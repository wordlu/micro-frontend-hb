<template>
    <div>
        <el-dialog
                title="新建编译器"
                :visible.sync="dialogVisible"
				@close='close()'
                width="30%" >
            <el-form label-width="120px">
                <el-form-item label="编译器名称">
                    <el-input v-model="name"></el-input>
                </el-form-item>
                <el-form-item label="集群名称">
                    <el-input value="本集群" disabled></el-input>
                </el-form-item>
                <el-form-item label="集群环境">
                    <el-input value="默认环境" disabled></el-input>
                </el-form-item>
                <el-form-item label="编译器类型">
                    <select name="time" id="" v-model="selectCodeeditorType">
                        <option v-for="(item, index) in codeeditors" :value="item" :key="index">{{item}}</option>
                    </select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="$emit('cancel')">Cancel</el-button>
                <el-button type="primary" @click="confirmCreation">Confirm</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import ElButton from "element-ui/packages/button/index"
// import ElInput from "element-ui/packages/input/index"
import ElDialog from "element-ui/packages/dialog/index"
import ElForm from "element-ui/packages/form/index"
import ElFormItem from "element-ui/packages/form-item/index"
import PhDagDefinitions from "./policy/definitions/definitions"
import { Message } from 'element-ui'

export default {
    data() {
        return {
            name: "",
			visible: false,
            selectCodeeditorType: "jupyter",
            codeeditors: ["jupyter", "c9"]
        }
    },
    components: {
        ElButton,
        ElDialog,
        ElForm,
        ElFormItem
    },
    props: {
        initialName: String,
        dialogVisible: Boolean,
        defs: {
            type: Object,
            default: function () {
                return new PhDagDefinitions("1");
            }
        }
    },
    computed: {

    },
    mounted() {
        // this.name = this.initialName
    },
    methods: {
		close() {
			this.$emit("cancel")
            this.name = ''
		},
        confirmCreation() {
            if (this.name.length > 0) {
                if(this.name.length > 30){
                    Message({
                        type: 'error',
                        showClose: true,
                        duration: 3000,
                        message: '输入内容过长！'
                    })
                } else {
                    let reg = /^[A-Za-z0-9]+$/
                    if (reg.test(this.name)) {
                        const event = new Event("event")
                        event.args = {
                            callback: "createNotebook",
                            param: {
                                name: this.name,
                                type: this.selectCodeeditorType
                            }
                        }
                        this.$emit("confirm", event)
                        this.name = ''
                    } else {
                        Message({
                            type: 'error',
                            showClose: true,
                            duration: 3000,
                            message: '请勿输入特殊字符！'
                        })
                    } 
                }
            } else {
                Message({
                    type: 'error',
                    showClose: true,
                    duration: 3000,
                    message: 'Scenario名称不能为空'
                })
            }
        }
    },
	watch: {
	}
}
</script>

<style lang="scss" scoped>
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
</style>
