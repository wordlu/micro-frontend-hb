<template>
    <div>
        <link rel="stylesheet" href="https://components.hubadata.com/element-ui/element-ui.css">
        <div class="editor-container">
            <el-table :data="codeeditors" style="width: 100%" class="editor-table">
                <el-table-column prop="ctype" label="程序" width="150"></el-table-column>
                <el-table-column prop="platform" label="依赖平台" width="120"></el-table-column>
                <el-table-column prop="owner" label="所有人" width="120"></el-table-column>
                <el-table-column prop="ownership" label="所绑定项目" width="120"></el-table-column>
                <el-table-column prop="metadata.version" label="版本" width="300"></el-table-column>
                <el-table-column prop="status" label="状态" width="300">
					<template slot-scope="scope">
						<div v-if="scope.row.status === 2">已启动</div>
						<div v-if="scope.row.status === 0">已停止</div>
						<div v-if="scope.row.status === 4">关闭中</div>
						<div v-if="scope.row.status === 1">启动中</div>
					</template>
				</el-table-column>
                <el-table-column label="Operations" width="120">
                    <template slot-scope="scope">
                        <el-switch 
							:disabled="scope.row.status === 1 || scope.row.status === 4"
							v-model="scope.row.switch"
							@change="switchChanged(scope.row)"
							active-color="#13ce66">
                        </el-switch>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
import ElSwitch from 'element-ui/packages/switch/index'
import ElTable from 'element-ui/packages/table/index'
import ElTableColumn from 'element-ui/packages/table-column/index'
import { MessageBox, Message } from 'element-ui'
import PhResourceModel from "./model/ph-resource-model"

export default {
    components: {
        ElSwitch,
        ElTable,
        ElTableColumn
    },
    data() {
        return {
        }
    },
    props: {
        codeeditors: Array,
        datasource: {
            type: Object,
            default: function() {
                return new PhResourceModel(1, this.tenantId, this)
            }
        },
        tenantId: String
    },
    mounted() {
    },
    computed: {

    },
    methods: {
		switchChanged(row) {
			row.switch = !row.switch
            if (row.switch) {
                MessageBox.confirm('关闭当前资源会影响其他用户使用！ 是否继续?', '警告', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    // 调用启动前，强制更新一下状态，以免竞争机制
                    // this.datasource.refreshStatus(this.tenantId)
                    // if (this.datasource.switch) {
                    //     // MessageBox.alert("现在不支持自动删除，请联系管理员")
					// 	this.datasource.resourceStop(this.tenantId)
                    // } else {
                    //     // 通过新的 trace ID 持续访问状态
                    //     Message.error("平台已经被另一进程关闭，请等待！！", { duration: 3000} )
                    // }
                    this.datasource.resourceStop(this.tenantId, row)
                }).catch(() => {
                })
            }
            else if (!row.switch) {
                MessageBox.confirm('是否确认开始资源并开始计费！ 是否继续?', '警告', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    // 调用启动前，强制更新一下状态，以免竞争机制
                    // this.datasource.refreshStatus(this.tenantId)
                    // if (!this.datasource.switch) {
					// 	this.datasource.resourceStart(this.tenantId)

                    // } else {
                    //     // 通过新的 trace ID 持续访问状态
                    //     Message.error("平台已经被另一进程启动，请等待！！", { duration: 3000} )
                    // }
                    this.datasource.resourceStart(this.tenantId, row)
                }).catch(() => {
                })
            }

        },
        dealResourceStart(res, row) {
			if (res.status === "failed") {
				Message.error("启动资源失败，请重新操作！！", { duration: 0, showClose: true} )
			} else {
				row.status = 1
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
		dealResourceStop(res, row) {
			if (res.status === "failed") {
				Message.error("关闭资源失败，请重新操作！！", { duration: 0, showClose: true} )
			} else {
				row.status = 4
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
    }
}
</script>
<style lang="scss" scoped>
    .right-cluster-controller {
        display: flex;
        flex-direction: row;
    }

    .engine-detail {
        margin: 10px 50px;

        .engine-detail-tags {
            margin-right: 20px;
        }
    }

    .editor-container {
        margin: 10px auto;
    }

    .editor-table {
        margin: 10px 50px;
    }
</style>
