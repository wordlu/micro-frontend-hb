<template>
    <div class="upload-recipt">
        <link rel="stylesheet" href="https://components.hubadata.com/element-ui/element-ui.css">
        <div class="upload_dataset_container">
            <div class="info">
                <div class="project_info_left">
                    <div class="upload_top">
                        <div class="selected_search">
                            <div class="selected"
                                :class="[{'bg_disabled': reciptcheckedIds.length == 0}]">
                                <input type="checkbox" class="checkbox" ref="all" @click='chechedAllDataset()' :checked="reciptcheckedIds.length === AllData.length && AllData.length !== 0">
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
                                        <div class="label_icon border_none" @click="deletedialogopen">
                                            <span>
                                                <img :src="delete_icon" alt="">
                                            </span>
                                            <p >删除脚本</p>
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
                            <button class="upload_btn" @click="toggle">新建脚本</button>
                            <div class="dialog" v-show="showDialog">
                                <div class="list" ref="classVisual" @mouseenter="showVisual" @mouseleave="hide" >
                                    <img :src="defs.iconsByName('visual','normal')" alt="">
                                    <p class="">Visual</p>
                                    <img :src="defs.iconsByName('path','normal')" class="path" ref="pathVisual" alt="">
                                </div>
                                <div class="list" ref="classCode" @mouseenter="showCode" @mouseleave="hide">
                                    <img :src="defs.iconsByName('code','normal')" alt="">
                                    <p class="">Code</p>
                                    <img :src="defs.iconsByName('path','normal')" class="path" ref="pathCode" alt="">
                                </div>
                                <div class="list" ref="classSpark" @mouseenter="showSpark" @mouseleave="hide">
                                    <img :src="defs.iconsByName('spark','normal')" alt="">
                                    <p class="">Hadoop&Spark</p>
                                    <img :src="defs.iconsByName('path','normal')" class="path" ref="pathSpark" alt="">
                                </div>
                                <!-- <div 
                                    class="list"
                                    v-for="script in scriptList"
                                    :key="script.name+'script'"
                                    @click="selectScripts(script.scriptName)">
                                    <img :src="defs.iconsByName(script.iconName)" alt="">
                                    <p class="">{{script.name}}</p>
                                </div> -->
                            </div>
                            <div class="dialog visual">
                                <div 
                                    class="list"
                                    v-show="showVisualAll"
                                    v-for="script in scriptList.slice(0,9)"
                                    :key="script.name+'script'"
                                    @mouseenter="showVisualList"
                                    @mouseleave="hideVisual"
                                    @click="selectScripts(script.scriptName)">
                                    <img :src="defs.iconsByName(script.iconName,'normal')" alt="">
                                    <p class="">{{script.name}}</p>
                                </div>
                            </div>
                            <div class="dialog code">
                                <div 
                                    class="list"
                                    v-show="showCodeAll"
                                    v-for="script in scriptList.slice(9,11)"
                                    :key="script.name+'script'"
                                    @mouseenter="showCodeList"
                                    @mouseleave="hideCode"
                                    @click="selectScripts(script.scriptName)">
                                    <img :src="defs.iconsByName(script.iconName,'normal')" alt="">
                                    <p class="">{{script.name}}</p>
                                </div>
                            </div>
                            <div class="dialog spark">
                                <div 
                                    class="list"
                                    v-show="showSparkAll"
                                    v-for="script in scriptList.slice(11,13)"
                                    :key="script.name+'script'"
                                    @mouseenter="showSparkList"
                                    @mouseleave="hideSpark"
                                    @click="selectScripts(script.scriptName)">
                                    <img :src="defs.iconsByName(script.iconName,'normal')" alt="">
                                    <p class="">{{script.name}}</p>
                                </div>
                            </div>
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
                                        <div class="label_name" v-for="(item,index) in datasource.tagsArray" :key="index">
                                            <span  :style="{ background: tagsColorArray[datasource.tagsArray.indexOf(item)] }"></span>
                                            <div class="tags_name">{{item}}</div>
                                        </div>
                                    </div>
                                    <div class="management">
                                        <div class="manage_label">管理标签</div>
                                    </div>
                                </div>
                            </div>
                            <div class="clear_sea" @click="clearSearch" v-if="searchValue">清空搜索项</div>
                            <div class="dataset_number" v-if="searchValue.length !== 0">
                                <p>{{ datasource.dcs.length }} / {{ totalCount }} 条脚本</p>
                            </div>
                            <div class="dataset_number" v-else>
                                <p>{{ totalCount }} 条脚本</p> 
                            </div>
                        </div>
                    </div>
                    <div class="upload_bottom" ref="centerData">
                        <div class="data_block_content">
                            <div class="data_content" v-for="(recipt,index) in datasource.dcs" :key="index" ref="content" :class="{bg: reciptcheckedIds.indexOf(recipt.id) > -1}" @click="clickOnlyOne(recipt, index)">
                                <div class="data_input" @click.stop="checkedMore(recipt)">
                                    <input type="checkbox" ref="data" name="reciptList" :checked="reciptcheckedIds.indexOf(recipt.id) > -1" @click.stop="checkedOneDataset(recipt)">
                                </div>
                                <div class="item_list">
                                    <span class="script_icon">
                                        <img :src="selectScriptIcon(recipt.runtime,'normal')" alt="">
                                    </span>
                                    <p class="data_name" @click.stop="clickReciptName(recipt)" :title="recipt.outputs">compute_{{recipt.outputs}}</p>
                                    <div class="tag_area" ref="tagsArea">
                                        <div v-for="(tag,inx) in recipt.labels" :key="inx">
                                            <span v-if="recipt.labels !== ''">
                                                <p
                                                    :title="tag"
                                                    class="tag_bg"
                                                    :style="{ background: tagsColorArray[datasource.tagsArray.indexOf(tag)] }">{{tag}}
                                                </p>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="word" v-show="datasource.dcs.length == 0" v-if="searchValue.length !== 0">当前页面搜索无结果</div>
                            <div class="word" v-show="datasource.dcs.length == 0" v-else>当前项目无数据</div>
                        </div>
                        <p class="block" @click="goUp" v-if="AllData.length !== totalCount">更多</p>
                        <p class="block" v-else>暂无更多</p>
                    </div>
                </div>
                <div class="project_info_right">
                    <div class="view_content" v-if="reciptcheckedIds.length > 0" >
                        <div class="project_name_view">
                            <span class="space">
                                <img :src="script_icon_show" alt="">
                            </span>
                            <div class="show-name" v-if="reciptcheckedIds.length == 1">
                                <p class="project_name_info" :title="reciptcheckedNames[0]">
                                {{reciptcheckedNames[0]}}
                                </p>
                            </div>
                           <div class="show-name">
                               <p class="project_name_info" v-if="reciptcheckedIds.length > 1">
                                    {{reciptcheckedIds.length}} 条脚本
                                </p>
                           </div>
                        </div>
                        <div class="view_func">
                            <span @click="edit" class="view_list" v-if="this.reciptcheckedIds.length == 1">
                                <img class='tags_imgs_tag' :src="edit_icon" alt="">
                                <span class='tags_func'>编辑</span>
                            </span>
                            <span @click="createTagsOpen" class="view_list">
                                <img class='tags_imgs_tag' :src="label_icon" alt="">
                                <span class='tags_func'>标签</span>
                            </span>
                            <span class="view_list" v-if="this.reciptcheckedIds.length == 1">
                                <img class='tags_imgs_tag' :src="run_icon" alt="">
                                <span class='tags_func'>运行</span>
                            </span>
                            <span class="view_list">
                                <img class='tags_imgs_tag' :src="star_icon" alt="">
                                <span class='tags_func'>收藏</span>
                            </span>
                            <span class="view_list" v-if="this.reciptcheckedIds.length == 1">
                                <img class='tags_imgs_tag' :src="copy_icon" alt="">
                                <span class='tags_func'>复制</span>
                            </span>
                             <span class="view_list">
                                <img class='tags_imgs_tag' :src="hide_icon" alt="">
                                <span class='tags_func'>隐藏</span>
                            </span>
                            <span  @click='deletedialogopen' class="view_list">
                                <img class='tags_imgs_tag' :src="delete_icon" alt="">
                                <span class='tags_func'>删除</span>
                            </span>
                        </div>
                    </div>
                    <p v-if="reciptcheckedIds.length == 0" class="click_look">单击对象查看详细信息</p>
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
        <!-- 删除脚本 -->
        <clear-delete
            v-if="deletedialogshow"
            :reciptcheckedIds="reciptcheckedIds"
            :datasetcheckedNames="reciptcheckedNames"
            @deleteScriptsEvent="deleteScript"
            @closeDeleteDialog="closeDeleteDialog">
        </clear-delete>
        <!-- 添加tag -->
        <create-tags-dialog
            v-if="showCreateTagsDialog"
            :reciptcheckedIds="reciptcheckedIds"
            :reciptcheckedNames="reciptcheckedNames"
            :datasets="datasource.dcs"
            :tagsArray="datasource.tagsArray"
            :tagsColorArray="tagsColorArray"
            @addTagsEvent="addTagsEvent"
            @closeCreateDialog="closeCreateDialog">
        </create-tags-dialog>
        <!-- 管理标签 -->
        <delete-tags-dialog :tags="tags" v-if="deleteTagsDia" @closeDeleteTags="closeDeleteTags"></delete-tags-dialog>
        <!-- 新建脚本 -->
        <create-scripts-dialog
            v-if="showCreateScriptsDialog"
            :datasets="datasource.dss"
            :runtime="runtime"
            @createScripts="createScripts"
            @closeCreateDialog="closeScriptDialog">
        </create-scripts-dialog>
    </div>
    </div>
</template>

<script>
import clearDelete from './delete-dialog-script.vue'
import createTagsDialog from './create-tags-dialog.vue'
import deleteTagsDialog from './delete-tags-dialog.vue'
import createScriptsDialog from './create-scripts-dialog.vue'
import bpSelectVue from '../../node_modules/vue-components/src/components/bp-select-vue.vue'
import bpOptionVue from '../../node_modules/vue-components/src/components/bp-option-vue.vue'
import ElButton from 'element-ui/packages/option/index'
import { staticFilePath } from '../config/envConfig'
import PhDagDefinitions from "./policy/definitions/definitions";
import { Message } from 'element-ui'
import PhDataSource from './model/datasource'

export default {
    data() {
        return {
            hide_icon: `${staticFilePath}` + "/%E9%9A%90%E8%97%8F.svg",
            copy_icon: `${staticFilePath}` + "/copy.svg",
            star_icon: `${staticFilePath}` + "/%E6%94%B6%E8%97%8F.svg",
            run_icon: `${staticFilePath}` + "/%E5%BC%80%E5%A7%8B1.svg",
            edit_icon: `${staticFilePath}` + "/edit.svg",
            label_icon: `${staticFilePath}` + "/tag.svg",
            search_icon: `${staticFilePath}` + "/search.png",
            dropDownIcon: `${staticFilePath}` + "/drop_down_icon.svg",
            selectIcon: `${staticFilePath}` + "/drop_down_icon.svg",
            delete_icon: `${staticFilePath}` + "/delete_r.svg",
            ascending_order: `${staticFilePath}` + "/down.svg",
            descending_order: `${staticFilePath}` + "/top.svg",
            script_icon: `${staticFilePath}` + "/script_select.svg",
            // prepare_icon: `${staticFilePath}` + "/prepare_icon.svg",
            // pyspark_icon: `${staticFilePath}` + "/pyspark_icon.svg",
            // python_icon: `${staticFilePath}` + "/python_icon.svg",
            // R_icon: `${staticFilePath}` + "/R_icon.svg",
            // sparkR_icon: `${staticFilePath}` + "/sparkR_icon.svg",
            script_icon_show: `${staticFilePath}` + "/icons/all_script.svg",
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
            showCreateScriptsDialog: false,
            deleteTagsDia: false,
            searchValue: '',
            ascending: false,
            tags: ['name','description','啦啦啦'],
            ary: [],
            checked: false,
            manual: true,
            scriptValue: "名称",
            isCheckedAllDataset: false,
            reciptcheckedIds: [], //选中项id
            reciptcheckedNames: [], //选中项name
            color: ['#133883','#90a8b7','#94be8e','#ff21ee','#1ac2ab','#77bec2','#c7c7c7','#a088bd','#d66b9b','#5354ec','#acacff','#1e8103', '#ec7211','#ec7211', '#ea1c82','#2bb1ac', '#3c498c', '#000', 'blue', '#666'],
            tagsColorArray: ['#133883','#90a8b7','#94be8e','#ff21ee','#1ac2ab','#77bec2','#c7c7c7','#a088bd','#d66b9b','#5354ec','#acacff','#1e8103', '#ec7211','#ec7211', '#ea1c82','#2bb1ac', '#3c498c', '#000', 'blue', '#666'],
            value: '',
            dialogVisible: false,
            runtime: "",
            showVisualAll: false,
            showCodeAll: false,
            showSparkAll: false,
            startKey: "",
            projectId: "",
            projectName: "",
            AllData: [],
            tagsArray: [],
            totalCount: 0,
            loading: false,
            inputDs: []
        }
    },
    props: {
        allData: {
            type: Object,
            default: () => ({})
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
        },
        scriptList: {
            type: Array,
            default: function() {
                return [{
                    scriptName: "sync",
                    iconName: "sync",
                    name: "Sync"
                }, {
                    scriptName: "group",
                    iconName: "group",
                    name: "Group"
                }, {
                    scriptName: "topn",
                    iconName: "topn",
                    name: "Topn"
                }, {
                    scriptName: "distinct",
                    iconName: "distinct",
                    name: "Distinct"
                }, {
                    scriptName: "sort",
                    iconName: "sort",
                    name: "Sort"
                }, {
                    scriptName: "join",
                    iconName: "join",
                    name: "Join"
                }, {
                    scriptName: "stack",
                    iconName: "stack",
                    name: "Stack"
                }, {
                    scriptName: "prepare",
                    iconName: "prepare",
                    name: "Prepare"
                }, {
                    scriptName: "pivot",
                    iconName: "pivot",
                    name: "Pivot"
                }, {
                    scriptName: "python3",
                    iconName: "python",
                    name: "Python"
                },  {
                    scriptName: "r",
                    iconName: "r",
                    name: "R"
                }, {
                    scriptName: "sparkr",
                    iconName: "sparkr",
                    name: "SparkR"
                }, {
                    scriptName: "pyspark",
                    iconName: "pyspark",
                    name: "Pyspark"
                }]
            }
        }
    },
    components: {
        clearDelete,
        createTagsDialog,
        deleteTagsDialog,
        createScriptsDialog,
        bpSelectVue,
        bpOptionVue,
        ElButton
    },
    computed: { },
    mounted() {
        this.projectId = this.getUrlParam("projectId")
        this.projectName = this.getUrlParam("projectName")
        let that = this
        this.loading = true
        this.datasource.refreshData(this, '', ()=>{
            that.startKey = this.datasource.startKey
            that.totalCount = this.datasource.totalCount
            // 总数据
            that.AllData = this.datasource.dcs
            this.loading = false
        })
        // this.datasource.refreshData1()
    },
    watch: {
        "datasource.tagsArray": function () {
            this.tagsColorArray = []
            this.datasource.tagsArray.forEach((item, index) => {
                this.tagsColorArray.push(this.color[Math.floor(Math.random() * 10 + Math.random() * 10)])
            })
        },
        searchValue(newValue, oldValue) {
            this.searchValue = newValue
            this.state = 'search'
            this.search(this.searchValue)
        }
    },
    methods: {
        search(value){
            if (value) {
                this.datasource.dcs = this.AllData.filter(item => ("compute_" + item.outputs).toLowerCase().indexOf(value.toLowerCase()) > -1)
            }else{
                this.datasource.dcs = this.AllData
            }
            // this.sort("ascending")
        },
        goUp(){
            let that = this
            this.loading = true
            this.datasource.appendData(this,this.startKey,()=>{
                that.startKey = this.datasource.startKey
                that.AllData = this.datasource.dcs
                if(that.searchValue.length !== 0){
                    that.datasource.dcs = that.AllData
                    this.state = 'search'
                    this.search(this.searchValue)
                }
                if (this.reciptcheckedIds.length < this.datasource.dcs.length && this.reciptcheckedIds.length !== 0) {
                    this.$refs.all.indeterminate = true
                }
                this.loading = false
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
            this.$confirm('确认关闭？').then(_ => {
                done();
            }).catch(_ => {});
        },
        //打开script弹框
        async selectScripts(data) {
            this.showDialog = false
            this.runtime = data
            await this.datasource.refreshData1(this)
            this.showCreateScriptsDialog = true
            this.showVisualAll = false
            this.showCodeAll = false
            this.showSparkAll = false
        },
        //增加tag
        addTagsEvent(data) {
            data.args.param.selectedDatasets = this.reciptcheckedIds
            data.args.param.datasetArray = this.datasource.dcs
            data.args.param.projectName = this.projectName,
            data.args.param.projectId = this.projectId
            this.$emit('event', data)
            this.showCreateTagsDialog = false;
        },
        //清除脚本中数据
        clearTags(data) {
            data.args.param.selectedDatasets = this.reciptcheckedIds
            data.args.param.datasetArray = this.datasource.dcs
            data.args.param.projectName = this.projectName,
            data.args.param.projectId = this.projectId
            this.$emit('event', data)
            this.cleardialogshow = false;
        },
        //删除脚本
        deleteScript(data) {
            data.args.param.selectedScripts = this.reciptcheckedIds
            data.args.param.scriptArray = this.datasource.dcs
            data.args.param.projectName = this.projectName,
            data.args.param.projectId = this.projectId
            this.$emit('event', data)
            this.deletedialogshow = false;
        },
        //点击list主体
        clickOnlyOne(recipt) {
            this.script_icon_show = this.selectScriptIcon(recipt.runtime,'reverse')
            this.reciptcheckedIds = []
            this.reciptcheckedNames = []
            this.reciptcheckedIds.push(recipt.id)
            this.reciptcheckedNames.push(recipt.jobShowName)
        },
        checkedMore(recipt){
            this.checked = !this.checked
            let idIndex = this.reciptcheckedIds.indexOf(recipt.id)
            if(idIndex >= 0) { 
                this.reciptcheckedIds.splice(idIndex, 1)
                this.reciptcheckedNames.splice(idIndex, 1)
                this.checked = false
            } else {
                this.checked = true
                this.reciptcheckedIds.push(recipt.id)
                this.reciptcheckedNames.push(recipt.jobShowName)
            }
            if (this.reciptcheckedIds.length == 1) {
                this.script_icon_show = this.selectScriptIcon(recipt.runtime,'reverse')
            } else {
                this.script_icon_show = `${staticFilePath}` + "/icons/all_script.svg"
            }
            if (this.reciptcheckedIds.length < this.datasource.dcs.length && this.reciptcheckedIds.length !== 0) {
                this.$refs.all.indeterminate = true
            } else if (this.reciptcheckedIds.length === this.datasource.dcs.length){
                this.$refs.all.indeterminate = false
                this.isCheckedAllDataset = true
            } else {
                this.$refs.all.indeterminate = false
            }
        },
        //点击list多选框
        checkedOneDataset(recipt) {
            let idIndex = this.reciptcheckedIds.indexOf(recipt.id)
            if(idIndex >= 0) {
                this.reciptcheckedIds.splice(idIndex, 1)
                this.reciptcheckedNames.splice(idIndex, 1)
            } else {
                this.reciptcheckedIds.push(recipt.id)
                this.reciptcheckedNames.push(recipt.jobShowName)
            }
            if (this.reciptcheckedIds.length == 1) {
                this.script_icon_show = this.selectScriptIcon(recipt.runtime,'reverse')
            } else {
                this.script_icon_show = `${staticFilePath}` + "/icons/all_script.svg"
            }
            if (this.reciptcheckedIds.length < this.datasource.dcs.length && this.reciptcheckedIds.length !== 0) {
                this.$refs.all.indeterminate = true
            } else if (this.reciptcheckedIds.length === this.datasource.dcs.length){
                this.$refs.all.indeterminate = false
                this.isCheckedAllDataset = true
            } else {
                this.$refs.all.indeterminate = false
            }
        },
        //点击dataset name
        async clickReciptName(recipt) {
            const inputName = JSON.parse(recipt.inputs)[0]
            await this.datasource.getInputDs(this, inputName)
            console.log(this.inputDs)
            const event = new Event("event")
            event.args = {
                callback: "linkToPage",
                element: this,
                param: {
                    name: "codeditor",
                    projectName: this.projectName,
                    projectId: this.projectId,
                    recipt: recipt,
                    inputDS: this.inputDs
                }
            }
            this.$emit('event', event)
        },
        //全选list
        chechedAllDataset() {
            this.isCheckedAllDataset = true
            if(this.reciptcheckedIds.length == this.datasource.dcs.length) {
                this.isCheckedAllDataset = false
            }
            this.reciptcheckedIds = []
            this.reciptcheckedNames = []
            //全选状态
            if(this.isCheckedAllDataset) {
                this.script_icon_show  = `${staticFilePath}` + "/icons/all_script.svg"
                this.datasource.dcs.forEach(item => {
                    this.reciptcheckedIds.push(item.id)
                    this.reciptcheckedNames.push(item.jobShowName)
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
            if(val === 'ascending') {
                // 升序->降序
                this.ascending = false
                // this.allData.dcs.sort()
                this.datasource.dcs.sort(
                    function compareFunction(param1, param2) {
                        if(param1.jobName) {
                            return param1.jobName.localeCompare(param2.name);
                        }
                        return
                    }
                )
            }else if (val === 'descending') {
                // 降序->升序
                this.ascending = true
                this.datasource.dcs.reverse()
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
        //编辑脚本
        edit() {
            let tid = this.reciptcheckedIds[0]
            let recipt = this.datasource.dcs.filter(it => it.id === tid)
            const event = new Event("event")
            event.args = {
                callback: "linkToPage",
                element: this,
                param: {
                    name: "codeditor",
                    projectName: this.projectName,
                    projectId: this.projectId,
                    recipt: recipt[0]
                }
            }
            this.$emit('event', event)
        },
        //打开tag添加弹框
        createTagsOpen() {
            this.showCreateTagsDialog = true;
        },
        //关闭tag添加弹框
        closeCreateDialog() {
            this.showCreateTagsDialog = false;
        },
        //关闭scripts弹框
        closeScriptDialog() {
            this.showCreateScriptsDialog = false
        },
        //增加scripts
        createScripts(data) {
            let multiInputs = ["join", "stack"]
            if (
                data.args.param.inputs.length != 2 &&
                multiInputs.includes(this.runtime)
            ) {
                Message.error("请选择两个输入数据！", { duration: 3000} )
                return false
            }

            data.args.param.projectName = this.projectName
            data.args.param.projectId = this.projectId
            data.args.param.runtime = this.runtime			
            this.$emit('event', data)
            this.showCreateScriptsDialog = false
        },
        //关闭删除脚本弹框
        closeDeleteDialog() {
            this.deletedialogshow = false;
        },
        //打开删除脚本弹框
        deletedialogopen() {
            if (this.reciptcheckedIds.length > 10) {
                Message.error("超出数量上限,单次最多同时删除10个脚本!", { duration: 0, showClose: true })
                return
            }
            this.deletedialogshow = true;
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
            if(this.reciptcheckedIds.length < 1) {
                this.dropDialogShow = false
            } else {
                this.dropDialogShow = !this.dropDialogShow
                this.nameShowDialog = false
                this.labelShowDialog = false
            }
        },
        //上传文件按钮
        upload() {
            const event = new Event("event")
            event.args = {
                callback: "linkToPage",
                element: this,
                param: {
                    name: "localUpload",
                    projectName: this.projectName,
                    projectId: this.projectId
                }
            }
            this.$emit('event', event)
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
        toggle() {
            this.showDialog = !this.showDialog
        },
        showVisual(e){
            this.showVisualAll = true
            e.currentTarget.className = 'list active'
            this.$refs.pathVisual.src = this.defs.iconsByName('pathHide')
            this.$refs.pathCode.src = this.defs.iconsByName('path')
            this.$refs.pathSpark.src = this.defs.iconsByName('path')
        },
        showVisualList(e){
            this.$refs.classVisual.className = 'list active'
            this.showVisual(e)
        },
        hideVisual(e){
            this.$refs.classVisual.className = 'list'
            this.hide(e)
        },
        hide(e){
            this.showVisualAll = false
            this.showCodeAll = false
            this.showSparkAll = false
            e.currentTarget.className = 'list'
            this.$refs.pathVisual.src = this.defs.iconsByName('path')
            this.$refs.pathSpark.src = this.defs.iconsByName('path')
            this.$refs.pathCode.src = this.defs.iconsByName('path')
        },
        showCode(e){
            this.showCodeAll = true
            e.currentTarget.className = 'list active'
            this.$refs.pathCode.src = this.defs.iconsByName('pathHide')
            this.$refs.pathVisual.src = this.defs.iconsByName('path')
            this.$refs.pathSpark.src = this.defs.iconsByName('path')
        },
        hideCode(e){
            this.$refs.classCode.className = 'list'
            this.hide(e)
        },
        showCodeList(e){
            this.$refs.classCode.className = 'list active'
            this.showCode(e)
        },
        // 显示spark详情
        showSpark(e){
            this.showSparkAll = true
            e.currentTarget.className = 'list active'
            this.$refs.pathSpark.src = this.defs.iconsByName('pathHide')
            this.$refs.pathVisual.src = this.defs.iconsByName('path')
            this.$refs.pathCode.src = this.defs.iconsByName('path')
        },
        hideSpark(e){
            this.$refs.classSpark.className = 'list'
            this.hide(e)
        },
        showSparkList(e){
            this.$refs.classSpark.className = 'list active'
            this.showSpark(e)
        },
        selectScriptIcon(runtime,status) {
            switch (runtime) {
            case "python3":
                return this.defs.iconsByName("python",status)
            case "pyspark":
                return this.defs.iconsByName("pyspark",status)
            case "r":
                return this.defs.iconsByName("r",status)
            case "sparkr":
                return this.defs.iconsByName("sparkr",status)
            case "prepare":
                return this.defs.iconsByName("prepare",status)
            case "sync":
                return this.defs.iconsByName("sync",status)
            case "topn":
                return this.defs.iconsByName("topn",status)
            case "sort":
                return this.defs.iconsByName("sort",status)
            case "distinct":
                return this.defs.iconsByName("distinct",status)
            case "join":
                return this.defs.iconsByName("join",status)
            case "stack":
                return this.defs.iconsByName("stack",status)
            case "group":
                return this.defs.iconsByName("group",status)
            case "pivot":
                return this.defs.iconsByName("pivot",status)
            case "export":
                return this.defs.iconsByName("export",status)
            case "shared":
                return this.defs.iconsByName("shared",status)
            default:
                return this.script_icon
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
    width: 160px;
    // height: 130px;
    // border-bottom: 1px solid #333;
    background: #fff;
    z-index: 9999;
    cursor: pointer;
    div {
        // border-bottom: 1px solid #979797;
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
        // background-color: red;
        border-top: 1px solid #ccc;
        border-left: 1px solid #ccc;
        border-right: 1px solid #ccc;
        position: relative;

        img {
            width: 20px;
            height: 20px;
        }
        .path {
            width: 10px;
            height: 10px;
            position: absolute;
            right: 5px;
            top: 10px;
            z-index: 999;
        }
    }
    .list:last-of-type{
        border-bottom: 1px solid #ccc;
    }
    .last {
        border-bottom: none;
    }

}
.visual{
    position: absolute;
    top: 30px;
    right: 200px;
}
.code{
    position: absolute;
    top: 62px;
    right: 200px;
}
.spark{
    position: absolute;
    top: 95px;
    right: 200px;
}
.active{
    background-color: #ccc;
}
.script-opt {
    padding: 0 10px;
    border-bottom: 1px solid #ccc;
}
.script-opt-last {
    border-bottom: none;
}
.upload_dataset_container {
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

                    .dataset_number {
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
                flex-grow: 1;
                overflow: auto;
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
                        width: 100%;
                        height: 60px;
                        box-sizing: border-box;
                        // height: 60px;
                        border-bottom: 1px solid #dddddd;
                        padding: 10px 0 10px 10px;
                        // align-items: center;
                
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
                            width:calc(100% - 40px);
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
                            min-width: 450px;
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
                    justify-content: space-between;
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
                        width: 60px;
                        height: 60px;
                        background: #dfe7ff;
                        // border-bottom: 1px solid #979797;
                        // border-right: 1px solid #979797;
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
