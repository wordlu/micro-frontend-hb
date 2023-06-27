<template>
    <div class="page">
        <div v-if="needTitle" class="title-panel">
            <img :src="img1" />
            <h2>{{dashboardTitle}}</h2>
        </div>
        <div class="container" >
            <div class="left">
                <div v-for="(item, index) in lst" :key="index" class="draggable-item" draggable="true"
                    @dragstart="dragStart($event, index, item)"
                    @dragend="dragEnd">
                    <span v-if="isNum(index)" class="num"><b>#</b></span>
                    <span v-else class="text"><b>A</b></span>
                    {{item}}
                </div>
            </div>
            <!-- <div class="filter-panel">
                <el-select v-model="policyName" placeholder="图表类型">
                    <el-option
                            v-for="(item, index) in policyCandidate"
                            :key="index"
                            :label="item"
                            :value="item">
                    </el-option>
                </el-select>
                <div class="bottom-filter">
                    <el-collapse v-model="activeCandis" >
                        <el-collapse-item title="Filters" name="1">
                            <el-input
                                    type="textarea"
                                    :rows="2"
                                    placeholder="Please input"
                                    v-model="filterString">
                            </el-input>
                        </el-collapse-item>
                        <el-collapse-item title="Display" name="2">
                            <div>暂不开放</div>
                        </el-collapse-item>
                        <el-collapse-item title="Color" name="3">
                            <div>暂不开放</div>
                        </el-collapse-item>
                        <el-collapse-item title="Animation" name="4">
                            <div>暂不开放</div>
                        </el-collapse-item>
                        <el-collapse-item title="Subcharts" name="5">
                            <div>暂不开放</div>
                        </el-collapse-item>
                        <el-collapse-item title="Tooltip" name="5">
                            <div>暂不开放</div>
                        </el-collapse-item>
                    </el-collapse>
                </div>
            </div> -->
            <div class="right">
                <div class="axis-container">
                    <div class="axis">
                        <span class="axis-title">图表类型</span>
                        <select v-model="tmpPolicyName"
                                style="width:200px;height: 30px;margin-top: 5px;margin-bottom: 5px;margin-left: 10px">
                            <option
								v-for="(item,index) in policyCandidate"
								v-bind:value="item" v-text="item"
								:key="index+'type'" ></option>
                        </select>
                    </div>
                    <div class="axis">
                        <span class="axis-title">Y轴</span>
                        <div class="drop" @drop="dropContentY" @dragover.prevent>
                            <p>{{yProperty}}</p>
                        </div>
                    </div>
                    <div class="axis">
                        <span class="axis-title">X轴</span>
                        <div class="drop" @drop="dropContentX" @dragover.prevent>
                            <p>{{xProperty}}</p>
                        </div>
                    </div>
                </div>
                <div class="content" ref="content">
                    <histogram ref="histogram" :policy="policy" />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import histogram from "../components/insight.vue"
import BarPolicy from "../components/render-policy/bar-policy"
import PiePolicy from "../components/render-policy/pie-policy"
import PhHistogramDatasource from "../components/model/datasource"
import PhHistogramSchema from "../components/model/schema"
import { staticFilePath } from '../config/envConfig'
export default {
    name: "insight-container",
    props: {
        dashboardTitle: {
            type: String,
            default: "alfred test"
        },
        needTitle: {
            type: Boolean,
            default: true
        },
        filterTreeData: {
            type: Array,
            default: function () {
                return [
                    { label: "Filters", children: [ { label: "sub-filters", children: [], leaf: true }] },
                    { label: "Display", children: [ { label: "sub-display", children: [], leaf: true }] },
                    { label: "Color", children: [ { label: "sub-color", children: [], leaf: true }] },
                    { label: "Animation", children: [ { label: "sub-animation", children: [], leaf: true }] },
                    { label: "Subcharts", children: [ { label: "sub-charts", children: [], leaf: true }] },
                    { label: "Tooltip", children: [ { label: "sub-tooltip", children: [], leaf: true }] }
                ]
            }
        },
        policy: {
            type: Object,
            default: function() {
                return null
            }
        },
        xProperty: String,
        yProperty: String,
        policyName: String
    },
    data: () => {
        return {
            policyCandidate: ["bar", "pie", "stack", "scatterplot"],
            draggingItem: null,
            needRefresh: 0,
            schemaRefresh: 0,
            needRefreshData: 0,
            lst: [],
            activeName: "first",
            activeCandis: [],
            filterString: "alfredtest",
            tmpPolicyName: "",
            img1: `${staticFilePath}` + "/icons/%E9%87%8D%E6%96%B0%E8%BF%90%E8%A1%8C%E5%BD%93%E5%89%8D%E8%84%9A%E6%9C%AC.svg"
        }
    },
    components: {
        histogram
    },
    mounted() {
        const w = this.$refs.content.offsetWidth
        const h = this.$refs.content.offsetHeight
        this.$refs.histogram.resizeHandler(w, h)

        this.needRefresh++
        this.schemaRefresh++
    },
    updated() {
        this.tmpPolicyName = this.policyName
    },
    methods: {
        getCookie(name) {
            let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg))
                return (arr[2]);
            else
                return null;
        },
        async refreshSchema() {
            if (this.policy) {
                await this.policy.schema.requestSchema(this)
                this.lst = this.policy.schema.schema
                this.$refs.histogram.schemaIsReady++
            }
        },
        refresh() {
            if (this.policy) {
                this.$refs.histogram.needRefresh++
            }
        },
        dragStart(event, index, item) {
            this.draggingItem = item
        },
        dragEnd() {
            this.clearDraggingStatus()
        },
        dropContentX(_) {
            // this.xProperty = this.draggingItem
            const event = new Event("x-property")
            event.args = {
                "xProperty": this.draggingItem
            }
            this.$emit("x-property", event)
            this.clearDraggingStatus()
        },
        dropContentY(_) {
            // this.yProperty = this.draggingItem
            const event = new Event("y-property")
            event.args = {
                "yProperty": this.draggingItem
            }
            this.$emit("y-property", event)
            this.clearDraggingStatus()
        },
        clearDraggingStatus() {
            if (this.draggingItem) {
                this.draggingItem = null
            }
        },
        isNum(index) {
            return this.policy.schema.dtype[index] !== "String"
        }
    },
    watch: {
        tmpPolicyName(n, o) {
            if (n !== o) {
                const event = new Event("event")
                event.args = {
                    name: n
                }
                this.$emit("changePolicy", event)
            }
        },
        needRefresh(n, o) {
            this.refresh()
        },
        needRefreshData(n, o) {
            this.$refs.histogram.schemaIsReady++
        },
        policy(n, o) {
            this.needRefresh++
        },
        schemaRefresh(n, o) {
            this.refreshSchema()
        }
    }
}
</script>

<style scoped lang="scss">
    .page {
        display: flex;
        flex-direction: column;
        // min-height: 100vh;
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

        .container {
            flex-grow: 1;
            overflow: hidden;
            display: flex;
            flex-direction: row;

            .left {
                display: flex;
                flex-direction: column;
                width: 300px;
                border: 2px solid grey;
                margin-right: 5px;
                padding-top: 20px;
                .draggable-item {
                    margin: 5px 10px;
                    padding: 5px 10px;
                    border-radius: 4px;
                    border: 1px solid rgba(0, 0, 0, .12);
                    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
                    font-size: 14px;

                    .num {
                        b {
                            color: darksalmon;
                        }
                    }

                    .text {
                        b {
                            color: darkgoldenrod;
                        }
                    }
                }
            }

            .filter-panel {
                width: 300px;
                padding-top: 30px;

                .bottom-filter {
                    margin: 50px 5px 5px 5px;
                    padding: 5px 0;
                }
            }

            .right {
                flex-grow: 1;
                display: flex;
                flex-direction: column;
                padding: 20px;
                .chart-type {
                    flex-grow: 1;
                    margin-right: 200px;
                    height: 40px;
                    margin-bottom: 4px;
                }
                .axis-container {
                    .axis {
                        display: flex;
                        flex-direction: row;

                        .axis-title {
                            margin: auto 0;
                            width: 100px;
                            min-width: 100px;
                            text-align: right;
                            margin-right: 20px;
                        }

                        span {
                            margin: auto 0;
                            width: 50px;
                        }

                        .drop {
                            display: flex;
                            flex-direction: row;
                            flex-grow: 1;
                            margin-right: 200px;
                            margin-top: 5px;
                            margin-bottom: 5px;
                            padding-left: 20px;
                            border: 1px solid rgba(0, 0, 0, .12);
                            // box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
                            height: 40px;
                            border-radius: 4px;
                            align-items: center;
                            span {
                                margin: auto 0;
                            }

                            p {
                                flex-grow: 1;
                                text-align: left;
                            }
                        }
                    }
                }

                .content {
                    flex-grow: 1;
                    // width: 100%;
                    // height: 100%;
                    position: relative;
                    display: flex;
                    /*background-color: red;*/
                }
            }
        }
    }
</style>
