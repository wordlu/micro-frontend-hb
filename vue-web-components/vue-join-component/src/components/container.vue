<template>
    <div class="join">
        <link rel="stylesheet" href="https://components.hubadata.com/element-ui/element-ui.css">
        <div class="join_header">
            <div class="header_left">
                <img :src="defs.iconsByName('join')" alt="" />
                <span class="title">{{jobShowName}}</span>
				<span class="link-to" @click="linkToVideos">视频教程</span>
            </div>
            <div class="header_right">
                <el-radio-group v-model="activeName" class="content">
                    <el-radio-button label="Setting"></el-radio-button>
					<el-radio-button label="脚本参数"></el-radio-button>
                    <el-radio-button label="input/output"></el-radio-button>
                </el-radio-group>
                <el-button class="save" @click="savePopup = true">保存</el-button>
				<!-- <el-button v-tooltip="abc">111</el-button> -->
            </div>
        </div>
        <div class="join_area" v-show="activeName === 'Setting'">
            <div class="join_left">
                <el-steps direction="vertical" :active="active" align-center >
                    <el-step v-for="(item, index) in stepsDefs" :key="index" :status="item.status">
                        <template slot="title">
                            <el-button type="text" @click="active = item.index" >{{item.title}}</el-button>
                        </template>
                    </el-step>
                </el-steps>
            </div>
            <div class="join_right" v-if="datasource.isReady && datasource.isMetaReady">
                <pre-filter v-show="active === 1"
                    ref="prefilter"
                    :step="datasource.step"
                    :datasetArray="datasetArray"
                    :schema="datasource.schema"
					@addDataset="addDataset"
					@delDataset="delDataset"
                    @statusChange="preFilterStatus" />
                <pre-computed v-show="active === 2"
                    ref="percomputed"
                    :step="datasource.step"
                    :schema="datasource.schema"
					@addDataset="addDataset"
					@delDataset="delDataset"
                    @statusChange="preComputedStatus" />
                <join 
					v-show="active === 3"
                    ref="join"
                    :datasetArray="datasetArray"
                    :step="datasource.step"
                    :schema="datasource.schema"
					@addDatasetFromJoin="addDatasetFromJoin"
					@delDatasetFromJoin="delDatasetFromJoin"
                    @statusChange="joinStatus" />
                <select-cols v-show="active === 4"
                    ref="select"
                    :step="datasource.step"
                    :schema="computedColumns"
                    @statusChange="selectStatus" />
                <post-computed v-show="active === 5"
                    ref="postcomputed"
                    :step="datasource.step"
                    :schema="computedSchema"
                    @statusChange="postComputedStatus" />
                <post-filter v-show="active === 6"
                    ref="postfilter"
                    :step="datasource.step"
                    :schema="computedSchema"
                    @statusChange="postFilterStatus" />
                <outputs v-show="active === 7"
                    ref="outputs"
                    :schema="computedSchema"
                    @statusChange="outputsStatus" />
            </div>
            <div v-if="datasource.hasNoSchema">
                Schema 不对，找产品处理
            </div>
        </div>
		<div v-show="activeName === '脚本参数'">
            <script-parameters
                ref="scriptParameters"
                @changeScriptParams="changeScriptParams"
                :scriptParamsData="datasource.scriptParamsData"
            />
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
		<el-dialog
            title="保存"
            :visible.sync="savePopup"
            width="400px">
            <div class="content">
                保存当前页面参数！
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary"  @click="save(0)">保存不跳转</el-button>
                <el-button type="primary"  @click="save(1)">保存并跳转</el-button>
            </span>
        </el-dialog>
        <div id="loadingio-spinner-double-ring-ho1zizxmctu" v-show="loading">
            <div class="ldio-400lpppmiue">
                <div></div>
                <div></div>
                <div>
                    <div></div>
                </div>
                <div>
                    <div></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import PhDagDefinitions from './policy/definitions/definitions'
import ElSteps from 'element-ui/packages/steps/index'
import ElStep from 'element-ui/packages/step/index'
import ElButton from 'element-ui/packages/button/index'
import PhDataSource from './model/datasource'
import PreFilter from './steps/commands/pre-filter/preFilterView'
import PreComputed from './steps/commands/pre-join-computed/preJoinComputedView'
import Join from './steps/commands/join/joinView'
import SelectCols from './steps/commands/select-cols/selectColsView'
import PostComputed from './steps/commands/post-join-computed/postJoinComputedView'
import PostFilter from './steps/commands/post-filter/postFilterView'
import Outputs from './steps/commands/output/outputView'
import ElRadioGroup from "element-ui/packages/radio-group/index"
import ElRadioButton from "element-ui/packages/radio-button/index"
import changeInputOutput from "./change-input-output"
import { Message } from 'element-ui'
import scriptParameters from "./script-parameters"
import ElDialog from 'element-ui/packages/dialog/src/component'
import Vue from 'vue'
import VTooltip from 'v-tooltip'

Vue.use(VTooltip)

export default {
    components: {
        ElSteps,
        ElStep,
        ElButton,
        PreFilter,
        PreComputed,
        Join,
        SelectCols,
        PostComputed,
        PostFilter,
        Outputs,
        ElRadioGroup,
        ElRadioButton,
        changeInputOutput,
        scriptParameters,
        ElDialog
    },
    data() {
        return {
			abc: "wqeawsda",
            computedSchema: [],
            active: 3,
            flowVersion: "developer",
            stepsDefs: [
                {
                    title: "Pre-Filter",
                    index: 1,
                    status: "wait"  // wait / process / finish / error / success
                },
                {
                    title: "Pre-join Computed Columns",
                    index: 2,
                    status: "wait"  // wait / process / finish / error / success
                },
                {
                    title: "Join",
                    index: 3,
                    status: "wait"  // wait / process / finish / error / success
                },
                {
                    title: "Select Columns",
                    index: 4,
                    status: "wait"  // wait / process / finish / error / success
                },
                {
                    title: "Post-join Computed Columns",
                    index: 5,
                    status: "wait"  // wait / process / finish / error / success
                },
                {
                    title: "Post Filter",
                    index: 6,
                    status: "wait"  // wait / process / finish / error / success
                },
                {
                    title: "Outputs",
                    index: 7,
                    status: "wait"  // wait / process / finish / error / success
                }
            ],
            activeName: "Setting",
            inArray: [],
            outArray: [],
            jobShowName: "",
            outputs: [],
            inputs: [],
            datasetArray: [],
			changeDs: false,
            savePopup: false,
            transition: 0,
            loading: false,
			computedColumns: {}
        }
    },
    props: {
        allData: {
            type: Object,
            default: function() {
                return { }
            }
        },
        defs: {
            type: Object,
            default: function() {
                return new PhDagDefinitions(1)
            }
        },
        datasource: {
            type: Object,
            default: function() {
                return new PhDataSource(1, this)
            }
        }
    },
    methods: {
		linkToVideos() {
			window.open("https://www.bilibili.com/video/BV1gG411p729")
		},
		changeScriptParams(data) {
            this.datasource.saveScriptParams(data, this)
        },
		saveSetting() {
			this.$refs.prefilter.validate()
			this.$refs.percomputed.validate()
			this.$refs.join.validate()
			this.$refs.select.validate()
			this.$refs.postcomputed.validate()
			this.$refs.postfilter.validate()
			this.$refs.outputs.validate()

			let errors = this.stepsDefs.filter(it => it.status === "error")
			if(errors.length > 0) {
				Message.error("请修改参数！", { duration: 3000} )
				this.loading = false
				return false
			}

			if (this.changeDs) {
				this.resetInputs()
			}
			const params = {
				"preFilters": this.$refs.prefilter.datasource.revert2Defs(),
				"preJoinComputedColumns": this.$refs.percomputed.datasource.revert2Defs(),
				"joins": this.$refs.join.datasource.revert2Defs(),
				"selectedColumns": this.$refs.select.datasource.revert2Defs(),
				"postJoinComputedColumns": this.$refs.postcomputed.datasource.revert2Defs(),
				"postFilter": this.$refs.postfilter.datasource.revert2Defs()
			}
			this.datasource.saveAndGenCode( params, this)
		},
		addDatasetFromJoin(data) {
			this.changeDs = true
			const event = data.args.param
			let ns = Object.keys(this.datasource.schema).includes(event.newData.name)
			let os = Object.keys(this.datasource.schema).includes(event.oldData.name)
			if (!os) {
				let obj = this.datasetArray.filter(it => it.name === event.oldData.name)[0]
				this.datasource.schema[event.oldData.name] = JSON.parse(obj["schema"])
			} else if (!ns) {
				let obj = this.datasetArray.filter(it => it.name === event.newData.name)[0]
				this.datasource.schema[event.newData.name] = JSON.parse(obj["schema"])
			}

			this.$refs.prefilter.updateData(event.newData, event.oldData, event.unreset)
			this.$refs.percomputed.updateData(event.newData, event.oldData, event.unreset)
			this.$refs.select.updateData(event.newData, event.oldData, event.unreset)
		},
		delDatasetFromJoin(data) {
			this.changeDs = true
			const event = data.args.param
			this.$refs.prefilter.deleteData(event.datasets, event.dsIdxArr)
			this.$refs.percomputed.deleteData(event.datasets, event.dsIdxArr)
			this.$refs.select.deleteData(event.datasets, event.dsIdxArr)
		},
		addDataset(name, index) {
			this.changeDs = true
			this.active = 3
			if (name) {
				this.$refs.join.addDataset(name, index)
			} else {
				this.$refs.join.showAddDialog = true
			}
		},
		delDataset(name, index) {
			this.changeDs = true
			this.active = 3
			this.$refs.join.delDataset(name, index)
		},
        getUrlParam(value) {
            let href = window.location.href
            let paramArr = href.split("?")[1].split("&")
            let data = paramArr.find(item => item.indexOf(value) > -1)
            return data ? decodeURI(data).split("=")[1] : undefined
        },
        getJobName() {
            let jobShowName = this.getUrlParam("jobShowName") ? this.getUrlParam("jobShowName") : this.getUrlParam("jobName")
            this.jobShowName = jobShowName
            return [this.projectName, this.projectName, this.flowVersion, jobShowName].join("_")
        },
        preFilterStatus(data) {
			/**
			 * 1. only dis open ==> success
			 * 2. no open ==> wait
			 * 3. open filter ===> 判断对错
			 */
            const status = data.args.param.status, errors = data.args.param.errors

			this.stepsDefs[0].status = "success"
			if (status) {
                this.stepsDefs[0].status = "wait"
            } else if (errors){
                this.stepsDefs[0].status = "error"
            }
        },
        preComputedStatus(data) {
            const status = data.args.param.status, errors = data.args.param.errors

			this.stepsDefs[1].status = "success"
            if (status) {
                this.stepsDefs[1].status = "wait"
            } else if (errors){
                this.stepsDefs[1].status = "error"
            }
        },
        joinStatus(data) {
           const status = data.args.param.status, errors = data.args.param.errors

			this.stepsDefs[2].status = "success"
            if (status) {
                this.stepsDefs[2].status = "wait"
            } else if (errors){
                this.stepsDefs[2].status = "error"
            }
        },
        selectStatus(data) {
           const status = data.args.param.status, errors = data.args.param.errors

			this.stepsDefs[3].status = "success"
            if (status) {
                this.stepsDefs[3].status = "wait"
            } else if (errors){
                this.stepsDefs[3].status = "error"
            }
        },
        postComputedStatus(data) {
            const status = data.args.param.status, errors = data.args.param.errors
			this.stepsDefs[4].status = "success"
            if (!status) {
                this.stepsDefs[4].status = "wait"
            } else if (errors){
                this.stepsDefs[4].status = "error"
            }
        },
        postFilterStatus(data) {
			const status = data.args.param.status, errors = data.args.param.errors
			this.stepsDefs[5].status = "success"
            if (!status) {
                this.stepsDefs[5].status = "wait"
            } else if (errors){
                this.stepsDefs[5].status = "error"
            }
        },
        outputsStatus(status) {
            if (status) {
                this.stepsDefs[6].status = "success"
            } else {
                this.stepsDefs[6].status = "error"
            }
        },
		computeColumns() {
			const result = JSON.parse(JSON.stringify(this.datasource.schema))
			const preJoinColumns = this.$refs.percomputed.datasource.commands
			const keys = Object.keys(result)
			keys.forEach(item => {
				const preJoinCol = preJoinColumns.filter(it => it.meta.name === item)
				if (preJoinCol.length > 0) {
					const preJoinSchema = preJoinCol[0].detail.computedCols.map(col => {
						return {
							des: col.name,
							src: col.name,
							type: col.type
						}
					})
					result[item] = result[item].concat(preJoinSchema)
				}
			})
			return result
		},
        computeSchema() {
            const result = []
            const selectCols = this.$refs.select.datasource.revert2Defs()
            for (let idx = 0; idx < selectCols.length; ++idx) {
                for (let idn = 0; idn < selectCols[idx]["columns"].length; ++idn) {
					const prefix = selectCols[idx]["prefix"]
					const val = !prefix || prefix === "" ? selectCols[idx]["columns"][idn] : prefix + '_' + selectCols[idx]["columns"][idn]
                    result.push(val)
                }
            }
            return result
        },
        computePostFilterSchema() {
            const result = this.computeSchema()
            const computedCols = this.$refs.postcomputed.datasource.revert2Defs()
            for (let idx = 0; idx < computedCols.length; ++idx) {
                result.push(computedCols[idx]["name"])
            }
            console.log(result)
            return result
        },
		resetInputs() {
			this.inputs = []
			this.$refs.join.datasource.datasets.forEach(item => {
				this.inputs = this.inputs.concat(item)
			})
		},
        save(transition) {
			this.savePopup = false
            this.loading = true
            this.transition = transition
            this.$refs.scriptParameters.save()
        },
        changScriptInputOutput(data) {
            let dssInputsOld = []
            let dssInputsNew = []
            let dssInputs = {}

            this.allData.inputs.forEach(item => {
                let inputNameOld = item
                let inputCatOld = this.datasetArray.filter(it => it.name === inputNameOld)[0]["cat"]
                dssInputsOld.push({
                    name: inputNameOld,
                    cat: inputCatOld
                })
            })
            dssInputs.old = dssInputsOld

            data.args.param.inputsArray.forEach(item => {
                let inputNameNew = item
                let inputCatNew = this.datasetArray.filter(it => it.name === inputNameNew)[0]["cat"]
                dssInputsNew.push({
                    name: inputNameNew,
                    cat: inputCatNew
                })
            })
            dssInputs.new = dssInputsNew

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
                    "runtime": "join",
                    "inputs": JSON.stringify(data.args.param.inputsArray),
                    "output": outputNameNew
                }
            }

            if (data.args.param.inputsArray.indexOf(outputNameNew) > -1) {
                Message.error("input和output不能相同", { duration: 3000} )
                return false
            }
			
            this.datasource.changeInputOutputQuery(this, dssOutputs, dssInputs, script)
        },
		dealChangeInputOutputQuery(data, func) {
            const event = new Event("event")
            event.args = {
                callback: "changScriptInputOutput",
                element: this,
                param: {
                    changeuuid: data.changeuuid,
                    eventName: data.eventName,
                    projectId: this.projectId,
                    projectName: this.projectName,
                    transition: this.transition,
                    callback: func
                }
            }
            this.$emit('event', event)
        },
        saveNotification(status) {
            if (status == "success" || status == "succeed") {
                Message({
                    type: 'success',
                    showClose: true,
                    duration: 3000,
                    message: '修改脚本成功！'
                })
            } else {
				this.loading = false
                Message({
                    type: 'error',
                    showClose: true,
                    duration: 30000,
                    message: '修改脚本失败！'
                })
            }
        }
    },
    async mounted() {
        this.projectId = this.getUrlParam("projectId")
        this.projectName = this.getUrlParam("projectName")
        this.jobName = this.getJobName()
        this.jobId = this.getUrlParam("jobId")
        await this.datasource.queryJob(this.projectId, this.jobId)
        this.datasource.refreshData(this.projectId, this.jobName, this.jobId)
        this.datasource.refreshInOut(this.projectId, this.jobShowName)
        this.datasource.refreshMateData(this.projectId, this.datasource.datasets)
        this.datasource.refreshScriptParameter(this.projectId, this.jobId)
    },
    watch: {
        active(n) {
            this.$refs.prefilter.validate()
            this.$refs.percomputed.validate()
            this.$refs.join.validate()
            this.$refs.select.validate()
            this.$refs.postcomputed.validate()
            this.$refs.postfilter.validate()
            this.$refs.outputs.validate()

			if (n === 4) {
				this.computedColumns = this.computeColumns()
			}

            if (n === 5) {
                this.computedSchema = this.computeSchema()
            }

            if (n === 6 || n === 7) {
                this.computedSchema = this.computePostFilterSchema()
            }
        },
        activeName(n) {
			if (n === "input/output") {
				this.resetInputs()
			}
        },
        "allData.inputs": function(n) {
            this.inputs = n
        },
        "allData.outputs": function(n) {
            this.outputs = n
        }
    }
}
</script>
<style lang="scss">
    .join {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;

        .join_header {
            height: 48px;
            padding: 0 15px;
            border-bottom: 1px solid #cccccc;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border: 1px solid #ccc;

            .header_left {
                display: flex;
                align-items: center;

                img {
                    width: 30px;
                    height: 30px;
                    margin-right: 10px;
                }

                .title {
                    font-size: 20px;
                    color: #000000;
                    letter-spacing: 0.21px;
                    font-weight: 600;
                }

				.link-to {
					color: #0073bb;
					font-size: 14px;
					margin-left: 20px;
					font-weight: bold;
					margin-top: 4px;
					cursor: pointer;
				}
            }

            .header_right {
                
                .content {
                    margin-right: 30px;
                }
            }
        }

        .join_area {
            width: 100%;
            flex-grow: 1;
            display: flex;
            flex-direction: row;
            height: calc(100vh - 100px);

            .join_left {
                display: flex;
                flex-direction: row;
                padding: 40px;
                justify-content: space-around;
                border-right: 1px solid #ccc;
            }

            .join_right {
                display: flex;
                flex-grow: 1;
                flex-direction: row;
                justify-content: space-around;
                background: #f2f2f2;
                // padding: 20px;
            }
        }

		#loadingio-spinner-double-ring-ho1zizxmctu {
            backdrop-filter: blur(1px);
            /* 毛玻璃特效 */
            background: rgba(200, 0, 0, 0.05);
            justify-content: center;
            align-items: center;
            width: 100vw;
            height: 100vh;
            display: flex;
            overflow: hidden;
            position: absolute;
            top: 0;
            left: 0;
        }

        /* 	使用transform: translateZ(0)加快动画和过渡的速度
            使用scale进行缩放
        */
        .ldio-400lpppmiue {
            position: absolute;
            transform: translateZ(0) scale(0.8);
        }

        /*  创建动画
            1. 0%是动画开始时间
            2. 100%是动画结束时间
            3. transform: rorate()是正时针旋转的角度
        */
        @keyframes ldio-400lpppmiue {
            0% {
                transform: rotate(0)
            }

            100% {
                transform: rotate(360deg)
            }
        }

        .ldio-400lpppmiue div {
            box-sizing: border-box;
        }

        .ldio-400lpppmiue>div {
            position: absolute;
            width: 68px;
            height: 68px;
            top: -30px;
            left: -30px;
            border-radius: 50%;
            border: 4px solid #000;
            border-color: #f5c924 transparent #f5c924 transparent;
            animation: ldio-400lpppmiue 1s linear infinite;
        }

        .ldio-400lpppmiue>div:nth-child(2),
        .ldio-400lpppmiue>div:nth-child(4) {
            width: 58px;
            height: 58px;
            top: -26px;
            left: -26px;
            animation: ldio-400lpppmiue 1s linear infinite reverse;
        }

        .ldio-400lpppmiue>div:nth-child(2) {
            border-color: transparent #747789 transparent #747789
        }

        .ldio-400lpppmiue>div:nth-child(3) {
            border-color: transparent
        }

        .ldio-400lpppmiue>div:nth-child(3) div {
            position: absolute;
            width: 100%;
            height: 100%;
            transform: rotate(45deg);
        }

        .ldio-400lpppmiue>div:nth-child(3) div:before,
        .ldio-400lpppmiue>div:nth-child(3) div:after {
            content: "";
            display: block;
            position: absolute;
            width: 4px;
            height: 4px;
            top: -4px;
            left: 28px;
            background: #f5c924;
            border-radius: 0%;
            box-shadow: 0 64px 0 0 #f5c924;
        }

        .ldio-400lpppmiue>div:nth-child(3) div:after {
            left: -4px;
            top: 28px;
            box-shadow: 64px 0 0 0 #f5c924;
        }

        .ldio-400lpppmiue>div:nth-child(4) {
            border-color: transparent;
        }

        .ldio-400lpppmiue>div:nth-child(4) div {
            position: absolute;
            width: 100%;
            height: 100%;
            transform: rotate(45deg);
        }

        .ldio-400lpppmiue>div:nth-child(4) div:before,
        .ldio-400lpppmiue>div:nth-child(4) div:after {
            content: "";
            display: block;
            position: absolute;
            width: 4px;
            height: 4px;
            top: -4px;
            left: 23px;
            background: #747789;
            border-radius: 0%;
            box-shadow: 0 54px 0 0 #747789;
        }

        .ldio-400lpppmiue>div:nth-child(4) div:after {
            left: -4px;
            top: 23px;
            box-shadow: 54px 0 0 0 #747789;
        }
    }
</style>

