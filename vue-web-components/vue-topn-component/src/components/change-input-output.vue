<template>
   <div class="input-output">
       <div class="left">
            <div class="title">Input</div>
            <div class="input-selected" v-show="!selectInput">
                <div class="name" 
                    :key="item+index"
                    v-for="(item,index) in inputsArray">{{item}}</div>
                <el-button 
                    @click="changeInput"
                    type="primary">更换</el-button>
            </div>
            <div class="input-for-select" v-show="selectInput">
                <div class="search">
                    <el-form label-width="60px">
                        <el-form-item label="搜索">
                            <el-input
                                placeholder="搜索"
                                v-model="searchInputName"></el-input>
                        </el-form-item>
                    </el-form>
                    <i 
                        @click="selectInput=!selectInput"
                        class="el-icon-close pointer"></i>
                </div>
                <ul class="list">
                    <li 
                        @click="selectInputItem(item)"
                        class="addInput pointer" 
                        :key="item+'input'" 
                        v-for="item in inArray">
                        <i class="el-icon-plus pointer mr-4"></i>
                        {{item}}
                    </li>
                </ul>
            </div>
        </div>
        <div class="right">
            <div class="title">Output</div>
            <div class="input-selected"  v-show="!selectOutput">
                <div class="name" 
                    :key="item+index"
                    v-for="(item,index) in outputsArray">{{item}}</div>
                <el-button 
                    @click="changeOutput"
                    type="primary">更换</el-button>
            </div>
            <div class="input-for-select" v-show="selectOutput">
                <div class="search">
                    <el-form label-width="60px">
                        <el-form-item label="搜索">
                            <el-input
                                placeholder="搜索"
                                v-model="searchInputName"></el-input>
                        </el-form-item>
                    </el-form>
                    <i class="el-icon-close pointer" 			
                        @click="selectOutput=!selectOutput"></i>
                </div>
                <ul class="list">
                    <li 
                        @click="selectOutputItem(item)"
                        class="addInput pointer" 
                        :key="item+'output'" 
                        v-for="item in outArray">
                        <i class="el-icon-plus pointer mr-4"></i>
                        {{item}}
                    </li>
                </ul>
            </div>
        </div>
   </div>
</template>
<script>
import ElForm from "element-ui/packages/form/index"
import ElFormItem from "element-ui/packages/form-item/index"
import ElInput from "element-ui/packages/input/index"
import ElButton from 'element-ui/packages/button/index'

export default {
    components: {
        ElInput,
        ElButton,
        ElForm,
        ElFormItem
    },
    data() {
        return {
            outputsArray: [],
            inputsArray: [],
            searchInputName: "",
            selectInput: false,
            selectOutput: false,
			inOutCount: 0
        }
    },
    props: {
        outputs: Array,
        inputs: Array,
        inArray: Array,
        outArray: Array
    },
    methods: {
		changeOutput() {
			this.inOutCount++
			this.selectOutput=!this.selectOutput
		},
		changeInput() {
			this.inOutCount++
			this.selectInput=!this.selectInput
		},
        selectInputItem(data) {
            this.inputsArray = []
            this.inputsArray.push(data)
            this.selectInput = !this.selectInput
        },
        selectOutputItem(data) {
            this.outputsArray = []
            this.outputsArray.push(data)
            this.selectOutput = !this.selectOutput
        },
        save(transition) {
            const event = new Event("event")
            event.args = {
                callback: "changScriptInputOutput",
                element: this,
                param: {
                    outputsArray: this.outputsArray,
                    inputsArray: this.inputsArray,
                    transition: transition
                }
            }
            this.$emit('changScriptInputOutput', event)
        }
    },
    mounted() {},
    watch: {
        "inputs": function(n) {
            this.inputsArray = n
        },
        "outputs": function(n) {
            this.outputsArray = n
        }
    }
}
</script>
<style lang="scss">

</style>

