<template>
    <div>
        <link rel="stylesheet" href="https://components.hubadata.com/element-ui/element-ui.css">
        <div class="scenario">
            <scenario-nav :scenario="datasource.scenario" :activeTrue="activeIsTrue" @active="activeChange"
                @save="saveAll" @trigger="trigger"></scenario-nav>
            <div class="scenario-container" v-show="activeName === 'Setting'">
                <!-- <div class="scenario-container" v-if="activeName === ''">  -->
                <detail-form :scenario="datasource.scenario"></detail-form>
                <trigger-lst :triggers="triggerDisplay" :datasetsAll="datasetsAllDisplay"
                    @isTriggerTrue="getTriggerTrue" :scenario-id="datasource.scenario.id" />
                <report-lst :reports="reportDisplay" @isTrue="getTrue" :scenario-id="datasource.scenario.id" />
            </div>
            <div v-show="activeName === 'Steps'" class="scenario-container">
                <scenario-steps :steps="stepDisplay" 
					:sharedExportArr="sharedExportArr"
					:datasets="datasetsDisplay"
                    :scenario-id="datasource.scenario.id" />
                <!-- @isStepTrue="getSteptrue" -->
            </div>
			<div v-show="activeName === '脚本参数'">
				<script-parameters 
					:scriptParamsData="datasource.scenarioParams"
					ref="scriptparameters"></script-parameters>
			</div>
            <div v-show="activeName === '历史记录'">
				<scenario-history
                    :history="arr"
                    :hasMore="datasource.hasMore" 
                    :detailList="getFirstDetail" 
                    :scenarioExecution="datasource.scenarioExecution"
                    :scenarioStep="scenarioStep"
                    @getHistory="getHistory"
                    @getExecution="getExecution"
                    @getScenarioJob="getScenarioJob"></scenario-history>
			</div>
        </div>
		<el-dialog title="输入参数" :visible.sync="dialogVisible" width="30%">
			<el-input 
				type="textarea" 
				:rows="4" 
				placeholder="请输入参数" 
				:class="isAll() ? 'error-border' : ''"
				v-model="codeFreeParams"></el-input>
			<span v-show="isAll()" class="error-msg">请输入正确参数!</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false" style="padding: 10px;">Cancel</el-button>
                <el-button type="primary" @click="triggerConfirm" style="padding: 10px;">Confirm</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import DetailForm from "./detail-form"
import ScenarioNav from "./scenario-nav"
import TriggerLst from "./trigger-list"
import ReportLst from "./report-lst"
import ScenarioSteps from "./scenario-steps"
import TriggerPolicy from "./policy/trigger-policy"
import ReportPolicy from "./policy/report-policy"
import StepPolicy from "./policy/step-policy"
import datasource from "./model/datasource"
import scriptParameters from "./script-parameters"
import ScenarioHistory from "./scenario-history"
import ElDialog from "element-ui/packages/dialog/index"
import ElButton from "element-ui/packages/button/index"
import ElInput from "element-ui/packages/input/index"
import { Message } from 'element-ui'

export default {
    data() {
        return {
            activeName: "Setting",
            triggerDisplay: [],
            stepDisplay: [],
			datasetsDisplay: [],
            datasetsAllDisplay: [],
            reportDisplay: [],
            isTrue: true,
            isTriggerTrue: true,
            isStepTrue: false,
            activeIsTrue: {active: false},
			dialogVisible: false,
			codeFreeParams: JSON.stringify({
				"CodeFree": {}
			}),
            getFirstDetail: {},
            arr: [],
            scenarioJob: [],
			sharedExportArr: [],
            scenarioStep: []
        }
    },
    props: {
        datasource: {
            type: Object,
            default: () => {
                return new datasource('1')
            }
        },
        triggerPolicy: {
            type: Object,
            default: () => {
                return new TriggerPolicy('1')
            }
        },
        reportPolicy: {
            type: Object,
            default: () => {
                return new ReportPolicy('1')
            }
        },
        stepPolicy: {
            type: Object,
            default: () => {
                return new StepPolicy('1')
            }
        },
		allData: {
            type: Object,
            default: () => {
                return {
                    projectName: "",
                    projectId: ""
                }
            }
        }
    },
    components: {
        DetailForm,
        ScenarioNav,
        TriggerLst,
        ReportLst,
        ScenarioSteps,
		scriptParameters,
        ScenarioHistory,
        ElDialog,
		ElButton,
		ElInput
    },
    computed: {

    },
    mounted() {
		this.datasource.projectId = this.getUrlParam("projectId")
		this.datasource.scenarioId = this.getUrlParam("scenarioId")
		this.datasource.scenarioName = this.getUrlParam("scenarioName")
        this.datasource.model()
        this.datasource.refreshHistory(this.datasource.projectId, ()=>{
            this.arr = this.datasource.history
            if(this.datasource.history.length >= 1){
                this.getFirstDetail = this.datasource.history[0]
                this.datasource.refreshScenarioExecution(this.getFirstDetail['trace-id'])
            }
        })
    },
    watch: {
        "datasource.triggers": function() {
            this.triggerAdapter()
        },
        "datasource.reports": function() {
            this.reportAdapter()
        },
        "datasource.steps": function() {
            this.stepAdapter()
        },
		"datasource.datasets": function() {
			this.datasetsAdapter()
		},
        "datasource.datasetsAll": function() {
			this.datasetsAllAdapter()
		},
        scenarioStep: {
			handler(newValue) {
                this.scenarioStep = newValue
            },
            deep: true
		},
        activeIsTrue:{
            handler(newValue){
                this.activeIsTrue.active = newValue.active
            },
            deep:true
        }
    },
    methods: {
        sortBy(){
            return function(a,b){
                // a-b 升序排列，b-a 降序排列
                return b.date - a.date
            }
        },
        getScenarioJob(runnerId,index){
            this.datasource.refreshScenarioJob(runnerId, ()=>{
                // this.datasource.scenarioJob.sortBy("['start-at']")
                this.scenarioStep[index].scenarioJob = this.datasource.scenarioJob
            })
        },
        getExecution(value){
            this.datasource.refreshScenarioExecution(value, ()=>{
                if (this.datasource.scenarioExecution.length >= 1) {
                    this.scenarioStep = []
                    this.datasource.scenarioExecution.forEach(item => {
                        this.datasource.refreshScenarioStep(item['scenario-id'], item['step-id'],()=>{
                            this.scenarioStep = this.scenarioStep.concat(this.datasource.scenarioStep)
                            this.scenarioStep.sortBy()
                            this.datasource.scenarioExecution.forEach(item => {
                                this.scenarioStep.forEach(iter => {
                                    if (item['step-id'] === iter.id) {
                                        iter.runtime = item.runtime
                                        iter['runner-id'] = item['runner-id']
                                        iter.date = item.date
                                    }
                                })
                            })
                        })
                    }) 
                } else {
                    this.scenarioStep = []
                }
            })
        },
        getHistory(){
            this.datasource.refreshHistory(this.datasource.projectId, ()=>{
                this.arr = this.arr.concat(this.datasource.history)
            })
        },
        getTriggerTrue(value){
            if (value.length == 0) {
                this.isTriggerTrue = true
            } else {
                if (value.every(item => item == false)) {
                    this.isTriggerTrue = true
                } else {
                    this.isTriggerTrue = false
                }
            }
        },
        getTrue(value){
            if (value.length == 0) {
                this.isTrue = true
            } else {
                if (value.every(item => item == false)) {
                    this.isTrue = true
                } else {
                    this.isTrue = false
                }
            }
        },
        getUrlParam( value) {
            let href = window.location.href
            let paramArr = href.split("?")[1].split("&")
            let data = paramArr.find(item => item.indexOf(value) > -1)
            return data ? decodeURI(data).split("=")[1] : undefined
        },
		isConfEmpty() {
            if (this.codeFreeParams.length == 0) {
                return true
            } else {
                return false
            }
        },
        isAll() {
            if (!this.isConfEmpty() && !this.isJSON_codeFreeParams()) {
                return false
            } else {
                return true
            }
        },
		isJSON_codeFreeParams() {
            try {
                var obj = JSON.parse(this.codeFreeParams);
                if (Object.prototype.toString.call(obj) == '[object Object]' && obj) {
                    return false
                } else {
                    return true
                }
            } catch (e) {
                return true
            }
        },
        isJSON_test(value) {
            try {
                var obj = JSON.parse(value);
                if (Object.prototype.toString.call(obj) == '[object Object]' && obj) {
                    return false
                } else {
                    return true
                }
            } catch (e) {
                return true
            }
        },
        forStepArray(array) {
            if (array.length == 0) {
                return true
            } else {
                let value = array.every(item => {
                    if (item.detail.name !== "" && item.confData !== "" && !this.isJSON_test(item.confData)) {
                        return true
                    } else {
                        return false
                    }
                })
                return value
            }
        },
        activeChange(n) {
            if (n == 'Steps') { //跳转steps
                if (this.isTrue && this.isTriggerTrue) {
                    this.activeName = n
                    this.activeIsTrue.active  = true
                } else {
                    Message({
                        type: 'error',
                        showClose: true,
                        duration: 3000,
                        message: '请输入正确的setting参数！'
                    })
                    this.activeName = "Setting"
                    this.activeIsTrue.active  = false
                }
            } else {
                let stepDisplay = this.stepPolicy.dealStepDisplay(this.stepDisplay.filter(it => !it.deleted))
                if (this.forStepArray(stepDisplay)) {
                    this.activeName = n
                    this.activeIsTrue.active = true
                } else {
                    Message({
                        type: 'error',
                        showClose: true,
                        duration: 3000,
                        message: '请修改step参数！'
                    })
                    this.activeName = "Steps"
                    this.activeIsTrue.active = false
                }
            }
        },
		datasetsAdapter() {
			this.datasetsDisplay = this.datasource.datasets.map(x => x)
			this.sharedExportArr = this.datasource.sharedExportArr.map(x => x)
		},
        datasetsAllAdapter() {
			this.datasetsAllDisplay = this.datasource.datasetsAll.map(x => x)
		},
        stepAdapter() {
            this.stepDisplay = this.datasource.steps.map((x) => {
                const result = {}
                const tmp = JSON.parse(x["detail"])
                result["recursive"] = tmp["recursive"]
                result["ignoreError"] = tmp["ignore-error"]
                result["type"] = tmp["type"]
                result["ds"] = tmp["name"]
                result["mode"] = x["mode"]
                result["name"] = x["name"]
                result["scenarioId"] = x["scenario-id"]
                result["id"] = x["id"]
                result["index"] = x["index"]
                result["traceId"] = x["trace-id"]
                result["confData"] = x["conf-data"]
                result["edited"] = false
                result["deleted"] = false
                return result
            })
        },
        triggerAdapter() {
            this.triggerDisplay = this.datasource.triggers.map((x) => {
                const result = {}
                const tmp = JSON.parse(x["detail"])
                if(x.mode == 'timer'){
                    result["start"] = tmp["start"]
                    result["period"] = tmp["period"]
                    result["value"] = tmp["value"]
                    result["timezone"] = tmp["timezone"]
                    result["mode"] = x["mode"]
                    result["name"] = x["name"]
                    result["active"] = x["active"]
                    result["scenarioId"] = x["scenario-id"]
                    result["id"] = x["id"]
                    result["index"] = x["index"]
                    result["resourceArn"] = x["resource-arn"]
                    result["traceId"] = x["trace-id"]
                    result["edited"] = false
                    result["deleted"] = false
                }else if(x.mode == 'dataset'){
                    result["dsNames"] = tmp["dsNames"].map(it => {
						return { "name": it }
					})
                    result["mode"] = x["mode"]
                    result["name"] = x["name"]
                    result["active"] = x["active"]
                    result["scenarioId"] = x["scenario-id"]
                    result["id"] = x["id"]
                    result["index"] = x["index"]
                    result["resourceArn"] = x["resource-arn"]
                    result["traceId"] = x["trace-id"]
                    result["edited"] = false
                    result["deleted"] = false
                }
                return result
            })
        },
        reportAdapter() {
            this.reportDisplay = this.datasource.reports.map((x) => {
                const result = {}
                const tmp = JSON.parse(x["detail"])
                result["destination"] = tmp["destination"]
                result["type"] = tmp["type"]
                result["mode"] = x["mode"]
                result["name"] = x["name"]
                result["active"] = x["active"]
                result["index"] = x["index"]
                result["scenarioId"] = x["scenario-id"]
                result["id"] = x["id"]
                result["traceId"] = x["trace-id"]
                result["edited"] = false
                result["deleted"] = false
                return result
            })
        },
		trigger() {
			this.dialogVisible = true
		},
		triggerConfirm() {
			if (!this.isAll()) {
				this.saveAll("trigger")
				this.dialogVisible = false
			} else {
				Message({
					type: 'error',
					showClose: true,
					duration: 3000,
					message: '请输入正确的参数！'
				})
				this.dialogVisible = true
			}
		},
        forArray(array){
            for (let i = 0; i < array.length; i++) {
                array[i].index = i
            }
            return array
        },
        saveAll(type) {
            let result = true
            let stepDisplay = []
            let triggerDisplay = []
            let reportDisplay = []
            triggerDisplay = this.triggerPolicy.dealTriggerDisplay(this.triggerDisplay.filter(it => !it.deleted))
            reportDisplay = this.reportPolicy.dealReportDisplay(this.reportDisplay.filter(it => !it.deleted))
            stepDisplay = this.stepPolicy.dealStepDisplay(this.stepDisplay.filter(it => !it.deleted))
            stepDisplay = this.forArray(stepDisplay)
            let value = this.forStepArray(stepDisplay)
            if (this.isTrue && this.isTriggerTrue) {
                if (value) {
                    const event = new Event("event")
                    event.args = {
                        callback: "saveScenario",
                        element: this,
                        param: {
                            name: "saveScenario",
                            projectName: this.allData.projectName,
                            projectId: this.allData.projectId,
                            scenarioName: this.datasource.scenarioName,
                            scenarioId: this.datasource.scenarioId,
                            active: this.datasource.scenario.active,
                            triggerDisplay: triggerDisplay,
                            stepDisplay: stepDisplay,
                            reportDisplay: reportDisplay,
                            type: type,
							args: JSON.stringify(this.$refs.scriptparameters.scriptParamsList),
							codeFree: JSON.parse(this.codeFreeParams).CodeFree
                        }
                    }
					console.log(event)
                    this.$emit('event', event)
                    return result
                } else {
                    Message({
                        type: 'error',
                        showClose: true,
                        duration: 3000,
                        message: '请修改step参数！'
                    })
                }
            } else {
                Message({
                    type: 'error',
                    showClose: true,
                    duration: 3000,
                    message: '请输入正确的setting参数！'
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
    }

	.error-border {
		border: 1px solid red !important;
	}

	.error-msg {
		color: red;
	}

    .scenario {
        display: flex;
        flex-direction: column;
		height: calc(100vh - 40px);
    }

    .scenario-container {
        display: flex;
        flex-direction: column;
        overflow: auto;
        flex-grow: 1;
        background-color: #f2f2f2;
        padding-top: 10px;
    }
</style>
