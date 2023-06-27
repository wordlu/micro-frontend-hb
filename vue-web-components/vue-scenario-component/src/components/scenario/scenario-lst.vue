<template>
    <div class="upload-scenario">
        <link rel="stylesheet" href="https://components.hubadata.com/element-ui/element-ui.css">
        <div class="upload_scenario_container">
            <div class="info">
                <div class="project_info_left">
                    <div class="upload_top">
                        <div class="selected_search">
                            <div class="selected" :class="[
                                    {'bg_disabled': scenarioCheckedIds.length === 0}]">
                                <input type="checkbox" class="checkbox" ref="all" @click='chechedAllScenario()'
                                    :checked="scenarioCheckedIds.length === AllData.length && AllData.length !== 0">
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
                                        <div class="label_icon border_none none" @click="clearDialogOpen">
                                            <span>
                                                <img :src="clear_data_icon" alt="">
                                            </span>
                                            <p>清除数据</p>
                                        </div>
                                        <div class="label_icon border_none" @click="deleteCurrentScenario">
                                            <span>
                                                <img :src="delete_icon" alt="">
                                            </span>
                                            <p>删除Scenario</p>
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
                            <button class="upload_btn" @click="openCreateScenarioDialog">New Scenario</button>
                        </div>

                        <div class="tag_selected">
                            <div class="sort">
                                <!-- 升序 -->
                                <img :src="ascending_order" alt="" v-if="ascending" @click="sort('ascending')">
                                <!-- 降序(默认) -->
                                <img :src="descending_order" alt="" v-if="!ascending" @click="sort('descending')">
                            </div>
                            <div class="down_sel">
                                <bp-select-vue :src="selectIcon" :choosedValue="scenarioSortedBy"
                                    @showSelectOption="showSelectOption" :closeTosts="closeTosts">
                                    <bp-option-vue text="名称" @click="selectScenario(1)"></bp-option-vue>
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
                                        <div class="label_name" v-for="(item,index) in datasource.tagsArray" :key="index">
                                            <span
                                                :style="{background: tagsColorArray[datasource.tagsArray.indexOf(item)]}"></span>
                                            <div class="tags_name">{{item}}</div>
                                        </div>
                                    </div>
                                    <div class="management">
                                        <div class="manage_label">管理标签</div>
                                    </div>
                                </div>
                            </div>
                            <div class="clear_sea" @click="clearSearch" v-if="searchValue">清空搜索项</div>
                            <div class="scenario_number" v-if="searchValue.length !== 0">
                                <p>{{ datasource.data.length }} / {{ totalCount }} 条 Scenarios</p>
                            </div>
                            <div class="scenario_number" v-else>
                                <p>{{ totalCount }} 条 Scenarios</p>
                            </div>
                        </div>
                    </div>
                    <div class="upload_bottom">
                        <div class="data_block_content">
                            <div class="data_content" v-for="(scenario,index) in datasource.data" :key="index"
                                ref="content" :class="{bg: scenarioCheckedIds.indexOf(scenario.id) > -1}"
                                @click="clickOnlyOne(scenario, index)">
                                <div class="data_input" @click.stop="checkedMore(scenario)">
                                    <input type="checkbox" ref="data" name="scenarioList"
                                        :checked="scenarioCheckedIds.indexOf(scenario.id) > -1"
                                        @click.stop="checkedOneScenario(scenario)" />
                                </div>
                                <div class="item_list">
                                    <span class="script_icon">
                                        <img :src="defs.iconsByName('scenario')" alt="">
                                    </span>
                                    <p class="data_name" @click.stop="clickScenarioName(scenario)"
                                        :title="scenario.scenarioName">{{scenario.scenarioName}}</p>
                                    <div class="tag_area" ref="tagsArea">
                                        <div v-for="(tag,inx) in scenario.label" :key="inx">
                                            <span v-if="scenario.label !== ''">
                                                <p :title="tag" class="tag_bg"
                                               :style="{background: tagsColorArray[datasource.tagsArray.indexOf(tag)]}">
                                               {{tag}}
                                            </p>
                                            </span>
                                        </div>

                                        <!-- tag的更多按钮，暂时隐藏 -->
                                        <!-- <img src=`${staticFilePath}` + "/%E6%9B%B4%E5%A4%9A.svg" alt="" class="more_tags" ref="moreTags"> -->
                                    </div>
                                </div>
                                <div class="scenario-active-switch">
                                    <span>自动运行</span>
                                    <el-switch @change="scenarioActiveChange(scenario)" v-model="scenario.active"
                                        active-color="#13ce66" inactive-color="#ff4949">
                                    </el-switch>
                                </div>
                            </div>
                            <div class="word" v-show="datasource.data.length == 0" v-if="searchValue.length !== 0">
                                当前页面搜索无结果</div>
                            <div class="word" v-show="datasource.data.length == 0" v-else>当前项目无数据</div>
                        </div>
                        <p class="block" @click="goUp" v-if="AllData.length !== totalCount">更多</p>
                        <p class="block" v-else>暂无更多</p>
                    </div>
                </div>
                <div class="project_info_right">
                    <div class="view_content" v-if="scenarioCheckedIds.length > 0">
                        <div class="project_name_view">
                            <span class="space">
                                <img :src="database_icon" alt="">
                            </span>
                            <div class="show-name" v-if="scenarioCheckedIds.length === 1">
                                <p class="project_name_info" :title="scenarioCheckedNames[0]">
                                    {{scenarioCheckedNames[0]}}
                                </p>
                            </div>
                            <div class="show-name">
                                <p class="project_name_info" v-if="scenarioCheckedIds.length > 1">
                                    {{scenarioCheckedIds.length}} 条 Scenario
                                </p>
                            </div>
                        </div>
                        <div class="view_func">
                            <span @click="createTagsOpen" class="view_list">
                                <img class='tags_imgs_tag' :src="label_icon" alt="">
                                <span class='tags_func'>标签</span>
                            </span>
                            <span @click='deleteCurrentScenario' class="view_list">
                                <img class='tags_imgs_tag' :src="delete_icon" alt="">
                                <span class='tags_func'>删除</span>
                            </span>
                        </div>
                    </div>
                    <p v-if="scenarioCheckedIds.length === 0" class="click_look">单击对象查看详细信息</p>
                </div>
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
        <!-- 添加tag -->
        <create-tags-dialog v-if="showCreateTagsDialog" :scenarioCheckedIds="scenarioCheckedIds"
            :scenarioCheckedNames="scenarioCheckedNames" :scenarios="datasource.data" 
            :tagsArray="datasource.tagsArray" :tagsColorArray="tagsColorArray"
            @addTagsEvent="addTagsEvent" @closeCreateDialog="closeCreateDialog">
        </create-tags-dialog>
        <!-- 管理标签 -->
        <delete-tags-dialog :tags="tags" v-if="deleteTagsDialog" @closeDeleteTags="closeDeleteTags">
        </delete-tags-dialog>
        <create-scenario-dlg :dialog-visible="showCreateScenarioDialog" :project-name="projectName"
            :index="nextIndexValue" owner="alfred" @cancelCreateScenario="showCreateScenarioDialog = false"
            @createScenario="createNewScenario" />
            <!-- 删除scenario -->
        <clear-delete
            v-if="deleteScenarioDialog"
            :scenarioCheckedIds="scenarioCheckedIds"
            :scenarioCheckedNames="scenarioCheckedNames"
            @deleteScenarioEvent="on_clickDeleteScenarioDialog"
            @closeDeleteScenario="deleteScenarioDialog = false">
        </clear-delete>
    </div>

</template>

<script>
import clearDelete from './delete-dialog-scenario.vue'
import createTagsDialog from './create-tags-dialog.vue'
import deleteTagsDialog from './delete-tags-dialog.vue'
import bpSelectVue from '../../../node_modules/vue-components/src/components/bp-select-vue.vue'
import bpOptionVue from '../../../node_modules/vue-components/src/components/bp-option-vue.vue'
import { staticFilePath } from '../../config/envConfig'
import ElSwitch from "element-ui/packages/switch/index"
import CreateScenarioDlg from "./create-scenario-dlg"
import PhDagDefinitions from "../policy/definitions/definitions";
// import ElDialog from 'element-ui/packages/dialog/src/component'
// import ElButton from 'element-ui/packages/button/index'
import PhDataSource from '../model/datasource'
import { Message } from 'element-ui'

export default {
    data() {
        return {
            // icons
            label_icon: `${staticFilePath}` + "/tag.svg",
            search_icon: `${staticFilePath}` + "/search.png",
            dropDownIcon: `${staticFilePath}` + "/drop_down_icon.svg",
            edit_icon: `${staticFilePath}` + "/edit_icon.png",
            selectIcon: `${staticFilePath}` + "/drop_down_icon.svg",
            delete_icon: `${staticFilePath}` + "/delete_r.svg",
            clear_data_icon: `${staticFilePath}` + "/delete_b.svg",
            ascending_order: `${staticFilePath}` + "/down.svg",
            descending_order: `${staticFilePath}` + "/top.svg",
            scenario_icon: `${staticFilePath}` + "/normal.svg",
            input_index_icon: `${staticFilePath}` + "/input_index.svg",
            output_index_icon: `${staticFilePath}` + "/output_index.svg",
            intermediate_icon: `${staticFilePath}` + "/intermediate.svg",
            database_icon: `${staticFilePath}` + "/Databases.svg",
            catalog_icon: `${staticFilePath}` + "/icons/catalog/normal.svg",
            // about select
            ascending: false,
            state: "",
            searchValue: "",
            scenarioSortedBy: "名称",
            scenarioCheckedIds: [], //选中项id
            scenarioCheckedNames: [], //选中项name
            isCheckedAllScenario: false,
            // Dialog shows controller
            showCreateScenarioDialog: false,
            dropDialogShow: false,
            labelShowDialog: false,
            showSelectOptionParam: false,
            closeTosts: false,
            showCreateTagsDialog: false, //添加tag弹框
            deleteTagsDialog: false,
            // about render
            color: ['#133883','#90a8b7','#94be8e','#ff21ee','#1ac2ab','#77bec2','#c7c7c7','#a088bd','#d66b9b','#5354ec','#acacff','#1e8103', '#ec7211','#ec7211', '#ea1c82','#2bb1ac', '#3c498c', '#000', 'blue', '#666'],
            tagsColorArray: ['#133883','#90a8b7','#94be8e','#ff21ee','#1ac2ab','#77bec2','#c7c7c7','#a088bd','#d66b9b','#5354ec','#acacff','#1e8103', '#ec7211','#ec7211', '#ea1c82','#2bb1ac', '#3c498c', '#000', 'blue', '#666'],
			searchData: [],
			deleteScenarioDialog: false,
            projectName: '',
            projectId: '',
            AllData: [],
            tagsArray: [],
            startKey: '',
            loading: false
        }
    },
    props: {
        allData: {
            type: Object,
            default: () => {
                return {
                    // projectName: "",
                    // projectId: "",
                    // scenarios: [],
                    // tagsArray: []
                }
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
                return new PhDataSource('1')
            }
        }
    },
    components: {
        clearDelete,
        createTagsDialog,
        deleteTagsDialog,
        bpSelectVue,
        bpOptionVue,
        ElSwitch,
        CreateScenarioDlg,
        // ElButton,
        // ElDialog
    },
    computed: {
        nextIndexValue() {
            const ids = this.datasource.data.map(x => parseInt(x.index))
            return 1 + Math.max(...ids)
        }
    },
    mounted() { 
        this.projectId = this.getUrlParam("projectId")
        this.projectName = this.getUrlParam("projectName")
        const that = this
        this.loading = true
        this.datasource.refreshData(this, '', ()=>{
            that.startKey = this.datasource.startKey
            that.totalCount = this.datasource.totalCount
            // 总数据
            that.AllData = this.datasource.data
            that.loading = false
        })
    },
    watch: {
        "datasource.tagsArray": function() {
            this.tagsColorArray = []
            this.datasource.tagsArray.forEach(() => {
                this.tagsColorArray.push(this.color[Math.floor(Math.random()*10+Math.random()*10)])
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
                this.datasource.data = this.AllData.filter(item => item.scenarioName.toLowerCase().indexOf(value.toLowerCase()) > -1)
            } else {
                this.datasource.data = this.AllData
            }
        },
        goUp(){
            let that = this
            this.datasource.appendData(this,this.startKey,()=>{
                that.startKey = this.datasource.startKey
                // that.AllData = that.AllData.concat(this.datasource.data)
                // this.datasource.data = that.AllData
                that.AllData = this.datasource.data
                if(that.searchValue.length !== 0){
                    this.state = 'search'
                    this.search(this.searchValue)
                }
                if (this.scenarioCheckedIds.length < this.datasource.data.length && this.scenarioCheckedIds.length !== 0) {
                    this.$refs.all.indeterminate = true
                }
            })
        },
        getUrlParam(value) {
            let href = window.location.href
            let paramArr = href.split("?")[1].split("&")
            let data = paramArr.find(item => item.indexOf(value) > -1)
            return data ? decodeURI(data).split("=")[1] : undefined
        },
		on_clickDeleteScenarioDialog() {
			const event = new Event("event")
            event.args = {
                callback: "deleteScenarios",
                element: this,
                param: {
                    name: "deleteScenarios",
                    selectedScenarios: this.scenarioCheckedIds,
					scenarioArray: this.datasource.data,
					projectName: this.projectName,
					projectId: this.projectId
                }
            }
            this.deleteScenarioDialog = false
            this.$emit('event', event)
		},
        checkName(data) {
            let arr = this.datasource.data.filter(it => it.name === data)
            return arr.length === 0
        },
        addTagsEvent(data) {
            data.args.param.selectedscenarios = this.scenarioCheckedIds
            data.args.param.scenarioArray = this.datasource.data
            data.args.param.projectName = this.projectName
            data.args.param.projectId = this.projectId
            this.$emit('event', data)
            this.showCreateTagsDialog = false;
        },
        //清除数据集中数据
        clearTags(data) {
            data.args.param.selectedscenarios = this.scenarioCheckedIds
            data.args.param.scenarioArray = this.datasource.data
            data.args.param.projectName = this.projectName
            data.args.param.projectId = this.projectId
            this.$emit('event', data)
            this.cleardialogshow = false;
        },
        //点击list主体
        clickOnlyOne(scenario) {
            this.scenarioCheckedIds = []
            this.scenarioCheckedNames = []
            this.scenarioCheckedIds.push(scenario.id)
            this.scenarioCheckedNames.push(scenario.scenarioName)
        },
        checkedMore(scenario){
            this.checked = !this.checked
            let idIndex = this.scenarioCheckedIds.indexOf(scenario.id)
            if(idIndex >= 0) { 
                this.scenarioCheckedIds.splice(idIndex, 1)
                this.scenarioCheckedNames.splice(idIndex, 1)
                this.checked = false
            } else {
                this.checked = true
                this.scenarioCheckedIds.push(scenario.id)
                this.scenarioCheckedNames.push(scenario.scenarioName)
            }
            if (this.scenarioCheckedIds.length < this.datasource.data.length && this.scenarioCheckedIds.length !== 0) {
                this.$refs.all.indeterminate = true
            } else if (this.scenarioCheckedIds.length === this.datasource.data.length){
                this.$refs.all.indeterminate = false
                this.isCheckedAllScenario = true
            } else {
                this.$refs.all.indeterminate = false
            }
        },
        //点击list多选框
        checkedOneScenario(scenario) {
            let idIndex = this.scenarioCheckedIds.indexOf(scenario.id)
            if(idIndex >= 0) {
                this.scenarioCheckedIds.splice(idIndex, 1)
                this.scenarioCheckedNames.splice(idIndex, 1)
            } else {
                this.scenarioCheckedIds.push(scenario.id)
                this.scenarioCheckedNames.push(scenario.scenarioName)
            }
            if (this.scenarioCheckedIds.length < this.datasource.data.length && this.scenarioCheckedIds.length !== 0) {
                this.$refs.all.indeterminate = true
            } else if (this.scenarioCheckedIds.length === this.datasource.data.length){
                this.$refs.all.indeterminate = false
                this.isCheckedAllScenario = true
            } else {
                this.$refs.all.indeterminate = false
            }
        },
        //点击scenario name
        clickScenarioName(data) {
            // TODO: 跳转到 trigger
            const event = new Event("event")
            event.args = {
                callback: "linkToPage",
                element: this,
                param: {
                    name: "scenario-detail",
                    projectName: this.projectName,
                    projectId: this.projectId,
                    scenario: data
                }
            }
            this.$emit('event', event)
        },
        //全选list
        chechedAllScenario() {
            this.isCheckedAllScenario = this.scenarioCheckedIds.length !== this.datasource.data.length;
            this.scenarioCheckedIds = []
            this.scenarioCheckedNames = []
            //全选状态
            if(this.isCheckedAllScenario) {
                this.datasource.data.forEach(item => {
                    this.scenarioCheckedIds.push(item.id)
                    this.scenarioCheckedNames.push(item.scenarioName)
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
        sort(v) {
            if(v === 'ascending') {
                // 升序->降序
                this.ascending = false
                this.datasource.data.sort(
                    function compareFunction(param1, param2) {
                        return param1.scenarioName.localeCompare(param2.name);
                    }
                )
            }else if (v === 'descending') {
                // 降序->升序
                this.ascending = true
                this.datasource.data.reverse()
            }
        },
        //排序条件下拉框
        selectScenario() {
            this.scenarioSortedBy = "名称"
        },
        //关闭tag删除弹框
        closeDeleteTags() {
            this.deleteTagsDialog = false;
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
        getCookie(name) {
            let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)")
            arr = document.cookie.match(reg)
            if (arr) return (arr[2])
            else return null
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
            if(this.scenarioCheckedIds.length < 1) {
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
        //打开删除数据集弹框
        deleteCurrentScenario() {
            // TODO: 删除
			this.deleteScenarioDialog = true
        },
        openCreateScenarioDialog() {
            if (this.showCreateScenarioDialog) {
                this.showCreateScenarioDialog = false
            } else {
                this.showCreateScenarioDialog = true
            }
            // this.showCreateScenarioDialog = !this.showCreateScenarioDialog
        },
        scenarioActiveChange(scenario) {
            const event = new Event("event")
            event.args = {
                callback: "resetScenario",
                element: this,
                param: {
                    projectId: this.projectId,
                    projectName: this.projectName,
                    scenario: scenario
                }
            }
            this.$emit('event', event)
        },
        createNewScenario(scenario) {
            const event = new Event("event")
            event.args = {
                callback: "createScenario",
                element: this,
                param: {
                    projectId: this.projectId,
                    projectName: this.projectName,
                    scenario: scenario,
                    callback: (param, payload) => {
                        const { message, status } = JSON.parse(payload)
                        const {
                            cnotification: { error }
                        } = JSON.parse(message)
                        if (status == "failed" && JSON.parse(error).errorcode == -90) {
                            Message({
                                type: 'error',
                                showClose: true,
                                duration: 0,
                                message: '该Scenario已存在！'
                            })
                        } else {
                            Message({
                                type: 'error',
                                showClose: true,
                                duration: 0,
                                message: '新建失败'
                            })
                        }
                    }
                }
            }
            this.$emit('event', event)
			this.showCreateScenarioDialog = false
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
        // height: 65px;
        border: 1px solid #dddddd;
        background: #fff;
        z-index: 8888;
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
    
    .upload_scenario_container {
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
                        width: 152px;
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

                        .scenario_number {
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
                    // border-bottom: 1px solid #ccc;
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
                        display: flex;
                        flex-direction: column;
                        flex-grow: 1;
                    
                        .data_content {
                            // flex-grow: 1;
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
                                width: calc(100% - 174px);
                                flex-grow: 1;
                                align-items: center;
                            }
                    
                            .script_icon {
                                // margin-left: 27px;
                                width: 30px;
                                max-width: 30px;
                    
                                img {
                                    width: 24px;
                                    height: 24px;
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
                                min-width: 300px;
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
                    
                            .scenario-active-switch {
                                display: flex;
                                align-items: center;
                                padding-right: 20px;
                                font-size: 16px;
                    
                                span {
                                    padding-right: 10px;
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
                        border-bottom: none;
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
                        // justify-content: space-between;
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
