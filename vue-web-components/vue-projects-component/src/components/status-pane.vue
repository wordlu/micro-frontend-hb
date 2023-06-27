<template>
    <div class="tenant-status">
        <span class="tenant-title">资源启动</span>
        <el-divider></el-divider>
        <div class="tenant-status-row">
            <span class="tenant-status-name">{{tenantName}}</span>
            <div class="tenant-status-content">
                <div class="status-area-content">
                    <div class="status-area" v-if="datasource.statusCode === 2">
                        <div class="status">
                            <img class="success-img" :src="defs.iconsByName('resource', 'success')" alt="">
                            <span class="success">已启动</span> 
                        </div>
                    </div>
                    <div class="status-area" v-if="datasource.statusCode === 0">
                        <div class="status">
                            <img :src="defs.iconsByName('resource', 'stop')" alt="">
                            <span class="stop">已停止</span>
                        </div>
                    </div>
                    <div class="status-area" v-if="datasource.statusCode === 4">
                        <div class="status">
                            <img  class="loading-img" :src="defs.iconsByName('resource', 'loading')" alt="">
                            <span class="loading">关闭中</span> 
                        </div>
                    </div>
                    <div class="status-area" v-if="datasource.statusCode === 1">
                        <div class="status">
                            <img class="loading-img" :src="defs.iconsByName('resource', 'loading')" alt="">
                            <span class="loading">启动中</span>
                        </div>
                    </div>
                    <div class="time" v-if="datasource.statusCode === 1">启动将于10-15分钟内完成</div>
                </div>
            </div>
            
            <div class="tenant-status-operator">
                <el-switch
						:disabled="datasource.statusCode === 1 || datasource.statusCode === 4"
                        :value="datasource.switch"
                        @change="switchChanged"
                        active-color="#13ce66">
                </el-switch>
            </div>
        </div>

    </div>
</template>
<script>
import ElDivider from 'element-ui/packages/divider/index'
import ElSwitch from 'element-ui/packages/switch/index'
import { MessageBox, Message } from 'element-ui'
import PhProjectDatasource from './model/datasource'
import PhDagDefinitions from "./policy/definitions/definitions";

export default {
    components: {
        ElDivider,
        ElSwitch
    },
    props: {
        tenantName: String,
        tenantId: String,
        datasource: {
            type: Object,
            default: function() {
                return new PhProjectDatasource(1, this)
            }
        },
        defs: {
            type: Object,
            default: function () {
                return new PhDagDefinitions("1");
            }
        }
    },
    computed: {

    },
    methods: {
		dealResourceStart(res) {
			if (res.status === "failed") {
				Message.error("启动资源失败，请重新操作！！", { duration: 0, showClose: true} )
			} else {
				const event = new Event("event")
				event.args = {
					callback: "dealResourceStart",
					element: this,
					param: {
						traceId: res.trace_id
					}
				}
				this.$emit('dealResourceStart', event)
			}
		},
		dealResourceStop(res) {
			if (res.status === "failed") {
				Message.error("关闭资源失败，请重新操作！！", { duration: 0, showClose: true} )
			} else {
				const event = new Event("event")
				event.args = {
					callback: "dealResourceStop",
					element: this,
					param: {
						traceId: res.trace_id
					}
				}
				this.$emit('dealResourceStop', event)
			}
		},
        switchChanged() {
            if (this.datasource.switch) {
                MessageBox.confirm('关闭当前资源会影响其他用户使用！ 是否继续?', '警告', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    if (this.datasource.switch) {
                        // MessageBox.alert("现在不支持自动删除，请联系管理员")
                        // 调用启动前，强制更新一下状态，以免竞争机制
                        // this.datasource.refreshStatus(this.tenantId)
                        if (this.datasource.status === "started"){
                            this.datasource.resourceStop(this.tenantId)
                        } else {
                            this.datasource.refreshStatus(this.tenantId)
                        }
                    } else {
                        // 通过新的 trace ID 持续访问状态
                        Message.error("平台已经被另一进程关闭，请等待！！", { duration: 3000} )
                    }
                }).catch(() => {
                    // do nothing ...
                })
            }
            else if (!this.datasource.switch) {
                MessageBox.confirm('是否确认开始资源并开始计费！ 是否继续?', '警告', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    if (!this.datasource.switch) {
                        // 调用启动前，强制更新一下状态，以免竞争机制
                        // this.datasource.refreshStatus(this.tenantId)
                        if(this.datasource.status == "stoped"){
                            this.datasource.resourceStart(this.tenantId)
                        } else {
                            this.datasource.refreshStatus(this.tenantId)
                        }
                    } else {
                        // 通过新的 trace ID 持续访问状态
                        Message.error("平台已经被另一进程启动，请等待！！", { duration: 3000} )
                    }
                }).catch(() => {
                    // do nothing ...
                })
            }

        }
    },
    mounted() {
        this.datasource.refreshStatus(this.tenantId)
    }
}
</script>
<style lang="scss" scoped>
    @keyframes rotate{
        0%{
            transform: rotateZ(0deg);/*从0度开始*/
        }
        100%{
            transform: rotateZ(360deg);/*360度结束*/
        }
    }
    .tenant-status {
        /*height: 200px;*/
        margin: 10px 20px;

        .tenant-title {
            font-size: 12px;
        }

        .tenant-label {
            background-color: transparent;
        }

        .el-divider--horizontal {
            margin: 5px 0 24px !important;
        }

       .tenant-status-row {
            display: flex;
            flex-direction: row;
            /*align-content: space-between;*/

            .tenant-status-name {

            }

            .tenant-status-content {
                flex-grow: 1;
                display: flex;
                justify-content: space-around;
                .status-area-content {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    .time {
                        color: #7a8cff;
                        font-size: 14px;
                        margin-top: 16px;
                    }
                    
                }
                .status-area {
                }
                
                .success {
                    color: #00e158;
                }
                .loading {
                    color: #7a8cff;
                }
                .stop {
                    color: #696969;
                }
                .status {
                    display: flex;
                    align-items: center;
                    .loading-img {
                        display: block;
                        animation: rotate 1s linear infinite;
                    }
                    img {
                        margin-right: 5px;
                    }
                }
            }

            .tenant-status-operator {

            }
        }
    }
</style>
