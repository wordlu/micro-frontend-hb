<template>
   <div class="input-output">
       <div class="left">
            <div class="title">Input</div>
            <div class="input-selected" v-show="!selectInput">
                <div class="name" 
                    :key="item+index"
                    v-for="(item,index) in inputsArray">{{item}}</div>
                <el-button 
                    @click="selectInput=!selectInput"
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
                    @click="selectOutput=!selectOutput"
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
            selectOutput: false
        }
    },
    props: {
        outputs: Array,
        inputs: Array,
        inArray: Array,
        outArray: Array
    },
    methods: {
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
        save() {
            const event = new Event("event")
            event.args = {
                callback: "changScriptInputOutput",
                element: this,
                param: {
                    outputsArray: this.outputsArray,
                    inputsArray: this.inputsArray,
                }
            }
            this.$emit('changScriptInputOutput', event)
        }
    },
    mounted() {
        // this.inputsArray = this.inputs 
        // this.outputsArray = this.outputs
    },
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
.input-output {
	width: 100%;
	flex-grow: 1;
	display: flex;
	flex-direction: row;
	height: calc(100vh - 100px);
	background: #f2f2f2;
	.pointer {
		cursor: pointer;
	}
	.left {
		flex: 1;
		padding: 20px;
	}
	.right {
		flex: 1;
		padding: 20px;
	}
	.title {
		margin-bottom: 10px;
	}

	.input-selected {
		width: 100%;
		display: flex;
		flex-direction: column;

		.name {
			height: initial;
			line-height: 41px;
			padding: 10px 15px;
			margin: 2px 15px -2px 15px;
			background: #ffffff;
			box-shadow: 1px 1px 4px -1px #dddddd;
			margin: 5px 0px 5px 0px;
		}

		button {
			margin: 20px auto;
			width: 250px;
		}
	}

	.input-for-select {

		.search {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-bottom: 10px;
			border-bottom: 1px solid #ccc;

			.el-form-item {
				margin-bottom: 0;
			}
		}

		.list {
			padding: 0;
			margin: 0;
			font-size: 15px;
			color: #666666;

			.addInput {
				list-style: none;
				height: 41px;
				line-height: 41px;
				padding: 0px 28px 0px 28px;
				box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
				border-bottom: 1px solid #ccc;
			}

			.mr-4 {
				margin-right: 4px;
			}
		}
	}
}
</style>

