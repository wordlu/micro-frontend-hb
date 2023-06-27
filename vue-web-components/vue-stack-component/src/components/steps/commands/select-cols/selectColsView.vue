<template>
    <div class="stack-select">
        <link rel="stylesheet" href="https://components.hubadata.com/element-ui/element-ui.css">
        <div class="stack-select-title">
            <div class="stack-select-title-p">
                <h2>Select Columns</h2>
            </div>
        </div>
        <div class="stack-select-ds-panel" v-if="datasource">
            <div class="stack-select-ds-lst">
                <div class="stack-select-ds-item"
                     v-for="(item, index) in datasource.command.ds"
                     :key="index" >
                    <div class="stack-select-ver">
                        <div class="stack-select-ds-left">
                            <span>{{item}}</span>
                            &nbsp;
                        </div>
                    </div>
                    <el-button type="text" @click="$emit('delDataset', item, index)">删除</el-button>
                </div>
                <div class="stack-select-hor">
                    <el-button type="primary" @click="$emit('addDataset')">添加数据集</el-button>
                </div>
            </div>
        </div>
        <div class="stack-select-matches-panel" v-if="datasource">
            <output-cols
                    :columns="datasource.command.columns"
                    :command="datasource.command"
					@addSelectColumn="addSelectColumn" />
            <ds-cols v-for="(item, index) in datasource.command.ds" 
					:key="index"
					ref="dscols"
					:dataset-name="item"
					:columns="datasource.command.dscols[item]"
					:colnameArr="datasource.command.dscols[item].map(it => it.name)"
					:schema="schema[item]"
					:command="datasource.command" />
        </div>
    </div>
</template>
<script>
import ElButton from 'element-ui/packages/button/index'
import OutputCols from './detail-view/output-cols'
import DsCols from './detail-view/ds-cols'
import { PhSelectColsDefs } from "./defs"
import PhSelectColsStep from "./step"

export default {
    data() {
        return {
            datasource: null
        }
    },
    props: {
        step: Object,
        schema: Object,
        datasetArray: Array,
        concretDefs: {
            type: Object,
            default: () => {
                return PhSelectColsDefs
            }
        }
    },
    components: {
        // ElInput,
        ElButton,
        // ElDivider,
        OutputCols,
        DsCols
    },
    mounted() {
        this.datasource = new PhSelectColsStep(this.step)
    },
    methods: {
		addSelectColumn() {
			this.datasource.command.addSelectColumn()
		},
        validate() {
            let errorValues = false
            if (this.datasource.command.columns.length === 0) {
                errorValues = true
            } else {
                const val = this.datasource.command.columns.filter(it => it.name === "")
                errorValues = val.length > 0
            }
            const event = new Event("event")
			event.args = {
				element: this,
				param: {
					errors: errorValues
				}
			}
			this.$emit('statusChange', event)
        },
        updateData(name, index) {
            this.datasource.refreshData(name, index)
        },
		deleteData(name, i) {
			this.datasource.command.ds.splice(i, 1)
			delete this.datasource.command.dscols[name]
		}
    },
    computed: {

    },
    watch: {

    }
}
</script>
<style lang="scss" scoped>
    * {
        letter-spacing: .4px;
        line-height: 1.6;
        box-sizing: border-box;
    }
    .stack-select {
        width: 100%;
        display: flex;
        flex-direction: column;
        background: #fff;
        padding: 20px;
        flex-grow: 1;

        .stack-select-title {
            display: flex;
            flex-direction: column;

            h3 {
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }

            .stack-select-title-p {
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

        .stack-select-ds-panel {
            display: flex;
            flex-direction: column;

            .stack-select-ds-lst {
                display: flex;
                flex-direction: row;
                border-bottom: 1px solid #ddd;
                border-top: 1px solid #ddd;
                align-items: center;
                margin-bottom: 100px;
            }

            .stack-select-ds-item {
                display: flex;
                flex-direction: row;
                min-width: 300px;
                width: 300px;
                margin-right: 40px;
                justify-content: space-between;

                .stack-select-ds-left {
                    display: flex;
                    flex-direction: row;
                }
            }
        }

        .stack-select-matches-panel {
            display: flex;
            flex-direction: row;

        }

        .stack-select-hor {
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            height: 40px;

            button {
                height: 40px;
                display: flex;
                align-items: center;
            }
        }

        .stack-select-ver {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
        }
    }
</style>
