<template>
    <div class="resource-main-container">
		<link href="https://components.hubadata.com/font-awesome/font-awesome.min.css" 	rel="stylesheet">
        <div class="header">
            <span class="header-large">
                {{title}}
            </span>
        </div>
        <div class="resource-container">
            <el-tabs type="border-card" class="resource-category-tabs" v-model="activeName">
                <el-tab-pane label="存储" name="1">
                    <ph-resource-storage-pane :storage="model.storage"></ph-resource-storage-pane>
                </el-tab-pane>
                <el-tab-pane label="计算引擎" name="2">
                    <ph-resource-engine-pane :engine="model.engine"></ph-resource-engine-pane>
                </el-tab-pane>
                <el-tab-pane label="数据缓存" name="3">
                    <ph-resource-olap-pane :olap="model.olap"></ph-resource-olap-pane>
                </el-tab-pane>
                <el-tab-pane label="集成编译器" name="4">
                    <ph-resource-codeeditor-pane 
						@dealResourceStart="dealResourceStart"
						@dealResourceStop="dealResourceStop"
						:codeeditors="model.codeeditors"
						:tenantId="tenantId"></ph-resource-codeeditor-pane>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
// import { staticFilePath } from '../config/envConfig'
import ElTabs from 'element-ui/packages/tabs/index'
import ElTabPane from 'element-ui/packages/tab-pane/index'
import PhResourceModel from "./model/ph-resource-model"
import PhResourceStoragePane from './ph-resource-storage-pane'
import PhResourceEnginePane from './ph-resource-engine-pane'
import PhResourceOlapPane from './ph-resource-olap-pane'
import PhResourceCodeeditorPane from './ph-resource-codeeditor-pane'

export default {
    components: {
        ElTabs,
        ElTabPane,
        PhResourceStoragePane,
        PhResourceEnginePane,
        PhResourceOlapPane,
        PhResourceCodeeditorPane
    },
    data() {
        return {
            title: "资源管理",
            activeName: "1"
        }
    },
    props: {
        tenantId: {
            type: String,
            default: "zudIcG_17yj8CEUoCTHg"
        },
        model: {
            type: Object,
            default: function() {
                return new PhResourceModel(1, this.tenantId, this)
            }
        }
    },
    computed: {

    },
    mounted() {
        this.model.model()
    },
    methods: {
        linkToPage(params) {
            const event = new Event("event")
            event.args = {
                callback: "linkToPage",
                element: this,
                param: {
                    name: params["name"],
                    pid: params.id
                }
            }
            this.$emit('event', event)
        },
		dealResourceStart(data) {
			this.$emit('event', data)
		},
		dealResourceStop(data) {
			this.$emit('event', data)
		}
    }
}
</script>
<style lang="scss" scoped>
    .resource-main-container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;

        .header {
            height: 62px;
            width: 100%;
            padding: 20px 24px 0;
            border-bottom: 1px solid rgba(37,35,45,.08);
            .header-large {
                font-family: SFProText-Regular;
                font-size: 20px;
                color: #302F39;
                letter-spacing: .25px;
                line-height: 28px;
            }
        }

        .resource-container {
            margin: 10px;
            padding: 0 10px;
            display: flex;
            flex-grow: 1;

            .resource-category-tabs {
                width: 100%;
            }
        }
    }
</style>
