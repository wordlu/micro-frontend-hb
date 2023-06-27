export default class NoticeServiceService {
    constructor(id, adapter) {
        this.id = id
        this.projectName = ""
        //被观察的对象，需要维持一个观察者对象的id列表（添加，删除，通知）
        this.subjectID= []
        this.subjectCallback= []
        //管理状态的参数
        this.uploadStatus = false
        this.timeout = 2
        this.statusNoticeCache = []
        this.retryButtonShow = false
        this.debugToken = "a71723eba8d673e68a9a87aee65c36a83c9e14abde59c60c556a3eba23818ea7"
    }

    register(tableName, id, callback, ele, projectId, timeout) {
        this.timeout = timeout
        if(this.subjectID.indexOf(id) == -1) {
            this.subjectID.push(id)
            this.subjectCallback.push({
                ele: ele,
                callback: callback,
                tableName: tableName,
                date: new Date().getTime(),
                projectId: projectId
            })
        }
    }

    unregister(id) {
        //删除id和callback函数
        let index = this.subjectID.indexOf(id)
        this.subjectID.splice(index, 1)
        this.subjectCallback.splice(index, 1)
    }

    getCookie(name) {
        let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return (arr[2]);
        else
            return null;
    }

    observer() {
        // 定义timer，5秒请求一次, 无限循环，id数组大于0调用register，无返回不进行处理
        // query notification, id数组大于0时请求数据，超过30秒删除id，用callback进行处理
        let that = this
        setInterval(async function() {
            let currentTime = new Date().getTime()
            // 设置超时时间
            that.subjectCallback.forEach((item,index) => {
                if(currentTime - item.date > that.timeout * 60000) {
                    that.unregister(that.subjectID[index])
                }
            })
            if(that.subjectID.length > 0) {
                let conditions = {}
                that.subjectID.forEach((item,index) => {
                    conditions = {
                        "id": ["=", item],
                        "projectId": ["begins_with", that.projectName]
                    }
                })
                let url = "https://api.hubadata.com/hbdydatasource/query"
                let headers = {
                    "Authorization": that.getCookie( "access_token" ) || that.debugToken,
                    "Content-Type": "application/vnd.api+json",
                    "Accept": "application/vnd.api+json"
                }
                let statusBody = {
                    "table": "notification",
                    "conditions": conditions,
                    "limit": 1000,
                    "start_key": {}
                }
                let options = {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify(statusBody)
                }
                fetch(url, options)
                    .then(res => res.json())
                    .then(response => {
                        if(response.data && response.data.length > 0) {
                            let doneArr = response.data.filter(it => it.attributes["job-cat"] != "running") 
                            let runningArr = response.data.filter(it => it.attributes["job-cat"] == "running")
                            console.log(doneArr)
                            if(doneArr.length > 0) {
                                // 有running和以外状态出现快修bug
                                let index = that.subjectID.indexOf(response.data[0].id)
                                let targetCallback = that.subjectCallback[index]
                                targetCallback.callback(doneArr, targetCallback.ele)
                                /**
                                 *  1. 没有running状态时，将本次结果缓存进statusNoticeCache
                                 * 	2. 如果本次和上次相比所有结果都不为running且长度相同,调用	*	unregister,断掉请求
                                 * */ 
                                if(that.statusNoticeCache.length === doneArr.length && runningArr.length === 0){
                                    console.log("query结束")
                                    that.unregister(response.data[0].id)
                                    that.retryButtonShow = true
                                }
                                if(runningArr.length === 0) {
                                    that.statusNoticeCache = response.data
                                }
                            }
                        
                        }
                    }) 
            } else {
                console.log("notice observer")
            }
        }, 15 * 1000)
    }
}
