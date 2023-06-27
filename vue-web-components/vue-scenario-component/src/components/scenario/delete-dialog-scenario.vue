<template>
    <div>
        <div class="clear_dialog_container">
            <div class="dialog_area">
               <div class="header">
                   <img :src="model_err" alt="">
                   <p class="clear_data">删除Scenario</p>
               </div>
                <div class="prompt">
                   <p class="tip">确定删除以下Scenario吗?</p>
                   <p class="name" v-for="(item,index) in scenarioCheckedNames" :key="index+'dataset'">{{item}}</p>
               </div>
               <div class="btn">
                   <button class="clear" @click="deleteScripts">删除</button>
                      <button @click="close" class="cancel">取消</button>
               </div>
            </div>
        </div>
    </div>
</template>

<script>
import { staticFilePath } from '../../config/envConfig'

export default {
    data() {
        return {
            model_err: `${staticFilePath}` + "/modal_header_error.svg"
        }
    },
    props: {
        scenarioCheckedIds: Array,
        scenarioCheckedNames: Array
    },
    methods: {
        close() {
            this.$emit('closeDeleteScenario');
        },
        deleteScripts() {
            this.$emit('deleteScenarioEvent')
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
    z-index: 10;
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
        font-size: 16px;
    }
   
}
.prompt {
    // height: 278px;
    margin-top: 20px;
    // line-height: 180px;
    text-align: center;
    .tip {
        // text-align: center;
        font-weight: 500;
        font-size: 16px;
    }
    .round {
        display: inline-block;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: #db4d71;
    }
    .name {
        margin-top: 10px;
        color: #db4d71;
        font-size: 14px;

    }
    
}
.btn {
    // position: absolute;
    // right: 0;
    // bottom: 0;
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