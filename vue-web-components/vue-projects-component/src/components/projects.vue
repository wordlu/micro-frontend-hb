<template>
    <div class="my-data-content-container">
        <link rel="stylesheet" href="https://components.hubadata.com/element-ui/element-ui.css">
        <div class="header">
            <span class="header-large">
                {{title}}
            </span>
        </div>
        <div class="data-main-container">
            <ph-status-pane 
				ref="statusPane"
				v-if="allData.tenantId" 
				:tenant-name="allData.company_name_show" 
				:tenant-id="allData.tenantId"
				@dealResourceStop="dealResourceStop"
				@dealResourceStart="dealResourceStart"></ph-status-pane>
            <template >
                <div class="project-list-container">
                    <div class="project-list-header">
                        <bp-text>项目名称</bp-text>
                        <div class="opt-icon">
                            <bp-text class="update_time" v-if="toggle">更新时间</bp-text>
                            <div class="opt">
                                <bp-select-vue class="select_opt" :src="selectIcon" choosedValue="操作" @showSelectOption="showSelectOption" :closeTosts="closeTosts">
                                    <bp-option-vue class="schema-select-item" text="新建项目" :src="addIcon" @click="dialogCreateVisible = true"></bp-option-vue>
                                    <bp-option-vue class="schema-select-item" text="缩略图" :src="cardIcon" @click="toggleClickCard"></bp-option-vue>
                                    <bp-option-vue class="schema-select-item" text="详细信息" :src="listIcon" @click="toggleClickList"></bp-option-vue>
                                </bp-select-vue>
                            </div>
                        </div>
                    </div>
                    <template v-if="toggle">
                        <div class="project-list-item" v-for="(file,index) in allData.projects" :key="index+'list'" @click="linkToPage(file)">
                            <div class="left-text">
                                <img :src="defs.iconsByName('project', 'list')" class="file-icon-dark" alt="">
                                <div class="text-area" >
                                    <bp-text class="title">{{file.name}}</bp-text>
                                    <bp-text class="subtitle">{{file.provider}}</bp-text>
                                </div>
                            </div>
                            <bp-text class="subtitle right-text">{{formatDateStandard(file.created,0)}}</bp-text>
                        </div>
                    </template>
                    <div v-if="!toggle" class="project-card">
                        <div class="project-card-item" v-for="(file,index) in allData.projects" :key="index+'card'" @click="linkToPage(file)">
                            <div class="text-area" >
                                <bp-text class="title">{{file.name}}</bp-text>
                                <bp-text class="subtitle">{{file.provider}}</bp-text>
                            </div>
                            <div class="last-date">
                                <bp-text class="subtitle right-text">
									{{formatDateStandard(file.created,0)}}
								</bp-text>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
        <el-dialog
            title="新建项目"
            :visible.sync="dialogCreateVisible"
            width="600px">
            <div class="dlg-create-container">
                <div class="name">
                    <span>项目名称：</span>
                    <el-input v-model="projectNameValue" ref="project_name_value" @input="inputStrChecked(projectNameValue, 'project_name_value', 'projectNameValue')" class="search_row">
                    </el-input>
                </div>
                <div class="deploy">
                    <span>资源配置：</span>
                    <div class="radio_area">
                        <div class="radio_item" v-for="(item, index) in resourcesTypesList" :key="'type'+index">
                            <input type="radio" class="radio" name="radio" ref="radioData" :checked="item.name === '单机'" :disabled="item.name !== '单机'" >
                            <input :value="item.name" class="el-input__inner" type="text" name="" id="" disabled>
                        </div>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogCreateVisible = false">取消</el-button>
                <el-button type="primary" @click="on_clickCreateConfirm">确认</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import bpText from '../../node_modules/vue-components/src/components/bp-text.vue'
import bpSelectVue from '../../node_modules/vue-components/src/components/bp-select-vue.vue'
import bpOptionVue from '../../node_modules/vue-components/src/components/bp-option-vue.vue'
import ElButton from 'element-ui/packages/button/index'
import ElInput from 'element-ui/packages/input/index'
import ElDialog from 'element-ui/packages/dialog/src/component'
import PhDagDefinitions from "./policy/definitions/definitions";
import { staticFilePath } from '../config/envConfig'
import PhStatusPane from './status-pane'
import PhProjectDatasource from './model/datasource'
import { Message } from 'element-ui'

export default {
    components: {
        bpText,
        bpSelectVue,
        bpOptionVue,
        ElDialog,
        ElButton,
        ElInput,
        PhStatusPane
    },
    data() {
        return {
            title: "工作平台",
            fileIconDark: `${staticFilePath}` + "/icon_dag+list.svg",
            addIcon: `${staticFilePath}` + "/icons/%E6%B7%BB%E5%8A%A0(1).svg",
            cardIcon: `${staticFilePath}` + "/icons/%E7%BC%A9%E7%95%A5%E5%9B%BE.svg",
            listIcon: `${staticFilePath}` + "/icons/%E5%88%97%E8%A1%A8%E6%98%BE%E7%A4%BA.svg",
            listIconSelect: `${staticFilePath}` + "/icon_list_slelect.svg",
            selectIcon: `${staticFilePath}` + "/drop_down_icon.svg",
            cardIconSelect: `${staticFilePath}` + "/icon_card_slelect.svg",
            toggle: false,
            closeTosts: false,
            dialogCreateVisible: false,
            projectNameValue: ""
        }
    },
    props: {
        allData: {
            type: Object,
            default: function() {
                return {
                    tenantId: null,
                    projects: []
                }
            }
        },
        resourcesTypesList: {
            type: Array,
            default: function() {
                return [{
                    id: 1,
                    name: "单机"
                }, {
                    id: 2,
                    name: "集群"
                }]
            }
        },
        defs: {
            type: Object,
            default: function () {
                return new PhDagDefinitions("1");
            }
        },
        datasource: {
            type: Object,
            default: function() {
                return new PhProjectDatasource(1)
            }
        }
    },
    methods: {
		dealResourceStart(data) {
			this.$emit('event', data)
		},
		dealResourceStop(data) {
			this.$emit('event', data)
		},
        on_clickCreateConfirm() {
            if (!this.projectNameValue || this.projectNameValue === "") {
                alert("请输入项目名称！")
                return false
            }
            this.allData.projects.forEach(item => {
                if (item.name === this.projectNameValue) {
                    alert("项目名称重复！")
                    throw Error("项目名称重复")
                }
            })
            const event = new Event("event")
            event.args = {
                callback: "cerateProject",
                element: this,
                param: {
                    name: this.projectNameValue,
                    id: this.getCookie("company_id")
                }
            }
            console.log(event)
            this.$emit('event', event)
            this.dialogCreateVisible = false
        },
        getCookie(name) {
            let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr === document.cookie.match(reg))
                return (arr[2]);
            else
                return "dae3d1540184499768c8efc58713565349ed36735db0f4566d824604c6b07e20";
        },
        showSelectOption(data) {
            console.log(data)
        },
        toggleClickCard() {
            this.toggle = false
        },
        toggleClickList() {
            this.toggle = true
        },
        linkToPage(params) {
            this.$refs.statusPane.datasource.refreshStatus(this.allData.tenantId, () => {
                if(this.$refs.statusPane.datasource.status !== "started") {
                    Message.error("请先启动项目资源！", { duration: 3000} )
                } else {
                    const event = new Event("event")
                    event.args = {
                        callback: "linkToPage",
                        element: this,
                        param: {
                            name: params["name"],
                            pid: params.id
                        }
                    }
                    this.$emit('event', event)
                }
                
            })
        },
        // 验证输入字符串时候的特殊字符
        inputStrChecked(value, ref, name) {
            // let r = /[(|)|（|）| 【|】| @ # $ % & * ^ \ - = ——\[|\] ]/;、
            // 只允许输入数字、字母、下划线
            // let r = /^[a-zA-Z0-9_^]{1,}$/
            let r = /^(?![0-9]+$)[A-Za-z_][A-Za-z_0-9]{0,}$/
            if (r.test(value) || value === "") {
                if(value.length > 30) {
                    this[name] = ""
                    alert("输入内容过长！")
                    return false;
                }
                return value
            } else {
                this[name] = ""
                alert("请勿输入特殊字符！")
                return false;
            }
        },
        formatDateStandard(...params) {
            if(params.length === 2) {
                // let date = new Date( Number(params[0]) ),
                let date = new Date(new Date(params[0])),
                    Y = date.getFullYear(),
                    M =
                        ( date.getMonth() + 1 < 10 ?
                            `0${date.getMonth() + 1}` :
                            date.getMonth() + 1 ),
                    D0 = ( date.getDate() < 10 ? `0${date.getDate()}` : date.getDate() ),
                    // D1 = ( date.getDate() < 10 ? `0${date.getDate()}` : date.getDate() ),

                    h =
                        ( date.getHours() < 10 ? `0${date.getHours()}` : date.getHours() ),
                    m =
                        ( date.getMinutes() < 10 ?
                            `0${date.getMinutes()}` :
                            date.getMinutes() ) ,
                    s = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()

                // 输出结果：yyyy/mm/dd hh:mm
                if(params[1] === 0){
                    return Y + "/" + M + "/" + D0 + " " + h + ":" + m + ":" + s
                }else if(params[1] === 1) {
                    return Y + "-" + M + "-" + D0 + " " + h + ":" + m
                }
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    * {
        box-sizing: border-box;
    }
    /deep/.el-dialog__header {
        border-bottom: 1px solid #ccc;
    }
    /deep/.el-dialog__headerbtn {
        display: none;
    }
    /deep/.el-dialog__wrapper {
        background: rgba(0, 0, 0, 0.31);
    }

    .my-data-content-container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        .header {
            height: 62px;
            width: 100%;
            padding: 20px 24px 0;
            border-bottom: 1px solid rgba(37,35,45,.08);
            .header-large {
                font-family: SFProText-Regular;
                font-size: 20px;
                color: #302F39;
                letter-spacing: .25px;
                line-height: 28px;
            }
        }
        .dlg-create-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            .name {
                display: flex;
                span {
                    min-width: 80px;
                }
                /deep/.el-input__inner {
                    width: 240px;
                    height: 30px;
                }
            }
            .deploy {
                display: flex;
                flex-direction: column;
                margin-top: 20px;
                span {
                    min-width: 320px;
                }
                .radio_area {
                    margin-left: 60px;
                    .radio_item {
                        display: flex;
                        align-items: center;
                        margin-top: 5px;
                        .radio {
                            margin-right: 5px;
                        }
                    }
                }
                /deep/.el-input__inner {
                    width: 240px;
                    height: 30px;
                }
            }
        }
        .data-main-container {
            display: flex;
            flex-direction: column;
            flex: 1;
            position: relative;
            .project-list-container {
                flex: 1;
                display: flex;
                flex-direction: column;
                padding: 27px 20px 8px 20px;
				max-height: calc(100vh - 200px);
				overflow: auto;
                min-height: 0;
				
                .project-list-header {
                    display: flex;
                    justify-content: space-between;
                    font-family: PingFangSC-Regular;
                    font-size: 12px;
                    color: #57565F;
                    letter-spacing: 0.25px;
                    text-align: left;
                    line-height: 16px;
                    font-weight: 400;
                    border-bottom: 1px solid  rgba(37,35,45,0.08);
                    .opt-icon {
                        width: 160px;
                        display: flex;
                        justify-content: flex-end;
                        align-items: center;
                        .opt {
                            width: 110px;
                            /deep/.bp-option-group {
                                width: 100px;
                            }
                        }
                        .icon {
                            display: flex;
                            cursor: pointer;
                            width: 110px;
                            justify-content: flex-end;
                        }
                        .select_opt {
                            width: 79px;
                            height: 21px;
                            background: #FFFFFF;
                            border: 0.5px solid rgba(0,0,0,1);
                            float: right;
                            /deep/ .svg-icon {
                                width: 12px;
                                height: 12px;
                                margin-right: 5px;
                            }
                        }
                    }
                }
                .project-card {
                    display: grid;
                    width: 100%;
                    gap: 20px;
                    grid-template-columns: repeat(auto-fill, minmax(225px, 1fr));
                    list-style: none;
                    margin-bottom: 24px;
                    margin-top: 12px;
                    .project-card-item:hover {
                        border: 1px solid #7163C5;
                        background: url("https://components.hubadata.com/dev/general/public/35531628231509_.pic.jpg");
                        box-shadow: 0 0 1px 0 rgba(37,35,45,0.12), 0 4px 8px -2px rgba(37,35,45,0.25);
                    }
                    .project-card-item:active {
                        border: 1px solid #7163C5;
                        background: url("https://components.hubadata.com/dev/general/public/35531628231509_.pic.jpg");
                        box-shadow: 0 0 1px 0 rgba(37,35,45,0), 0 4px 8px -2px rgba(37,35,45,0);
                    }
                    .project-card-item {
                        width: 225px;
                        height: 100px;
                        border: 1px solid #f1f1f2;
                        border-radius: 2px;
                        background: url("https://components.hubadata.com/dev/general/public/dag_card.png");
                        background-size: cover;
                        padding: 10px;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        cursor: pointer;
                        .text-area {
                            display: flex;
                            flex-direction: column;
                            .title {
                                font-family: PingFangSC-Regular;
                                font-size: 20px;
                                color: #25232D;
                                letter-spacing: 0.25px;
                                line-height: 28px;
                                font-weight: 400;
                                margin-bottom: 3px;
                            }
                            .subtitle {
                                font-family: PingFangSC-Light;
                                font-size: 12px;
                                color: #706F79;
                                line-height: 16px;
                                font-weight: 200;
                                width: 132px;
                                overflow: hidden;
                                white-space: nowrap;
                                text-overflow: ellipsis;
                            }
                        }
                        .last-date {
                            display: flex;
                            justify-content: flex-end;
                            font-family: PingFangSC-Light;
                            font-size: 12px;
                            color: #706F79;
                            letter-spacing: 0.25px;
                            line-height: 16px;
                            font-weight: 200;
                        }
                    }
                }
                .project-list-item {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid  rgba(37,35,45,0.08);
                    padding: 12px 0;
                    cursor: pointer;
                    .subtitle {
                        font-family: SFProText-Light;
                        font-size: 14px;
                        color: #706F79;
                        letter-spacing: 0.25px;
                        line-height: 16px;
                        font-weight: 200;
                    }
                    .right-text {
                        width: 160px;
                    }
                    .left-text {
                        display: flex;
                        .file-icon-dark {
                            width: 38px;
                            height: 38px;
                            margin-right: 14px;
                        }
                        .text-area {
                            display: flex;
                            flex-direction: column;
                            .title {
                                font-family: SFProText-Regular;
                                font-size: 14px;
                                color: #25232D;
                                letter-spacing: 0.25px;
                                text-align: left;
                                line-height: 20px;
                                font-weight: 400;
                                margin-bottom: 3px;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
