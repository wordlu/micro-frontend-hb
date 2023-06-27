<template>
   <div class="script-parameters-area">
        <div class="script-param">
            <div class="title">
                <h2>脚本参数</h2>
            </div>
            <div class="search">
                <img :src="defs.iconsByName('search')" class="search_list_icon" alt="">
                <el-input 
                    placeholder="搜索名称" 
                    ref="colSearch" 
                    v-model="paramName" 
                    class="search_list" 
                    @input="searchParamName(paramName)">
                </el-input>
            </div>
            <div class="count">
                <el-button type="primary"  @click="addScriptParamsList">添加</el-button>
                <div>count: {{scriptParamsList.length}}</div>
            </div>
            <el-table
                ref="table"
                class="script-param-table"
                :data="scriptParamsList"
                :key="itemkey"
                style="width: 100%">
                <el-table-column
                    type="index"
                    label="序号"
                    width="120"
                    :index="indexMethod">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="名称">
                </el-table-column>
                <el-table-column
                    prop="default"
                    label="默认值">
                </el-table-column>
                <el-table-column
                    prop="type"
                    label="默认值类型">
                </el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    prop="level" >
                    <template slot="header">
                        优先级
                        <el-button 
                            v-tooltip="levelMsg"
                            class="ques-img" 
                            icon="el-icon-question" circle></el-button>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="des"
                    label="描述">
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="100">
                    <template slot-scope="scope">
                        <el-button @click="editParams(scope)" type="text" size="medium">编辑</el-button>
                        <el-button @click="delParams(scope)" type="text" size="medium">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog
            :title="dialogTitle"
            :visible.sync="changeScriptParamsList"
            width="800px">
            <div class="content">
                <el-form ref="form" label-width="80px">
                    <el-form-item label="名称">
                        <el-input 
                            :class="[{'error-border': content.name === '' || duplicateContentName}]"
                            ref="contentName"
                            @input="inputContentName()"
                            v-model="content.name"></el-input>
                    </el-form-item>
                    <div class="error-msg" v-show="duplicateContentName">参数名称已存在！</div>
                    <div class="error-msg" v-show="content.name === ''">请填写参数名称！</div>
                    <div class="type-param">
                        <el-form-item label="默认值" class="default">
                            <el-input 
                                :class="[{'error-border': content.default === ''}]"
                                v-model="content.default"></el-input>
                        </el-form-item>
                        <select name="type" id="" v-model="content.type">
                            <option value="String">String</option>
                            <option value="Double">Double</option>
                            <option value="Bigint">Bigint</option>
                        </select>
                    </div>
                    <div class="error-msg" v-show="content.default === ''">请填写默认值！</div>

                    <div class="level-param">
                        <el-form-item label="优先级">
                            <el-input-number 
                                :min="1"
                                :precision="0" :step="1"
                                v-model="content.level"></el-input-number>
                        </el-form-item>
                        <div class="desc">（数值越大，优先级越低）</div>
                    </div>
                    <el-form-item label="描述">
                        <el-input type="textarea" 
                            :class="[{'error-border': content.des === ''}]"
                            v-model="content.des"></el-input>
                    </el-form-item>
                    <div class="error-msg" v-show="content.des === ''">请填写描述！</div>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="changeScriptParamsList = false">取消</el-button>
                <el-button type="primary"  @click="confirm">确认</el-button>
            </span>
        </el-dialog>
   </div>
</template>
<script>
import ElForm from "element-ui/packages/form/index"
import ElFormItem from "element-ui/packages/form-item/index"
import ElInput from "element-ui/packages/input/index"
import ElButton from 'element-ui/packages/button/index'
import ElTable from 'element-ui/packages/table/index'
import ElTableColumn from 'element-ui/packages/table-column/index'
import PhDagDefinitions from "./policy/definitions/definitions"
import ElDialog from 'element-ui/packages/dialog/src/component'
// import ElTooltip from 'element-ui/packages/tooltip/index'
import { Message } from 'element-ui'
import ElInputNumber from 'element-ui/packages/input-number/index'
import Vue from 'vue'
import VTooltip from 'v-tooltip'

Vue.use(VTooltip)

export default {
    components: {
        ElInput,
        ElButton,
        ElDialog,
        ElForm,
        ElFormItem,
        ElTable,
        ElInputNumber,
        ElTableColumn,
        // ElTooltip
    },
    data() {
        return {
            paramName: "",
            changeScriptParamsList: false,
            scriptParamsList: [],
            duplicateContentName: false,
            dialogTitle: "",
            scopeRowIndex: 0,
            content: {
                "name": "",
                "default": "",
                "type": "String",
                "des": "",
                "level": 1, 
                "index": 1
            },
            paramCount: 0,
            hover: true,
            itemkey: false,
            levelMsg: "同优先级按排列顺序运行"
        }
    },
    props: {
        defs: {
            type: Object,
            default: function () {
                return new PhDagDefinitions("1");
            }
        },
        scriptParamsData: Array
    },
    methods: {
        hoverIn() {
            this.hover = true
            this.itemkey = !this.hover
        },
        hoverOut() {
            this.hover = false
            this.itemkey = !this.hover
        },
        inputStrChecked(value, ref) {
            // 只允许输入数字、字母、下划线
            // let r = /^[a-zA-Z0-9_^]{1,}$/
			let r = /([a-z])([a-z1-9])*(_([a-z1-9]+))*/
            if (r.test(value)) {
                if(value.length > 30) {
                    this.$refs[ref].value = ""
                    this.content.name = ""
                    Message.error("输入内容过长！！")
                    return false;
                }
                return value
            } else {
                this.$refs[ref].value = ""
                this.content.name = ""
                Message.error("请勿输入特殊字符！")
                return false;
            }
        },
        addScriptParamsList() {
            this.dialogTitle = "添加参数"
            this.content = {
                "name": "",
                "default": "",
                "type": "String",
                "des": "",
                "level": 1, 
                "index": 1
            }
            this.duplicateContentName = false
            this.changeScriptParamsList = true
        },
        searchParamName(data) {
            console.log(data)
        },
        indexMethod(index) {
            return index + 1;
        },
        editParams(scope) {
            this.dialogTitle = "修改参数"
            this.scopeRowIndex = scope.$index
            this.content = JSON.parse(JSON.stringify(scope.row))
            this.duplicateContentName = false
            this.changeScriptParamsList = true
        },
        delParams(scope) {
            this.paramCount++
            this.scriptParamsList.splice(scope.$index, 1)
        },
        inputContentName() {
            const name = this.content.name
            if (!this.inputStrChecked(name, "contentName")) {
                return false
            }
            let arr = []
            if (this.dialogTitle === "添加参数") {
                arr = this.scriptParamsList.filter(it => it.name === name)
            } else if (this.dialogTitle === "修改参数") {
                const list = this.scriptParamsList.filter((it,i) => i !== this.scopeRowIndex)
                arr = list.filter(it => it.name === name)
            }

            if (arr.length > 0) {
                this.duplicateContentName = true
            } else {
                this.duplicateContentName = false
            }
        },
        validate() {
            if (this.content.name === "" || this.content.default === '' || this.content.des === '' || this.duplicateContentName) {
                return false
            }
            return true
        },
        confirm() {
            this.paramCount++
            const val = this.validate()
            if(!val) return false

            if (this.dialogTitle === "添加参数") {
                this.scriptParamsList.push(this.content)
            } else if (this.dialogTitle === "修改参数") {
                this.$set(this.scriptParamsList, this.scopeRowIndex, this.content)
            }
            this.changeScriptParamsList = false
        },
        save() {
            const event = new Event("event")
            event.args = {
                callback: "changeScriptParams",
                element: this.parent,
                param: {
                    scriptParamsList: this.scriptParamsList
                }
            }
            this.$emit('changeScriptParams', event)
        }
    },
    mounted() {
    },
    watch: {
        scriptParamsData: function(n) {
            this.scriptParamsList = JSON.parse(JSON.stringify(n))
        }
    }
}
</script>
<style lang="scss">
    .script-parameters-area {
        width: 100%;
        flex-grow: 1;
        display: flex;
        flex-direction: row;
        height: calc(100vh - 100px);
        background: #f2f2f2;

        /deep/.el-dialog__header {
            border-bottom: 1px solid #ccc;
        }
        /deep/.el-dialog__headerbtn {
            display: none;
        }
        /deep/.el-dialog__wrapper {
            background: rgba(0, 0, 0, 0.31);
        }
        
        .content {
            .type-param {
                display: flex;

                .default {
                    width: 640px;
                }

                select {
                    height: 40px;
                    width: 100px;
                    margin-left: 20px;
                }
            }

            .level-param {
                display: flex;

                .desc {
                    margin-top: 10px;
                }
            }

            .error-msg {
                font-size: 13px;
                color: #ce1228;
                margin-left: 80px;
                margin-bottom: 20px;
            }

            .error-border {
                .el-input__inner, .el-textarea__inner {
                    border-color: #ce1228 !important;
                }
            }

            .el-form-item {
                margin-bottom: 10px;
            }
        }

        .script-param {
            width: 100%;
            margin: 40px;
            padding: 20px;
            box-sizing: border-box;
            background: #fff;
            overflow: hidden;

            .title {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
            }

            .search {
                margin-bottom: 20px;
                position: relative;
                left: -20px;
                .search_list {
                    width: 500px;
                    input.el-input__inner {
                        padding-left: 40px;
                    }
                }
                .search_list_icon {
                    width: 20px;
                    position: relative;
                    top: 5px;
                    left: 30px;
                    z-index: 2;
                    color: #ccc;
                }
            }

            .count {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 14px;
                margin-bottom: 20px;
            }

            .script-param-table {
                height: calc(100vh - 400px);
                overflow: auto;
                
                .ques-img {
                    cursor: pointer;
                    border: none;
                }

                .info-msg {
                    background: #fff;
                    border: 1px solid #ddd;
                    /* padding: 2px; */
                    position: absolute;
                }
            }
            
        }
    }
</style>

