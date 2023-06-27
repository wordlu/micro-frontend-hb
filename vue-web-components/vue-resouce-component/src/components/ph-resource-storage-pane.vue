<template>
    <div>
        <link rel="stylesheet" href="https://components.hubadata.com/element-ui/element-ui.css">
        <el-descriptions title="块存储">
            <el-descriptions-item label="使用状况">{{total}}</el-descriptions-item>
        </el-descriptions>
        <el-progress :text-inside="true" :stroke-width="26" :percentage="percentage"></el-progress>
        <el-descriptions title="对象存储">
            <el-descriptions-item label="使用状况">正在使用S3</el-descriptions-item>
        </el-descriptions>
        <el-alert title="暂时未开放，请等待下一个版本" type="error" show-icon :closable="false"></el-alert>
        <el-descriptions title="项目数据存储状况">
            <el-descriptions-item label="使用状况">正在使用数据目录</el-descriptions-item>
        </el-descriptions>
        <el-alert title="暂时未开放，请等待下一个版本" type="error" show-icon :closable="false"></el-alert>
    </div>
</template>
<script>
// import { staticFilePath } from '../config/envConfig'
import ElProgress from 'element-ui/packages/progress/index'
import ElDescriptions from 'element-ui/packages/descriptions/index'
import ElDescriptionsItem from 'element-ui/packages/descriptions-item/index'
import ElAlert from 'element-ui/packages/alert/index'

export default {
    components: {
        ElProgress,
        ElDescriptions,
        ElDescriptionsItem,
        ElAlert
    },
    data() {
        return {

        }
    },
    props: {
        storage: Array
    },
    mounted() {
    },
    computed: {
        total: function() {
            let result = 0
            for (let c = 0; c < this.storage.length; ++c) {
                const block = this.storage[c]
                result += block.computeTotal()
            }
            return result
        },
        percentage: function() {
            let usage = 0
            let total = 0
            for (let c = 0; c < this.storage.length; ++c) {
                const block = this.storage[c]
                total += block.computeTotal()
                usage += block.queryUsage()
            }
            if (total === 0) return 0
            else return usage / total * 100
        }
    },
    methods: {

    }
}
</script>
<style lang="scss" scoped>

</style>
