<template>
    <div class="pivot-example1">
        <div class="pivot-example-content" >
            <div class="pivot-example-sample">
                <el-table
                        height="160"
                        :cell-style="tableNoBorder"
                        :header-cell-style="tableNoBorder"
                        @cell-click="cellClicked"
                        :data="defs.sampleData">
                    <el-table-column
                            prop="col"
                            label="样例"
                            width="180">
                    </el-table-column>
                </el-table>
            </div>
            <div class="pivot-example-setting">
                <el-table
                        height="160"
                        :cell-style="tableNoBorder"
                        :header-cell-style="tableNoBorder"
                        :data="defs.settingData[selected]">
                    <el-table-column
                            prop="data"
                            label="Setting"
                            width="180">
                    </el-table-column>
                </el-table>
            </div>
            <div class="pivot-example-display">
                <div class="left-table">
                    <el-table v-if="selected !== 'Pivot Value'"
                            style="width: 300px; margin-top: 5px"
                            :data="defs.condData[selected]">
                        <el-table-column
                                prop="id"
                                label="Id">
                        </el-table-column>
                        <el-table-column
                                prop="country"
                                label="country">
                        </el-table-column>
                        <el-table-column
                                prop="year"
                                label="year">
                        </el-table-column>
                        <el-table-column
                                prop="qty"
                                label="qty">
                        </el-table-column>
                    </el-table>
                    <el-table v-else
                              style="width: 300px; margin-top: 5px"
                              :data="defs.condData[selected]">
                        <el-table-column
                                prop="id"
                                label="Id">
                        </el-table-column>
                        <el-table-column
                                prop="metric"
                                label="metric">
                        </el-table-column>
                        <el-table-column
                                prop="values"
                                label="values">
                        </el-table-column>
                    </el-table>
                </div>

                <!-- <div class="hor-center">
                    <svg width="80" height="200">
                        <defs>
                            <marker id="arrow" markerWidth="10" markerHeight="10"
                                    refX='0' refY='2' orient="auto"
                                    markerUnits="strokeWidth" viewBox="0 0 20 20">
                                <path d="M0,0 L0,6 L9,3 z" fill="#ccc" />
                            </marker>
                        </defs>
                        <line x1="0" y1="100" :x2="150" y2="100" stroke="#ccc" stroke-width="2" marker-end="url(#arrow)" />
                    </svg>
                </div> -->

                <div class="line-area">
                    <div class="center-children">
                        <div class="line"></div>
                    </div>
                    <span class="output-marker">•</span>
                </div>

                <div class="right-table">
                    <el-table v-if="selected === 'Pivot Table'"
                            style="width: 300px; margin-top: 5px"
                            :data="defs.pivotData[selected]">
                        <el-table-column
                                prop="country" >
                        </el-table-column>
                        <el-table-column
                                prop="2016"
                                label="2016">
                        </el-table-column>
                        <el-table-column
                                prop="2017"
                                label="2017">
                        </el-table-column>
                    </el-table>
                    <el-table v-if="selected === 'Pivot Value'"
                              style="width: 300px; margin-top: 5px"
                              :data="defs.pivotData[selected]">
                        <el-table-column
                                prop="id" >
                        </el-table-column>
                        <el-table-column
                                prop="weight"
                                label="weight">
                        </el-table-column>
                        <el-table-column
                                prop="height"
                                label="height">
                        </el-table-column>
                    </el-table>
                    <el-table v-if="selected === 'Frequency Table'"
                              style="width: 300px; margin-top: 5px"
                              :data="defs.pivotData[selected]">
                        <el-table-column
                                prop="country" >
                        </el-table-column>
                        <el-table-column
                                prop="2016"
                                label="2016">
                        </el-table-column>
                        <el-table-column
                                prop="2017"
                                label="2017">
                        </el-table-column>
                    </el-table>
                    <el-table v-if="selected === 'Various Statistics'"
                              style="width: 320px; margin-top: 5px"
                              :data="defs.pivotData[selected]">
                        <el-table-column
                                prop="country" >
                        </el-table-column>
                        <el-table-column
                                prop="2016"
                                label="2016">
                        </el-table-column>
                        <el-table-column
                                prop="2017"
                                label="2017">
                        </el-table-column>
                        <el-table-column
                                width="100"
                                prop="avg(qty)"
                                label="avg(qty)">
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import ElTable from 'element-ui/packages/table/index'
import ElTableColumn from 'element-ui/packages/table-column/index'
import { PhPivotDefs } from '../defs'

export default {
    data() {
        return {
            selected: "Pivot Table"
        }
    },
    props: {
        defs: {
            type: Object,
            default: () => {
                return PhPivotDefs
            }
        }
    },
    components: {
        ElTable,
        ElTableColumn,

    },
    mounted() {

    },
    methods: {
        tableNoBorder() {
            return 'border: none';
        },
        cellClicked(row) {
            this.selected = row.col
        }
    },
    computed: {

    }
}
</script>
<style lang="scss" scoped>
    * {
        letter-spacing: .4px;
        line-height: 1.6;
        box-sizing: border-box;
    }
    .pivot-example1 {
        /*margin-top: 4px;*/
        height: 100%;
        overflow-y: auto;
    }
    
    .pivot-example-content {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        
        /deep/td.el-table__cell {
            padding: 0 !important;
        }
        /deep/.el-table {
            background-color: #f2f2f2;
        }
        /deep/tr {
            background-color: #f2f2f2;
        }
        /deep/th {
            background-color: #f2f2f2;
        }

        .pivot-example-sample {
            flex: 0 0 50%;

            td {
                border: none !important;
            }
        }

        .pivot-example-setting {
            flex: 0 0 50%;
            background-color: #f2f2f2;
        }

        .pivot-example-display {
            flex: 0 0 100%;
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            width: 400px;
            max-height: 170px;
            .left-table {
                border: 1px solid #ccc;
                width: 170px;
            }
            .right-table {
                width: 170px;
                border: 1px solid #ccc;
            }
            .line-area {
                width: 100px;
                display: flex;
                align-items: center;
                .center-children {
                    width: 100px;
                    .line {
                        width: 100%;
                        height: 1px;
                        border-top: 1px solid #dddddd;
                    }
                }
                .output-marker {
                    color: #bbbbbb;
                    font-size: 20px;
                    line-height: 20px;
                    margin-top: -3px;
                    margin-left: -1px;
                }
            }
        }
    }

    .no-border-class {
        border-bottom: none !important;
    }

    .hor-center {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
    }


</style>
