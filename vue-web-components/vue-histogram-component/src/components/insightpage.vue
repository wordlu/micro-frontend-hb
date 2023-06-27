
<template>
    <div class="insight-page">
        <link rel="stylesheet" href="https://components.hubadata.com/element-ui/element-ui.css">
        <div class="project_info_left">
            <div class="page_header">
                <div class="left">
                    <img :src="logo2" class="logo" alt="">
                    <div class="name">{{allData.projectName}}</div>
                </div>
                <div class="right">
                    <el-button class="panl" @click="backToDashboard">返回数据看板</el-button>
                    <el-button class="panl" @click="transToDataset">查看源数据</el-button>
                    <el-button class="panl" @click="saveSlideContent">保存</el-button>
                </div>
            </div>
            <insightComponent v-if="isMounted"
				class="insight-content"
				:policy="currentPolicy"
				:policy-name="activeContent.policyName"
				:x-property="activeContent.x"
				:y-property="activeContent.y"
				v-on:x-property="changeXProperty"
				v-on:y-property="changeYProperty"
				v-on:changePolicy="changePolicy"
				:needTitle="false" ref="histogram"/>
        </div>
    </div>
</template>
<script>
import ElButton from "element-ui/packages/button"
import ElTabs from "element-ui/packages/tabs"
import ElTabPane from "element-ui/packages/tab-pane"
import ElDialog from 'element-ui/packages/dialog/src/component'
import insightComponent from "./insight-container"
import PhSlideModel from "./slide-model/slide-model"
import "element-ui/lib/theme-chalk/index.css"
import PhHistogramDatasource from "../components/model/datasource"
import PhHistogramSchema from "../components/model/schema"
import StackPolicy from "../components/render-policy/stack-policy"
import ScatterplotPolicy from "../components/render-policy/scatterplot-policy"
import LinesPolicy from "../components/render-policy/lines-policy"
import BarPolicy from "../components/render-policy/bar-policy"
import PiePolicy from "../components/render-policy/pie-policy"
import { staticFilePath } from '../config/envConfig'

export default {
    props: {
        allData: {
            type: Object,
            default:() => ({
                projectName: "alfred test",
                projectId: "1",
                slide: null,
                contentId: 0
            })
        }
    },
    components: {
        ElDialog,
        ElButton,
        insightComponent
    },
    data: () => {
        return {
            logo1: `${staticFilePath}` + "/icons/%E7%9C%8B%E6%9D%BF.svg",
            logo2: `${staticFilePath}` + "/icons/%E7%9C%8B%E6%9D%BF%E5%8F%8D%E8%89%B2.svg",
            del_icon: `${staticFilePath}` + "/delete_r.svg",
            add_icon: `${staticFilePath}` + "/icons/%E5%8A%A0%E5%8F%B7.svg",
            clear_data_icon: `${staticFilePath}` + "/delete_b.svg",
            delete_icon: `${staticFilePath}` + "/delete_r.svg",
            label_icon: `${staticFilePath}` + "/tag.svg",
            isMounted: 0,
            contentModel: null,
            currentPolicy: null,
            activeContent: null
        }
    },
    mounted () {
        this.isMounted++
    },
    methods: {
        getCookie(name) {
            let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg))
                return (arr[2]);
            else
                return null;
        },
        createCurrentContent() {
            this.contentModel = new PhSlideModel(this.allData.slide.idx, this.allData.slide)
            this.activeContent = this.contentModel.content[this.allData.contentId]
        },
        createPolicyWithinContent() {
            const content = this.activeContent
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
                    { xProperty: content.x, yProperty: content.y })
            }
            else if (content.policyName === "pie") {
                return new PiePolicy(content.index,
                    new PhHistogramDatasource(content.index,
                        this.allData.projectId,
                        content.datasetName),
                    new PhHistogramSchema(content.index,
                        this.allData.projectId,
                        content.datasetName),
                    { xProperty: content.x, yProperty: content.y })
            }
            else if (content.policyName === "stack") {
                return new StackPolicy(content.index,
                    new PhHistogramDatasource(content.index,
                        this.allData.projectId,
                        content.datasetName),
                    new PhHistogramSchema(content.index,
                        this.allData.projectId,
                        content.datasetName),
                    { xProperty: content.x, yProperty: content.y })
            }
            else if (content.policyName === "scatterplot") {
                return new ScatterplotPolicy(content.index,
                    new PhHistogramDatasource(content.index,
                        this.allData.projectId,
                        content.datasetName),
                    new PhHistogramSchema(content.index,
                        this.allData.projectId,
                        content.datasetName),
                    { xProperty: content.x, yProperty: content.y })
            }
            else if (content.policyName === "lines") {
                return new LinesPolicy(content.index,
                    new PhHistogramDatasource(content.index,
                        this.allData.projectId,
                        content.datasetName),
                    new PhHistogramSchema(content.index,
                        this.allData.projectId,
                        content.datasetName),
                    {xProperty: content.x, yProperty: content.y})

            }
            else {
                // TODO: other histogrm
            }
        },
        changePolicy(param) {
            const content = this.activeContent
            content.policyName = param.args.name
            this.currentPolicy = this.createPolicyWithinContent()
            this.$refs.histogram.needRefreshData++
        },
        changeXProperty(param) {
            const content = this.activeContent
            content.x = param.args.xProperty
            this.currentPolicy.xProperty = content.x
            this.$refs.histogram.needRefreshData++
        },
        changeYProperty(param) {
            const content = this.activeContent
            content.y = param.args.yProperty
            this.currentPolicy.yProperty = content.y
            this.$refs.histogram.needRefreshData++
        },
        backToDashboard() {
            const event = new Event("event")
            event.args = {
                callback: "linkToPage",
                element: this,
                param: {
                    name: "slidespage",
                    projectId: this.allData.projectId,
                    projectName: this.allData.projectName,
                    dashboardId: this.allData.dashboardId,
                    slideId: this.allData.slide.slideId,
                    contentId: this.allData.contentId
                }
            }
            this.$emit('event', event)
        },
        transToDataset() {
            const event = new Event("event")
            event.args = {
                callback: "linkToPage",
                element: this,
                param: {
                    name: "analyze",
                    projectId: this.allData.projectId,
                    projectName: this.allData.projectName,
                    dashboardId: this.allData.dashboardId,
                    slideId: this.allData.slide.slideId,
                    contentId: this.allData.contentId,
                    datasetId: this.activeContent.datasetId,
                    datasetName: this.activeContent.datasetName
                }
            }
            this.$emit('event', event)
        },
        async saveSlideContent() {
            this.contentModel.queryContent = this.contentModel.content
            if (await this.contentModel.save(this)) {
                this.backToDashboard()
            } else {
                alert("save histogrm error")
            }
        }
    },
    watch: {
        allData(n, o) {
            this.createCurrentContent()
            this.currentPolicy = this.createPolicyWithinContent()
        }
    }
}
</script>

<style scoped lang="scss">
    .insight-page {
        display: flex;
        width: 100%;
        height: calc(100vh - 60px);

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
                    align-items: center;
                        padding-right: 20px;
                    .text {
                        margin-right: 10px;
                        font-weight: bold;
                        height: 40px;
                        display: flex;
                        align-items: center;
                        cursor: pointer;
                    }
                    .panl {
                        height: 32px;
                        display: flex;
                        align-items: center;
                        background: #5342B3;
                        color: #fff;
                    }
                    .borderBold {
                        border-bottom: 1px solid #666;
                    }
                }
            }
            .insight-content {
                height: calc(100vh - 88px);
            }
            .page_footer {
                display: flex;
                padding: 0 20px;
                height: 40px;
                border-top: 1px solid #ccc;
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
