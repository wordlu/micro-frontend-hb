<template>
    <div>
        <link rel="stylesheet" href="https://components.hubadata.com/element-ui/element-ui.css">
        <el-descriptions v-if="olap" class="engine-detail" title="集群OLAP缓存" :column="3" size="Default" border>
            <template slot="extra">
                <div class="right-cluster-controller">
                    <div v-if="isClusterOn"><span>关闭集群</span></div>
                    <div v-else><span>启动集群</span></div>
                    <el-switch v-model="isClusterOn" active-color="#13ce66"></el-switch>
                </div>
            </template>
            <el-descriptions-item>
                <template slot="label">
                    <i class="fa fa-amazon blue"></i>依赖平台
                </template>
                {{olap.platform}}
            </el-descriptions-item>
            <el-descriptions-item>
                <template slot="label">
                    <i class="fa fa-wrench blue"></i>使用工具
                </template>
                {{olap.ctype}}
            </el-descriptions-item>
            <el-descriptions-item>
                <template slot="label">
                    <i class="fa fa-vcard blue"></i>承担角色
                </template>
                {{olap.role}}
            </el-descriptions-item>
            <el-descriptions-item>
                <template slot="label">
                    <i class="fa fa-list blue"></i>使用版本
                </template>
                {{olap.applicationVersion}}
            </el-descriptions-item>
            <el-descriptions-item>
                <template slot="label">
                    <i class="fa fa-list blue"></i>依赖版本
                </template>
                <el-tag v-for="(item, index) in olap.applicationLabels" :key="index" class="engine-detail-tags">{{item}}</el-tag>
            </el-descriptions-item>
        </el-descriptions>


        <el-descriptions v-if="olap" class="engine-detail" title="公有数据" :column="3" size="Default" border></el-descriptions>
        <el-alert title="暂时未开放，请等待下一个版本" type="error" show-icon :closable="false"></el-alert>

        <el-descriptions v-if="olap" class="engine-detail" title="所有项目数据" :column="3" size="Default" border></el-descriptions>
        <el-alert title="暂时未开放，请等待下一个版本" type="error" show-icon :closable="false"></el-alert>
    </div>
</template>
<script>
// import { staticFilePath } from '../config/envConfig'
// import ElProgress from 'element-ui/packages/progress/index'
import ElDescriptions from 'element-ui/packages/descriptions/index'
import ElDescriptionsItem from 'element-ui/packages/descriptions-item/index'
// import ElButton from 'element-ui/packages/button/index'
import ElSwitch from 'element-ui/packages/switch/index'
import ElTag from 'element-ui/packages/tag/index'
import ElAlert from 'element-ui/packages/alert/index'

export default {
    components: {
        // ElProgress,
        ElDescriptions,
        ElDescriptionsItem,
        // ElButton,
        ElSwitch,
        ElTag,
        ElAlert
    },
    data() {
        return {
            isClusterOn: false
        }
    },
    props: {
        olap: Object
    },
    mounted() {
    },
    computed: {

    },
    methods: {

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

		.blue {
			color: #409EFF;
			margin-right: 4px;
		}
    }
</style>
