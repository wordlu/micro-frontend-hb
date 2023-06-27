<template>
    <div class="computed">
        <link rel="stylesheet" href="https://components.hubadata.com/element-ui/element-ui.css">
        <div class="computed-title">
            <div class="computed-title-p">
                <h2>Computed Columns</h2>
            </div>
        </div>
        <div class="multi-computed-c" v-if="datasource">
            <div class="sel-ds" v-show="datasource.commands.length === 0">
                <div class="title">no input dataset</div>
                <el-button @click="$emit('addDataset')">请选择</el-button>
            </div>
            <div class="multi-computed-item" v-for="(item, index) in datasource.commands" :key="index">
                <div class="computed-ds-item-title">
                    <h3>{{item.meta.name}}</h3>
                     <div class="ver-center" >
                        <el-button type="text" @click="$emit('addDataset', item.meta.name, item.meta.index)">添加</el-button>
                        <el-button type="text" @click="$emit('delDataset', item.meta.name, item.meta.index)">删除</el-button>
                    </div>
                </div>
                <div class="computed-ds-item-col-list" >
                    <div class="computed-item" v-for="(cur, idx) in item.detail.computedCols" :key="idx">
                        <div class="computed-item-detail">
                            <span>列名:</span>
                            <span>{{cur.name}}</span>
                            <span>类型:</span>
                            <span>{{cur.type}}</span>
                        </div>
                        <div class="computed-item-operator">
                            <el-button type="text" @click="editComputedCol(item, idx)">修改</el-button>
                            <el-button type="text" @click="removeComputedCol(item, idx)">删除</el-button>
                        </div>
                    </div>
                </div>

                <div class="computed-add-button">
                    <el-button @click="createNewComputedItem(item)">添加</el-button>
                </div>
            </div>
            <el-dialog
                    title="Computed Columns"
                    :visible.sync="showEditDialog"
                    width="30%"
                    @closed="handleClose">
                <div class="computed-list" v-if="dialogEditing">
                    <div class="computed-items">
                        <span>新建列名</span>
                        <el-input class="computed-item-title" v-model="dialogEditing.name"></el-input>
                        <span>保存为</span>
                        <select v-model="dialogEditing.type">
                            <option v-for="(op, opi) in concretDefs.typeDefs" :key="opi" :value="op.cal" :label="op.desc" />
                        </select>
                        <span>模式</span>
                        <select v-model="pattern">
                            <option v-for="(op, opi) in concretDefs.pattern" :key="opi" :value="op.cal" :label="op.desc" />
                        </select>
                    </div>
                </div>
                <div class="computed-expression" v-if="dialogEditing">
                    <ul class="computed-schema-list">
                        <li v-for="(item, index) in dialogSchema" :key="index" @click="dlgSchemaItemClicked(item.src)">{{item.src}}</li>
                    </ul>
                    <el-input class="computed-expression-expr"
                              type="textarea"
                              :rows="10"
                              v-model="dialogEditing.expr"
                              placeholder="Please input" />
                </div>

                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="confirm">Confirm</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import ElInput from 'element-ui/packages/input/index'
import ElButton from 'element-ui/packages/button/index'
import ElDialog from 'element-ui/packages/dialog/index'
import { PhComputedDefs } from "./defs"
import PhComputedStep from "./step"
import PhComputedCmd from "./cmd"
import { Message } from 'element-ui'

export default {
    data() {
        return {
            datasource: null,
            currentIdx: 0,
            // currentExpr: "",
            currentEdit: null,
            currentItem: null,
            dialogSchema: [],
            dialogEditing: {
                name: "",
                expr: "",
                type: "int"
            },
            pattern: "SQL Expression",
            showEditDialog: false
        }
    },
    props: {
        step: Object,
        schema: Object,
        concretDefs: {
            type: Object,
            default: () => {
                return PhComputedDefs
            }
        }
    },
    components: {
        ElInput,
        ElButton,
        ElDialog
    },
    mounted() {
        this.datasource = new PhComputedStep(this.step)
        this.validate()
        // this.currentExpr = this.datasource.command.computedCols[0]["expr"]
    },
    methods: {
        confirm() {
            if (this.dialogEditing.name.length === 0 || this.dialogEditing.expr.length === 0) {
                Message.error("请填写列名和表达式", { duration: 3000} )
				return false
            }
            this.showEditDialog = false
        },
        itemClicked(v) {
            this.currentExpr += "`" + v + "`"
        },
        computedClicked(it, idx) {
            this.currentExpr = it.expr
            this.currentIdx = idx
        },
        validate() {
            let len = 0
            this.datasource.commands.forEach(item => {
                len = len + item.detail.computedCols.length
            })
            const event = new Event("event")
            event.args = {
                element: this,
                param: {
                    status: len === 0,
                    errors: false
                }
            }
            this.$emit('statusChange', event)
        },
        handleClose() {
            this.currentItem = null
            this.dialogSchema = []
            this.dialogEditing = {
                name: "",
                    expr: "",
                    type: "int"
            }
        },
        createNewComputedItem(item) {
            this.currentItem = item
            this.dialogSchema = this.schema[item.meta.name]
            this.dialogEditing = item.detail.insertComputedCol()
            this.showEditDialog = true
        },
        dlgSchemaItemClicked(col) {
            this.dialogEditing.expr = this.dialogEditing.expr + "`" + col + "`"
        },
        editComputedCol(item, idx) {
            this.currentItem = item
            this.dialogSchema = this.schema[item.meta.name]
			const it = item.detail.computedCols[idx]
            this.dialogEditing = item.detail.editComputedCol(idx, it)       
            this.showEditDialog = true
        },
        removeComputedCol(item, idx) {
            item.detail.removeComputedCol(idx)
        },
        updateData(n, o, unreset) {
            console.log(n, o)
            if (!unreset) {
                this.datasource.commands.push({
                    meta: {
                        "name": o.name,
                        "index": o.index,
                        "distinct": false,
                        "enabled": false,
                    },
                    detail: new PhComputedCmd([])
                })
            }
            this.datasource.commands.push({
                 meta: {
                    "name": n.name,
                    "index": n.index,
                    "distinct": false,
                    "enabled": false,
                },
                detail: new PhComputedCmd([])
            })
        },
        deleteData(dss, ids) {
            this.datasource.commands.forEach((itds, i) => {
                if(!dss.includes(itds.meta.name) || !ids.includes(itds.meta.index)) {
                    delete this.datasource.commands[i]
                }
            })
            this.datasource.commands = this.datasource.commands.filter(it => it)
        }
    },
    computed: {

    },
    watch: {
        // currentExpr(n) {
        //     this.datasource.command.computedCols[this.currentIdx]["expr"] = n
        // }
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
        width: 100%;
        padding: 4px;
        display: flex;
        flex-direction: column;
        background: #fff;
        padding: 20px;
        flex-grow: 1;
		width: calc(100vw - 300px);
        
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

            .computed-items {
                display: flex;
                flex-direction: row;
                align-items: center;

                .computed-item-title {
                    width: 200px;
                    margin-right: 20px;
                }

                select {
                    height: 40px;
                    margin-right: 20px;
                }

                span {
                    margin-right: 10px;
                }
            }
        }

        .computed-item {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;

            .computed-item-title {
                width: 200px;
                margin-right: 20px;
            }
            
            .computed-item-detail {
                display: flex;
                flex-direction: row;
                font-size: 16px;
            }

            .computed-item-operator {
                display: flex;
                flex-direction: row;
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

        .multi-computed-c {
            display: flex;
            flex-direction: row;
            flex-grow: 1;
			overflow: auto;

            .sel-ds {
                margin: 10px auto;
                display: flex;
                flex-direction: column;
                .title {
                    color: #666666;
                    font-size: 13px;
                    margin-bottom: 20px;
                }
            }

            .multi-computed-item:nth-child(odd) {
                background-color: rgb(242, 242, 242)
            }
            .multi-computed-item {
                display: flex;
                flex-direction: column;
                width: 500px;
				min-width: 500px;
                border: 1px dashed #aaa;
                border-top: none;
                margin: 1px;

                .computed-ds-item-title {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 10px;
                    border: 1px solid #ddd;
                    height: 40px;
                    background: #fff;
                }
            }

            .computed-ds-item-col-list {
                display: flex;
                flex-direction: column;
                padding: 20px;

                .computed-ds-item-col-item {

                }
            }
        }

        .computed-add-button {
            display: flex;
            flex-direction: row;
            justify-content: space-around;

            button {
                width: 180px;
            }
        }
    }
</style>
