<template>
    <div class="pivot">
        <link rel="stylesheet" href="https://components.hubadata.com/element-ui/element-ui.css">
        <div class="pivot_header">
            <div class="header_left">
                <img :src="defs.iconsByName('pivot')" alt="" />
                <span class="title">{{jobShowName}}</span>
				<span class="link-to" @click="linkToVideos">视频教程</span>
            </div>
            <div class="header_right">
				<el-radio-group v-model="activeName" class="content">
					<el-radio-button 
						label="Setting"></el-radio-button>
					<el-radio-button 
                        label="脚本参数"></el-radio-button>
					<el-radio-button 
						label="input/output"></el-radio-button>
				</el-radio-group>
                <el-button class="save" @click="savePopup = true">保存</el-button>
            </div>
        </div>
        <div class="pivot_area" v-show="activeName === 'Setting'">
            <div class="pivot_left">
                <el-steps direction="vertical" :active="active" align-center >
                    <el-step v-for="(item, index) in stepsDefs" :key="index" :status="item.status">
                        <template slot="title">
                            <el-button type="text" @click="active = item.index" >{{item.title}}</el-button>
                        </template>
                    </el-step>
                </el-steps>
            </div>
            <div class="pivot_right" v-if="datasource.isReady && datasource.isMetaReady">
                <pre-filter v-show="active === 1"
					ref="prefilter"
					:step="datasource.step"
					:schema="datasource.dataset.schema"
					@statusChange="preFilterStatus" />
                <computed v-show="active === 2"
					ref="computed"
					:step="datasource.step"
					:schema="datasource.dataset.schema"
					@statusChange="computedStatus" />
                <pivot v-show="active === 3"
					ref="pivot"
					:step="datasource.step"
					:schema="computedSchema"
					@statusChange="pivotStatus" />
                <other-cols v-show="active === 4"
					ref="other"
					:step="datasource.step"
					:identifiers="identifiers"
					:schema="computedSchema"
					@statusChange="otherStatus" />
                <outputs v-show="active === 5"
					ref="outputs"
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
import Computed from './steps/commands/computed/computedView'
import Pivot from './steps/commands/pivot/pivotView'
import OtherCols from './steps/commands/other-cols/view'
import Outputs from './steps/commands/output/outputView'
import ElRadioGroup from "element-ui/packages/radio-group/index"
import ElRadioButton from "element-ui/packages/radio-button/index"
import changeInputOutput from "./change-input-output"
import { Message } from 'element-ui'
import scriptParameters from "./script-parameters"
import ElDialog from 'element-ui/packages/dialog/src/component'

export default {
    components: {
        ElSteps,
        ElStep,
        ElButton,
        PreFilter,
        Computed,
        Pivot,
        OtherCols,
        Outputs,
		ElRadioGroup,
        ElRadioButton,
		changeInputOutput,
        scriptParameters,
        ElDialog
    },
    data() {
        return {
            outputsSchema: [],
            active: 3,
			flowVersion: "developer",
            stepsDefs: [
                {
                    title: "Pre-Filter",
                    index: 1,
                    status: "wait"  // wait / process / finish / error / success
                },
                {
                    title: "Computed Columns",
                    index: 2,
                    status: "wait"  // wait / process / finish / error / success
                },
                {
                    title: "Pivot",
                    index: 3,
                    status: "wait"  // wait / process / finish / error / success
                },
                {
                    title: "Other Columns",
                    index: 4,
                    status: "wait"  // wait / process / finish / error / success
                },
                {
                    title: "Outputs",
                    index: 5,
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
            savePopup: false,
            transition: 0,
            loading: false,
            computedSchema: [],
			identifiers: []
        }
    },
    props: {
        allData: {
            type: Object,
            default: function() {
                return {}
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
		computeSchema() {
            const result = this.datasource.dataset.schema.slice(0)
			let addCols = []
            if (this.$refs.computed) {
                addCols = this.$refs.computed.datasource.revert2Defs()
            }
			
			if(addCols.length === 0){
                const computedStep = JSON.parse(this.datasource.step["expressions"])
                addCols = computedStep["params"]["computedColumns"]
            }

			for (let x = 0; x < addCols.length; ++x) {
                result.push({
                    "type": addCols[x]["type"].toLowerCase(),
                    "src": addCols[x]["name"],
					"des": addCols[x]["name"]
                })
            }
			return result
		},
		linkToVideos() {
			window.open("https://www.bilibili.com/video/BV1st4y137hJ")
		},
        changeScriptParams(data) {
            this.datasource.saveScriptParams(data, this)
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
            const status = data.args.param.status, errors = data.args.param.errors
			this.stepsDefs[0].status = "success"
            if (!status) {
                this.stepsDefs[0].status = "wait"
            } else if (errors){
                this.stepsDefs[0].status = "error"
            }
        },
        computedStatus(data) {
            const status = data.args.param.status, errors = data.args.param.errors
			this.stepsDefs[1].status = "success"
            if (!status) {
                this.stepsDefs[1].status = "wait"
            } else if (errors){
                this.stepsDefs[1].status = "error"
            }
        },
        pivotStatus(data) {
            const errors = data.args.param.errors
            if (errors) {
                this.stepsDefs[2].status = "error"
            } else {
                this.stepsDefs[2].status = "success"
            }
        },
        otherStatus(status) {
            if (status) {
                this.stepsDefs[3].status = "success"
            } else {
                this.stepsDefs[3].status = "error"
            }
        },
        outputsStatus() {
			this.stepsDefs[4].status = "wait"
        },
        genOutputsSchema() {
            const identifiers = this.$refs.pivot.datasource.revert2Defs().identifiers
            const pivotColumns = this.$refs.pivot.datasource.revert2Defs().pivot.keyColumns
            const valueColumns = this.$refs.pivot.datasource.revert2Defs().pivot.valueColumns.map(x => x.column)
            const otherColumns = this.$refs.other.datasource.revert2Defs().map(x => x.column)

            return identifiers.concat(pivotColumns).concat(valueColumns).concat(otherColumns)
        },
		saveSetting() {
            this.$refs.prefilter.validate()
			this.$refs.computed.validate()
			this.$refs.pivot.validate()
			this.$refs.other.validate()
			this.$refs.outputs.validate()

			let errors = this.stepsDefs.filter(it => it.status === "error")
			if(errors.length > 0) {
				Message({
                    type: 'error',
                    showClose: true,
                    duration: 3000,
                    message: '请修改参数！'
                })
				this.loading = false
				return false
			}
			const params = {
				"preFilter": this.$refs.prefilter.datasource.revert2Defs(),
				"computedColumns": this.$refs.computed.datasource.revert2Defs(),
				"identifiers": this.$refs.pivot.datasource.revert2Defs().identifiers,
				"pivot": this.$refs.pivot.datasource.revert2Defs().pivot,
				"otherColumns": this.$refs.other.datasource.revert2Defs(),
			}
			this.datasource.saveAndGenCode(params, this)
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
					"runtime": "pivot",
					"inputs": JSON.stringify(data.args.param.inputsArray),
					"output": outputNameNew
				}
			}

			if (data.args.param.inputsArray.indexOf(outputNameNew) > -1) {
				Message({
                    type: 'error',
                    showClose: false,
                    duration: 3000,
                    message: 'input和output不能相同!'
                })
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
        this.datasetId = this.getUrlParam("datasetId")
        const fetch1 = this.datasource.refreshData(this.projectId, this.jobName, this.jobId)
        const fetch2 = this.datasource.refreshDataset(this.projectId, this.datasetId)
        const fetch3 = this.datasource.refreshInOut(this.projectId, this.jobShowName)
        const fetch4 = this.datasource.refreshScriptParameter(this.projectId, this.jobId)
		await Promise.all([fetch1, fetch2, fetch3, fetch4])
		// this.computedSchema = this.computeSchema()
		this.$refs.pivot.renderSchema()
    },
    watch: {
        active(n) {

			if (n === 4) {
				// this.identifiers = this.$refs.pivot.datasource.command.identifiers
			}

            this.$refs.prefilter.validate()
            this.$refs.computed.validate()
            this.$refs.pivot.validate()
            this.$refs.other.validate()
            this.$refs.outputs.validate()
        },
		activeName(n) {
            this.$emit("active", n)
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
    .pivot {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        height: 100%;

        .pivot_header {
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

        .pivot_area {
            width: 100%;
            flex-grow: 1;
            display: flex;
            flex-direction: row;
			height: calc(100vh - 100px);

            .pivot_left {
                display: flex;
                flex-direction: row;
				padding: 40px;
                justify-content: space-around;
				border-right: 1px solid #ccc;
            }

            .pivot_right {
                display: flex;
                flex-grow: 1;
                flex-direction: row;
                justify-content: space-around;
				background: #f2f2f2;
				padding: 20px;
            }
        }

		/*  loading style */
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

