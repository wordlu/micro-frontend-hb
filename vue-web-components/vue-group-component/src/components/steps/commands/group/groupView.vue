<template>
    <div class="group-container">
        <link rel="stylesheet" href="https://components.hubadata.com/element-ui/element-ui.css">
        <div class="group-keys">
            <div class="group-key-title">
                <h3>Group Keys</h3>
            </div>
            <div class="group-key-container" v-if="datasource">
                <span class="warning-msg" v-show="datasource.keys.length === 0">未选择分组条件，将以整个数据集为单位进行聚合！</span>
                <div class="group-key-list" >
                    <div class="group-key-item" v-for="(item, index) in datasource.keys" :key="index">
                        <p class="group-key-item-col">{{item}}</p>
                        <el-button type="text" @click="delSelectCol(item, index)">删除</el-button>
                    </div>
                </div>
                <div class="group-key-add-btn" >
                    <select v-model="selectedAdd" @change="addSelectedColToKey" onfocus="if(this.options.length>3){this.size=4}" onblur="this.size=1" onchange="this.size=1">
                        <option label="选中添加" value="选中添加" />
                        <option v-for="(item, index) in selectedAddArray" :label="item.title" :key="index" :value="item.title" />
                    </select>
                </div>
            </div>
        </div>
        <div class="group-agg-container" v-if="datasource">
            <div class="group-agg-title">
                <h3>Aggregation</h3>
                <el-checkbox v-model="computedGroupCount" @change="changeComputedGroupCount">计算每个分组的总数</el-checkbox>
            </div>
            <div class="error-msg" v-show="!computedGroupCount && !checkGroupedKeys()">需要添加至少一个Filter条件！</div>
            <div class="group-agg-op">
                <el-table :data="notGroupedCommands"
                          ref="table"
                          height="calc(100vh - 480px)"
                          style="width: 100%">
                    <!-- <el-table-column
                            type="selection"
                            width="55">
                    </el-table-column> -->
                    <el-table-column
                            label="列名"
                            prop="column"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            label="类型"
                            prop="type"
                            width="120">
                    </el-table-column>
                    <el-table-column width="700">
                        <template slot-scope="scope">
                            <div class="group-check-box">
                                <el-checkbox-button v-model="scope.row.countDistinct">Distinct</el-checkbox-button>
                                <el-checkbox-button v-model="scope.row.min">Min</el-checkbox-button>
                                <el-checkbox-button v-model="scope.row.max">Max</el-checkbox-button>
                                <el-checkbox-button v-model="scope.row.sum">Sum</el-checkbox-button>
                                <el-checkbox-button v-model="scope.row.avg">Avg</el-checkbox-button>
                                <el-checkbox-button v-model="scope.row.stddev">Stddev</el-checkbox-button>
                                <el-checkbox-button v-model="scope.row.count">count</el-checkbox-button>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column width="300">
                        <template slot-scope="scope">
                            <div class="group-check-box">
                                <el-checkbox-button v-model="scope.row.first">First</el-checkbox-button>
                                <el-checkbox-button v-model="scope.row.last">Last</el-checkbox-button>
                                <el-checkbox-button v-model="scope.row.concat">Concat</el-checkbox-button>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column width="120">
                        <template slot-scope="scope">
                            <div class="popover" v-show="scope.row.showPopover && (scope.row.first || scope.row.last || scope.row.concat)">
                                <!-- <div class="popitem" v-show="scope.row.first || scope.row.last">
                                    <div class="label">Order first/last by</div>
                                    <select 
                                        v-model="scope.row.orderColumn">
                                        <option v-for="(item, index) in schemaDafault" :label="item.src" :key="index" :value="item.src" />
                                    </select>
                                </div> -->
                                <div class="popitem" v-show="scope.row.first || scope.row.last">
                                    <div class="label">First/last not null</div>
                                    <el-checkbox v-model="scope.row.firstLastNotNull"></el-checkbox>
                                </div>
                                <div class="popitem" v-show="scope.row.concat">
                                    <div class="label">Concat separator</div>
                                    <el-input v-model="scope.row.concatSeparator"></el-input>
                                </div>
                                <div class="popitem" v-show="scope.row.concat">
                                    <div class="label">Concat distinct</div>
                                    <el-checkbox v-model="scope.row.concatDistinct"></el-checkbox>
                                </div>
                            </div>
                            <div class="group-check-box">
                                <el-button 
                                    :disabled="!scope.row.first && !scope.row.last && !scope.row.concat"
                                    @click="showOptionPopoverClick(scope.row)">option
                                </el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>
<script>
import ElButton from 'element-ui/packages/button/index'
import ElCheckbox from 'element-ui/packages/checkbox/index'
import ElCheckboxButton from 'element-ui/packages/checkbox-button/index'
import ElInput from 'element-ui/packages/input/index'
// import ElForm from 'element-ui/packages/form/index'
// import ElFormItem from 'element-ui/packages/form-item/index'
import ElTable from 'element-ui/packages/table/index'
import ElTableColumn from 'element-ui/packages/table-column/index'
import { PhGroupDefs } from "./defs"
import PhGroupStep from "./step"

export default {
    data() {
        return {
            datasource: null,
            selectedAdd: "选中添加",
            computedGroupCount: true,
            isIndeterminate: false,
            checkAll: false,
            notGroupedCommands: [],
            // notGroupedTypes: [],
            checkedKeys: [],
            ignoredClearMsg: false,
            schemaArray: [],
            showOptionPopover: false,
			selectedAddArray: []
        }
    },
    props: {
        step: Object,
        schema: Array,
        schemaDafault: Array,
        concretDefs: {
            type: Object,
            default: () => {
                return PhGroupDefs
            }
        }
    },
    components: {
        // ElFormItem,
        // ElForm,
        ElInput,
        ElButton,
        ElTable,
        ElTableColumn,
        ElCheckbox,
        ElCheckboxButton
    },
    mounted() {
        this.datasource = new PhGroupStep(this.step, this.schema)
        this.computedGroupCount = this.datasource.globalCount
        this.ignoredClearMsg = false
		this.validate()
    },
    methods: {
        showOptionPopoverClick(data) {
            data.showPopover = !data.showPopover
            this.$refs.table.doLayout()
        },
        renderSchema() {
			//computed columns的结果
            this.schemaArray = this.$parent.computeSchema()
			this.selectedAddArray = this.schemaArray.filter(it => !this.datasource.keys.includes(it.title))
			//生成新的command array
            this.datasource.resetCommands(this.schemaArray)
            this.notGroupedCommands = this.resetSelectGroupKeys()
			//当computed columns的列被删除时发生改变
            const columns = this.schemaArray.map(it => it.title)
            this.datasource.keys = this.datasource.keys.filter(it => columns.includes(it))
        },
        validate() {
            this.renderSchema()

            const ErrorVales = !this.computedGroupCount && !this.checkGroupedKeys()
            this.$emit('statusChange', ErrorVales)
        },
        delSelectCol(item, index) {
            this.datasource.keys.splice(index, 1)
            this.notGroupedCommands = this.resetSelectGroupKeys()
            this.selectedAddArray = this.selectedAddArray.concat(this.schema.filter(it => it.title === item))
        },
        resetSelectGroupKeys() {
            const res = []
            for (let idx = 0; idx < this.datasource.commands.length; ++idx) {
                if (!this.datasource.keys.includes(this.datasource.commands[idx].column)) {
                    res.push(this.datasource.commands[idx])
                } else {
                    this.datasource.commands[idx].isUsed = false
                }
            }
            this.ignoredClearMsg = true
            const that = this
            this.$nextTick(() => {
                res.forEach(x => {
                    if (x.isUsed) {
                        that.$refs.table.toggleRowSelection(x)
                    }
                })
            })
            return res
        },
        checkGroupedKeys() {
            let num = 0
            this.notGroupedCommands.forEach(it => {
                if (Object.values(it).includes(true)) {
                    num = num + 1
                }
            })
            return num > 0
        },
        addSelectedColToKey() {
            this.datasource.addCol2Key(this.selectedAdd)
            this.selectedAddArray = this.selectedAddArray.filter(it => it.title !== this.selectedAdd)
            this.selectedAdd = "选中添加"
            this.notGroupedCommands = this.resetSelectGroupKeys()
        },
        changeComputedGroupCount() {
            this.datasource.changeComputedGroupCount(this.computedGroupCount)
        },
        // handleSelectionChange(val) {
        //     if (!this.ignoredClearMsg) {
        //         this.datasource.commands.forEach(x => {
        //             x.isUsed = val.includes(x);
        //         })
        //     } else {
        //         this.ignoredClearMsg = false
        //     }
        // }
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
    .group-container {
        margin-top: 4px;
        min-width: calc(100vw - 300px);
        width: calc(100vw - 300px);
        display: flex;
        flex-direction: column;
        background: #fff;
        height: fit-content;
        padding: 20px;

        .group-title {
            display: flex;
            flex-direction: column;

            .group-title-p {
                display: flex;
                flex-direction: row;
                justify-content: space-between;

                .ver-center {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;
                }
            }
        }

        .group-keys {
            .group-key-title {

            }

            .group-key-container {
                display: flex;
                flex-direction: column;
                padding: 10px;
                position: relative;
                height:90px;
                margin-bottom: 20px;

                .warning-msg {
                    font-size: 13px;
                    color: #c05b0a;
                    margin-bottom: 20px;
                }
            }


            .group-key-list {
                display: flex;
                flex-wrap: wrap;
                max-height: 140px;
                overflow: auto;

                .group-key-item {
                    width: 220px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin: 0 14px 10px 0;
                    background-color: #f2f2f2;
                    padding: 0 10px;
                    font-size: 14px;
                    border-radius: 4px;
                }
            }

            .group-key-add-btn {
                // display: flex;
                // flex-direction: row;
                // justify-content: space-around;
                margin-top: 10px;
                height: 80px;
                position: absolute;
                bottom: -74px;
                left: calc(50vw - 313px);

                select {
                    min-height: 26px;
                    width: 220px;
                }
            }
        }

        .group-agg-container {
            margin-top: 10px;
            display: flex;
            flex-direction: column;

            .error-msg {
                font-size: 13px;
                color: #ce1228;
            }

            .group-agg-title {
                display: flex;
                flex-direction: column;
                border-top: 1px solid #ccc;

                .el-checkbox {
                    margin-left: 10px;
                    margin-bottom: 10px;
                }
            }

            .group-agg-op {
                overflow: auto;
                .popover {
                    position: absolute;
                    border: 1px solid #aaa;
                    box-shadow: 0 2px 12px 0  rgba(0, 0, 0, 0.1);
                    z-index: 1;
                    background: #fff;
                    width: 300px;
                    right: 30px;
                    top: 60px;
                    padding: 10px;

                    .popitem {
                        display: flex;
                        align-items: center;

                        .label {
                            width: 150px;
                            max-width: 150px;
                            padding-right: 16px;
                        }

                        /deep/.el-input {
                            width: 120px;
                        }
                    }
                }
            }


            .group-agg-list {
                display: flex;
                flex-direction: column;

                .group-agg-item {
                    display: flex;
                    flex-direction: row;
                }
            }
        }
    }
</style>
