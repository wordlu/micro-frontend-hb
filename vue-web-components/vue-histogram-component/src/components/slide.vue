<template>
    <div class="grid-page">
        <div v-if="needTitle" class="title-panel">
            <img :src="icon" />
            <h2>{{dashboardTitle}}</h2>
            <el-button class="save-button" type="primary" plain @click="saveContentPosition">Save</el-button>
            <el-tabs v-model="activeName">
                <el-tab-pane label="View" name="first" ></el-tab-pane>
                <el-tab-pane label="Edit" name="second" ></el-tab-pane>
            </el-tabs>
        </div>
        <div class="edit-container" ref="container">
            <div class="mid-container">
                <div v-if="isMounted" class="grid-container" ref="grid">
                    <div class="grid-item"
                         v-for="index in this.initGrids.columns * this.initGrids.lines"
                         :key="'grid'+index"
                         :style="gridItemLayout(index - 1)" >
                        &nbsp
                    </div>
                </div>
            </div>
            <div v-if="isMounted" class="high-container" >
                <div class="histogram-container" v-if="contentModel" :style="draggableLayout()" >
                    <Histogram v-for="(item, index) in contentModel.content"
                               :key="index"
                               :editable="isEditable()"
                               :position="item.position"
                               :active-content="item"
                               @selected="insightSelected"/>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import ElButton from "element-ui/packages/button"
import ElTabs from "element-ui/packages/tabs"
import ElTabPane from "element-ui/packages/tab-pane"
import Histogram from "./draggable-container"
import PhSlideModel from "../components/slide-model/slide-model"
import "element-ui/lib/theme-chalk/index.css"
import { staticFilePath } from '../config/envConfig'

export default {
    props: {
        initGrids: {
            type: Object,
            default: function () {
                return { columns: 12, lines: 6, margin: 3 }
            }
        },
        needTitle: {
            type: Boolean,
            default: true
        },
        dashboardTitle: {
            type: String,
            default: "alfred test"
        },
        contentModel: {
            type: Object,
            default: null
        },
        icon: {
            type: String,
            default: `${staticFilePath}` + "/icons/%E9%87%8D%E6%96%B0%E8%BF%90%E8%A1%8C%E5%BD%93%E5%89%8D%E8%84%9A%E6%9C%AC.svg"
        },
        isEditableValue: Boolean,
        projectId: String
    },
    data: () => {
        return {
            name: "slide",
            isMounted: 0,
            activeName: "first",
            needRefresh: 0
        }
    },
    components: {
        Histogram,
        ElButton,
        ElTabs,
        ElTabPane
    },
    mounted () {
        this.isMounted++
    },
    updated() {

    },
    methods: {
        changeHistogram(data) {
            const event = new Event("event")
            event.args = {
                callback: "linkToPage",
                element: this,
                param: {
                    name: "changeHistogram",
                    "histogramParams": data
                }
            }
            this.$emit('changeHistogram', event)
        },
        gridItemLayout(index) {
            const w = this.$refs.container.offsetWidth
            const h = this.$refs.container.offsetHeight
            const margin = this.initGrids.margin
            const columns = this.initGrids.columns
            const lines = this.initGrids.lines
            const stepW = (w - margin) / columns - margin
            const stepH = (h - margin) / lines - margin
            const cy = Math.floor(index / columns)
            const cx = index % columns
            const top = margin + cy * (stepH + margin)
            const left = margin + cx * (stepW + margin)
            return "top: " + top + "px; left: " + left + "px; width: " + stepW + "px; height: " + stepH + "px;"
        },
        draggableLayout() {
            const w = this.$refs.container.offsetWidth
            const h = this.$refs.container.offsetHeight
            return "width: " + w + "px; height: " + h + "px;"
        },
        saveContentPosition() {
            const keys = Object.keys(this.contentModel.content)
            for (let idx = 0; idx < keys.length; ++idx) {
                const cur = this.$refs[this.contentModel.content[keys[idx]].index][0]
                this.contentModel.content[keys[idx]].x = cur.policy.xProperty
                this.contentModel.content[keys[idx]].y = cur.policy.yProperty
                this.contentModel.content[keys[idx]].position = [cur.left, cur.top, cur.right, cur.bottom]
            }
            this.contentModel.save()
        },
        isEditable() {
            if(this.isEditableValue !== undefined) {
                return this.isEditableValue
            }
            return this.activeName === "second"
        },
        insightSelected(e) {
            e.param["slideId"] = this.contentModel.slideId
            e.param["pdId"] = this.contentModel.pdId
            this.$emit("selected", e)
        }
    },
    watch: {
        contentModel(n, o) {
            this.needRefresh++
        }
    }
}
</script>

<style scoped lang="scss">
    .grid-page {
        display: flex;
        flex-direction: column;
        min-height: 100%;
        flex-grow: 1;

        .title-panel {
            display: flex;
            flex-direction: row;
            background-color: grey;
            height: 45px;

            img {
                width: 40px;
                height: 40px;
                margin: auto 0;
                border: 2px solid gray;
                padding: 1px;
            }

            h2 {
                margin: auto 0;
            }
        }

        .edit-container {
            flex-grow: 1;

            .mid-container {
                position: absolute;
                z-index: -2;


                .grid-container {
                    position: relative;
                    z-index: -1;

                    .grid-item {
                        position: absolute;
                        background-color: #f2f2f2;
                    }
                }
            }

            .high-container {
                position: absolute;

                .histogram-container {
                    position: relative;
                    z-index: 99;
                }
            }
        }
    }
</style>
