<template>
    <div class="page">
        <link rel="stylesheet" href="https://components.hubadata.com/element-ui/element-ui.css">
        <div class="project_info_left">
            <div class="page_header">
                <div class="left">
                    <img :src="logo2" class="logo" alt="">
                    <div class="name">{{allData.dashboard.title}}</div>
                </div>
                <div class="right">
                    <div class="text"
                        :class="[
                            {'borderBold': !edit}
                        ]"
                        @click="edit = false">浏览模式</div>
                    <div class="text"
                        :class="[
                            {'borderBold': edit}
                        ]"
                        @click="edit = true">编辑模式</div>
                    <el-button v-if="edit" class="panl" @click="saveSlideContent">Save</el-button>
                </div>
            </div>
            <div class="content">
                <slideComponent
                    :needTitle="false"
                    :isEditableValue="edit"
                    :content-model="activeModel"
                    :project-id="allData.projectId"
                    @selected="insightSelected" />
            </div>
            <div class="page_footer">
                <div v-for="(slide, index) in slideArr"
                     :class="slideItemStyle(slide)"
                     @click="clickSlideFooterTab(index)"
                     :key="index">
                    <div class="slide_name">{{slide.title}}</div>
                    <img class="del_icon" :src="del_icon" @click.stop="clickDeleteSlide(index)"/>
                </div>
                <img :src="add_icon"  alt="" class="add_icon" @click.stop="addSlide">
            </div>
        </div>
        <el-dialog
            title="删除"
            :visible.sync="dialogDeleteSlideVisible"
            width="600px">
            <div class="delete-slide-container">
                确定删除该数据看板吗？
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogDeleteSlideVisible = false">取消</el-button>
                <el-button type="primary"
                    @click="on_clickDeleteSlideConfirm">
                    确认
                </el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="新内容"
            :visible.sync="dialogNewChartVisible"
            width="600px">
            <div class="create-container">
                <div class="chart-type">
                    <img :src="logo1">
                    <span>图表</span>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogNewChartVisible = false">取消</el-button>
                <el-button type="primary" @click="on_clickNewChartConfirm">确认</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="新建图表"
            :visible.sync="dialogNewChartNameVisible"
            width="600px">
            <div class="create-chart-container">
                <span>数据源：</span>
                <div @click="toggle" class="sel">
                    <div class="input">
                        <p ref="dataSet">{{datasourceName}}</p>
                    </div>
                    <div class="icon" >
                        <img :src="dropDownIcon">
                    </div>
                </div>
                <div class="dialog" v-if="showDialog">
                    <p class="dialog_select" v-for="(item,index) in allData.datasetArr" :key="index">
                        <span @click="select(item)" class="dialog_select_span">{{item.name}}</span>
                    </p>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogNewChartNameVisible = false">取消</el-button>
                <el-button type="primary" @click="on_clickNewChartNameConfirm">确认</el-button>
            </span>
        </el-dialog>
		 <el-dialog
            title="操作未保存"
            :visible.sync="saveDialog"
            width="600px">
            <div class="delete-slide-container">
                您的操作尚未被保存
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="saveDialog = false">取消</el-button>
                <el-button @click="saveDialog = false">不保存并继续</el-button>
                <el-button type="primary"
                    @click="saveSlideContent">
                    保存并继续
                </el-button>
            </span>
        </el-dialog>
        <img v-if="edit" :src="add_chart" class="add_chart" alt="" @click="dialogNewChartVisible = true">
    </div>
</template>
<script>
import ElButton from "element-ui/packages/button"
import ElTabs from "element-ui/packages/tabs"
import ElTabPane from "element-ui/packages/tab-pane"
import ElDialog from 'element-ui/packages/dialog/src/component'
import slideComponent from "./slide"
import "element-ui/lib/theme-chalk/index.css"
import PhSlideModel from './slide-model/slide-model'
import BarPolicy from "../components/render-policy/bar-policy"
import PiePolicy from "../components/render-policy/pie-policy"
import StackPolicy from "../components/render-policy/stack-policy"
import ScatterplotPolicy from "../components/render-policy/scatterplot-policy"
import LinesPolicy from "../components/render-policy/lines-policy"
import PhHistogramDatasource from "../components/model/datasource"
import PhHistogramSchema from "../components/model/schema"
import { staticFilePath } from '../config/envConfig'

export default {
    props: {
        allData: {
            type: Object,
            default: function() {
                return {
                    datasetArr: [],
                    dashboard: {}
                }
            }
        }
    },
    data: () => {
        return {
            logo1: `${staticFilePath}` + "/icons/%E7%9C%8B%E6%9D%BF.svg",
            logo2: `${staticFilePath}` + "/icons/%E7%9C%8B%E6%9D%BF%E5%8F%8D%E8%89%B2.svg",
            del_icon: `${staticFilePath}` + "/delete_r.svg",
            datasetcheckedIds: [],
            edit: false,
            add_icon: `${staticFilePath}` + "/icons/%E5%8A%A0%E5%8F%B7.svg",
            clear_data_icon: `${staticFilePath}` + "/delete_b.svg",
            delete_icon: `${staticFilePath}` + "/delete_r.svg",
            label_icon: `${staticFilePath}` + "/tag.svg",
            dialogDeleteSlideVisible: false, //删除slide
            delSlideIndex: 0,
            add_chart: `${staticFilePath}` + "/icons/%E6%B7%BB%E5%8A%A0%E5%86%85%E5%AE%B9.svg",
            dropDownIcon: `${staticFilePath}` + "/drop_down_icon.svg",
            dialogNewChartVisible: false,
            dialogNewChartNameVisible: false,
            slideArr: [],
            activeModel: null,
            datasourceName: "",
            showDialog: false,
            timeout: null,
            selDataset: null,
            saveDialog: false
        }
    },
    components: {
        ElDialog,
        ElButton,
        slideComponent
    },
    mounted () {
        this.edit = true
    },
    methods: {
        // editFalse() {
        //     if(!this.activeModel.checkSave()) {
        //         this.saveDialog = true
        //     } else {
        //         this.edit = false
        //     }
        // },
        // on_clickSaveDialodConfirm() {
        //     this.saveSlideContent()
        // },
        getCookie(name) {
            let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg))
                return (arr[2]);
            else
                return null;
        },
        createSlides() {
            const tmp = []
            for (let index = 0; index < this.allData.slides.length; ++index) {
                const item = new PhSlideModel(index, this.allData.slides[index])
                this.createAllPolicyByModel(item)
                tmp.push(item)
            }
            this.slideArr = tmp.sort((l, r) => l.idx - r.idx)
            this.activeModel = this.slideArr[0]
        },
        insightSelected(e) {
            const event = new Event("event")
            event.args = {
                callback: "linkToPage",
                element: this,
                param: {
                    name: "changeHistogram",
                    projectId: this.allData.projectId,
                    projectName: this.allData.projectName,
                    dashboardId: this.allData.dashboard.dashboardId,
                    slideId: e.param.slideId,
                    contentId: e.param.contentIdx
                }
            }
            this.$emit('event', event)
        },
        on_clickNewChartNameConfirm() {
            const nextIdx = this.activeModel.content.length === 0 ? 0 : Math.max(...this.activeModel.content.map(_ => parseInt(_.index))) + 1
            if (this.datasourceName.length > 0) {
                const defaultPolicyName = "bar"
                const one_content = {
                    tp:"histogram",
                    index: nextIdx,
                    histogramName: "alfredtest",
                    policyName: defaultPolicyName,
                    datasourceClass:"default",
                    schemaClass:"default",
                    conditions: {},
                    position: [0,0,1,1],
                    datasetName: this.datasourceName,
                    datasetId: this.selDataset.id,
                    x: "",
                    y: ""
                }
                one_content["policy"] = this.createPolicyWithinContent(one_content)
                this.activeModel.content.push(one_content)
                this.dialogNewChartNameVisible = false
            } else {
                alert("请选择数据源！")
                return false
            }
        },
        on_clickNewChartConfirm() {
            this.dialogNewChartVisible = false
            this.dialogNewChartNameVisible = true
        },
        async addSlide() {
            const nextIdx = this.slideArr.length === 0 ? 0 : Math.max(...this.slideArr.map(_ => parseInt(_.idx))) + 1
            const data = {
                content: "[]",
                pdId: this.allData.projectId + "_" + this.allData.dashboard.dashboardId,
                title: "new title",
                datasetName: "does not useful just for back up",
                idx: String(nextIdx),
                slideId: String(nextIdx)
            }

            const item = new PhSlideModel(data.pdId + "_" + data.slideId, data)
            this.slideArr.push(item)
            await item.save(this)
            this.activeModel = item
            this.edit = true
        },
        createAllPolicyByModel(model) {
            let result = []
            // TODO: maybe has some bug
            // for (const item in model.content) {
            for (let index = 0; index < model.content.length; ++index) {
                const item = model.content[index]
                item["policy"] = this.createPolicyWithinContent(item)
                // result.push(this.createPolicyWithinContent(model.content[item]))
            }
            return result
        },
        createPolicyWithinContent(content) {
            // TODO: 这个是一个工厂类，在写的时候，可以运用外部单例，因为这个函数会被多次用到
            // 不会写就多写cv次这个函数吧
            if (content.policyName === "bar") {
                return new BarPolicy(content.index,
                    new PhHistogramDatasource(content.index,
                        this.allData.projectId,
                        content.datasetName),
                    new PhHistogramSchema(content.index,
                        this.allData.projectId,
                        content.datasetName),
                    {xProperty: content.x, yProperty: content.y})
            } else if (content.policyName === "pie") {
                return new PiePolicy(content.index,
                    new PhHistogramDatasource(content.index,
                        this.allData.projectId,
                        content.datasetName),
                    new PhHistogramSchema(content.index,
                        this.allData.projectId,
                        content.datasetName),
                    {xProperty: content.x, yProperty: content.y})
            } else if (content.policyName === "stack") {
                return new StackPolicy(content.index,
                    new PhHistogramDatasource(content.index,
                        this.allData.projectId,
                        content.datasetName),
                    new PhHistogramSchema(content.index,
                        this.allData.projectId,
                        content.datasetName),
                    {xProperty: content.x, yProperty: content.y})
            } else if (content.policyName === "scatterplot") {
                return new ScatterplotPolicy(content.index,
                    new PhHistogramDatasource(content.index,
                        this.allData.projectId,
                        content.datasetName),
                    new PhHistogramSchema(content.index,
                        this.allData.projectId,
                        content.datasetName),
                    {xProperty: content.x, yProperty: content.y})
            } else if (content.policyName === "lines") {
                return new LinesPolicy(content.index,
                    new PhHistogramDatasource(content.index,
                        this.allData.projectId,
                        content.datasetName),
                    new PhHistogramSchema(content.index,
                        this.allData.projectId,
                        content.datasetName),
                    {xProperty: content.x, yProperty: content.y})

            }
        },
        clickSlideFooterTab(data) {
            this.edit = false
            this.activeModel = this.slideArr[data]
        },
        /**
         * 防抖
         * @param {Function} func 要执行的回调函数
         * @param {Number} wait 延时的时间
         * @param {Boolean} immediate 是否立即执行
         * @return null
         */
        Debounce(func, wait=300, immediate = false) {
        // 清除定时器
            if (this.timeout !== null) clearTimeout(this.timeout);
            // 立即执行，此类情况一般用不到
            if (immediate) {
                var callNow = !this.timeout;
                this.timeout = setTimeout(function() {
                    this.timeout = null;
                }, wait);
                if (callNow) typeof func === 'function' && func();
            } else {
                // 设置定时器，当最后一次操作后，timeout不会再被清除，所以在延时wait毫秒后执行func回调方法
                this.timeout = setTimeout(function() {
                    typeof func === 'function' && func();
                }, wait);
            }
        },
        on_clickDeleteSlideConfirm() {
            this.Debounce(this.clickDeleteSlideConfirm)
        },
        async clickDeleteSlideConfirm() {
            const tmp = []
            for (let idx = 0; idx< this.slideArr.length; ++idx) {
                if (idx !== this.delSlideIndex) {
                    tmp.push(this.slideArr[idx])
                } else {
                    await this.slideArr[idx].delete(this)
                }
            }
            this.slideArr = tmp
            this.activeModel = this.slideArr[0]
            this.dialogDeleteSlideVisible = false
        },
        clickDeleteSlide(index) {
            if(this.slideArr.length > 1) {
                this.delSlideIndex = index
                this.dialogDeleteSlideVisible = true
            }
        },
        resetSlideName() {
            this.slideArr.forEach((item, index) => {
                let num = index + 1
                item.name = "slide" + num
            })
        },
        slideItemStyle(item) {
            if (this.activeModel && item === this.activeModel) {
                return "slide_item slide_item_clicked"
            }
            else {
                return "slide_item"
            }
        },
        async saveSlideContent() {
            for (let idx = 0; idx < this.slideArr.length; ++idx) {
                if (this.slideArr[idx]) {
                    this.slideArr[idx].queryContent = [...this.slideArr[idx].content]
                    // delete this.slideArr[idx].queryContent.map(x => {x["policy"] = null})
                    await this.slideArr[idx].save(this)
                }
            }
            this.edit = false
        },
        toggle() {
            this.showDialog = !this.showDialog
        },
        select(data) {
            this.datasourceName = data.name
            this.selDataset = data
            this.showDialog = false
        }
    },
    watch: {
        allData: async function(n, o) {
            this.createSlides()
            if(this.allData.slides.length < 1) {
                await this.addSlide()
            }
        }
    }
}
</script>

<style scoped lang="scss">
    * {
        box-sizing: border-box;
    }
    .el-dialog__wrapper {
        background: rgba(0, 0, 0, 0.31);
    }
    .page {
        display: flex;
        width: 100%;
        height: calc(100vh - 100px);
        .create-container {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .create-chart-container {
            display: flex;
            align-items: center;
            margin-left: 60px;
            .sel {
                cursor: pointer;
            }
            .input {
                width: 200px;
                height: 30px;
                border: 1px solid #979797;
                margin-left: 20px;
                p {
                    font-family: PingFangSC-Medium;
                    font-size: 14px;
                    color: #000000;
                    font-weight: 600;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    padding: 0 10px;
                    bottom: 10px;
                    position: relative;
                }
            }
            .icon {
                position: absolute;
                top: 90px;
                right: 244px;
                height: 18px;
                img {
                    width: 20px;
                    height: 20px;
                }
            }
            .dialog {
                position: absolute;
                top: 114px;
                right: 241px;
                width: 206px;
                height: 90px;
                overflow-y: auto;
                overflow-x: hidden;
                border: 1px solid #979797;
                background: white;
                .dialog_select {
                    width: 200px;
                    height: 24px;
                    margin: -1px;
                    border: 1px solid #979797;
                    background: #ffffff;
                    span {
                        display: block;
                        width: 100%;
                        height: 100%;
                        font-family: PingFangSC-Medium;
                        font-size: 14px;
                        color: #000000;
                        font-weight: 600;
                        margin-left: 10px;
                    }
                    .dialog_select_span {
                        width: 200px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }
            }
        }
        .chart-type {
            height: 60px;
            width: 500px;
            border: 1px solid #bbb;
            display: flex;
            align-items: center;
            padding: 20px;
            cursor: pointer;
            img {
                width: 30px;
                margin-right: 14px;
            }
        }
        .add_chart {
            position: absolute;
            bottom: 60px;
            right: 510px;
            z-index: 99;
            cursor: pointer;
        }
        .project_info_left {
            flex: 1;
            border-right: 1px solid #dddddd;
            .page_header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 40px;
                border-bottom: 1px solid #ccc;
                .left {
                    display: flex;
                    align-items: center;
                    img {
                        height: 40px;
                    }
                    .name {
                        padding-left: 5px;
                        font-weight: bold;
                    }
                }
                .right {
                    display: flex;
                    .text {
                        margin-right: 10px;
                        font-weight: bold;
                        height: 40px;
                        display: flex;
                        align-items: center;
                        cursor: pointer;
                    }
                    .borderBold {
                        border-bottom: 1px solid #666;
                    }
                }
            }
            .content {
                height: calc(100vh - 128px);
            }
            .page_footer {
                display: flex;
                padding: 0 20px;
                height: 40px;
                border-top: 1px solid #ccc;

                .slide_item_clicked {
                    border: 2px red solid;
                }

                .slide_item {
                    display: flex;
                    align-items: center;
                    margin-right: 20px;
                    .slide_name {
                        cursor: pointer;
                        padding-right: 5px;
                    }
                    .del_icon {
                        width: 20px;
                        cursor: pointer;
                    }
                }

                .add_icon {
                    width: 20px;
                    cursor: pointer;
                }
            }
        }
        .project_info_right {
            width: 500px;
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
                    .tags_imgs_tag {
                        width: 20px;
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
                        border-bottom: 2px solid #979797;
                        border-right: 2px solid #979797;
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
            }
        }
    }
</style>
