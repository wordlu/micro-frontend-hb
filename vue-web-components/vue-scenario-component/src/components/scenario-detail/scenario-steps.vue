<template>
    <div class="scenario-steps-container">
        <div class="scenario-step-lst">
            <ul>
                <li v-for="(item, index) in steps" :key="index" :class="{ 'select': selectStep == item }"
                    v-show="item.deleted === false" @click="selectedStep(item, index)" draggable="true"
                    @dragstart="handleDragStart($event, item)" @dragover.prevent="handleDragOver($event, item)"
                    @dragenter="handleDragEnter($event, item)" @dragend="handleDragEnd($event, item)">
                    <!-- <p class="el-icon-s-operation" >{{index}}</p> -->
                    <span>运行&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    <span style="flex-grow: 1">{{ item.name }}</span>
                    <el-button class="el-icon-delete-solid border-none" @click.stop="deleteStep(item, index)"
                        :class="{ 'select': selectStep == item }"></el-button>
                </li>
            </ul>
            <el-button class="add_new_step" @click="addNewStep">
                添加运行步骤
                <!-- <img class="add" :src="add_icon" alt="" /> -->
            </el-button>
        </div>
        <!-- <el-divider direction="vertical" class="divider"></el-divider> -->
        <div class="scenario-step-detail" v-if="selectStep.deleted === false">
            <el-form label-width="120px">
                <el-form-item label="重命名">
                    <el-input v-model="selectStep.name" placeholder="step name" @change="selectStep.edited = true">
                    </el-input>
                </el-form-item>
                <el-form-item label="数据集">
                    <div :class="isDsEmpty() ? 'scenario-step-ds-item stepEmpty' : 'scenario-step-ds-item'"
                        style="width:100%;">
                        <span><b>{{ selectStep.ds }}</b></span>
                        <el-button class="el-icon-delete-solid border-none" @click="deleteStepDatasetName" />
                    </div>
                    <span class="dsEmpty" v-show="isDsEmpty()">数据集不能为空！</span>
                </el-form-item>
                <el-form-item label="" class="button_area">
                    <el-button class="add-ds" type="primary" @click="selectDS('ds')">选择目标数据集</el-button>
                    <el-button class="add-ds" type="primary" @click="selectDS('final')">选择最终目标</el-button>
                </el-form-item>
                <el-form-item label="配置参数">
                    <el-input type="textarea" :rows="4" placeholder="请输入配置参数" v-model="selectStep.confData"
                        :class="isAll() ? 'stepEmpty' : ''"></el-input>
                    <span class="confEmpty" v-show="isConfEmpty()">配置参数不能为空！</span>
                    <span class="confEmpty" v-show="isConfEmpty() ? !isJSON_test() : isJSON_test()">参数格式错误！</span>
                </el-form-item>
                <el-form-item label="运行模式">
                    <select class="select-pattern" v-model="selectStep.recursive" @change="selectStep.edited = true">
                        <option v-for="iter in options" :key="iter.index" :label="iter.desc" :value="iter.cat">
                        </option>
                    </select>
                </el-form-item>
                <el-form-item label="忽略失败">
                    <el-checkbox v-model="selectStep.ignoreError" @change="selectStep.edited = true">忽略上一步骤的失败，继续运行
                    </el-checkbox>
                </el-form-item>
            </el-form>
        </div>
        <el-dialog title="选择数据集名称" :visible.sync="dialogVisible" width="30%">
            <el-form label-width="120px">
                <el-form-item label="数据集名称">
                    <select class="select-pattern" v-model="dsName">
                        <option v-for="(iter, index) in dsArr" :key="iter.name + index" :label="iter.name"
                            :value="iter.name">
                        </option>
                    </select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false" style="padding: 10px;">Cancel</el-button>
                <el-button type="primary" @click="changeDataset" style="padding: 10px;">Confirm</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
// import { staticFilePath } from '../../config/envConfig'
import ElButton from "element-ui/packages/button/index"
import ElInput from "element-ui/packages/input/index"
import ElForm from "element-ui/packages/form/index"
import ElFormItem from "element-ui/packages/form-item/index"
// import ElDivider from "element-ui/packages/divider/index"
import ElCheckbox from "element-ui/packages/checkbox/index"
import ElDialog from "element-ui/packages/dialog/index"
// import PhDagDefinitions from "./policy/definitions/definitions"

export default {
    data() {
        return {
            // add_icon: `${staticFilePath}` + "/icons/path/normal.svg",
            dialogVisible: false,
            dsName: '',
            selectStep: {},
            selectIndex: -1,
            options: [
                {
                    index: 0,
                    cat: false,
                    desc: "单步运行"
                },
                {
                    index: 1,
                    cat: true,
                    desc: "递归运行"
                }
            ],
            dsNameArr: [],
            confDataArr: [],
            stepIndexArr: [],
            dragging: null, //正在拖拽的 元素
            handleDragNewItemsDst: 0,
        }
    },
    props: {
        steps: Array,
        scenarioId: String,
        datasets: Array,
		sharedExportArr: Array
        // defs: {
        //     type: Object,
        //     default: function () {
        //         return new PhDagDefinitions("1");
        //     }
        // },
    },
    components: {
        ElButton,
        ElForm,
        ElFormItem,
        ElInput,
        // ElDivider,
        ElCheckbox,
        ElDialog
    },
    computed: {

    },
    mounted() {
        if (this.steps.length > 0) {
            this.selectStep = this.steps[0]
            this.selectIndex = 0
        }
    },
    watch: {

    },
    methods: {
		selectDS(data) {
			this.dialogVisible = true
			if (data === "final") {
				this.dsArr = this.sharedExportArr
			} else {
				this.dsArr = this.datasets
			}
		},
        selectedStep(item, index) {
            this.selectStep = item
            this.steps[index].name = this.selectStep.name
            item.name = this.steps[index].name
            this.steps[index].ds = this.selectStep.ds
            this.steps[index].confData = this.selectStep.confData
            this.steps[index].recursive = this.selectStep.recursive
            this.steps[index].ignoreError = this.selectStep.ignoreError
        },
        isConfEmpty() {
            if (this.selectStep.confData.length == 0) {
                return true
            } else {
                return false
            }
        },
        isJSON_test() {
            try {
                var obj = JSON.parse(this.selectStep.confData);
                if (Object.prototype.toString.call(obj) == '[object Object]' && obj) {
                    return false
                } else {
                    return true
                }
            } catch (e) {
                return true
            }
        },
        isAll() {
            if (!this.isConfEmpty() && !this.isJSON_test()) {
                return false
            } else {
                return true
            }
        },
        isDsEmpty() {
            if (this.selectStep.ds.length == 0) {
                return true
            } else {
                return false
            }
        },
        deleteStep(item, index) {
            item.deleted = true
            this.steps[index].deleted = true
        },
        deleteStepDatasetName() {
            if (this.selectStep) {
                this.selectStep.ds = ""
                this.edited = true
            } 
        },  
        changeDataset() {
            if (this.selectStep && this.dsName) {
                this.selectStep.ds = this.dsName
                this.selectStep.name = "ds_" + this.dsName
                this.selectStep.edited = true
            }
            this.dialogVisible = false
        },
        addNewStep() {
            const idx = this.steps.length > 0 ? 1 + Math.max(...this.steps.map(x => x.index)) : 0
            const result = {}
            const num = this.steps.length + 1
            result["recursive"] = false
            result["ignoreError"] = false
            result["type"] = "dataset"
            result["ds"] = ""
            result["mode"] = "dataset"
            result["name"] = "step" + num
            result["confData"] = ""
            result["scenarioId"] = this.scenarioId
            result["index"] = idx
            result["traceId"] = this.genId()
            result["edited"] = true
            result["deleted"] = false
            result["id"] = this.genId()
            this.steps.push(result)

        },
        genId(len = 16, radix = 16) {
            const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
            let uuid = [], i;
            radix = radix || chars.length;

            if (len) {
                // Compact form
                for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
            } else {
                // rfc4122, version 4 form
                var r;

                // rfc4122 requires these characters
                uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
                uuid[14] = '4';

                // Fill in random data.  At i==19 set the high bits of clock sequence as
                // per rfc4122, sec. 4.1.5
                for (i = 0; i < 36; i++) {
                    if (!uuid[i]) {
                        r = 0 | Math.random() * 16;
                        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
                    }
                }
            }

            return uuid.join('');
        },

        /** 拖拽 **/

        // 进行拖拽的元素
        handleDragStart(e, item) {
            this.dragging = item;
        },
        //首先把div变成可以放置的元素，即重写dragenter/dragover
        handleDragOver(e) {
            //在dragenter中针对放置目标来设置
            e.dataTransfer.dropEffect = 'move'
        },
        handleDragEnter(e, item) {
            // for (let index = 0; index < this.steps.length; ++index) {
            //     const item = this.steps[index]
            //     // item.expressions = JSON.stringify(item.callback.command.revert2Defs())
            // }
            //为需要移动的元素设置dragstart事件
            e.dataTransfer.effectAllowed = "move"
            if (item === this.dragging) {
                return
            }
            let newItems = [...this.steps]
            const src = newItems.indexOf(this.dragging) //被拖拽元素的index
            const dst = newItems.indexOf(item) //被挤开元素的index
            this.handleDragNewItemsDst = dst
            newItems.splice(dst, 0, ...newItems.splice(src, 1))
            this.steps = newItems
        },
        handleDragEnd() {
            let that = this
            //更改index流程
            this.steps.forEach((item, index) => {
                if (index >= that.handleDragNewItemsDst) {
                    if (index < 1) index = 1
                    item["index"] = parseFloat(that.steps[index - 1]["index"]) + 1
                }
            })
            this.dragging = null
        },
    }
}
</script>

<style lang="scss" scoped>
* {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}

.add_new_step {
    margin: 30px auto;
    width: 66.7%;
    height: 30px;
    background: #3b99fc;
    box-shadow: 1px 2px 4px 0px rgba(59, 153, 252, .5);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: #000000;
    // position: relative;
    // .add {
    //     height: 12px;
    //     transform: rotate(-90deg);
    //     position: absolute;
    //     right: 10px;
    // }
}

.select {
    background-color: #c4e0fe !important;
}

.stepEmpty {
    border: 1px solid red !important;
    // border-radius: 4px;
}

.el-textarea__inner {
    border: none;
}

.el-textarea {
    border: 1px solid #ccc;
    border-radius: 4px;
}

.scenario-steps-container {
    display: flex;
    flex-direction: row;
    height: calc(100vh - 90px);

    .select-pattern {
        width: 120px;
        height: 40px;
        border: 1px solid #dcdfe6;
    }

    .border-none {
        border: none;
    }

    .divider {
        height: auto;
    }

    .scenario-step-lst {
        display: flex;
        flex-direction: column;
        border-right: 1px solid #ccc;
        // flex-grow: 1;
        min-width: 200px;
        // max-width: 600px;
        width: 25vw;
        padding: 30px;

        ul {
            // flex-grow: 1;
            height: calc(100% - 25px);
            overflow: hidden;
            overflow-y: auto;
            padding: 10px;

            li {
                padding-left: 10px;
            }

            .el-icon-delete-solid {
                margin-right: 10px;
            }
        }

        li {
            display: flex;
            align-items: center;
            flex-direction: row;
            // border: 1px solid grey;
            margin-bottom: 10px;
            height: 40px;
            background-color: #fff;
        }
    }

    .scenario-step-detail {
        display: flex;
        justify-content: center;
        padding: 14px 36px;
        // align-items: center;
        flex-grow: 3;
        // max-width: 800px;

        .el-form {
            display: flex;
            flex-direction: column;
            background-color: #fff;
            padding: 14px 36px;
            width: 75%;
            height: 530px;
        }

        .el-form-item {
            margin-top: 20px;
        }

		.button_area {
			
			/deep/.el-form-item__content {
				display: flex;

				.add-ds {
					width: 120px;
					height: 30px;
					display: flex;
					align-items: center;
					justify-content: center;
					margin-right: 10px;
				}
			}
		}

        

        .scenario-step-ds-item {
            display: flex;
            flex-direction: row;
            border: 1px solid #dcdfe6;
            border-radius: 4px;
            height: 40px;
            position: absolute;

            span {
                flex-grow: 1;

                b {
                    padding-left: 10px;
                }
            }

            .el-icon-delete-solid {
                margin-right: 10px;
                width: 24px;
                height: 24px;
                position: relative;
                top: 8px;
                right: 0;
            }
        }

        .dsEmpty {
            font-size: 12px;
            color: red;
            position: relative;
            bottom: -29px;
            left: 0px;
        }

        .confEmpty {
            font-size: 12px;
            color: red;
            position: absolute;
            bottom: -30px;
            left: 0;
        }
    }
}
</style>
