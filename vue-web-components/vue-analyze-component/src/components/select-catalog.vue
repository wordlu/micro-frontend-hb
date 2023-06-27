<template>
    <div>
        <div class="clear_dialog_container">
            <div class="dialog_area">
                <div class="header">
                        <span>调用</span>
                </div>
                <div class="prompt">
                    <span>调用数据目录</span>
                    <div class="data_version">
                        <table>
                            <tr>
                                <th class="input">数据目录</th>
                                <th class="version">数据版本</th>
                            </tr>
                            <tr>
                                <td class="version" >
                                    <span :title="catalogName">{{catalogName}}</span>
                                    <img class="add_version" :src="add_icon" @click="addVersion"/>
                                </td>
                                <td class="version" >
                                    <span>暂不开放</span>
                                    <img class="add_version" :src="add_icon"/>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div class="btn">
                    <div class="">
                        <button class="cancel" @click="close">取消</button>
                        <button class="save btn-margin" @click="save">确定</button>
                    </div>
              </div>
            </div>
        </div>
        <select-version 
            v-show="selectDataVersion"
            @closeSelVersionDialog="closeSelVersionDialog"
            @selectCatalogNameConfirm="selectCatalogNameConfirm"
        ></select-version>
    </div>
</template>

<script>
import selectVersion from "./select-version.vue"
import { staticFilePath } from '../config/envConfig'

export default {
    data() {
        return{
            selectDataVersion: false,
            add_icon: `${staticFilePath}` + "/icons/%E5%8A%A0%E5%8F%B7.svg",
            catalogName: ""
        }
    },
    props: {
        textConf: Object,
        projectId: String
    },
    components: {
        selectVersion
    },
    methods: {
        selectCatalogNameConfirm(data) {
            this.catalogName = data.args.param.name
            this.selectDataVersion = false
        }, 
        closeSelVersionDialog() {
            this.selectDataVersion = false
        },
        addVersion() {
            this.selectDataVersion = true
        },
        save() {
            if(!this.catalogName || this.catalogName === "") {
                alert("请选择数据目录！")
                return false
            }
            const event = new Event("event")
            event.args = {
                callback: "createCatalog",
                element: this,
                param: {
                    dsName: this.catalogName
                }
            }
            this.$emit('confirmeCreateCatalog', event)
        },
        close() {
            this.$emit('closeCreateCatalogDialog')
        }
    }
}
</script>

<style lang="scss" scoped>
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
.clear_dialog_container {
    height: 100vh;
    width: 100vw;
    // background: rgba(37,35,45,0.55);
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9999;
    justify-content: center;
    align-items: center;
    background: rgba(0,0,0,0.31);
}
.dialog_area {
    width: 500px;
    height: 560px;
    border: 1px solid #ddd;
    background-color: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    box-sizing: border-box;
}
.header {
    height: 60px;
    border-bottom: 1px solid #ddd;
    line-height: 60px;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    color: #000;
    font-size: 16px;
    .close_icon {
        width: 24px;
        height: 24px;
        cursor: pointer;
    }
}
.prompt {
    height: 440px;
    padding-left: 40px;
    padding-top: 20px;
    box-sizing: border-box;
    .data_version {
        width: 420px;
        height: 140px;
        border: 1px solid #ccc;
        overflow: auto;
        padding: 24px 30px;
        .input {
            max-width: 160px;
            width: 160px;
        }
        .version {
            max-width: 180px;
            width: 180px;
            span {
                max-width: 150px;
                display: inline-block;
                width: 150px;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .add_version {
                position: relative;
                cursor: pointer;
            }
        }
        .cat {
            max-width: 120px;
            width: 120px;
        }
        table {
            border-collapse: collapse;
            text-align: left;
            font-size: 14px;
            color: #000000;
        }
        th {
            height: 24px;
            font-weight: normal;
        }
        td {
            border: 1px solid #ccc;
            height: 24px;
            padding: 5px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
    span {
        font-size: 14px;
        color: #000000;
    }
    textarea {
        font-size: 14px;
    }
    .run_json {
        width: 520px;
        height: 350px;
        background: #FFFFFF;
        border: 1px solid #ccc;
        resize: none;
    }
}
.btn {
    position: absolute;
    right: 23px;
    bottom: 15px;
    .timeout {
        display: flex;
        select {
            width: 72px;
            height: 24px;
            background: #FFFFFF;
            border: 0.5px solid #979797;
            margin-left: 10px;
        }
    }
    button {
        width: 60px;
        height: 28px;
        border: 0;
        cursor: pointer;
    }
    .cancel {
        margin-right: 5px;
        // background-color:#DB4D71;
        color: #7163C5;
    }
    .save {
        background-color: #7163C5;
        color: #fff;
    }
    .btn-margin {
        margin: 5px;
    }
}
</style>