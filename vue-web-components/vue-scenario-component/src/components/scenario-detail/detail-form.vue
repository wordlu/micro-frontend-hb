<template>
    <div class="scenario-detail">
        <h2>运行</h2>
        <el-form :model="scenario"  :label-position="labelPosition">
            <el-form-item label="自动触发" prop="delivery">
                <el-switch v-model="scenario.active" class="switch"></el-switch>
            </el-form-item>
            <el-form-item label="运行用户名" class="user">
                <el-input disabled v-model="scenario['show-name']"></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
// import { staticFilePath } from '../../config/envConfig'
import ElForm from "element-ui/packages/form/index"
import ElFormItem from "element-ui/packages/form-item/index"
import ElSwitch from "element-ui/packages/switch/index"
import ElInput from "element-ui/packages/input/index"
import ScenarioPolicy from "./policy/scenario-policy"

export default {
    components: {
        ElForm,
        ElFormItem,
        ElSwitch,
        ElInput
    },
    data() {
        return {
            labelPosition:'left',
            projectName: '',
            projectId: '',
        }
    },
    props: {
        scenario: Object,
        policy: {
            type: Object,
            default: () => {
                return new ScenarioPolicy('1')
            }
        }
    },
    computed: {

    },
    mounted() {
        this.projectId = this.getUrlParam("projectId")
        this.projectName = this.getUrlParam("projectName")
     },
    watch: {

    },
    methods: {
        getUrlParam(value) {
            let href = window.location.href
            let paramArr = href.split("?")[1].split("&")
            let data = paramArr.find(item => item.indexOf(value) > -1)
            return data ? decodeURI(data).split("=")[1] : undefined
        },
        saveScenario() {
            const result = this.policy.createOrUpdateScenarioIndex(this.scenario)
            if (result) {
                alert("save scenario success")
            } else {
                alert("save scenario error")
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
    }

    .scenario-detail {
        // border: 1px solid #666;
        margin: 1px auto;
        padding: 14px 36px;
        width: 800px;
		margin-bottom: 40px;
        background-color: #ffffff;
    }

    .el-form-item__content{
        position: relative;
        .el-switch{
            width:40px;
            position: absolute;
            top:4px;
            left: 555px;
        }
    }
    .el-form {
        margin-left: 75px;
         .user{
            .el-input{
                width:430px;
                height:32px;
            }
            /deep/.el-input__inner{
                width:430px;
                height: 32px !important;
            }
        }
    }
</style>
