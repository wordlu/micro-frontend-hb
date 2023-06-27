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
                :class="[{'active-item': index === currentIdx}]"
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
                <el-button type="text" @click.stop="delComputedColumns(index)">删除</el-button>
            </div>
        </div>
        <div class="computed-expression" v-if="datasource && datasource.command.computedCols.length > 0">
            <ul class="computed-schema-list">
                <li v-for="(item, index) in schema" :key="index" @click="itemClicked(item.src)">{{item.src}}</li>
            </ul>
            <el-input class="computed-expression-expr"
                :class="[{'el-input-error': currentExpr === ''}]"
                type="textarea"
                :rows="10"
                @change="currentExprChange"
                v-model="currentExpr"
                placeholder="Please input" />
            <!-- <div class="iframe-area">
                <iframe ref="scriptCodeEditor" id="scriptCodeEditor" class="executions-iframe" :src="iframeUrl" frameborder="0" style="width: 100%; height: 100%;"></iframe>
            </div> -->
        </div>

        <div class="computed-add-button">
            <el-button type="primary" @click.stop="addComputedColumns()">添加</el-button>
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
        },
        iframeUrl: {
            type: String,
            // default: "http://localhost:8081/hbcodeditor/"
            default: "https://codeditor.hubadata.com/hbcodeditor"
        },
    },
    components: {
        ElInput,
        ElButton
    },
    mounted() {
        this.datasource = new PhComputedStep(this.step)
        if (this.datasource.command.computedCols.length > 0) {
            this.currentExpr = this.datasource.command.computedCols[0]["expr"]
        }
        // this.$nextTick(() => {
        //     // 将datasource注册到window中，iframe传递消息this指向为window
        //     window["datasource"] = this.datasource
        //     this.initEditor()
        //     this.validate()
        // });
				this.validate()
    },
    methods: {
        // registerEvent() {
        //     this.unRegisterEvent()
        //     // 注册获取Editor内容事件
        //     window.addEventListener("message", this.datasource.getEditorContentEvent);
        //     window.addEventListener("message", this.datasource.iframeComplete);
        // },
        // unRegisterEvent() {
        //     window.removeEventListener("message", this.datasource.getEditorContentEvent);
        //     window.removeEventListener("message", this.datasource.iframeComplete);
        // },
        // initEditor() {
        //     const iframe = this.$refs.scriptCodeEditor
        //     iframe.onload = function () {
        //         iframe.contentWindow.postMessage({
        //             codeEditorParameters: {
        //                 editorId: "topnEditor",
        //                 // value: this.codeBuffer,
        //                 viewHeight: "calc(100vh - 8px)",
        //                 language: "sql",
        //                 maxLines: 100,
        //                 theme: "github"
        //             }
        //         }, "*")
        //     }
        //     this.registerEvent()
        // },
        // setEditorValue() {
        //     const that = this
        //     const iframe = this.$refs.scriptCodeEditor
        //     iframe.contentWindow.postMessage({
        //         codeValue: that.currentExpr
        //     }, "*")
        // },
        addComputedColumns() {
            this.datasource.command.insertComputedCol()
            const len = this.datasource.command.computedCols.length - 1
            this.computedClicked(this.datasource.command.computedCols[len], len)
        },
        delComputedColumns(index) {
            this.datasource.command.removeComputedCol(index)
            const len = this.datasource.command.computedCols.length - 1
            if (len >= 0)
                this.computedClicked(this.datasource.command.computedCols[len], len)
        },
        itemClicked(v) {
            // this.currentExpr += "`" + v + "`"
            // this.datasource.command.computedCols[this.currentIdx]["expr"] = this.currentExpr
            // this.setEditorValue()
            this.currentExpr += "`" + v + "`"
        },
        currentExprChange(n) {
            this.datasource.command.computedCols[this.currentIdx]["expr"] = n
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
            // this.setEditorValue()
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

        .active-item {
            background: rgba(230, 230, 230, 0.5);
            border-radius: 4px;
        }

        .computed-item {
            display: flex;
            flex-direction: row;
            cursor: pointer;
            align-items: center;
            padding: 0 10px;

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

            .iframe-area {
                padding-top: 10px;
                padding-left: 10px;
                height: 500px;
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
