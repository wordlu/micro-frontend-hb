<template>
    <div>
        <link rel="stylesheet" href="https://components.hubadata.com/element-ui/element-ui.css">
        <div class="upload_dashboard_container">
            <div class="info">
                <div class="project_info_left">
                    <div class="upload_top">
                        <div class="selected_search">
                            <div class="selected"
                                :class="[
                                    {'bg_disabled': dashboardCheckedIds.length == 0}]">
                                <input type="checkbox" class="checkbox" ref="all" @click='chechedAllDsahboards()' :checked="dashboardCheckedIds.length === allData.dashboards.length">
                                <div class="opt-area" @click="dropShow">
                                    <span class="action" >选项</span>
                                    <img :src="dropDownIcon" alt="" class="d_icon">
                                    <div class="drop_dialog" v-if="dropDialogShow">
                                        <div class="label_icon" @click="createTagsOpen">
                                            <span class="tag_icon">
                                                <img :src="label_icon" alt="">
                                            </span>
                                            <p>标签</p>
                                        </div>
                                        <div class="label_icon border_none none" @click="clearDialogOpen">
                                            <span>
                                                <img :src="clear_data_icon" alt="">
                                            </span>
                                            <p >清除数据</p>
                                        </div>
                                        <div class="label_icon border_none" @click="deletedialogopen">
                                            <span>
                                                <img :src="delete_icon" alt="">
                                            </span>
                                            <p >删除数据看板</p>
                                        </div>
                                    </div>
                                </div>
                               </div>
                            <div class="search_area">
                                   <div class="search_icon">
                                       <img :src="search_icon">
                                   </div>
                                   <input type="text" placeholder="搜索" class="text_input" v-model="searchValue">
                            </div>
                            <button class="upload_btn" @click="dialogCreateVisible = true">新建数据看板</button>
                        </div>

                        <div class="tag_selected">
                            <div class="sort">
                                <!-- 升序 -->
                                <img :src="ascending_order" alt="" v-if="ascending" @click="sort('ascending')">
                                <!-- 降序(默认) -->
                                <img :src="descending_order" alt="" v-if="!ascending" @click="sort('descending')">
                            </div>
                            <div class="down_sel" >
                                <bp-select-vue :src="selectIcon" :choosedValue="scriptValue" @showSelectOption="showSelectOption" :closeTosts="closeTosts">
                                    <bp-option-vue text="名称" @click="selectScript(1)"></bp-option-vue>
                                </bp-select-vue>
                            </div>
                            <div class="line">|</div>
                            <div class="down_sel tags_down_sel" >
                                <p class="sel" @click="labelShow">标签</p>
                                <span class="drop_icon" @click="labelShow">
                                    <img :src="dropDownIcon" alt="">
                                </span>
                                <div class="label_selected" v-if="labelShowDialog">
                                    <div class="tag_arr">
                                        <div class="label_name" v-for="(item,index) in allData.tagsArray" :key="index">
                                            <span  :style="{background: tagsColorArray[allData.tagsArray.indexOf(item)]}"></span>
                                            <div class="tags_name">{{item}}</div>
                                        </div>
                                    </div>
                                    <div class="management">
                                        <div class="manage_label">管理标签</div>
                                    </div>
                                </div>
                            </div>
                            <div class="clear_sea" @click="clearSearch" v-if="searchValue">清空搜索项</div>
                            <div class="dashboard_number">
                                <p>{{allData.dashboards.length}} 个图表</p>
                            </div>
                        </div>
                    </div>
                    <div class="upload_bottom">
                        <div class="data_content" v-for="(dashboard,index) in searchData" :key="index" ref="content" :class="{bg: dashboardCheckedIds.indexOf(dashboard.id) > -1}" @click="clickOnlyOne(dashboard, index)">
                            <div class="data_input" @click.stop="checkedMore(dashboard)">
                                <input type="checkbox" ref="data" :checked="dashboardCheckedIds.indexOf(dashboard.id) > -1" @click.stop="checkedOneDashboard(dashboard)">
                            </div>
                            <div class="item_list">
                                <span class="script_icon">
                                    <img :src="selectDashboardsetIcon(dashboard.cat)" alt="">
                                </span>
                                <p class="data_name" @click.stop="clickDashboardName(dashboard)" :title="dashboard.title">{{dashboard.title}}</p>
                                <div class="tag_area" ref="tagsArea">
                                    <div v-for="(tag,inx) in dashboard.label" :key="inx">
                                        <span v-if="dashboard.label !== ''">
                                            <p
                                                :title="tag"
                                                class="tag_bg"
                                                :style="{background: tagsColorArray[allData.tagsArray.indexOf(tag)]}">{{tag}}
                                            </p>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="word" v-if="allData.dashboards == ''">当前项目无数据</div>
                    </div>
                </div>
                <div class="project_info_right">
                    <div class="view_content" v-if="dashboardCheckedIds.length > 0" >
                        <div class="project_name_view">
                            <span class="space">
                                <img :src="dashboard_icon_reverse" alt="">
                            </span>
                            <div class="show-name" v-if="dashboardCheckedIds.length == 1">
                                <p class="project_name_info" :title="dashboardcheckedNames[0]">
                                {{dashboardcheckedNames[0]}}
                                </p>
                            </div>
                           <div class="show-name">
                               <p class="project_name_info" v-if="dashboardCheckedIds.length > 1">
                                    {{dashboardCheckedIds.length}} 个图表
                                </p>
                           </div>
                        </div>
                        <div class="view_func">
                            <span @click="createTagsOpen" class="view_list">
                                <img class='tags_imgs_tag' :src="label_icon" alt="">
                                <span class='tags_func'>标签</span>
                            </span>
                            <span @click="clearDialogOpen" class="view_list">
                                <img class='tags_imgs_tag' :src="clear_data_icon" alt="">
                                <span class='tags_func'>清除数据</span>
                            </span>
                            <span  @click='deletedialogopen' class="view_list">
                                <img class='tags_imgs_tag' :src="delete_icon" alt="">
                                <span class='tags_func'>删除</span>
                            </span>
                        </div>
                    </div>
                    <p v-if="dashboardCheckedIds.length == 0" class="click_look">单击对象查看详细信息</p>
                </div>
            </div>
        </div>
		<el-dialog
            title="创建数据看板"
            :visible.sync="dialogCreateVisible"
            height="300px"
            width="600px">

            <div class="dlg-container">
                <span>数据看板名称：</span>
                <input type="text" class="db_name" v-model="inputDashboardName">
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogCreateVisible = false">取消</el-button>
                <el-button type="primary" @click="on_clickCreateConfirm">确认</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import ElDialog from 'element-ui/packages/dialog/src/component'
import ElButton from 'element-ui/packages/button/index'
import ElInput from 'element-ui/packages/input/index'
import bpSelectVue from '../../node_modules/vue-components/src/components/bp-select-vue.vue'
import bpOptionVue from '../../node_modules/vue-components/src/components/bp-option-vue.vue'
import { staticFilePath, hostName } from '../config/envConfig'

export default {
    data() {
        return {
            dialogCreateVisible: false,
            searchData: [],
            label_icon: `${staticFilePath}` + "/tag.svg",
            search_icon: `${staticFilePath}` + "/search.png",
            dropDownIcon: `${staticFilePath}` + "/drop_down_icon.svg",
            edit_icon: `${staticFilePath}` + "/edit_icon.png",
            delete_icon: `${staticFilePath}` + "/delete.png",
            clear_data_icon: `${staticFilePath}` + "/clear_data.png",
            selectIcon: `${staticFilePath}` + "/drop_down_icon.svg",
            delete_icon: `${staticFilePath}` + "/delete_r.svg",
            clear_data_icon: `${staticFilePath}` + "/delete_b.svg",
            ascending_order: `${staticFilePath}` + "/down.svg",
            descending_order: `${staticFilePath}` + "/top.svg",
            dashboard_icon: `${staticFilePath}` + "/icons/%E7%9C%8B%E6%9D%BF.svg",
            dashboard_icon_reverse: `${staticFilePath}` + "/icons/%E7%9C%8B%E6%9D%BF%E5%8F%8D%E8%89%B2.svg",
            showDialog: false,
            state: '',
            editShow: false,
            dropDialogShow: false,
            labelShowDialog: false,
            cleardialogshow: false,
            deletedialogshow: false,
            showSelectOptionParam: false,
            closeTosts: false,
            showCreateTagsDialog: false, //添加tag弹框
            deleteTagsDia: false,
            searchValue: '',
            ascending: false,
            tags: [],
            ary: [],
            checked: false,
            manual: true,
            clickMax: false,
            clickMaxOutput: false,
            scriptValue: "名称",
            isCheckedAllDashboard: false,
            dashboardCheckedIds: [], //选中项id
            dashboardcheckedNames: [], //选中项name
            color: ['#133883','#90a8b7','#94be8e','#ff21ee','#1ac2ab','#77bec2','#c7c7c7','#a088bd','#d66b9b','#5354ec','#acacff','#1e8103', '#ec7211','#ec7211', '#ea1c82','#2bb1ac', '#3c498c', '#000', 'blue', '#666'],
            tagsColorArray: ['#133883','#90a8b7','#94be8e','#ff21ee','#1ac2ab','#77bec2','#c7c7c7','#a088bd','#d66b9b','#5354ec','#acacff','#1e8103', '#ec7211','#ec7211', '#ea1c82','#2bb1ac', '#3c498c', '#000', 'blue', '#666'],
            inputDashboardName: ""
        }
    },
    props: {
        allData: {
            type: Object,
            default: () => ({
                projectName: "项目名称",
                dashboards: [],
                tagsArray: []
            })
        }
    },
    components: {
        bpSelectVue,
        bpOptionVue,
        ElDialog,
        ElButton,
        ElInput
    },
    watch: {
        "allData.tagsArray": function() {
            this.tagsColorArray = []
            this.allData.tagsArray.forEach((item, index) => {
                this.tagsColorArray.push(this.color[Math.floor(Math.random()*10+Math.random()*10)])
            })
        },
        "allData.dashboards": function() {
            this.searchData = this.allData.dashboards
        },
        searchValue: function() {
            let searchValue = this.searchValue
            this.state = 'search'
            if(searchValue) {
                this.searchData = this.allData.dashboards.filter(item => item.title.toLowerCase().indexOf(searchValue.toLowerCase()) > -1)
            } else {
                this.searchData = this.allData.dashboards
            }
            this.sort("ascending")
        }
    },
    methods: {
        guid(len, radix) {
            const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
            let uuid = [], i;
            radix = radix || chars.length;

            if (len) {
                // Compact form
                for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
            } else {
                // rfc4122, version 4 form
                let r;

                // rfc4122 requires these characters
                uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
                uuid[14] = '4';

                // Fill in random data.  At i==19 set the high bits of clock sequence as
                // per rfc4122, sec. 4.1.5
                for (i = 0; i < 36; i++) {
                    if (!uuid[i]) {
                        r = 0 | Math.random()*16;
                        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                    }
                }
            }

            return uuid.join('');
        },

        on_clickCreateConfirm() {
            const data = {
                projectId: this.allData.projectId,
                dashboardId: this.guid(8, 16),
                label: "[]",
                title: this.inputDashboardName,
                description: this.inputDashboardName,
                updating: String(new Date().getTime())
            }
            data["id"] = data.projectId + "_" + data.dashboardId

            const event = new Event("event")
            event.args = {
                callback: "createDashboard",
                element: this,
                param: {
                    name: "createDashboard",
                    projectName: this.allData.projectName,
                    projectId: this.allData.projectId,
                    dashboard: data
                }
            }
            this.$emit('event', event)
        },
        //增加tag
        addTagsEvent(data) {
            data.args.param.selectedDashboards = this.dashboardCheckedIds
            data.args.param.dashboardArray = this.allData.dashboards
            data.args.param.projectName = this.allData.projectName,
            data.args.param.projectId = this.allData.projectId
            this.$emit('event', data)
            this.showCreateTagsDialog = false;
        },
        //清除数据集中数据
        clearTags(data) {
            data.args.param.selectedDashboards = this.dashboardCheckedIds
            data.args.param.dashboardArray = this.allData.dashboards
            data.args.param.projectName = this.allData.projectName
            data.args.param.projectId = this.allData.projectId
            this.$emit('event', data)
            this.cleardialogshow = false;
        },
        //点击list主体
        clickOnlyOne(dashboard, index) {
            this.dashboardCheckedIds = []
            this.dashboardcheckedNames = []
            this.dashboardCheckedIds.push(dashboard.id)
            this.dashboardcheckedNames.push(dashboard.title)
        },
        checkedMore(dashboard){
            this.checked = !this.checked
            let idIndex = this.dashboardCheckedIds.indexOf(dashboard.id)
            if(idIndex >= 0) { 
                this.dashboardCheckedIds.splice(idIndex, 1)
                this.dashboardcheckedNames.splice(idIndex, 1)
                this.checked = false
            } else {
                this.checked = true
                this.dashboardCheckedIds.push(dashboard.id)
                this.dashboardcheckedNames.push(dashboard.name)
            }
        },
        //点击list多选框
        checkedOneDashboard(dashboard) {
            let idIndex = this.dashboardCheckedIds.indexOf(dashboard.id)
            if(idIndex >= 0) {
                this.dashboardCheckedIds.splice(idIndex, 1)
                this.dashboardcheckedNames.splice(idIndex, 1)
            } else {
                this.dashboardCheckedIds.push(dashboard.id)
                this.dashboardcheckedNames.push(dashboard.title)
            }
        },
        //点击 name
        clickDashboardName(data) {
            const event = new Event("event")
            event.args = {
                callback: "linkToPage",
                element: this,
                param: {
                    name: "clickDashboardName",
                    projectName: this.allData.projectName,
                    projectId: this.allData.projectId,
                    dashboardId: data.dashboardId
                }
            }
            this.$emit('event', event)
        },
        //全选list
        chechedAllDsahboards() {
            this.isCheckedAllDashboard = true
            if(this.dashboardCheckedIds.length == this.allData.dashboards.length) {
                this.isCheckedAllDashboard = false
            }
            this.dashboardCheckedIds = []
            this.dashboardcheckedNames = []
            //全选状态
            if(this.isCheckedAllDashboard) {
                this.allData.dashboards.forEach(item => {
                    this.dashboardCheckedIds.push(item.id)
                    this.dashboardcheckedNames.push(item.title)
                })
            }
        },
        //排序条件下拉框
        showSelectOption() {
            this.showSelectOptionParam = true
        },
        //清空list搜索框
        clearSearch() {
            this.searchValue = ''
        },
        //排序
        sort(val) {
            if(val == 'ascending') {
                // 升序->降序
                this.ascending = false
                this.searchData.sort(
                    function compareFunction(param1, param2) {
                        return param1.title.localeCompare(param2.title);
                    }
                )
            }else if (val == 'descending') {
                // 降序->升序
                this.ascending = true
                this.searchData.reverse()
            }
        },
        //排序条件下拉框
        selectScript(data) {
            this.scriptValue = "名称"
        },
        //关闭tag删除弹框
        closeDeleteTags() {
            this.deleteTagsDia = false;
        },
        //打开tag添加弹框
        createTagsOpen() {
            this.showCreateTagsDialog = true;
        },
        //关闭tag添加弹框
        closeCreateDialog() {
            this.showCreateTagsDialog = false;
        },
        //关闭删除数据集弹框
        closeDeleteDialog() {
            this.deletedialogshow = false;
        },
        //打开删除数据集弹框
        async deletedialogopen() {
            /**
             * 1. 先请求phcomputedeletionimpact，找到关联关系
             * 2. 返回空数组 原来流程；不是空数组，原来流程 + 新流程
             */
            let that = this
            const accessToken = this.getCookie("access_token") || "318a0bd769a6c0f59b8885762703df522bcb724fcdfa75a9df9667921d4a0629"
            const checkUrl = `${hostName}/hbcomputedeletionimpact`
            let query = []
            this.dashboardCheckedIds.forEach((item,index) => {
                query.push({
                    "id": item,
                    "name": that.dashboardcheckedNames[index],
                    "sortVersion": "developer_"
                })
            })
            let checkBody = {
                "projectId": this.allData.projectId,
                "type": "ds",
                "query": query
            }
            let checkOptions = {
                method: "POST",
                headers: {
                    "Authorization": accessToken,
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    "accept": "application/json"
                },
                body: JSON.stringify(checkBody)
            }
            this.dashboardRelaResult = await fetch(checkUrl, checkOptions).then(res => res.json())
            //打开弹框
            this.deletedialogshow = true;
        },
        getCookie(name) {
            let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg))
                return (arr[2]);
            else
                return null;
        },
        //关闭清除数据集弹框
        closeClearDialog() {
            this.cleardialogshow = false;
        },
        //打开清除数据集弹框
        clearDialogOpen(){
            this.cleardialogshow = true
        },
        //标签下拉框
        labelShow() {
            this.labelShowDialog = !this.labelShowDialog
            this.dropDialogShow = false;
            this.nameShowDialog = false;
        },
        //左上角选项下拉框
        dropShow() {
            if(this.dashboardCheckedIds.length < 1) {
                this.dropDialogShow = false
            } else {
                this.dropDialogShow = !this.dropDialogShow
                this.nameShowDialog = false
                this.labelShowDialog = false
            }
        },
        linkToPage() {
            const event = new Event("event")
            event.args = {
                callback: "linkToPage",
                element: this,
                param: {
                    name: "linkToProject",
                    projectName: this.allData.projectName,
                    projectId: this.allData.projectId
                }
            }
            this.$emit('event', event)
        },
        selectDashboardsetIcon(cat) {
            return this.dashboard_icon
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
.el-dialog__wrapper {
	background: rgba(0, 0, 0, 0.31);
}
.bg {
    background: #dfe7ff;
}
.name {
    position: absolute;
    top: 25px;
    left: 24px;
    width: 110px;
    height: 60px;
    line-height: 28px;
    background: #fff;
    // border: 1px solid #dddddd;
    box-shadow: 2px 4px 6px #dddddd;
    padding-left: 10px;
    font-size: 14px;
}
 .dialog {
    position: absolute;
    top: 30px;
    right: 40px;
    width: 150px;
    // height: 65px;
    border: 1px solid #dddddd;
    background: #fff;
    z-index: 9999;
    cursor: pointer;
    div {
        border-bottom: 1px solid #979797;
        p {
            margin-left: 10px;
            font-family: PingFangSC-Medium;
            font-size: 14px;
            color: #000000;
            font-weight: 600;
        }
    }
}
.dlg-container {
    display: flex;
    align-items: center;
    .db_name {
        padding-left: 10px;
        width: 70%;
        height: 24px;
        border: 1px solid #666;
    }
}
.upload_dashboard_container {
    width: 100vw;
    height: calc(100vh - 40px);
    .project_name_header {
        height: 50px;
        width: 100%;
        border-bottom: 1px solid #dddddd;
        .project_name {
            margin-left: 30px;
            line-height: 50px;
            font-family: SourceSansPro;
            font-size: 16px;
            color: #000000;
            font-weight: 600;
            cursor: pointer;
        }
    }
    .info {
        display: flex;
        width: 100%;
        height: calc(100vh - 60px);
        .project_info_left {
            flex: 1;
            border-right: 1px solid #dddddd;

            .upload_top {
                height: 100px;
                border-bottom: 1px solid #dddddd;
                padding-left: 20px;
                padding-top: 20px;
                background: #f2f2f2;
                box-sizing: border-box;

                .selected_search {
                    display: flex;
                    position: relative;
                    .bg_disabled {
                        background: #eee !important;
                    }
                    .selected {
                        position: relative;
                        width: 90px;
                        height: 25px;
                        border: 1px solid #dddddd;
                        background: #fff;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        .opt-area {
                            display: flex;
                        }
                        .checkbox {
                            margin-left: 10px;
                        }

                        .action {
                            margin-left: 10px;
                        }

                        .d_icon {
                            position: absolute;
                            top: 4px;
                            right: 5px;
                            width: 15px;
                            height: 15px;
                        }

                        .drop_dialog {
                            position: absolute;
                            top: 24px;
                            left: 0;
                            width: 120px;
                            height: 90px;
                            background: #fff;
                            // border: 1px solid #000;
                            .label_icon {
                                display: flex;
                                border-bottom: 1px solid #dddddd;

                                img {
                                    margin-left: 10px;
                                    margin-top: 5px;
                                    width: 15px;
                                    height: 15px;
                                }

                                p {
                                    margin-left: 10px;
                                    margin-top: 2px;
                                    font-size: 14px;
                                }
                            }

                            .border_none {
                                border-bottom: none;
                            }
                        }
                    }

                    .sele {
                        width: 50px;
                    }
                }

                .search_area {
                    position: relative;
                    width: 300px;
                    height: 28px;
                    display: flex;
                    margin-left: 20px;
                    border: 1px solid #dddddd;

                    .search_icon {
                        width: 26px;
                        height: 26px;

                        img {
                            width: 26px;
                            height: 26px;
                        }
                    }

                    .text_input {
                        flex: 1;
                        display: inline-block;
                        height: 100%;
                        outline: none;
                        border: 1px solid #dddddd;
                        padding-left: 10px;
                    }
                }

                .upload_btn {
                    position: absolute;
                    top: 0px;
                    right: 40px;
                    display: inline-block;
                    width: 110px;
                    height: 32px;
                    background: #ffffff;
                    border: 1px solid #eeedf7;
                    font-family: PingFangSC-Medium;
                    font-size: 14px;
                    font-weight: 600;
                    color: #7163C5;
                    margin-bottom: 16px;
                }

                .tag_selected {
                    display: flex;
                    position: relative;
                    margin-top: 10px;
                    margin-left: 125px;

                    .clear_sea {
                        color: #3b99fc;
                        font-size: 12px;
                        margin-left: 20px;
                        margin-top: 8px;
                        // text-decoration: none;
                        cursor: pointer;
                    }

                    .sort {
                        width: 25px;
                        height: 25px;
                        cursor: pointer;
                        img {
                            width: 100%;
                        }
                    }

                    .line {
                        margin-left: 10px;
                        color: #dddddd;
                    }

                    .down_sel {
                        height: 30px;
                        display: flex;
                        width: 120px;
                        font-size: 14px;

                        /deep/ .bp-select {
                            height: 30px;
                            background: #f2f2f2;
                        }

                        /deep/ .bp-select:hover {
                            background: #ddd;
                        }

                        cursor: pointer;
                        // border-right: 1px solid #c0cfe4;
                        .sel {
                            font-size: 14px;
                            margin-left: 5px;
                            margin-top: 4px;
                        }

                        .drop_icon {
                            margin-top: 4px;
                            width: 15px;
                            height: 15px;

                            img {
                                width: 100%;
                            }
                        }
                    }

                    .down_sel:hover {
                        background: #dddddd;
                    }

                    .tags_down_sel {
                        border: 0;
                        margin-left: 10px;
                        width: 50px;
                        .label_selected {
                            box-shadow: 2px 4px 6px #dddddd;
                            // display: flex;
                            position: absolute;
                            top: 25px;
                            left: 168px;
                            width: 150px;
                            // height: 72px;
                            border: 1px solid #dddddd;
                            background: #fff;
                            padding-top: 10px;
                            z-index: 3333;
                            .tag_arr {
                                height: 150px;
                                overflow: auto;
                            }
                            .management {
                                margin-top: 5px;
                                width: 150px;
                                height: 30px;
                                border-top: 1px solid #dddddd;
                                background: #e6e6e6;
                                .manage_label {
                                    font-size: 14px;
                                    // text-align: center;
                                    font-weight: 600;
                                    margin-left: 40px;
                                    margin-top: 5px;
                                }
                            }

                            .management:hover {
                                background: #e6e6e6;
                            }
                        }

                        .label_name {
                            display: flex;
                            margin-left: 10px;

                            span {
                                display: inline-block;
                                width: 10px;
                                height: 10px;
                                border-radius: 5px;
                                // background: #1bc2ac;
                                margin-top: 8px;
                                margin-right: 8px;
                            }

                            .tags_name {
                                font-size: 14px;
                                margin-bottom: 5px;
                            }

                        }

                        .label_name:hover {
                            background: #fff99d;
                        }
                    }

                    .dashboard_number {
                        position: absolute;
                        top: 0;
                        right: 45px;
                        // margin-left: 700px;

                        p {
                            font-size: 14px;
                            font-weight: 600;
                        }
                    }
                }
            }

            .upload_bottom {
                height: calc(100vh - 280px);
                overflow: auto;
                .word {
                    width: 100%;
                    height: 618px;
                    line-height: 618px;
                    text-align: center;
                    font-family: PingFangSC-Medium;
                    font-size: 20px;
                    color: #000000;
                    font-weight: 500;
                }

                .data_content:hover {
                    background-color: #f2f2f2;
                    cursor: pointer;
                }

                .data_content {
                    display: flex;
                    width: 100%;
                    box-sizing: border-box;
                    // height: 60px;
                    border-bottom: 1px solid #dddddd;
                    padding: 10px 0 10px 10px;
                    align-items: center;
                    .data_input {
                        width: 40px;
                        height: 40px;
                        input {
                            height: 40px;
                            cursor: pointer;
                        }
                    }
                    .tag_bg:hover::after {
                        content: attr(data-title);    //取到data-title属性的值
                        display: inline-block;
                        padding: 10px 14px;
                        border: 1px solid #ddd;
                        border-radius: 5px;
                        position: absolute;
                        top: -50px;
                        left: -30px;
                    }
                    .tag_bg {
                        position: relative;
                        // top: -8px;
                        left: 0px;
                        font-size: 12px;
                        color: #fff;
                        height: 16px;
                        text-align: center;
                        padding: 0 8px;
                        border-radius: 10px;
                        margin-left: 10px;
                        margin-bottom: 5px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        max-width: 120px;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        padding: 0 10px;
                    }
                    .item_list {
                        display: flex;
                    }
                    .script_icon {
                        // margin-left: 27px;
                        width: 30px;
                        max-width: 30px;
                        height: 30px;

                        img {
                            width: 30px;
                            height: 30px;
                        }
                    }
                    .data_name {
                        margin-left: 27px;
                        font-family: PingFangSC-Medium;
                        font-size: 14px;
                        color: #000000;
                        font-weight: 600;
                        width: 400px;
                        min-width: 400px;
                        height: 40px;
                        line-height: 40px;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                    .tag_area {
                        display: flex;
                        flex-wrap: wrap;
                        overflow: hidden;
                        img {
                            width: 20px;
                            height: 20px;
                        }
                        .more_tags {
                            display: none;
                            position: relative;
                            top: -8px;
                            margin-left: 10px;
                        }
                    }
                }

                .tip {
                    background: #f0edc5;
                    color: #000;
                    font-size: 14px;
                    font-weight: 600;
                    // height: 80px;

                }
            }
        }

        .project_info_right {
            width: 500px;

            .click_look {
                font-family: PingFangSC-Medium;
                font-size: 14px;
                color: #838383;
                text-align: center;
                line-height: 800px;
            }

            .view_content {
                width: 100%;
                height: 260px;
                border-bottom: 1px solid #dddddd;

                .view_func {
                    margin-top: 100px;
                    display: flex;
                    justify-content: space-between;
                    padding: 0 30px;
                    .view_list {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        width: 75px;
                    }
                }

                .tags_func {
                    cursor: pointer;
                }

                .project_name_view {
                    display: flex;
                    width: 100%;
                    height: 60px;
                    border-bottom: 1px solid #979797;
                    height: 44px;
                    .space {
                        display: flex;
                        // width: 60px;
                        // height: 60px;
                        background: #dfe7ff;
                        // border-bottom: 2px solid #979797;
                        // border-right: 2px solid #979797;
                        height: 44px;
                        width: 44px;
                        min-width: 44px;
                        justify-content: center;
                        align-items: center;
                        img {
                            width: 44px;
                            height: 44px;
                        }
                    }
                    .show-name {
                        line-height: 44px;
                        .project_name_info {
                            margin-left: 20px;
                            font-family: PingFangSC-Medium;
                            font-size: 14px;
                            color: #000000;
                            font-weight: 600;
                            height: 44px;
                            white-space: nowrap;
                            overflow: hidden;
                            width: 350px;
                            text-overflow: ellipsis;
                            cursor: pointer;
                        }
                    }
                }

                .project_info_view {
                    // display: flex;
                    position: relative;
                    padding: 14px;
                    padding-left: 50px;
                    background: #f5f5f5;
                    width: 100%;
                    height: 100%;
                    border-bottom: 2px solid #dddddd;

                    .edit_input {
                        position: absolute;
                        // margin-left: 20px;
                        top: 6px;
                        right: 192px;
                        display: inline-block;
                        width: 216px;
                        height: 74px;
                    }

                    .operation {
                        display: flex;

                        .about {
                            font-family: PingFangSC-Medium;
                            font-size: 14px;
                            color: #000000;
                            font-weight: 600;

                        }

                        .data_tm_nm {
                            margin-left: 15px;
                            font-family: PingFangSC-Medium;
                            font-size: 12px;
                            color: #000000;
                            font-weight: 600;
                        }

                        .edit_icon {
                            position: absolute;
                            right: 140px;
                            top: 12px;
                            width: 20px;
                            height: 20px;

                            img {
                                width: 100%;
                                height: 100%;
                            }
                        }
                    }
                }

                .time {
                    margin-top: 100px;

                    .create_time {
                        display: flex;

                        .create_word {
                            font-family: PingFangSC-Medium;
                            font-size: 14px;
                            color: #000000;
                            font-weight: 600;
                        }

                        .create_tm {
                            margin-left: 60px;
                            font-family: PingFangSC-Medium;
                            font-size: 12px;
                            color: #000000;
                            font-weight: 600;
                        }
                    }

                    .last_time_edit_time {
                        display: flex;
                        margin-top: 20px;

                        .last_word {
                            font-family: PingFangSC-Medium;
                            font-size: 14px;
                            color: #000000;
                            font-weight: 600;
                        }

                        .last_tm {
                            margin-left: 20px;
                            font-family: PingFangSC-Medium;
                            font-size: 12px;
                            color: #000000;
                            font-weight: 600;
                        }
                    }
                }
            }
        }
    }
}
.tags_imgs_tag {
    width: 24px;
    height: 24px;
    cursor: pointer;
    margin-bottom: 5px;
}
</style>
