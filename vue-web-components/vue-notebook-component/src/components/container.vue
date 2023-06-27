<template>
    <div class="upload-notebooks">
        <link rel="stylesheet" href="https://components.hubadata.com/element-ui/element-ui.css">
        <div class="upload_notebooks_container">
            <div class="info">
                <div class="project_info_left">
                    <div class="upload_top">
                        <div class="selected_search">
                            <div class="selected" :class="[{ 'bg_disabled': notebookscheckedIds.length === 0 }]">
                                <input type="checkbox" class="checkbox" ref="all" @click='chechedAllnotebooks()'
                                    :checked="notebookscheckedIds.length === AllData.length && AllData.length !== 0">
                                <div class="opt-area" @click="dropShow">
                                    <span class="action">选项</span>
                                    <img :src="dropDownIcon" alt="" class="d_icon">
                                    <div class="drop_dialog" v-if="dropDialogShow">
                                        <div class="label_icon" @click="createTagsOpen">
                                            <span class="tag_icon">
                                                <img :src="label_icon" alt="">
                                            </span>
                                            <p>标签</p>
                                        </div>
                                        <div class="label_icon border_none" @click="deleteNotebook">
                                            <span>
                                                <img :src="delete_icon" alt="">
                                            </span>
                                            <p>删除</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="search_area">
                                <div class="search_icon">
                                    <img :src="search_icon">
                                </div>
                                <input type="text" placeholder="搜索当前页面" class="text_input" v-model="searchValue">
                            </div>
                            <button class="upload_btn" @click.stop="showCreationDialog = true">新建编译器</button>
                        </div>

                        <div class="tag_selected">
                            <div class="sort">
                                <!-- 升序 -->
                                <img :src="ascending_order" alt="" v-if="ascending" @click="sort('ascending')">
                                <!-- 降序(默认) -->
                                <img :src="descending_order" alt="" v-if="!ascending" @click="sort('descending')">
                            </div>
                            <div class="down_sel">
                                <bp-select-vue :src="selectIcon" :choosedValue="scriptValue"
                                    @showSelectOption="showSelectOption" :closeTosts="closeTosts">
                                    <bp-option-vue text="名称" @click="selectScript(1)"></bp-option-vue>
                                </bp-select-vue>
                            </div>
                            <div class="line">|</div>
                            <div class="down_sel tags_down_sel">
                                <p class="sel" @click="labelShow">标签</p>
                                <span class="drop_icon" @click="labelShow">
                                    <img :src="dropDownIcon" alt="">
                                </span>
                                <div class="label_selected" v-if="labelShowDialog">
                                    <div class="tag_arr">
                                        <div class="label_name" v-for="(item, index) in datasource.tagsArray" :key="index">
                                            <span
                                                :style="{ background: tagsColorArray[datasource.tagsArray.indexOf(item)] }"></span>
                                            <div class="tags_name">{{ item }}</div>
                                        </div>
                                    </div>
                                    <div class="management">
                                        <div class="manage_label">管理标签</div>
                                    </div>
                                </div>
                            </div>
                            <div class="clear_sea" @click="clearSearch" v-if="searchValue">清空搜索项</div>
                            <div class="notebooks_number" v-if="searchValue.length !== 0">
                                <p>{{ datasource.dns.length }} / {{ totalCount }} 条</p>
                            </div>
                            <div class="notebooks_number" v-else>
                                <p>{{ totalCount }} 条</p>
                            </div>
                        </div>
                    </div>
                    <!--                    <div class="upload_bottom" v-if="datasource.isReady">-->
                    <div class="upload_bottom" ref="centerData">
                        <div class="data_block_content">
                            <div class="data_content" v-for="(notebook, index) in datasource.dns" :key="index"
                                ref="content" :class="{ bg: notebookscheckedIds.indexOf(notebook.detail.id) > -1 }"
                                @click="clickOnlyOne(notebook, index)">
                                <div class="data_input" @click.stop="checkedMore(notebook, index)">
                                    <input type="checkbox" ref="data" name="notebooksList"
                                        :checked="notebookscheckedIds.indexOf(notebook.detail.id) > -1"
                                        @click.stop="checkedOnenotebooks(notebook)">
                                </div>
                                <div class="data_input_left">
                                    <div class="content-left">
                                        <!-- <div style="display: flex; flex-direction: column; justify-content: space-around"> -->
                                        <!-- <div class="data_input" @click="checkedMore(notebook)">
                                        <input type="checkbox" ref="data" name="notebooksList"
                                        :checked="notebookscheckedIds.indexOf(notebook.detail.id) > -1"
                                        @click.stop="checkedOnenotebooks(notebook)">
                                    </div> -->
                                        <div class="item_list">
                                            <span class="script_icon">
                                                <img :src="defs.iconsByName(notebook.detail.ctype)" alt="">
                                            </span>
                                            <p class="data_name" @click.stop="clickNotebooksName(notebook)"
                                                :title="notebook.detail.name">
                                                {{ notebook.detail.name }}
                                            </p>
                                            <el-tag type="danger" v-if="owner === notebook.detail.owner">我的编译器</el-tag>

                                            <div class="tag_area" ref="tagsArea">
                                                <div v-for="(tag, inx) in notebook.detail.label" :key="inx">
                                                    <span v-if="notebook.detail.label !== ''">
                                                        <p :title="tag" class="tag_bg"
                                                            :style="{ background: tagsColorArray[datasource.tagsArray.indexOf(tag)] }">
                                                            {{ tag }}
                                                        </p>
                                                    </span>
                                                </div>
                                                <!-- tag的更多按钮，暂时隐藏 -->
                                                <!-- <img src=`${staticFilePath}` + "/%E6%9B%B4%E5%A4%9A.svg" alt="" class="more_tags" ref="moreTags"> -->
                                            </div>
                                        </div>
                                    </div>
                                    <div @click.stop>
                                        <span>{{ notebook.message }}</span>
                                        <el-switch v-if="notebook.editable && owner === notebook.detail.owner"
                                            v-model="notebook.switch" active-color="#13ce66"
                                            @change="resetStatus(notebook)" />
                                        <el-switch v-else disabled v-model="notebook.switch" active-color="#13ce66" />
                                    </div>
                                </div>
                            </div>
                            <div class="word" v-show="datasource.dns.length == 0" v-if="searchValue.length !== 0">
                                当前页面搜索无结果</div>
                            <div class="word" v-show="datasource.dns.length == 0" v-else>当前项目无注册编辑器</div>
                        </div>
                        <p class="block" @click="goUp" v-if="AllData.length !== totalCount">更多</p>
                        <p class="block" v-else>暂无更多</p>
                    </div>
                </div>
                <div class="project_info_right">
                    <div class="view_content" v-if="notebookscheckedIds.length > 0">
                        <div class="project_name_view">
                            <span class="space">
                                <img :src="script_icon_show" alt="">
                            </span>
                            <div class="show-name" v-if="notebookscheckedIds.length === 1">
                                <p class="project_name_info" :title="notebookscheckedNames[0]">
                                    {{ notebookscheckedNames[0] }}
                                </p>
                            </div>
                            <div class="show-name" v-if="notebookscheckedIds.length > 1">
                                <p class="project_name_info">
                                    {{ notebookscheckedIds.length }} 条
                                </p>
                            </div>
                        </div>
                        <div class="view_func">
                            <span @click="createTagsOpen" class="view_list">
                                <img class='tags_imgs_tag' :src="label_icon" alt="">
                                <span class='tags_func'>标签</span>
                            </span>
                            <span @click='deleteNotebook' class="view_list">
                                <img class='tags_imgs_tag' :src="delete_icon" alt="">
                                <span class='tags_func'>删除</span>
                            </span>
                        </div>
                    </div>
                    <p v-if="notebookscheckedIds.length === 0" class="click_look">单击对象查看详细信息</p>
                </div>
            </div>
            <!-- 添加tag -->
            <create-tags-dialog v-if="showCreateTagsDialog" :datasetchecked-ids="notebookscheckedIds"
                :datasetchecked-names="notebookscheckedNames" :datasets="datasource.dns" :tagsArray="datasource.tagsArray"
                :tagsColorArray="tagsColorArray" @addTagsEvent="addTagsEvent" @closeCreateDialog="closeCreateDialog">
            </create-tags-dialog>
            <!-- 新建NoteBook -->
            <create-notebook-dialog :dialog-visible="showCreationDialog" @cancel="showCreationDialog = false"
                @confirm="createNotebook">
            </create-notebook-dialog>
        </div>
        <div id="loadingio-spinner-double-ring-ho1zizxmctu" v-show="loading">
            <div class="ldio-400lpppmiue">
                <div></div>
                <div></div>
                <div>
                    <div></div>
                </div>
                <div>
                    <div></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import createTagsDialog from './create-tags-dialog.vue'
import createNotebookDialog from './create-notebook-dialog.vue'
import bpSelectVue from '../../node_modules/vue-components/src/components/bp-select-vue.vue'
import bpOptionVue from '../../node_modules/vue-components/src/components/bp-option-vue.vue'
import { MessageBox, Message } from 'element-ui'
import { staticFilePath } from '../config/envConfig'
import PhDagDefinitions from "./policy/definitions/definitions"
import ElSwitch from "element-ui/packages/switch/index"
import ElTag from "element-ui/packages/tag/index"
import PhDataSource from "./model/datasource"

export default {
    data() {
        return {
            label_icon: `${staticFilePath}` + "/tag.svg",
            search_icon: `${staticFilePath}` + "/search.png",
            dropDownIcon: `${staticFilePath}` + "/drop_down_icon.svg",
            delete_icon: `${staticFilePath}` + "/delete.png",
            selectIcon: `${staticFilePath}` + "/drop_down_icon.svg",
            ascending_order: `${staticFilePath}` + "/down.svg",
            descending_order: `${staticFilePath}` + "/top.svg",
            script_icon: `${staticFilePath}` + "/script_select.svg",
            script_icon_show: "",
            // showDialog: false,
            state: '',
            dropDialogShow: false,
            labelShowDialog: false,
            showSelectOptionParam: false,
            closeTosts: false,
            showCreateTagsDialog: false, //添加tag弹框
            showCreationDialog: false,
            searchValue: '',
            ascending: false,
            tags: ['name', 'description', '啦啦啦'],
            checked: false,
            manual: true,
            scriptValue: "名称",
            isCheckedAllnotebooks: false,
            notebookscheckedIds: [], //选中项id
            notebookscheckedNames: [], //选中项name
            notebookscheckedOwners: [], //选中项owner
            notebookscheckedStatus: [], //选中项状态
            isStopStatus: true, //是否是已停止状态
            loading: false,
            color: ['#133883', '#90a8b7', '#94be8e', '#ff21ee', '#1ac2ab', '#77bec2', '#c7c7c7', '#a088bd', '#d66b9b', '#5354ec', '#acacff', '#1e8103', '#ec7211', '#ec7211', '#ea1c82', '#2bb1ac', '#3c498c', '#000', 'blue', '#666'],
            tagsColorArray: ['#133883', '#90a8b7', '#94be8e', '#ff21ee', '#1ac2ab', '#77bec2', '#c7c7c7', '#a088bd', '#d66b9b', '#5354ec', '#acacff', '#1e8103', '#ec7211', '#ec7211', '#ea1c82', '#2bb1ac', '#3c498c', '#000', 'blue', '#666'],
            owner: "",
            startKey: "",
            projectId: "",
            projectName: "",
            AllData: [],
            tagsArray: [],
            totalCount: 0
        }
    },
    props: {
        allData: {
            type: Object,
            default: () => ({
                // "projectName": "ETL_Iterator",
                // "projectId": "JfSmQBYUpyb4jsei",
                // "dns": [],
                // "tagsArray": [],
                "_isVue": true
            })
        },
        defs: {
            type: Object,
            default: function () {
                return new PhDagDefinitions("1");
            }
        },
        datasource: {
            type: Object,
            default: function () {
                return new PhDataSource("1", this)
            }
        }
    },
    components: {
        createTagsDialog,
        createNotebookDialog,
        bpSelectVue,
        bpOptionVue,
        ElSwitch,
        ElTag
    },
    computed: { },
    mounted() {
        // if (this.$refs.tagsArea) {
        //     this.$refs.tagsArea.forEach((item) => {
        //         item.style["height"] = "40px"
        //     })
        // }
        this.owner = this.datasource.getCookie("account_id")

        this.projectId = this.getUrlParam("projectId")
        this.projectName = this.getUrlParam("projectName")
        let that = this
        this.loading = true
        this.datasource.refreshJupyterData(this, '', ()=>{
            that.startKey = this.datasource.startKey
            that.totalCount = this.datasource.totalCount
            this.datasource.refreshPlaceholders(this.datasource.dns)
            const dnsIds = this.datasource.dns.map(x => x.id)
            this.datasource.refreshStatus(this.datasource.tenantId, dnsIds, ()=>{
                that.datasource.dns = this.datasource.model
                that.AllData = that.datasource.dns
            })
        })
    },
    watch: {
        "datasource.tagsArray": function () {
            this.tagsColorArray = []
            this.datasource.tagsArray.forEach(() => {
                // this.allData.tagsArray.forEach((item, index) => {
                this.tagsColorArray.push(this.color[Math.floor(Math.random() * 10 + Math.random() * 10)])
            })
        },
        searchValue(newValue) {
            this.searchValue = newValue
            this.state = 'search'
            this.search(this.searchValue)
        }
    },
    methods: {
        search(value){
            if (value) {
                this.datasource.dns = this.AllData.filter(item => item.detail.name.toLowerCase().indexOf(value.toLowerCase()) > -1)
            } else {
                this.datasource.dns = this.AllData
            }
            // this.sort("ascending")
        },
        arrRemoveRepetition(maxArr, minArr) {
            let nArr = [];
            nArr = maxArr.filter(function (item) {
                let temp = minArr.map(function (v) {
                    return v.detail.id
                })
                return !temp.includes(item.id)
            })
            return nArr
        },
        goUp(){
            let that = this
            this.loading = true
            this.datasource.appendJupyterData(this, this.startKey, ()=>{
                that.startKey = this.datasource.startKey
                let dns = this.arrRemoveRepetition(this.datasource.dns, that.AllData)
                this.datasource.refreshPlaceholders(dns)
                const dnsIds = dns.map(x => x.id)
                this.datasource.refreshStatus(this.datasource.tenantId, dnsIds, ()=>{
                    that.datasource.dns = that.AllData.concat(this.datasource.model)
                    that.AllData = this.datasource.dns
                    if (that.searchValue.length !== 0) {
                        this.state = 'search'
                        this.search(this.searchValue)
                    }
                    if (this.notebookscheckedIds.length < this.datasource.dns.length && this.notebookscheckedIds.length !== 0) {
                        this.$refs.all.indeterminate = true
                    }
                })
            })
        },
        getCookie(name) {
            let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)")
            arr = document.cookie.match(reg)
            if (arr) return (arr[2])
            else return null
        },
        getUrlParam(value) {
            let href = window.location.href
            let paramArr = href.split("?")[1].split("&")
            let data = paramArr.find(item => item.indexOf(value) > -1)
            return data ? decodeURI(data).split("=")[1] : undefined
        },
        handleClose(done) {
            this.$confirm('确认关闭？').then(() => {
                done();
            }).catch(() => { });
        },
        addTagsEvent(data) {
            data.args.param.selectednotebooks = this.notebookscheckedIds
            data.args.param.notebooksArray = this.datasource.dns
            data.args.param.projectName = this.projectName
            data.args.param.projectId = this.projectId
            this.$emit('event', data)
            this.showCreateTagsDialog = false;
        },
        //点击list主体
        clickOnlyOne(notebook) {
            this.script_icon_show = this.defs.iconsByName(notebook.detail.ctype)
            this.notebookscheckedIds = []
            this.notebookscheckedNames = []
            this.notebookscheckedOwners = []
            this.notebookscheckedStatus = []
            this.notebookscheckedIds.push(notebook.detail.id)
            this.notebookscheckedNames.push(notebook.detail.name)
            this.notebookscheckedOwners.push(notebook.detail.owner)
            this.notebookscheckedStatus.push(notebook.status)
            if (this.notebookscheckedStatus.every(item => item == 0)) {
                this.isStopStatus = true
            } else {
                this.isStopStatus = false
            }
        },
        checkedMore(notebook,index){
            this.$refs.data[index].checked = !this.$refs.data[index].checked
            let idIndex = this.notebookscheckedIds.indexOf(notebook.detail.id)
            if(idIndex >= 0) {
                this.notebookscheckedIds.splice(idIndex, 1)
                this.notebookscheckedNames.splice(idIndex, 1)
                this.notebookscheckedOwners.splice(idIndex, 1)
                this.$refs.data[index].checked = false
            } else {
                this.$refs.data[index].checked = true
                this.notebookscheckedIds.push(notebook.detail.id)
                this.notebookscheckedNames.push(notebook.detail.name)
                this.notebookscheckedOwners.push(notebook.detail.owner)
            }
            if (this.notebookscheckedIds.length == 1) {
                this.script_icon_show = this.defs.iconsByName(notebook.detail.ctype)
            } else {
                this.script_icon_show = `${staticFilePath}` + "/icons/all_jupyter.svg"
            }
            if (this.notebookscheckedIds.length < this.datasource.dns.length && this.notebookscheckedIds.length !== 0) {
                this.$refs.all.indeterminate = true
            } else if (this.notebookscheckedIds.length === this.datasource.dns.length){
                this.$refs.all.indeterminate = false
                this.isCheckedAllnotebooks = true
            } else {
                this.$refs.all.indeterminate = false
            }
        },
        //点击list多选框
        checkedOnenotebooks(notebook) {
            let idIndex = this.notebookscheckedIds.indexOf(notebook.detail.id)
            if (idIndex >= 0) {
                this.notebookscheckedIds.splice(idIndex, 1)
                this.notebookscheckedNames.splice(idIndex, 1)
                this.notebookscheckedOwners.splice(idIndex, 1)
                this.notebookscheckedStatus.splice(idIndex, 1)
            } else {
                this.notebookscheckedIds.push(notebook.detail.id)
                this.notebookscheckedNames.push(notebook.detail.name)
                this.notebookscheckedOwners.push(notebook.detail.owner)
                this.notebookscheckedStatus.push(notebook.status)
            }
            if (this.notebookscheckedStatus.every(item => item == 0)) {
                this.isStopStatus = true
            } else {
                this.isStopStatus = false
            }
            if (this.notebookscheckedIds.length == 1) {
                this.script_icon_show = this.defs.iconsByName(notebook.detail.ctype)
            } else {
                this.script_icon_show = `${staticFilePath}` + "/icons/all_jupyter.svg"
            }
            if (this.notebookscheckedIds.length < this.datasource.dns.length && this.notebookscheckedIds.length !== 0) {
                this.$refs.all.indeterminate = true
            } else if (this.notebookscheckedIds.length === this.datasource.dns.length){
                this.$refs.all.indeterminate = false
                this.isCheckedAllnotebooks = true
            } else {
                this.$refs.all.indeterminate = false
            }
        },
        //点击notebooks name
        clickNotebooksName(notebook) {
            if (notebook.detail.owner !== this.owner) {
                Message.error("抱歉,您没有权限操作当前Jupyter!", { duration: 0, showClose: true })
                return
            } else if (notebook.status !== 2) {
                Message.error("请先启动编译器资源!", { duration: 0, showClose: true })
                return
            }

            const event = new Event("event")
            event.args = {
                callback: "linkToPage",
                element: this,
                param: {
                    name: "notebook-" + notebook.detail.ctype,
                    detailName: notebook.detail.name,
                    resourceId: notebook.resourceId,
                    projectName: this.projectName,
                    projectId: this.projectId
                }
            }
            this.$emit('event', event)
        },
        //全选list
        chechedAllnotebooks() {
            this.isCheckedAllnotebooks = this.notebookscheckedIds.length !== this.AllData.length;
            this.notebookscheckedIds = []
            this.notebookscheckedNames = []
            this.notebookscheckedOwners = []
            //全选状态
            if (this.isCheckedAllnotebooks) {
                this.script_icon_show = `${staticFilePath}` + "/icons/all_jupyter.svg"
                this.AllData.forEach(item => {
                    this.notebookscheckedIds.push(item.detail.id)
                    this.notebookscheckedNames.push(item.detail.name)
                    this.notebookscheckedOwners.push(item.detail.owner)
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
            if (val === 'ascending') {
                // 升序->降序
                this.ascending = false
                this.datasource.dns.sort(
                    function compareFunction(param1, param2) {
                        if (param1.detail.name) {
                            return param1.detail.name.localeCompare(param2.name);
                        }
                    }
                )
            } else if (val === 'descending') {
                // 降序->升序
                this.ascending = true
                this.datasource.dns.reverse()
            }
        },
        //排序条件下拉框
        selectScript() {
            this.scriptValue = "名称"
        },
        //打开tag添加弹框
        createTagsOpen() {
            if (this.notebookscheckedOwners.every(item => item === this.owner)) {
                this.showCreateTagsDialog = true;
            } else {
                Message.error("抱歉,您没有权限操作当前Jupyter!", { duration: 0, showClose: true })
            }
        },
        //关闭tag添加弹框
        closeCreateDialog() {
            this.showCreateTagsDialog = false;
        },
        //增加 notebook
        createNotebook(data) {
            data.args.param.projectId = this.projectId
            this.$emit('event', data)
            this.showCreationDialog = false
        },
        //关闭删除脚本弹框
        closeDeleteDialog() {
            this.deletedialogshow = false;
        },
        //打开删除脚本弹框
        deleteNotebook() {
            if (this.notebookscheckedIds.length !== 1) {
                Message.error("暂时不支持同时删除多种资源的操作!!", { duration: 0, showClose: true })
                return
            }
            const _that = this
            var result = this.notebookscheckedOwners.every(function (item) {
                return item === _that.owner
            })
            if (!result) {
                Message.error("无法删除其他用户的编译器!", { duration: 0, showClose: true })
                return
            }
            if (this.isStopStatus !== true) {
                Message.error("请先关闭编辑器资源!", { duration: 0, showClose: true })
                return
            }
            // this.deletedialogshow = true;
            MessageBox.confirm('释放删除资源将丢失所有数据！ 是否继续?', '警告', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(() => {
                const event = new Event("event")
                event.args = {
                    callback: "deleteNotebook",
                    param: {
                        resourceId: this.notebookscheckedIds[0]
                    }
                }
                this.$emit('event', event)
            }).catch(() => {
            })
        },
        //关闭清除脚本弹框
        closeClearDialog() {
            this.cleardialogshow = false;
        },
        //标签下拉框
        labelShow() {
            this.labelShowDialog = !this.labelShowDialog
            this.dropDialogShow = false;
            this.nameShowDialog = false;
        },
        //左上角选项下拉框
        dropShow() {
            if (this.notebookscheckedIds.length < 1) {
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
                    projectName: this.projectName,
                    projectId: this.projectId
                }
            }
            this.$emit('event', event)
        },
        dealResourceStart(data, func) {
            const event = new Event("event")
            event.args = {
                callback: "dealResourceStart",
                param: {
                    traceId: data.traceId,
                    owner: data.detail.owner,
                    callback: func
                }
            }
            this.$emit('event', event)
        },
        dealResourceStop(data, func) {
            const event = new Event("event")
            event.args = {
                callback: "dealResourceStop",
                param: {
                    traceId: data.traceId,
                    owner: data.detail.owner,
                    callback: func
                }
            }
            this.$emit('event', event)
        },
        // 启停
        resetStatus(notebook) {
            this.loading = true
            this.isStopStatus = false
            if (notebook.switch) {
                this.datasource.resourceStart(this.datasource.tenantId, notebook)
            } else {
                this.datasource.resourceStop(this.datasource.tenantId, notebook)
            }
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
    // height: 130px;
    border: 1px solid #333;
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

    .list {
        display: flex;
        padding: 5px;

        img {
            width: 20px;
            height: 20px;
        }

        .dis {
            color: #ccc;
        }
    }

    .last {
        border-bottom: none;
    }

}

.script-opt {
    padding: 0 10px;
    border-bottom: 1px solid #ccc;
}

.script-opt-last {
    border-bottom: none;
}

.upload_notebooks_container {
    width: 100vw;
    height: calc(100vh - 40px);

    // border: 2px solid #dddddd;
    .project_name_header {
        height: 50px;
        width: 100%;
        // background: rgba(0,0,0,.2);
        border-bottom: 1px solid #dddddd;

        .project_name {
            // width: 200px;
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
            display: flex;
            flex-direction: column;

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
                    width: 82px;
                    height: 32px;
                    background: #ffffff;
                    border: 1px solid #eeedf7;
                    font-family: PingFangSC-Medium;
                    font-size: 14px;
                    font-weight: 600;
                    color: #7163C5;
                    margin-bottom: 16px;
                    cursor: pointer;
                }

                .upload_btn_new {
                    position: absolute;
                    top: 0px;
                    right: 40px;
                    width: 100px;
                    height: 26px;

                    /deep/.el-input {
                        height: 26px !important;
                    }

                    /deep/.el-input__inner {
                        height: 26px !important;
                        box-sizing: border-box;
                        display: inline-block;
                        width: 100px;
                        background: #ffffff;
                        border: 1px solid #eeedf7;
                        font-family: PingFangSC-Medium;
                        font-size: 14px;
                        font-weight: 600;
                        color: #7163C5;
                        margin-bottom: 16px;
                        color: #333333;
                        border: 1px solid #cccccc;
                        padding-right: 10px;
                    }

                    /deep/input::placeholder {
                        color: #333;
                    }
                }

                .tag_selected {
                    display: flex;
                    position: relative;
                    margin-top: 10px;
                    // width: 400px;
                    // height: 20px;
                    // border: 2px solid #111;
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

                    .notebooks_number {
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
                height: calc(100vh - 160px);
                overflow: auto;
                flex-grow: 1;
                display: flex;
                flex-direction: column;
                justify-content: space-between;

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

                .data_block_content{
                    display:flex;
                    flex-direction: column;
                    flex-grow: 1;

                    .data_content {
                        display: flex;
                        // justify-content: space-between;
                        width: 100%;
                        box-sizing: border-box;
                        // height: 60px;
                        border-bottom: 1px solid #dddddd;
                        padding: 10px 0 10px 10px;
                        align-items: center;

                        .data_input {
                            width: 40px;
                            height: 40px;
                            line-height: 40px;
                            input {
                                height: 40px;
                                cursor: pointer;
                            }
                        }
                        .data_input_left{
                            display: flex;
                            justify-content: space-between;
                            flex-grow: 1;
                            width:calc(100% - 40px);
                        }
                        .tag_bg:hover::after {
                            content: attr(data-title); //取到data-title属性的值
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
                            // width: calc(100% - 174px);
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
                            overflow: auto;
                            // min-width: 300px;
                            height: 42px;

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
                }

                .tip {
                    background: #f0edc5;
                    color: #000;
                    font-size: 14px;
                    font-weight: 600;
                    // height: 80px;
                }

                .block{
                    color: rgb(28, 30, 36);
                    font-size: 18px;
                    cursor: pointer;
                    text-align: center;
                    line-height: 60px;
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
                line-height: calc(100vh - 40px);
            }

            .view_content {
                width: 100%;
                height: 260px;
                border-bottom: 1px solid #dddddd;

                .view_func {
                    margin-top: 20px;
                    display: flex;
                    flex-wrap: wrap;

                    /*justify-content: space-;*/
                    // padding: 0 30px;
                    .view_list {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        width: 75px;
                        margin-bottom: 20px;
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
                        background: #dfe7ff;
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
                    border-bottom: 1px solid #dddddd;

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

    .content-left {
        display: flex;
        flex-direction: row;
        width: calc(100% - 110px);
    }
}

.tags_imgs_tag {
    width: 20px;
    height: 20px;
    cursor: pointer;
    margin-bottom: 5px;
}

#loadingio-spinner-double-ring-ho1zizxmctu {
    backdrop-filter: blur(1px);
    /* 毛玻璃特效 */
    background: rgba(200, 0, 0, 0.05);
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    display: flex;
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
}

/* 	使用transform: translateZ(0)加快动画和过渡的速度
	使用scale进行缩放
*/
.ldio-400lpppmiue {
    position: absolute;
    transform: translateZ(0) scale(0.8);
}

/*  创建动画
	1. 0%是动画开始时间
	2. 100%是动画结束时间
	3. transform: rorate()是正时针旋转的角度
*/
@keyframes ldio-400lpppmiue {
    0% {
        transform: rotate(0)
    }

    100% {
        transform: rotate(360deg)
    }
}

.ldio-400lpppmiue div {
    box-sizing: border-box;
}

.ldio-400lpppmiue>div {
    position: absolute;
    width: 68px;
    height: 68px;
    top: -30px;
    left: -30px;
    border-radius: 50%;
    border: 4px solid #000;
    border-color: #f5c924 transparent #f5c924 transparent;
    animation: ldio-400lpppmiue 1s linear infinite;
}

.ldio-400lpppmiue>div:nth-child(2),
.ldio-400lpppmiue>div:nth-child(4) {
    width: 58px;
    height: 58px;
    top: -26px;
    left: -26px;
    animation: ldio-400lpppmiue 1s linear infinite reverse;
}

.ldio-400lpppmiue>div:nth-child(2) {
    border-color: transparent #747789 transparent #747789
}

.ldio-400lpppmiue>div:nth-child(3) {
    border-color: transparent
}

.ldio-400lpppmiue>div:nth-child(3) div {
    position: absolute;
    width: 100%;
    height: 100%;
    transform: rotate(45deg);
}

.ldio-400lpppmiue>div:nth-child(3) div:before,
.ldio-400lpppmiue>div:nth-child(3) div:after {
    content: "";
    display: block;
    position: absolute;
    width: 4px;
    height: 4px;
    top: -4px;
    left: 28px;
    background: #f5c924;
    border-radius: 0%;
    box-shadow: 0 64px 0 0 #f5c924;
}

.ldio-400lpppmiue>div:nth-child(3) div:after {
    left: -4px;
    top: 28px;
    box-shadow: 64px 0 0 0 #f5c924;
}

.ldio-400lpppmiue>div:nth-child(4) {
    border-color: transparent;
}

.ldio-400lpppmiue>div:nth-child(4) div {
    position: absolute;
    width: 100%;
    height: 100%;
    transform: rotate(45deg);
}

.ldio-400lpppmiue>div:nth-child(4) div:before,
.ldio-400lpppmiue>div:nth-child(4) div:after {
    content: "";
    display: block;
    position: absolute;
    width: 4px;
    height: 4px;
    top: -4px;
    left: 23px;
    background: #747789;
    border-radius: 0%;
    box-shadow: 0 54px 0 0 #747789;
}

.ldio-400lpppmiue>div:nth-child(4) div:after {
    left: -4px;
    top: 23px;
    box-shadow: 54px 0 0 0 #747789;
}
</style>
