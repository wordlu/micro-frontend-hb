// eslint-disable-next-line no-unused-vars
export async function phcatelogMyDataTableEventHandler(e, route) {
    let param = e.detail[0].args.param
    switch (e.detail[0].args.callback) {
        case "linkToPage":
            if (param.index != undefined) {
                if (param.queryParams) {
                    route.router.transitionTo(
                        "shell",
                        `${param.name}/${param.index}?${param.queryParams}`
                    )
                } else {
                    route.router.transitionTo(
                        "shell",
                        `${param.name}/${param.index}`
                    )
                }
            } else {
                if (param.queryParams) {
                    route.router.transitionTo(
                        "shell",
                        `${param.name}?${param.queryParams}`
                    )
                } else {
                    route.router.transitionTo("shell", param.name)
                }
            }
            break
        case "service":
            //下载文件
            if (e.detail[0].args.param.name == "downloadFile") {
                let source = e.detail[0].args.param.file.source
                this.downloadFile.downloadFile(source)
            }
            //上传文件
            else if (e.detail[0].args.param.name == "uploadFile") {
                uploadFiles(
                    e.detail[0].args.param.event,
                    e.detail[0].args.element
                )
            }
            break
        case "closeToast":
            this.closeuploadToast = "1"
            break
        default:
            console.log("submit event to parent")
    }
    async function uploadFiles(event, element) {
        //初始化变量
        element.uploadToastBorder = "blue"
        element.uploadTextStatus = "正在上传"
        element.uploadText = ""
        element.closeuploadToast = "0" //显示上传弹框

        //禁用上传文件input
        let dom = event.target
        dom.disabled = true

        function guid() {
            return "xxxxx-xxxx-4xxx-yxxx-xxxxx".replace(/[xy]/g, function (c) {
                var r = (Math.random() * 16) | 0,
                    v = c === "x" ? r : (r & 0x3) | 0x8

                return v.toString(16)
            })
        }

        /**
         * 1. 初始化上传流程
         */
        const traceId = guid()
        let uploadMessage = {}
        uploadMessage.accountId = route.cookies.read("account_id")
        let myFileElement = element.$refs.myFile
        uploadMessage.file = myFileElement.files[0]

        /**
         * 2. upload file to OSS
         */
        element.showProgress = "1" //显示上传进度
        element.uploadFileSize = uploadMessage.file.size // 上传文件总大小

        // aws s3 upload
        const accountId = route.cookies.read("account_id")
        const bucketName = "ph-origin-files"
        const s3Client = route.awsService.get("s3Client")
        const fileKey = `user/${accountId}/${traceId}/${uploadMessage.file.name}`
        let uploadFileParams = {
            Bucket: bucketName,
            Key: fileKey,
            Body: uploadMessage.file
        }

        try {
            //S3 上传
            await s3Client
                .upload(uploadFileParams)
                .on("httpUploadProgress", function (progress) {
                    element.uploadLoadedSize = progress.loaded //实时进度
                })
                .promise()

            /**
             * 3. create file metadata for database
             */
            const applicationAdapter = route.store.adapterFor("application")
            const fileBodyObj = {
                name: uploadMessage.file.name.split(".")[0],
                owner: accountId,
                extension: uploadMessage.file.name.split(".")[1],
                size: uploadMessage.file.size,
                source: fileKey,
                labels: [],
                created: new Date(),
                modified: new Date(),
                version: "",
                description: ""
            }
            applicationAdapter.set("reqBody", fileBodyObj)
            //数据库上传数据
            await route.store.createRecord("file", fileBodyObj).save()
            let filesData = await route.store.query("file", {
                "filter[owner]": route.cookies.read("account_id"),
                "page[limit]": 10,
                "page[offset]": 0,
                sort: "-created"
            })
            element.allData.files = filesData.filter((it) => it)
            element.showProgress = "0" // 关闭上传进度条
            //上传成功提示
            element.uploadTextStatus = "上传成功"
            element.uploadText = "在“我的数据”中查看结果"
            element.uploadToastBorder = "green"
        } catch (e) {
            element.showProgress = "0" //关闭上传进度条
            //上传失败提示
            element.uploadTextStatus = "上传失败"
            element.uploadText = ""
            element.uploadToastBorder = "red"
        }

        // 不管上传成功还是失败，都把按键的disabled取消，样式还原,loaded大小还原
        dom.disabled = false
        element.uploadLoadedSize = 0

        // 不管上传成功还是失败，都把文件清空
        let fileContainer = myFileElement
        fileContainer.value = null
    }
}
