<template>
    <div class="prepare">
        <link rel="stylesheet" href="https://components.hubadata.com/element-ui/element-ui.css">
        <div class="prepare_header">
            <div class="header_left">
                <img :src="defs.iconsByName('prepare')" alt="" />
                <span>compute_{{allData.outputs[0]}}</span>
            </div>
            <div class="header_right">
				<el-radio-group v-model="activeName" class="content">
					<el-radio-button label="Setting"></el-radio-button>
					<el-radio-button label="input/output"></el-radio-button>
				</el-radio-group>
                <button class="save" @click="save">保存</button>
            </div>
        </div>
        <div class="prepare_area" v-show="activeName === 'Setting'">
            <div class="prepare_area_left">
                <div class="tab_content">
                    <div class="no_operator" v-if="steps.data.length === 0">
                        当前脚本无算子
                    </div>
                    <div v-if="steps.data.length > 0" class="operator_area">
                        <div class="actions">
                            <div class="select_all">
                                <el-checkbox
                                    :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"></el-checkbox>
                                <img :src="defs.iconsByName('dropdown')" @click="showMultiSelectActionMenu = !showMultiSelectActionMenu" alt="" />
                                <div class="action_card" v-show="showMultiSelectActionMenu">
                                    <div class="action_item">删除</div>
                                </div>
                            </div>
                            <el-input
                                placeholder="搜索"
                                prefix-icon="el-icon-search"
                                v-model="searchKeyword">
                            </el-input>
                        </div>
                        <ul class="operator_item_area">
                            <li class="operator_item"
                                v-for="(item, index) in steps.data"
                                draggable="true"
                                @dragstart="handleDragStart($event, item)"
                                @dragover.prevent="handleDragOver($event, item)"
                                @dragenter="handleDragEnter($event, item)"
                                @dragend="handleDragEnd($event, item)"
                                :key="item.index + item['step-id'] +'operator'">
                                <bp-operator-card
                                    :key="index+'opreator'"
                                    :step="item"
                                    :schema="schema.schema"
                                    @delCardItem="delCardItem"
                                    :type="item['ctype']"/>
                            </li>
                        </ul>
                    </div>
                    <div class="opt-btn">
                        <el-button
                            class="add_new_step preview"
                            @click="previewExcel">
                            Apply for Preview
                        </el-button>
                        <el-button
                            class="add_new_step"
                            @click="showOpFactories">
                            <img :src="defs.iconsByName('add')" alt="" />
                            添加一个新算子
                        </el-button>
                    </div>
                </div>
            </div>
            <div class="prepare_area_right">
                <div class="main_container">
                    <bp-excel 
                        v-if="steps.isReady" 
                        ref="excel" 
                        viewHeight="calc(100vh - 300px)"
                        :isNeedPopmenu="false"
                        v-on:countIsReady="totalCountIsReady"
                        @countIsReady="totalCountIsReady"
                        :datasource="datasource" :schema="schema" class="excel" />
                </div>
            </div>
        </div>
		<div v-show="activeName === 'input/output'">
			<change-input-output
				ref="changeInputOutput"
				:inputs="inputs"	
				:outputs="outputs"
				:inArray="inArray"
				:outArray="outArray"
				@changScriptInputOutput="changScriptInputOutput"
				:datasetArray="datasetArray"
			/>
        </div>
        <op-factories ref="opFactories" class="op-factories" :visible="drawer" @newStep="newStep"/>
        <el-dialog
            title="数据样本配置"
            :visible.sync="sampleVisible"
            width="800px">
            <div>请先进行数据样本配置</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="sampleVisible = false">确认</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { hostName } from '../config/envConfig'
import ElButton from 'element-ui/packages/button/index'
import ElInput from 'element-ui/packages/input/index'
import PhStepDataSource from './model/stepDatasource'
import PhStepSchema from './model/stepSchema'
import PhStepModel from './model/stepsModel'
import bpExcel from '../../../vue-excelv2-component/src/components/ph-excel-container'
import bpOperatorCard from './bp-card-dispatch'
import ElCheckbox from 'element-ui/packages/checkbox/index'
import OpFactories from "./processors/factory"
import { PhInitialFOVStepDefs, step2SaveObj } from "./steps/commands/filter-on-value/defs"
import { PhInitialFONRStepDefs } from "./steps/commands/filter-on-numerical-range/defs"
import { PhInitialRVStepDefs } from "./steps/commands/replace-value/defs"
import { PhInitialFEWVEStepDefs } from "./steps/commands/fill-empty-with-value/defs"
import PhDagDefinitions from "./policy/definitions/definitions";
import ElDialog from 'element-ui/packages/dialog/src/component'

import ElRadioGroup from "element-ui/packages/radio-group/index"
import ElRadioButton from "element-ui/packages/radio-button/index"
import changeInputOutput from "./change-input-output"
import { Message } from 'element-ui'

export default {
    data() {
        return {
            drawer: false,
            projectId: "",
            projectName: "",
            flowVersion: "developer",
            jobName: "compute_q_out",
            debugToken: "8eade362b221e1f7c4da38e70cd432771c4d392791b5d9822656634c50b4a0d9",
            // ********* 上部功能区 *************
            showMultiSelectActionMenu: false,
            searchKeyword: "",
            checkAll: false,
            isIndeterminate: true,
            deleteStepsArray: [],
            uriMessage: null,
            dragging: null, //正在拖拽的 元素
            handleDragNewItemsDst: 0,
            sampleVisible: false,
            activeName: "Setting",
			inArray: [],
			outArray: [],
            jobShowName: "",
			outputs: [],
            inputs: [],
            datasetArray: []
        }
    },
    components: {
        ElButton,
        bpExcel,
        bpOperatorCard,
        ElCheckbox,
        ElInput,
        OpFactories,
        ElDialog,
        ElRadioGroup,
        ElRadioButton,
		changeInputOutput
    },
    props: {
        allData: {
            type: Object,
            default: function() {
                return {
                    projectId: "YZYijD17N9L6LXx",
                    projectName: "autorawdata2021",
                    datasetName: "wodeluTest_勿删",
                    datasetId: "549b3658122543003bdd84b97dfaf8af.xlsx"
                }
            }
        },
        datasource: {
            type: Object,
            default: function () {
                return new PhStepDataSource('1', this)
            }
        },
        schema: {
            type: Object,
            default: function () {
                return new PhStepSchema('1', this)
            }
        },
        steps: {
            type: Object,
            default: function() {
                return new PhStepModel('1', this.datasource, this.schema, this)
            }
        },
        defs: {
            type: Object,
            default: function () {
                return new PhDagDefinitions("1");
            }
        }
    },
    mounted() {
        this.projectId = this.getUrlParam("projectId")
        this.projectName = this.getUrlParam("projectName")
        this.jobName = this.getJobName()
        this.jobId = this.getUrlParam("jobId")
        this.steps.refreshData()
		this.datasource.refreshInOut(this.projectId, this.jobShowName)
		this.datasource.refreshDataset(this.projectId)
    },
	watch: {
        activeName(n) {
            this.$emit("active", n)
        },
        "allData.inputs": function(n) {
            this.inputs = n
        },
		"allData.outputs": function(n) {
            this.outputs = n
		}
	},
    methods: {
        previewExcel () {
            this.save("preview")
            // this.steps.refreshData()
        },
        getJobName() {
            let jobShowName = this.getUrlParam("jobShowName") ? this.getUrlParam("jobShowName") : this.getUrlParam("jobName")
			this.jobShowName = jobShowName
            return [this.projectName, this.projectName, this.flowVersion, jobShowName].join("_")
        },
        getUrlParam(value) {
            let href = window.location.href
            let paramArr = href.split("?")[1].split("&")
            let data = paramArr.find(item => item.indexOf(value) > -1)
            return data ? decodeURI(data).split("=")[1] : undefined
        },
        delCardItem(datas) {
            let model = datas.args.param.data
            this.deleteStepsArray.push(model)
            this.steps.store.destroy(model)
            this.steps.data = this.steps.store.findAll("steps")
        },
        showOpFactories() {
            this.drawer = true
            this.$refs.opFactories.visibleSync = true
        },
        getCookie(name) {
            let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)")
            arr = document.cookie.match(reg)
            if (arr) return (arr[2])
            else return null
        },

        /** 拖拽 **/

        // 进行拖拽的元素
        handleDragStart(e,item){
            this.dragging = item;
        },
        handleDragEnter(e,item){
            for (let index = 0; index < this.steps.data.length; ++index) {
                const item = this.steps.data[index]
                item.expressions = JSON.stringify(item.callback.command.revert2Defs())
            }
            //为需要移动的元素设置dragstart事件
            e.dataTransfer.effectAllowed = "move"
            if(item === this.dragging) {
                return
            }
            let newItems = [...this.steps.data]
            const src = newItems.indexOf(this.dragging) //被拖拽元素的index
            const dst = newItems.indexOf(item) //被挤开元素的index
            this.handleDragNewItemsDst = dst
            newItems.splice(dst, 0, ...newItems.splice(src, 1))
            this.steps.data = newItems

        },
        //首先把div变成可以放置的元素，即重写dragenter/dragover
        handleDragOver(e) {
            //在dragenter中针对放置目标来设置
            e.dataTransfer.dropEffect = 'move'
        },
        handleDragEnd(){
        // handleDragEnd(e, item){
            let that = this
            //更改index流程
            this.steps.data.forEach((item, index) => {
                if(index >= that.handleDragNewItemsDst) {
                    if(index < 1) index = 1
                    item["index"] = parseFloat(that.steps.data[index - 1]["index"]) + 1
                }
            })
            this.dragging = null
        },
        /** 拖拽 **/

        // handleCheckAllChange(val) {
        handleCheckAllChange() {
            // this.checkedCities = val ? cityOptions : [];
            this.isIndeterminate = false;
        },
        totalCountIsReady(val) {
            this.totalNum = val
        },
        async deleteStep(ele) {
            const body = {
                table: "step",
                conditions: {
                    pjName: ele["pj-name"],
                    stepId: ele["step-id"]
                }
            }

            const url = `${hostName}/hbdydatasource/delete_item`
            let headers = {
                Authorization: this.getCookie("access_token") || this.debugToken,
                "Content-Type": "application/vnd.api+json",
                Accept: "application/vnd.api+json"
            }
            let options = {
                method: "POST",
                headers: headers,
                body: JSON.stringify(body)
            }
            const result = await fetch(url, options)
            return result.status === 200
        },
        async save(type) {
			if (this.activeName === "Setting") {
               //删除算子
				for (let idx = 0; idx< this.deleteStepsArray.length; ++idx) {
					// await this.deleteStepsArray[idx].delete(this)
					await this.deleteStep(this.deleteStepsArray[idx])
				}
				// 保存算子
				let itemArr = []
				let expressionsArr = []
				for (let index = 0; index < this.steps.data.length; ++index) {
					const item = this.steps.data[index]
					item.expressions = item.callback.command.revert2Defs()
					expressionsArr.push(item.expressions)
					itemArr.push(step2SaveObj(item))
				}
				itemArr = itemArr.sort((l, r) => l["index"] - r["index"])

				// 保存脚本
				const event = new Event("event")
				event.args = {
					callback: "prepare",
					element: this,
					param: {
						name: "prepare",
						projectId: this.projectId,
						projectName: this.projectName,
						itemArr: expressionsArr,
						stepsArr: itemArr,
						message: this.allData.message,
						type: type
					}
				}
				this.$emit('event', event)
            } else {
				this.$refs.changeInputOutput.save()
            }
        },
		changScriptInputOutput(data) {
			let inputNameOld = this.allData.inputs[0]
			let inputCatOld = this.datasetArray.filter(it => it.name === inputNameOld)[0]["cat"]
			let inputNameNew = data.args.param.inputsArray[0]
			let inputCatNew = this.datasetArray.filter(it => it.name === inputNameNew)[0]["cat"]
			let dssInputs = {
				old: [{
					name: inputNameOld,
					cat: inputCatOld
				}],
				new: [{
					name: inputNameNew,
					cat: inputCatNew
				}]
			}
			let outputNameOld = this.allData.outputs[0]
			let outputCatOld = this.datasetArray.filter(it => it.name === outputNameOld)[0]["cat"]
			let outputNameNew = data.args.param.outputsArray[0]
			let outputCatNew = this.datasetArray.filter(it => it.name === outputNameNew)[0]["cat"]
			
			let dssOutputs = {
				old: {
					name: outputNameOld,
					cat: outputCatOld
				},
				new: {
					name: outputNameNew,
					cat: outputCatNew
				}
			}

			let script = {
				old: {
					name: this.allData.jobName,
					id: this.jobId
				},
				new: {
					"name": `compute_${outputNameNew}`,
					"runtime": "prepare",
					"inputs": JSON.stringify(data.args.param.inputsArray),
					"output": outputNameNew
				}
			}

			if (inputNameNew === outputNameNew) {
				Message.error("input和output不能相同", { duration: 3000} )
				return false
			}
			
			const event = new Event("event")
			event.args = {
				callback: "changScriptInputOutput",
				element: this,
				param: {
					name: "changScriptInputOutput",
					projectId: this.projectId,
					projectName: this.projectName,
					dssOutputs: dssOutputs,
					dssInputs: dssInputs,
					script: script
				}
			}
			this.$emit('event', event)
		},
        // 新建算子
        newStep(stepType) {
            let indexNum = this.steps.data.length > 0 ? Math.max(...this.steps.data.map(x => x.index)) + 1 : 1
            let ns = null
            switch (stepType) {
            case "FilterOnValue":
                ns = Object.assign({}, PhInitialFOVStepDefs)
                break
            case "FilterOnNumericalRange":
                ns = Object.assign({}, PhInitialFONRStepDefs)
                break
            case "ReplaceValue":
                ns = Object.assign({}, PhInitialRVStepDefs)
                break
            case "FillEmptyWithValue":
                ns = Object.assign({}, PhInitialFEWVEStepDefs)
                break
            default:
                alert("step type is not implemented")
                break
            }
            ns["attributes"].index = indexNum
            ns["attributes"]["pj-name"] = [this.projectId, this.jobName].join("_")
            ns["attributes"]["step-id"] = (ns["attributes"].index).toString()
            ns["id"] = ns["attributes"][["pj-name"]] + ns["attributes"]["step-id"]
            this.steps.store.syncRecord(ns)
            this.steps.data = this.steps.store.findAll("steps")
            this.drawer = false
        }
    }
}
</script>
<style lang="scss">
    @font-face {
        font-family: element-icons;
        src: url(https://components.hubadata.com/element-ui/element-icons.woff) format("woff"),url(https://components.hubadata.com/element-ui/element-icons.woff) format("truetype");
        font-weight: 400;
        font-display: "auto";
        font-style: normal
    }
    .el-dialog__wrapper {
        background: rgba(0, 0, 0, 0.31);
    }
    .prepare {
        box-sizing: border-box;
        .prepare_header {
            height: 48px;
            padding: 0 15px;
            border-bottom: 1px solid #cccccc;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .header_left {
                display: flex;
                align-items: center;
                img {
                    width: 30px;
                    height: 30px;
                    margin-right: 10px;
                }
                span {
                    font-size: 20px;
                    color: #000000;
                    letter-spacing: 0.21px;
                    font-weight: 600;
                }
            }
            .header_right {
                button {
                    width: 65px;
                    height: 26px;
                    border: 1px solid #57565F;
                    border-radius: 2px;
                    background: none;
                    cursor: pointer;
                }
				.content {
                    margin-right: 30px;
                }
            }
        }
        .prepare_tab {
            height: 35px;
            border-bottom: 1px solid #cccccc;
            padding: 0 20px;
            display: flex;
            align-items: center;
            .tab {
                padding: 0 15px;
                cursor: pointer;
                font-size: 14px;
                color: #000000;
                letter-spacing: 0.15px;
                font-weight: 400;
            }
        }
        .prepare_area {
            display: flex;
            position: absolute !important;
            top: 88px;
            bottom: 0;
            left: 0;
            right: 0;
            .prepare_area_left {
                width: 300px;
                min-width: 300px;
                height: 100%;
                border-right: 1px solid #cccccc;
                display: flex;
                flex-direction: column;
                font-size: 14px;
                color: #000000;
                .left_title {
                    display: flex;
                    align-items: center;
                    padding-left: 50px;
                    border-bottom: 1px solid #ccc;
                }
                .tab_content {
                    padding: 0;
                    overflow: auto;
                    margin: 0;
                    flex: 1 1 0;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    .no_operator {
                        padding: 30px 0;
                    }
                    .operator_area {
                        display: flex;
                        align-items: center;
                        flex-direction: column;
                        width: 100%;
                        .actions {
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            width: 100%;
                            padding: 4px;
                            border-bottom: 1px solid #ccc;
                            .select_all {
                                display: flex;
                                align-items: center;
                                border: 1px solid #ccc;
                                height: 40px;
                                padding: 4px;
                                img {
                                    cursor: pointer;
                                }
                                .action_card {
                                    position: absolute;
                                    top: 36px;
                                    left: 26px;
                                    border: 1px solid #ccc;
                                    width: 100px;
                                    z-index: 2;
                                    background: #fff;
                                    padding: 10px;
                                    cursor: pointer;
                                }
                            }
                            /deep/.el-input {
                                height: 24px;
                                width: 240px;
                            }
                            /deep/.el-input__inner {
                                height: 24px;
                                display: flex;
                                align-items: center;
                            }
                            /deep/.el-input__icon {
                                line-height: 24px;
                            }
                        }
                        .operator_item_area {
                            overflow: auto;
                            height: calc(100vh - 330px);
                            width: 100%;
                            padding: 0;
                        }
                        .operator_item {
                            width: 100%;
                            display: flex;
                            flex-direction: column;
                            overflow: auto;
                            background: white;
                            .card {
                                border: 1px solid #ddd;
                            }
                        }
                    }
                    .opt-btn {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        // padding-top: 30px;
                        .add_new_step {
                            margin: 10px 0;
                            width: 216px;
                            height: 25px;
                            background: #F8D634;
                            box-shadow: 1px 2px 4px 0px rgba(0,0,0,0.5);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 12px;
                            color: #000000;
                        }
                        .preview {
                            background: #32C5FF;
                        }
                    }
                }
            }
            .prepare_area_right {
                padding: 20px;
                // width: calc(100vw - 300px);
                .main_container {
                    display: flex;
                    justify-content: center;
                    .excel {
                        display: inline-grid;
                        margin: 10px;
                        overflow: auto;
                        width: 98%;
                    }
                }
            }
        }
    }
</style>

