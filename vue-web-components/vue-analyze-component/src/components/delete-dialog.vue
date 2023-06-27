<template>
    <div>
        <div class="clear_dialog_container">
            <div class="dialog_area">
               <div class="header">
                   <img :src="model_err" alt="">
                   <p class="clear_data">删除数据集</p>
               </div>
                <div class="prompt">
                   	<p class="tip">删除这些项将会有以下影响:</p>
					<div class="item" v-for="(item,index) in datasetRelaResult" :key="index+'dataset'">
						<span>删除脚本 </span>
						<span class="jobname"> {{item.jobShowName}}</span>
						<span class="jobtype"> ({{item.type}})</span>
					</div>
               </div>
               <div class="btn">
                   <button class="clear" @click="deleteDatasets">删除</button>
                      <button @click="close" class="cancel">取消</button>
               </div>
            </div>
        </div>
    </div>
</template>

<script>
import { staticFilePath } from '../config/envConfig'

export default {
    data() {
        return {
            model_err: `${staticFilePath}` + "/modal_header_error.svg"
        }
    },
    props: {
        datasetcheckedIds: Array,
        datasetcheckedNames: Array,
        datasetRelaResult: Array
    },
    methods: {
        close() {
            this.$emit('closeDeleteDialog');
        },
        deleteDatasets() {
            const event = new Event("event")
            event.args = {
                callback: "deleteDatasets",
                element: this,
                param: {
                    name: "deleteDatasets",
                    selectedTags: this.selectedTags,
                    datasetRelaResult: this.datasetRelaResult
                }
            }
            this.$emit('deleteDatasetsEvent', event)
        }
    }
}
</script>

<style lang="scss" scoped>
* {
    padding: 0;
    margin: 0;
}
.clear_dialog_container {
   	height: 100vh;
    width: 100vw;
    background: rgba(37,35,45,0.55);
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9999;
    justify-content: center;
    align-items: center;
	background: rgba(0,0,0,0.31);
}
.dialog_area {
    position: relative;
    width: 500px;
    // height: 400px;
    border: 1px solid #ddd;
    background-color: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%)
}
.header {
    display: flex;
    position: relative;
    height: 45px;
    border-bottom: 1px solid #ddd;
    // line-height: 45px;
    // padding-left: 30px;
    img {
        position: absolute;
        top: 14px;
        left: 20px;
        width: 20px;
        height: 20px;
    }
    .clear_data {
        line-height: 45px;
        margin-left: 50px;
    }
   
}
.prompt {
    margin-top: 20px;
	text-align: left;
    padding-left: 20px;
	max-height: 200px;
	overflow: auto;	
    .tip {
        // text-align: center;
        font-weight: 500;
    }
	.item {
		display: flex;
		flex-wrap: nowrap;
		margin-top: 10px;
        color: #db4d71;
        font-size: 14px;
		.jobname {
			width: 230px;
			overflow: hidden;
			display: block;
			text-overflow: ellipsis;
			height: 24px;
		}
	}
    .round {
        display: inline-block;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: #db4d71;
    }
    
}
.btn {
    margin-left: 280px;
    margin-bottom: 20px;
    margin-top: 20px;
    button {
        border: 0;
        width: 80px;
        height: 32px;
    }
    .clear {
           margin-right: 30px;
           background-color:#DB4D71;
           color: #fff;
           cursor: pointer;
    }
    .cancel {
        border: 1px solid #eeedf7;
        color: #8377cc;
    }
}
</style>