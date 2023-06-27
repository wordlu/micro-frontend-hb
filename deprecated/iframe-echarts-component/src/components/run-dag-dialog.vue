<template>
    <div>
        <div class="clear_dialog_container">
            <div class="dialog_area">
               <div class="header">
                    <span>运行</span>
               </div>
               <div class="prompt">
                    <textarea name="runJson" id="" cols="30" rows="10" class="run_json" v-model="jsonValue"></textarea>
               </div>
              <div class="btn">
                  <div class="timeout">
                        <div class="title">超时时间: </div>
                        <select name="time" id="" v-model="selectTimeout">
                            <option value="60mins">60mins</option>
                        </select>
                  </div>
                  <div class="">
                        <button class="cancel" @click="close">取消</button>
                        <button class="save" @click="save">确认</button>
                  </div>
              </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return{
            selectTimeout: "60mins",
            jsonValue: ""
        }
    },
    props: {
    },
    computed: {},
    async mounted() {
    },
    watch: {
    },
    methods: {
        isJSON_test(str) {
            if (typeof str == 'string') {
                try {
                    this.jsonValue = JSON.parse(str);
                    return true;
                } catch(e) {
                    if(str != "") {
                        alert("请输入JSON字符串！")
                        return false;
                    } else {
                        return true
                    }
                }
            }
        },
        save() {
            let isJSON = this.isJSON_test(this.jsonValue)
            if(!isJSON) return false
            const event = new Event("event")
            event.args = {
                callback: "runDag",
                element: this,
                param: {
                    name: "runDag",
                    timeout: parseFloat(this.selectTimeout),
                    jsonValue: this.jsonValue == "" ? {} : this.jsonValue
                }
            }
            this.$emit('confirmeRunDag', event)
        },
        close() {
            this.$emit('closeRunDagDialog');
        }
    }
}
</script>

<style lang="scss" scoped>
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
.clear_dialog_container {
    height: 100vh;
    width: 100vw;
    // background: rgba(37,35,45,0.55);
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
    width: 600px;
    height: 560px;
    border: 1px solid #ddd;
    background-color: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    box-sizing: border-box;
}
.header {
    height: 60px;
    border-bottom: 1px solid #ddd;
    line-height: 60px;
    padding: 20px;
    font-weight: 500;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .close_icon {
        width: 24px;
        height: 24px;
        cursor: pointer;
    }
}
.prompt {
    height: 440px;
    padding-left: 40px;
    padding-top: 20px;
    box-sizing: border-box;
    .run_json {
        width: 520px;
        height: 350px;
        background: #FFFFFF;
        border: 1px solid #ccc;
    }
}
.btn {
    position: absolute;
    right: 23px;
    bottom: 15px;
    display: flex;
    justify-content: space-between;
    width: 530px;
    box-sizing: border-box;
    .timeout {
        display: flex;
        select {
            width: 72px;
            height: 24px;
            background: #FFFFFF;
            border: 0.5px solid #979797;
            margin-left: 10px;
        }
    }
    button {
        width: 60px;
        height: 28px;
        border: 0;
        cursor: pointer;
    }
    .cancel {
        margin-right: 20px;
        // background-color:#DB4D71;
        color: #7163C5;
    }
    .save {
        background-color: #7163C5;
        color: #fff;
    }
}
</style>