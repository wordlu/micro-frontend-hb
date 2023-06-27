<template>
    <div class="code_container">
        <link rel="stylesheet" href="https://components.hubadata.com/element-ui/element-ui.css">
        <div class="header">
            <div class="title">
                <img src="" alt="">
                <span>{{allData.scriptName}}</span>
            </div>
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane>
                <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
                <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
                <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
            </el-tabs>
            <div class="actions">
                <el-select v-model="value" placeholder="请选择">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>
       
    </div>
</template>

<script>
import ElInput from 'element-ui/packages/input/index'
import ElTabs from 'element-ui/packages/tabs/index'
import ElTabPane from 'element-ui/packages/tab-pane/index'
import ElSelect from 'element-ui/packages/select/index'
import ElOption from 'element-ui/packages/option/index'
import ElButton from 'element-ui/packages/button/index'

export default {
    data() {
        return {
            activeName: '',
            options: [{
                value: '选项1',
                label: '黄金糕'
            }, {
                value: '选项2',
                label: '双皮奶'
            }],
            value: ''
        }
    },
    props: {
        allData: {
            type: Object,
            default: function() {
                return {
                    fileName: "filename",
                    projectName: "projectName",
                    scriptName: "test"
                }
            }
        }
    },
    components: {
        ElInput,
        ElTabs,
        ElTabPane,
        ElSelect,
        ElOption,
        ElButton
    },
    methods: {
        handleClick(tab, event) {
            console.log(tab, event);
        }
    }
}
</script>

<style lang="scss" scoped>
    
</style>
