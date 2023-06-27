<template>
    <div>
        <div class="fit-max-dialog">
            <div class="dialog_area">
               <div class="header">
                   <p class="clear_data">Max1.0入口</p>
               </div>
                <div class="prompt">
                    <div class="item">
                        <p>输入路径:</p>
                        <input type="text" v-model="path" ref="path">
                    </div>
                    <div class="item">
                        <p>数据ID:</p>
                        <input type="text" v-model="version" ref="version" disabled @change="inputStrChecked(version, 'version', 'version')">
                    </div>
                    <div class="item">
                        <p>新建数据集:</p>
                        <input type="text" v-model="dsName" ref="dsName" @change="inputStrChecked(dsName, 'dsName', 'dsName')">
                    </div>
               </div>
               <div class="btn">
                    <button @click="close" class="cancel">取消</button>
                    <button class="clear" @click="fitMax">确定</button>
               </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            path: "",
            version: "max1.0",
            dsName: ""
        }
    },
    props: {
    },
    methods: {
        close() {
            this.$emit('closeDialog');
        },
        // 验证输入字符串时候的特殊字符
        inputStrChecked(value, ref, name) {
            // let r = /[(|)|（|）| 【|】| @ # $ % & * ^ \ - = ——\[|\] ]/;、
            // 只允许输入数字、字母、汉字、下划线
            let r = /^[a-zA-Z0-9_^\u4E00-\u9FA5]{1,}$/
            if (r.test(value)) {
                if(value.length > 30) {
                    this.$refs[ref].value = ""
                    this[name] = ""
                    alert("输入内容过长！")
                    return false;
                }
                return value
            } else {
                this.$refs[ref].value = ""
                this[name] = ""
                alert("请勿输入特殊字符！")
                return false;
            }
        },
        fitMax() {
            if(this.path == "" || this.version == "" || this.dsName == "") {
                alert("以上信息不能为空！")
                return false
            }
            const event = new Event("event")
            event.args = {
                callback: "fitMax",
                element: this,
                param: {
                    name: "fitMax",
                    path: this.path,
                    version: this.version,
                    dsName: this.dsName
                }
            }
            this.$emit('fitMaxEvent', event)
        }
    }
}
</script>

<style lang="scss" scoped>
* {
    padding: 0;
    margin: 0;
}
.fit-max-dialog {
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
    width: 800px;
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
    img {
        position: absolute;
        top: 14px;
        left: 20px;
        width: 20px;
        height: 20px;
    }
    .clear_data {
        line-height: 45px;
        margin-left: 20px;
    }
   
}
.prompt {
    width: 100%;
    margin-top: 20px;
    text-align: center;
    display: flex;
    flex-direction: column;
    margin-left: 30px;
    .item {
        display: flex;
        margin: 5px 0;
        height: 40px;
        align-items: center;
        p {
            width: 100px;
            text-align: right;
            margin-right: 10px;
        }
        input {
            height: 30px;
            border: 1px solid #979797;
            width: 600px;
            padding-left: 10px;
        }
    }
}
.btn {
    text-align: right;
    margin-bottom: 20px;
    margin-top: 20px;
    margin-right: 40px;
    button {
        border: 0;
        width: 80px;
        height: 32px;
        border-radius: 4px;
    }
    .clear {
           background-color: #5342B3;
           color: #fff;
           cursor: pointer;
    }
    .cancel {
        margin-right: 30px;
        border: 1px solid #eeedf7;
        color: #8377cc;
    }
}
// button {
    
//     position: absolute;
//     right: 0;
// 	bottom: 0;
//     border: 0;
// }
// .clear {
//     margin-right: 30px;
//     background-color:#DB4D71;
//     color: #fff;
// }
</style>