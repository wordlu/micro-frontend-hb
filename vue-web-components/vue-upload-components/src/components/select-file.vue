<template>
    <div class="upload-dataset">
        <div class="upload_dataset_container" >
            <div class="project_name_header">
                <p class="project_name new_upload">本地上传文件</p>
            </div>
            <div class="upload_file_area">

                <div class="upload_area">
                    <div class="file_content_area" v-for="(item,index) in fileList" :key="index">
                        <p>{{item.name}}</p>
                        <button @click="deleteFile(index)">删除</button>
                    </div>
                    <button class="select" v-if="fileList.length === 0" @click="fileClick">上传文件</button>
                    <button class="next" @click="$emit('confirm')" v-if="fileList.length > 0">下一步</button>
                    <input style="display: none;" type="file" name="" ref="file" @change="selectFiles" accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv,.csv,.xlsx,.xls,.xlsm">
                </div>
                <div class="select-area">
                    <span class="title">上传至</span>
                    <el-select placeholder="Select" v-model="selectParam">
                        <el-option class="file_upload_item" label="本集群" value="1"></el-option>
                    </el-select>
<!--                    <bp-select-vue src="https://www.hubadata.com/public/icon_drop.svg" :choosedValue="selectParam">-->
<!--                        <bp-option-vue @click="changeSelect">本集群</bp-option-vue>-->
<!--                    </bp-select-vue>-->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ElSelect from 'element-ui/packages/select/index'
import ElOption from 'element-ui/packages/option/index'
import 'element-ui/packages/theme-chalk/lib/index.css'
import 'element-ui/packages/theme-chalk/lib/select-dropdown.css'

export default {
    data() {
        return {
            selectParam: "本集群"
        }
    },
    components: {
        ElSelect,
        ElOption
    },
    props: {
        fileList: Array
    },
    methods: {
        fileClick() {
            this.$refs.file.click()
        },
        deleteFile(index) {
            this.$refs.file.value = null
            this.$emit("fileDeleted", index)
        },
        selectFiles() {
            // this.fileList.push(this.$refs.file.files[0])
            this.$emit("fileSelected", this.$refs.file.files[0])
        }
    }
}
</script>

<style lang="scss" scoped>
* {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}

.file_upload_item {
    padding: 0 20px;
}

.bg {
    background: #dfe7ff;
 }

.upload_dataset_container {
    width: 100vw;
    height: calc(100vh - 40px);
    // border: 2px solid #ddd;
    .project_name_header {
        height: 50px;
        width: 100%;
        border-bottom: 1px solid #ddd;
        .project_name {
            margin-left: 30px;
            line-height: 50px;
            font-family: PingFangSC-Medium;
            font-size: 16px;
            color: #000000;
            font-weight: 600;
            cursor: pointer;
        }
        .new_upload {
            font-size: 14px;
        }
    }
    .upload_file_area {
        width: 100%;
        padding: 20px;
        height: calc(100vh - 110px);
        background: #f7f7f7;
        padding-top: 50px;
        .s3_upload_area {
            padding: 30px;
            height: 270px !important;
            display: flex;
            flex-direction: column;
            .s3next_area {
                width: 100%;
                display: flex;
                justify-content: flex-end;
                .s3next {
                    width: 82px;
                    height: 32px;
                    background: #7163C5;
                    font-family: PingFangSC-Medium;
                    font-size: 14px;
                    color: #FFFFFF;
                    font-weight: 600;
                    border-radius: 4px;
                    line-height: 32px;
                    text-align: center;
                    cursor: pointer;
                    border: none;
                }
            }
            .item {
                display: flex;
                height: 60px;
                span {
                    display: block;
                    min-width: 100px;
                    text-align: left;
                    padding-right: 20px;
                }
                .filepath {
                    width: 800px
                }
            }
            input, select {
                padding-left: 20px;
                width: 160px;
                height: 24px;
            }
        }
        .file_content_area {
            display: flex;
            position: relative;
            width: 1064px;
            height: 20px;
            border: 1px solid #979797;
            margin: 17px auto;
            p {
                font-family: PingFangSC-Medium;
                font-size: 14px;
                color: #000000;
                font-weight: 600;
                margin-left: 7px;
                line-height: 18px;
            }
            button {
                position: absolute;
                top: 0;
                right: 28px;
                font-family: PingFangSC-Medium;
                font-size: 14px;
                color: #000000;
                font-weight: 600;
                border: none;
                background: none;
            }
        }
        .select-area {
            width: 100%;
            background: #fff;
            margin-top: 20px;
            display: flex;
            align-items: center;
            padding: 15px;
            border: 1px solid #979797;
            .title {
                width: 70px;
            }
            /deep/.bp-select {
                height: 26px;
            }
            /deep/.bp-select-title{
                background: #fff !important;
                height: 26px;
                border: 1px solid #cccccc;
            }
        }
        .upload_area {
            position: relative;
            // width: 1400px;
            width: 100%;
            height: 184px;
            border: 1px solid #979797;
            margin: 0 auto;
            background: #FFF;
            .select {
                position: absolute;
                top: 0;
                bottom: 0;
                right: 0;
                left: 0;
                margin: auto;
                display: inline-block;
                width: 82px;
                height: 32px;
                background: #7163C5;
                font-family: PingFangSC-Medium;
                font-size: 14px;
                color: #FFFFFF;
                font-weight: 600;
                border: 0;
                border-radius: 4px;
				cursor: pointer;
            }
            .next {
                position: absolute;
                margin: auto;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                // display: inline-block;
                width: 82px;
                height: 32px;
                background: #7163C5;
                font-family: PingFangSC-Medium;
                font-size: 14px;
                color: #FFFFFF;
                font-weight: 600;
                border-radius: 4px;
                line-height: 32px;
                text-align: center;
                cursor: pointer;
            }
            .select_input {
                position: absolute;
                top: 186px;
                left: 664px;
                opacity: 0;
            }
        }

    }
}
</style>
