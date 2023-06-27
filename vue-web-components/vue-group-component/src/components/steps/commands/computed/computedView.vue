<template>
    <div class="computed">
        <link rel="stylesheet" href="https://components.hubadata.com/element-ui/element-ui.css">
        <div class="computed-title">
            <div class="computed-title-p">
                <h2>Computed Columns</h2>
            </div>
        </div>
        <div class="computed-list" v-if="datasource && datasource.command.computedCols.length > 0">
            <div class="computed-item"
                 v-for="(item, index) in datasource.command.computedCols"
                 :key="index"
                 @click="computedClicked(item, index)">
                <span>新建列名</span>
                 <el-input 
					class="computed-item-title" 
					@blur="blurColName(item)"
					:class="[{'el-input-error': item.name === ''}]"
					v-model="item.name"></el-input>
                <span>保存为</span>
                <select class="computed-item-type" v-model="item.type">
                    <option v-for="(op, opi) in concretDefs.typeDefs" :key="opi" :value="op.cal" :label="op.desc" />
                </select>
                <span>模式</span>
                <select class="computed-item-mode" v-model="datasource.command.pattern">
                    <option v-for="(op, opi) in concretDefs.pattern" :key="opi" :value="op.cal" :label="op.desc" />
                </select>
                <el-button type="text" @click="datasource.command.removeComputedCol(index)">删除</el-button>
            </div>
        </div>
        <div class="computed-expression" v-if="datasource && datasource.command.computedCols.length > 0">
            <ul class="computed-schema-list" v-if="datasource.command.computedCols.length > 0">
                <li v-for="(item, index) in schema" :key="index" @click="itemClicked(item.src)">{{item.src}}</li>
            </ul>
            <el-input class="computed-expression-expr"
					:class="[{'el-input-error': currentExpr === ''}]"
					type="textarea"
					:rows="10"
					v-model="currentExpr"
					placeholder="Please input"/>
        </div>

        <div class="computed-add-button">
            <el-button type="primary" @click="datasource.command.insertComputedCol()">添加</el-button>
        </div>
    </div>
</template>
<script>
import ElInput from 'element-ui/packages/input/index'
import ElButton from 'element-ui/packages/button/index'
import { PhComputedDefs } from "./defs"
import PhComputedStep from "./step"
import { Message } from 'element-ui'

export default {
    data() {
        return {
            datasource: null,
            currentIdx: 0,
            currentExpr: ""
        }
    },
    props: {
        step: Object,
        schema: Array,
        concretDefs: {
            type: Object,
            default: () => {
                return PhComputedDefs
            }
        }
    },
    components: {
        ElInput,
        ElButton
    },
    mounted() {
        this.datasource = new PhComputedStep(this.step)
        if (this.datasource.command.computedCols.length > 0)
            this.currentExpr = this.datasource.command.computedCols[0]["expr"]
        this.validate()
    },
    methods: {
        itemClicked(v) {
            this.currentExpr += "`" + v + "`"
        },
        computedClicked(it, idx) {
            this.currentExpr = it.expr
            this.currentIdx = idx
        },
        blurColName(item) {
			const schemaRepeat = this.schema.filter(it => it.src === item.name)
			const newColRepeat = this.datasource.command.computedCols.filter(it => it.name === item.name)
			if (schemaRepeat.length > 0 || newColRepeat.length > 1) {
				item.name = ""
				Message.error("列名与现有schema不能重复！", { duration: 3000} )
			}
		},
        validate() {
            const nameArr = this.datasource.command.computedCols.filter(it => it.name.replace(/\s*/g,"").length === 0)
            const exprArr = this.datasource.command.computedCols.filter(it => it.expr.replace(/\s*/g,"").length === 0)
            let ErrorVales = nameArr.length > 0 || exprArr.length > 0

            const event = new Event("event")
            event.args = {
                element: this,
                param: {
                    status: this.datasource.command.computedCols.length > 0,
                    errors: ErrorVales
                }
            }
            this.$emit('statusChange', event)
        }
    },
    computed: {

    },
    watch: {
        currentExpr(n) {
            this.datasource.command.computedCols[this.currentIdx]["expr"] = n
        }
    }
}
</script>
<style lang="scss" scoped>
    * {
        letter-spacing: .4px;
        line-height: 1.6;
        box-sizing: border-box;
    }
    .computed {
        margin-top: 4px;
        min-width: 800px;
        display: flex;
        flex-direction: column;
		background: #fff;
		height: fit-content;
		padding: 20px;

		.el-input-error {
			/deep/input.el-input__inner {
				border-color: #ce1228;
			}
			/deep/textarea.el-textarea__inner {
				border-color: #ce1228;
			}
		}

        .computed-title {
            display: flex;
            flex-direction: column;

            .computed-title-p {
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

        .computed-list {
            display: flex;
            flex-direction: column;
        }

        .computed-item {
            display: flex;
            flex-direction: row;
            cursor: pointer;


            .computed-item-title {
                width: 100px;
            }

            .computed-item-type {
                height: 40px;
            }

            .computed-item-mode {
                height: 40px;
            }
        }

        .computed-expression {
            display: flex;
            flex-direction: row;


            .computed-schema-list {
                border: 1px solid grey;
                height: 500px;
                width: 400px;
                overflow: auto;

                li {
                    cursor: pointer;
                }
            }

            .computed-expression-expr {
                margin: 30px 0 0 20px;
            }
        }

        .computed-add-button {
            display: flex;
            flex-direction: row;
            justify-content: space-around;
        }
    }
</style>
