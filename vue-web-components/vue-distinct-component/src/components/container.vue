<template>
    <div class="distinct">
        <link rel="stylesheet" href="https://components.hubadata.com/element-ui/element-ui.css">
        <div class="distinct_header">
            <div class="header_left">
                <img :src="defs.iconsByName('distinct')" alt="" />
                <span class="title">{{jobShowName}}</span>
                <span class="link-to" @click="linkToVideos">视频教程</span>
            </div>
            <div class="header_right">
                <el-radio-group 
                    v-model="activeName"
                    class="content">
                    <el-radio-button 
                        label="Setting" ></el-radio-button>
                    <el-radio-button 
                        label="脚本参数"></el-radio-button>
                    <el-radio-button 
                        label="input/output"></el-radio-button>
                </el-radio-group>
                <el-button class="save" @click="savePopup = true">保存</el-button>
				<!-- <el-radio-group v-model="activeName" class="content">
					<el-radio-button label="Setting"></el-radio-button>
					<el-radio-button label="input/output"></el-radio-button>
				</el-radio-group>
                <el-button class="save" @click="save">保存</el-button> -->
            </div>
        </div>
        <div class="distinct_area" v-show="activeName === 'Setting'">
            <div class="distinct_left">
                <el-steps direction="vertical" :active="active" align-center >
                    <el-step v-for="(item, index) in stepsDefs" :key="index" :status="item.status">
                        <template slot="title">
                            <el-button type="text" @click="active = item.index" >{{item.title}}</el-button>
                        </template>
                    </el-step>
                </el-steps>
            </div>
            <div class="distinct_right" v-if="datasource.isReady && datasource.isMetaReady">
                <pre-filter v-show="active === 1"
                            ref="prefilter"
                            :step="datasource.step"
                            :schema="datasource.dataset.schema"
                            @statusChange="preFilterStatus" />
                <distinct v-show="active === 2"
                            ref="distinct"
                            :step="datasource.step"
                            :schema="datasource.dataset.schema"
                            @statusChange="distinctStatus" />
                <post-filter v-show="active === 3"
                                ref="postfilter"
                                :step="datasource.step"
                                :schema="datasource.dataset.schema"
                                @statusChange="postFilterStatus" />
                <outputs v-show="active === 4"
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
import PostFilter from './steps/commands/post-filter/postFilterView'
import Distinct from './steps/commands/distinct/distinctView'
import Outputs from './steps/commands/output/outputView'
import ElRadioGroup from "element-ui/packages/radio-group/index"
import ElRadioButton from "element-ui/packages/radio-button/index"
import changeInputOutput from "./change-input-output"
import ElDialog from 'element-ui/packages/dialog/src/component'
import scriptParameters from "./script-parameters"
import { Message } from 'element-ui'

export default {
    components: {
        ElSteps,
        ElStep,
        ElButton,
        PreFilter,
        PostFilter,
        Distinct,
        Outputs,
		ElRadioGroup,
        ElRadioButton,
        changeInputOutput,
        scriptParameters,
        ElDialog
    },
    data() {
        return {
			computedSchema: [],
            outputsSchema: [],
            activeName: "Setting",
			inArray: [],
			outArray: [],
            jobShowName: "",
			outputs: [],
            inputs: [],
            datasetArray: [],
            active: 2,
            flowVersion: "developer",
            stepsDefs: [
                {
                    title: "Pre-Filter",
                    index: 1,
                    status: "wait"  // wait / process / finish / error / success
                },
                {
                    title: "Distinct",
                    index: 2,
                    status: "wait"  // wait / process / finish / error / success
                },
                {
                    title: "Post-Filter",
                    index: 3,
                    status: "wait"  // wait / process / finish / error / success
                },
                {
                    title: "Outputs",
                    index: 4,
                    status: "wait"  // wait / process / finish / error / success
                }
            ],
            savePopup: false,
            transition: 0,
            loading: false,
        }
    },
    props: {
        allData: {
            type: Object,
            default: function() {
                return {
                    // projectId: "YZYijD17N9L6LXx",
                    // projectName: "autorawdata2021",
                    // scriptsParams: null,
                    // dss: []
                }
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
			window.open("https://www.bilibili.com/video/BV1ma411Z79i/")
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
        distinctStatus(errors) {
            if (errors) {
                this.stepsDefs[1].status = "error"
            } else {
                this.stepsDefs[1].status = "success"
            }
        },
        postFilterStatus(data) {
            const status = data.args.param.status, errors = data.args.param.errors
			this.stepsDefs[2].status = "success"
            if (!status) {
                this.stepsDefs[2].status = "wait"
            } else if (errors){
                this.stepsDefs[2].status = "error"
            }
        },
        outputsStatus() {
			this.stepsDefs[3].status = "success"
        },
        computeSchema() {
			let result = []
			if (this.$refs.distinct.isAllCols) {
				result = this.datasource.dataset.schema
			} else {
				result = this.datasource.dataset.schema.filter(it => this.$refs.distinct.datasource.command.retrievedCols.includes(it.src))
			}

			if (this.$refs.distinct.datasource.globalCount) {
				result.push({
					src: "count",
					type: "bigint"
				})
			}
            return result
        },
        saveSetting() {
            this.$refs.prefilter.validate()
            this.$refs.distinct.validate()
            this.$refs.postfilter.validate()
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
                "keys": this.$refs.distinct.datasource.revert2Defs().keys,
                "preFilter": this.$refs.prefilter.datasource.revert2Defs(),
                "postFilter": this.$refs.postfilter.datasource.revert2Defs(),
                "globalCount": this.$refs.distinct.datasource.revert2Defs().globalCount
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
					"runtime": "distinct",
					"inputs": JSON.stringify(data.args.param.inputsArray),
					"output": outputNameNew
				}
			}

			if (inputNameNew === outputNameNew) {
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
    mounted() {
        this.projectId = this.getUrlParam("projectId")
        this.projectName = this.getUrlParam("projectName")
		this.jobName = this.getJobName()
        this.jobId = this.getUrlParam("jobId")
        this.datasetId = this.getUrlParam("datasetId")
        this.datasource.refreshScriptParameter(this.projectId, this.jobId)
        this.datasource.refreshData(this.projectId, this.jobName, this.jobId)
		this.datasource.refreshDataset(this.projectId, this.datasetId)
        this.datasource.refreshInOut(this.projectId, this.jobShowName)
        
    },
    updated() {

    },
    watch: {
        active(n) {
			if (n === 4) {
                this.computedSchema = this.computeSchema()
            }
            this.$refs.prefilter.validate()
            this.$refs.distinct.validate()
            this.$refs.postfilter.validate()
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
    .distinct {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        height: 100%;

        .distinct_header {
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

        .distinct_area {
            width: 100%;
            flex-grow: 1;
            display: flex;
            flex-direction: row;
			height: calc(100vh - 100px);

            .distinct_left {
                display: flex;
                flex-direction: row;
                padding: 40px;
                justify-content: space-around;
				border-right: 1px solid #ccc;
            }

            .distinct_right {
                display: flex;
                flex-grow: 1;
                flex-direction: row;
                justify-content: space-around;
				background: #f2f2f2;
				padding: 20px;
                overflow: auto;
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

