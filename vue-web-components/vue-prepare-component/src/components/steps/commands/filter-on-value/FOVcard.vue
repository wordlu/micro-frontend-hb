<template>
    <div class="bp_operator_card">
        <link rel="stylesheet" href="https://components.hubadata.com/element-ui/element-ui.css">
        <div v-if="concretDefs" class="card">
            <div class="card_header" @click="handleCloseContent">
                <img :src="icons.drag_prepare_card" class="drag_prepare_card" alt="">
                <el-checkbox></el-checkbox>
                <div class="card_header_content">
                    <div class="card_header_desc">
                        <!-- {{step["step-name"]}} -->
                        {{stepDesc}}
                    </div>
                    <div class="card_header_del">
                        <div class="num"></div>
                        <img
                            :src="icons.del_icon"
                            @click="delCardItem"
                            class="del_icon" />
                    </div>
                </div>
            </div>
            <div class="card_content" v-show="showContent">
                <div class="mb_1">
                    <div class="title">操作</div>
                    <select class="sel" v-model="datasource.command.action" v-if="datasource">
                        <option
                                v-for="(item, i) in concretDefs.actions"
                                :key="i+'filterOnValue_options'"
                                :value="item.cal">{{item.desc}}</option>
                    </select>
                </div>
                <div class="mb_1">
                    <div class="title">多列筛选关系</div>
                         <select class="sel" v-model="datasource.command.booleanMode" v-if="datasource">
                            <option
                                v-for="(item,i) in concretDefs.relations"
                                :key="i+'filterOnValue_options'"
                                :value="item.cal">{{item.desc}}</option>
                        </select>
                </div>
                <div class="mb_1 filter_col" v-if="datasource">
                    <div class="title title_space">
                        <div>列</div>
                        <div class="right_title">
                            <div
                                    class="mr_1"
                                    @click="clickColType(1)"
                                    :class="[{
                                    active: colType === 1
                                }]">单列</div>
                            <div
                                    @click="clickColType(2)"
                                    :class="[{
                                    active: colType === 2
                                }]">多列</div>
                        </div>
                    </div>
                    <div class="sel_item"
                         v-for="(col,index) in datasource.command.columns"
                         :key="index + 'col'">
                        <select class="sel" v-if="datasource" v-model="datasource.command.columns[index]">
                            <option
                                v-for="(item,i) in schema"
                                :key="i+'schema'"
                                :value="item">
                                {{item}}
                            </option>
                        </select>
                        <img :src="icons.del_icon"
                            @click="datasource.command.delCol(index)"
                            v-if="index !== 0"
                            class="del_icon" alt=""/>
                    </div>
                    <el-button
                        @click="datasource.command.addSelCol(this)"
                        type="text"
                        v-show="colType === 2">
                        + 增加列
                    </el-button>
                </div>
                <div class="mb_1 filter_value" v-if="datasource">
                    <div class="title_space">
                        <div class="title">值</div>
                    </div>
                    <div class="sel_item"
                         v-for="(val,i) in datasource.command.values"
                         :key="i+'val'">
                        <el-input class="input" placeholder="请输入内容" v-model="datasource.command.values[i]" />
                        <img
                            :src="icons.del_icon"
                            @click="datasource.command.delSelVal(i)"
                            v-if="i !== 0"
                            class="del_icon" alt="">
                    </div>
                    <el-button
                            @click="datasource.command.addSelVal()"
                            type="text">
                        + 增加值
                    </el-button>
                </div>
                <div class="mb_1">
                    <div class="title">筛选模式</div>
                        <select class="sel" v-if="datasource" v-model="datasource.command.matchingMode">
                           <option
                                v-for="(item,i) in concretDefs.pattern"
                                :key="i+'filterPattern'"
                                :value="item.cal">{{item.desc}}</option>
                        </select>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import ElCheckbox from 'element-ui/packages/checkbox/index'
import ElInput from 'element-ui/packages/input/index'
import { staticFilePath } from '../../../../config/envConfig'
import ElButton from 'element-ui/packages/button/index'
import { PhFilterStepDefs } from "./defs"
import PhFilterStep from "./step"

export default {
    data() {
        return {
            showContent: false,
            colType: 1,
            datasource: null
        }
    },
    props: {
        step: {
            type: Object
        },
        icons: {
            type: Object,
            default: () => {
                return {
                    del_icon: `${staticFilePath}/delete_r.svg`,
                    drag_prepare_card: `${staticFilePath}/drag_prepare_card.svg`
                }
            }
        },
        schema: {
            type: Array,
            default: () => {
                return []
            }
        },
        concretDefs: {
            type: Object,
            default: () => {
                return PhFilterStepDefs
            }
        }
    },
    components: {
        ElCheckbox,
        ElButton,
        ElInput
    },
    mounted() {
        this.datasource = new PhFilterStep(this.step)
    },
    methods: {
        delCardItem() {
            const event = new Event("event")
            event.args = {
                callback: "delCardItem",
                element: this,
                param: {
                    name: "delCardItem",
                    data: this.step
                }
            }
            this.$emit("delCardItem", event)
        },
        // 选择单列多列
        clickColType(num) {
            this.colType = num
        },
        // 收起内容
        handleCloseContent() {
            this.showContent = !this.showContent
        }
    },
    computed: {
        stepDesc: function() {
            return this.datasource ? this.datasource.command.stepDesc(this.concretDefs) : ""
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
    .bp_operator_card {
        margin-top: 4px;
        width: 100%;
        padding: 4px;
        .selected_border {
            border-color: #3b99fc !important;
        }
        .selected_background {
            background: #e7f3ff !important;
        }
        .error_border {
            border-color: #fb9292 !important;
        }
        .error_background {
            background: #fff8f8 !important;
        }
        .card {
            width: 100%;
            border: 1px solid #ccc;
            // background: #F4F8FF;
            .del_icon {
                width: 16px;
                height: 16px;
            }
            .active {
                color: #409EFF;
            }
            .card_header {
                padding: 4px;
                display: flex;
                align-items: center;
                min-height: 60px;
                border-bottom: 1px solid #ccc;
                box-shadow: 1px 1px 2px 0px rgba(0,0,0,0.5);
                cursor: pointer;
                .drag_prepare_card {
                    height: 18px;
                    margin-right: 4px;
                    cursor: move;
                }
                .el-checkbox {
                    margin-right: 10px;
                }
                .card_header_content {
                    display: flex;
                    width: 100%;
                    height: 100%;
                    flex-direction: column;
                    justify-content: space-between;
                    .card_header_del {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        font-size: 10px;
                        .num {
                            color: #F50000;
                        }
                    }
                }
            }
            .card_content {
                height: auto;
                padding: 10px;
                display: flex;
                flex-direction: column;
                // align-items: center;
                padding-left: 30px;
                .mb_1 {
                    margin-bottom: 20px;
                }
                .mr_1 {
                    margin-right: 10px;
                }
                .title {
                    font-size: 10px;
                    color: #000000;
                }
                .title_space {
                    display: flex;
                    justify-content: space-between;
                    width: 206px;
                    .right_title {
                        display: flex;
                        cursor: pointer;
                    }
                }
                .sel_item {
                    display: flex;
                    align-items: center;
                    margin-bottom: 6px;
                    select, .input {
                        margin-right: 4px;
                    }
                }
                .filter_col {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                }
                .filter_value {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                }
                .sel {
                    width: 206px;
                    height: 20px;
                }
                .input {
                    width: 206px;
                    height: 20px;
                }
                /deep/.el-input__inner {
                    height: 20px;
                }
            }
        }
    }
</style>
