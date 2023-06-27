<template>
    <div class="data-list-home">
        <link rel="stylesheet" href="https://components.hubadata.com/element-ui/element-ui.css">
        <div class="data-home-container">
               <div class="content">
                <div class="left-area">
                    <div class="projectInfo">
                        <div class="left">
                            <div class="color"></div>
                            <div class="project_Information">
                                <p class="project_name">{{allData.projectDetail.name}}</p>
                                <p class="project_info">{{allData.projectDetail.provider}} , {{formatDateStandard(allData.projectDetail.created, 0)}}</p>
                            </div>
                        </div>
                        <div class="right">
							<button class="delete"
								@click="dialogDeleteProject = true"
								:disabled="!showStartButton"
								:class="{disButton: !showStartButton}">删除项目
							</button>
                        </div>
                    </div>
                    <div class="items">
                        <div class="item">
                            <div class="flow">
                                <p class="flow_word">主流程</p>
                                <div class="flow_item">
									<div class="flow_item_cell" @click="linkToPage('datasets')">
										<div>
											<img :src="dataset_icon" alt="">
										</div>
										<div>
											<p class="number">{{allData.numShow.dataset}}</p>
											<p class="dataset">数据集</p>
										</div>
									</div>
									<div class="flow_item_cell" @click="linkToPage('script')">
										<div>
											<img :src="recipes_icon" alt="">
										</div>
										<div>
											<p class="number">{{allData.numShow.flow}}</p>
											<p class="recipes">脚本</p>
										</div>
									</div>
									<div class="flow_item_cell">
										<div>
											<img :src="models_icon" alt="">
										</div>
										<div>
											<p class="number">{{allData.numShow.model}}</p>
											<p class="models">模型</p>
										</div>
									</div>
                                </div>
                            </div>
                            <div class="flow flow_two">
                                <p class="flow_word">实验室</p>
                                <div class="flow_item">
                                    <div class="flow_item_cell" @click="linkToPage('notebooks')">
										<div>
											<img :src="notebook_icon" alt="">
										</div>
										<div>
											<p class="number">{{allData.numShow.notebook}}</p>
											<p class="notebooks">编译器</p>
										</div>
									</div>
									<div class="flow_item_cell">
										<div>
											<img :src="analyses_icon" alt="">
										</div>
										<div>
											<p class="number">{{allData.numShow.analysis}}</p>
											<p class="models">分析</p>
										</div>
									</div>
                                </div>
                            </div>
                            <div class="flow flow_three">
                                <p class="flow_word">数据看板</p>
                                <div class="flow_item">
									<div class="flow_item_cell">
										<div>
											<img :src="dashboard_icon" alt="">
										</div>
										<div>
											<!-- <p class="number">{{allData.numShow.dashBoard}}</p> -->
											<p class="number">0</p>
											<p class="dashboard">数据看板</p>
										</div>
									</div>
                                </div>
                            </div>
                            <div class="flow flow_four">
                                <p class="flow_word">维基</p>
                                <div class="flow_item">
									<div class="flow_item_cell">
										<div>
											<img :src="article_icon" alt="">
										</div>
										<div>
											<p class="number">{{allData.numShow.wiki}}</p>
											<p class="article">详解</p>
										</div>
									</div>
                                </div>
                            </div>
                        </div>
                        <div class="go_flow">
                            <button @click="linkToPage('flow')">数据流程</button>
                        </div>
                    </div>

                </div>
                <div class="right_area">
                    <div class="hearder">
                        <p>时间线</p>
                    </div>
                    <div class="actions" @scroll="scrollGet($event)">
                        <div class="actions_list" v-for="(item, index) in actionsShow" :key="index+'actionsShow'">
                            <div class="center">
                                <p>{{formatDateStandard(item.date, 2)}}</p>
                            </div>
                            <div class="info" v-for="(list, index) in item.list" :key="index+'list'">
                                <div class="info_cell">
                                    <div class="icon">
                                        <img :src="num_icon" alt="">
                                    </div>
                                    <div class="cell_info">
                                        <p class="top_info">
                                            <span class="you">{{decodeURI(list.attributes["show-name"])}}</span>
                                            {{showActionDesc(list.attributes)}}
                                            <span class="time">{{formatDateStandard(list.attributes.date, 3)}}</span>
                                        </p>
                                        <span class="file">
                                            <img :src="showActionIcon(list.attributes)" alt="">
                                            <p> {{showActionName(list.attributes.message)}}</p>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
		<el-dialog
                title="删除项目"
                :visible.sync="dialogDeleteProject"
                width="460px">
            <span>确定删除该项目及包含的所有数据吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogDeleteProject = false">取消</el-button>
                <el-button type="primary" @click="deleteProject">确认</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import ElDialog from 'element-ui/packages/dialog/src/component'
import ElButton from 'element-ui/packages/button/index'
import { staticFilePath, hostName } from '../config/envConfig'

export default {
    data() {
        return {
            dataset_icon: `${staticFilePath}` + "/datasets.png",
            recipes_icon: `${staticFilePath}` + "/recipes.png",
            models_icon: `${staticFilePath}` + "/models.png",
            notebook_icon: `${staticFilePath}` + "/notebooks.png",
            analyses_icon: `${staticFilePath}` + "/analyses.png",
            dashboard_icon: `${staticFilePath}` + "/dashboard.png",
            article_icon: `${staticFilePath}` + "/articles.png",
            num_icon: `${staticFilePath}` + "/num_icon.png",
            file_icon: `${staticFilePath}` + "/file.png",
            script_icon: `${staticFilePath}` + "/script.png",
            optionsMap: {
                "intermediate": "创建了脚本",
                "transform_schema": "编辑了数据集",
                "clear_DS_data": "编辑了数据集",
                "remove_Job": "删除了脚本",
                "max1.0": "创建了数据集",
                "remove_DS": "删除了数据集",
                "upload": "创建了数据集",
                "dag_create": "创建了脚本",
                "catalog": "创建了脚本",
                "edit_sample": "编辑了sample",

                "create_steps": "编辑了脚本",
                "create_script": "创建了脚本",
                "delete_script": "删除了脚本",
                "delete_dataset": "删除了dataset",
                "project_file_to_DS": "导入了数据",
                "create_scenario": "创建了scenario",
                "update_scenario": "更新了scenario",
                "scenario_trigger": "触发了scenario",
                "create_catalog": "创建了数据目录",
                "run_dag": "运行了dag",
                "stop_dag": "停止了dag"
            },
            actions: [],
            actionsShow: [],
            actionsKey: "",
            showStartButton: true,
            dialogDeleteProject: false
        }
    },
    components: {
        ElDialog,
        ElButton
    },
    async mounted() {
        //actions数据
        const accessToken = this.getCookie("access_token") || "dae3d1540184499768c8efc58713565349ed36735db0f4566d824604c6b07e20"
        const acurl = `${hostName}/hbdydatasource/query`
        // href param
        const href = window.location.href.split("?")[1]
        console.log(href)
        const hrefParam = href.split("&")
        let projectId = hrefParam[1].split("=")[1]
        let projectName = hrefParam[0].split("=")[1]
        let acbody = {
            "table": "action",
            "conditions": {
                "projectId": ["=", projectId]
            },
            "limit": 20,
            "start_key": ""
        }
        let acoptions = {
            method: "POST",
            headers: {
                "Authorization": accessToken,
                'Content-Type': 'application/json; charset=UTF-8',
                "accept": "application/json"
            },
            body: JSON.stringify(acbody)
        }
        this.actions = await fetch(acurl, acoptions).then(res=>res.json())
        this.actionsKey = this.actions.meta.start_key
        this.dealActions() //处理actions数据
    },
    props: {
        allData: {
            type: Object,
            default: function() {
                return {
                    "projectDetail": {},
                    "numShow": {},
                    "projectName": "",
                    "projectId": ""
                }
            }
        }
    },
    methods: {
        deleteProject() {
            const event = new Event("event")
            event.args = {
                callback: "deleteProject",
                element: this,
                param: {
                    projectName: this.allData.projectDetail.name,
                    projectId: this.allData.projectDetail.id
                }
            }
            this.$emit('event', event)
            this.dialogDeleteProject = false
        },
        dealActions() {
            this.actions.data.map(mapItem => {
                //过滤掉dag_refresh
                if (mapItem.attributes["job-cat"] === "dag_refresh") {
                    return false
                } else if (!this.isJSON(mapItem.attributes["message"])) {
                    return false
                }
                // 第一条数据直接存入actionsShow数组
                if(this.actionsShow.length === 0) {
                    this.actionsShow.push({
                        date: Number(mapItem.attributes.date),
                        list: [mapItem]
                    })
                } else {
                    // 判断当前数据的date在actionsShow数组中是否已经存在
                    let res = this.actionsShow.some(item => {
                        let checkDate = this.isSameDay(item.date, Number(mapItem.attributes.date))
                        if(checkDate) {
                            item.list.push(mapItem)
                            return true
                        }
                    })
                    // 若不存在则在actionsShow中存入新的按时间分类的数组
                    if(!res) {
                        this.actionsShow.push({
                            date: Number(mapItem.attributes.date),
                            list: [mapItem]
                        })
                    }
                }
            })
        },
        getCookie(name) {
            let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg))
                return (arr[2]);
            else
                return null;
        },
        //滚动
        scrollGet(e) {
            let scrollTop = e.target.scrollTop || document.body.scrollTop;
            let clientHeight = e.target.clientHeight;
            let scrollHeight = e.target.scrollHeight;
            if (scrollTop + clientHeight >= scrollHeight) {
                //滚动到底部
                this.getActions(this.actionsKey)
            }
        },
        async getActions(value) {
            const accessToken = this.getCookie("access_token") || "dae3d1540184499768c8efc58713565349ed36735db0f4566d824604c6b07e20"
            const acurl = `${hostName}/hbdydatasource/query`
            let acbody = {
                "table": "action",
                "conditions": {
                    "projectId": ["=", this.allData.projectId]
                },
                "limit": 20,
                "start_key": value
            }
            let acoptions = {
                method: "POST",
                headers: {
                    "Authorization": accessToken,
                    'Content-Type': 'application/json; charset=UTF-8',
                    "accept": "application/json"
                },
                body: JSON.stringify(acbody)
            }
            this.actions = await fetch(acurl, acoptions).then(res=>res.json())
            this.actionsKey = this.actions.meta.start_key
            this.dealActions() //处理actions数据
        },
        //操作叙述
        showActionDesc(data) {
            let cat = data["job-cat"]
            let msg = null
            if(this.isJSON(data["message"])) {
            	msg = JSON.parse(data["message"])
                return this.optionsMap[msg.optionName]
            } else {
                return "进行了操作"
            }
            // let msg = data["message"]
            // if(cat === "intermediate" && msg.jobCat === "prepare_edit") {
            //     return "编辑了脚本"
            // } else {
            //     return this.optionsMap[msg.actionName]
            // }
        },
        isJSON(str) {
            if (typeof str == 'string') {
                try {
                    var obj=JSON.parse(str);
                    if(typeof obj == 'object' && obj ){
                        return true;
                    }else{
                        return false;
                    }

                } catch(e) {
                    // console.log('error：'+str+'!!!'+e);
                    return false;
                }
            }
        },
        //操作对象的名称
        showActionName(data) {
            if(this.isJSON(data)) {
            	let msg = JSON.parse(data)
                return msg["actionName"]
            } else {
                return ""
            }
        },
        //操作对象的icon
        showActionIcon(data) {
            let cat = data["job-cat"]
            let msg = data["message"]
            // let msg = JSON.parse(data["message"])
            if(cat === "intermediate") {
                if(msg.runtime === "prepare") {
                    return `${staticFilePath}` + "/prepare_icon.svg"
                } else if(msg.runtime === "python3") {
                    return `${staticFilePath}` + "/python_icon.svg"
                } else if(msg.runtime === "pyspark") {
                    return `${staticFilePath}` + "/pyspark_icon.svg"
                } else if(msg.runtime === "r") {
                    return `${staticFilePath}` + "/R_icon.svg"
                } else if(msg.runtime === "sparkr") {
                    return `${staticFilePath}` + "/sparkR_icon.svg"
                } else {
                    return `${staticFilePath}` + "/intermediate.svg"
                }
            } else if(cat === "upload" || cat === "transform_schema") {
                return `${staticFilePath}` + "/normal.svg"
            } else if(cat === "max1.0" && msg.cat === "input_index") {
                return `${staticFilePath}` + "/input_index.svg"
            } else if(cat === "max1.0" && msg.cat === "output_index") {
                return `${staticFilePath}` + "/output_index.svg"
            } else  {
                return `${staticFilePath}` + "/intermediate.svg"
            }
        },
        isSameDay(timeStampA, timeStampB) {
            let dateA = new Date(timeStampA);
            let dateB = new Date(timeStampB);
            return (dateA.setHours(0, 0, 0, 0) == dateB.setHours(0, 0, 0, 0));
        },
        linkToPage(param) {
            const event = new Event("event")
            event.args = {
                callback: "linkToPage",
                element: this,
                param: {
                    name: param,
                    projectName: this.allData.projectDetail.name,
                    projectId: this.allData.projectDetail.id
                }
            }
            this.$emit('event', event)
        },
        formatDateStandard(...params) {
            if(params.length === 2) {
                let date = new Date( new Date((params[0])) ),
                    Y = date.getFullYear(),
                    M =
                        ( date.getMonth() + 1 < 10 ?
                            `0${date.getMonth() + 1}` :
                            date.getMonth() + 1 ),
                    D0 = ( date.getDate() < 10 ? `0${date.getDate()}` : date.getDate() ),
                    D1 = ( date.getDate() < 10 ? `0${date.getDate()}` : date.getDate() ),

                    h =
                        ( date.getHours() < 10 ? `0${date.getHours()}` : date.getHours() ),
                    m =
                        ( date.getMinutes() < 10 ?
                            `0${date.getMinutes()}` :
                            date.getMinutes() ) ,
                    s = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()

                // 输出结果：yyyy/mm/dd hh:mm
                if(params[1] === 0){
                    return Y + "/" + M + "/" + D0 + " " + h + ":" + m
                } else if(params[1] === 1) {
                    return Y + "-" + M + "-" + D0 + " " + h + ":" + m
                } else if(params[1] === 2) {
                    return Y + "-" + M + "-" + D0
                } else if(params[1] === 3) {
                    return h + ":" + m
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
/deep/.el-dialog__header {
    border-bottom: 1px solid #ccc;
}
/deep/.el-dialog__headerbtn {
    display: none;
}
/deep/.el-dialog__wrapper {
    background: rgba(0, 0, 0, 0.31);
}
.data-home-container {
    height: calc(100vh - 40px);
    width: 100vw;
    background: #f2f2f2;

    .dataset_header {
        height: 48px;
        background: #ffffff;
        border-bottom: 1px solid #dddddd;
        margin: 0 !important;
        color: #333333;
        display: flex;
        padding: 0 20px;
        align-items: center;
        .script_icon {
            width: 24px;
            height: 24px;
            margin-right: 10px;
        }
    }
    .content {
        display: flex;
    }
    .header-area {
        width: 100%;
        height: 50px;
        background: #fff;
        p {
            line-height: 50px;
            margin: 0px;
            margin-left: 17px;
            font-family: PingFangSC-Medium;
            font-size: 16px;
            color: #000000;
            font-weight: 600;
            width: 200px;
            cursor: pointer;
        }
    }
    .left-area {
        flex: 1;
		width: 75%;
        .projectInfo {
            display: flex;
            min-width: 880px;
            height: 220px;
            background: #ffffff;
            border: 1px solid #ddd;
            margin-left: 20px;
            margin-top: 25px;
            justify-content: space-between;
            .left {
                display: flex
            }
            .color {
                width: 80px;
                height: 100%;
                background: #cc9f3b;
            }
            .project_Information {
                display: 1;
                margin-left: 20px;
                margin-top: 20px;
                .project_name {
                    font-family: PingFangSC-Medium;
                    font-size: 38px;
                    color: #000000;
                    font-weight: 600;
                }
                .project_info {
                    font-family: PingFangSC-Medium;
                    font-size: 12px;
                    color: #000000;
                    font-weight: 500;
                }
            }
            .right {
                display: flex;
                padding-top: 20px;
                padding-right: 20px;
				.delete {
					background: #DB4D71 !important;
					margin-right: 10px;
				}
				.disButton {
					background: #bbb !important;
				}
                button {
                    min-width: 80px;
                    height: 32px;
                    background: #5342B3;
                    border-radius: 2px;
                    color: white;
                    border: none;
                    cursor: pointer;
                }
				span {
					font-size: 14px;
					color: #7163C5;
					font-weight: 500;
					line-height: 32px;
				}
            }
        }
    }
    .items {
        height: 220px;
        background: #ffffff;
        border: 1px solid #ddd;
        margin-left: 20px;
        margin-top: 25px;
		min-width: 880px;
        .go_flow {
            display: flex;
            justify-content: center;
            button {
                margin: 10px 0;
                width: 300px;
                height: 40px;
                box-sizing: border-box;
                background: #f9bd38;
                color: #333333;
                border: 1px solid transparent;
                font-weight: bold;
                letter-spacing: 2px;
                font-size: 14px;
                cursor: pointer;
            }
        }
        .item {
            display: flex;
        }
        .flow {
            width: 450px;
            height: 100%;
            // border: 1px solid #aaa;
            margin-left: 10px;
            .flow_word {
                width: 100%;
                height: 50px;
                border-bottom: 1px solid #dddddd;
                margin: 0px;
                line-height: 60px;
                font-size: 20px;
                font-weight: 600;
            }
            .flow_item {
                display: flex;

                .flow_item_cell {
                    width: 110px;
                    height: 80px;
                    margin-left: 10px;
                    margin-top: 20px;
                    cursor: pointer;
                div {
                    display: inline-block;
                }
                .number {
                    color: #666666;
                    font-size: 30px;
                    font-weight: 500;
                }
                .dataset {
                    color: #28a9dd;
                    font-size: 12px;
                }
                .recipes {
                    color: #f9bd38;
                    font-size: 12px;
                }
                .models {
                    color: #29af5d;
                    font-size: 12px;
                }
                .dashboard {
                    color: #f44336;
                    font-size: 12px;
                }
                .article {
                    color: #427b98;
                    font-size: 12px;
                }
                .notebooks {
                    color: #f28c38;
                    font-size: 12px;
                }

                }

            }

        }
        .flow_two {
            width: 320px;

        }
        .flow_three {
            width: 180px;
        }
        .flow_four {
            width: 150px;
        }
    }
    .right_area {
		width: 22%;
        // border: 1px solid #000;
        margin-top: 30px;
        margin-left: 20px;
        margin-right: 20px;
        .hearder {
            height: 30px;
            font-size: 14px;
            font-weight: 600;
            text-align: center;
            line-height: 30px;
            border-bottom: 2px solid #000;
        }
        .actions {
            height: calc(100vh - 150px);
            overflow: auto;
        }
        .center {
            margin-top: 10px;
            margin-left: 10px;
            color: #666666;
            font-size: 12px;
            margin-bottom: 10px;
        }
        .info {
            .info_cell {
                display: flex;
                height: 75px;
                width: 100%;
                background: #ffffff;
                border: 1px solid #dddddd;
                padding-left: 10px;
                padding-top: 10px;
                margin-bottom: 10px;
				overflow: auto;
                .icon {
                    width: 20px;
                    height: 20px;

                    img {
                        width: 100%;
                        border-radius: 10px;
                    }
                }
                .cell_info {
                    width: 100%;
                    padding-left: 10px;
                    font-size: 14px;
                    .top_info {
                        position: relative;
                        .time {
                            position: absolute;
                            right: 10px;
                            top: 0;
                            font-size: 12px;
                            color: #999;
                        }
                    }
                     .you {
                        font-weight: 600;
                    }
                    .file {
                        display: flex;
                        margin: 5px;
                        p {
                            margin-left: 10px;
                            width: 300px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                    }
                   img {
                       width: 20px;
                       height: 20px;
                   }
                   };
                }
            }
        }
}
</style>
