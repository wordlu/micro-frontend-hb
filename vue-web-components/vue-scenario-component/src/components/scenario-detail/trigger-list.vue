<template>
    <div class="scenario-triggers">
        <div class="scenario-trigger-create">
            <h2>触发条件</h2>
            <select class="add-trigger-select" ref="addNewTriggerSelect" @click="addNewTriggerClick"
                @change="addNewTrigger(triggerTimeData)" placeholder="添加触发条件" value="添加触发条件" name="" id=""
                v-model="triggerTimeData">
                <option value="添加触发条件" label="添加触发条件"></option>
                <option v-for="item in options" :key="item.index" :label="item.desc" :disabled="item.disable"
                    :value="item.cat">{{item.desc}}</option>
            </select>
        </div>
        <el-collapse>
            <el-collapse-item 
                v-for="(item, index) in triggers" 
                :key="index" 
                v-show="item.deleted === false"
                @change="changeTrigger(item,index)">
                <template slot="title">
                    <div class="scenario-trigger-item-title">
                        <!-- <select 
                            v-model="item.mode" @change="item.edited = true">

                            <option 
                                v-for="iter in options"
                                :key="iter.index"
                                :label="iter.desc"
                                :value="iter.cat"
                                :disabled="iter.disable">{{item.desc}}</option>
                        </select> -->
                        <div @click.stop class="input-con">
                            <input v-model="item.name" class="trigger-input" @input="changeName(item,index)">
                        </div>
                        <div @click.stop style="width:40px;height:20px;position:relative;">
                            <el-switch v-model="item.active" disabled @change="item.edited = true" class="el-switch">
                            </el-switch>
                        </div>
                        <el-button class="el-icon-close scenario-trigger-item-delbtn" @click="item.deleted = true">
                        </el-button>
                    </div>
                </template>
                <el-form 
                    :model="item" 
                    v-if="item.mode == 'timer'" 
                    label-width="120px" 
                    style="margin-top:20px;"
                    :label-position="labelPosition">
                    <el-form-item label="重复时间间隔" class="date">
                        <el-col :span="6" class="minute">
                            <el-input v-model="item.value" @change="changeTime(item,index)"
                                :class="isNotTrue(item.value) ? 'isEmpty' : ''"></el-input>
                            <span v-show="isNotTrue(item.value)">请输入参数！</span>
                        </el-col>
                        <el-col class="line" :span="4">&nbsp;</el-col>
                        <el-col :span="11">
                            <select class="time-space" v-model="item.period" placeholder="时间间隔"
                                @change="item.edited = true">
                                <option v-for="iter in period" :key="iter.desc" :label="iter.desc" :value="iter.cat"
                                    :disabled="iter.disable">></option>
                            </select>
                        </el-col>
                    </el-form-item>
                    <el-form-item class="time" label="开始时间">
                        <datetime @change="item.edited = true" format="YYYY-MM-DD H:i:s" v-model="item.start">
                        </datetime>
                    </el-form-item>
                    <el-form-item label="时区" class="area">
                        <el-input disabled value="北京时间"></el-input>
                    </el-form-item>
                </el-form>
                <el-form 
                    class="dataset-trigger" 
                    :model="item" 
                    v-else-if="item.mode == 'dataset'" 
                    label-width="120px"
                    :label-position="labelPosition">
                    <el-form-item label="数据集">
                        <div v-for="(its,is) in item.dsNames" :key="its+is" class="trigger-area">
                            <!-- <select class="sel-dataset" v-model="obj.value">
                                <option 
                                    v-for="(iter, index) in datasetsAll" 
                                    :key="iter.name+index"
                                    :value="iter.name"
                                    :label="iter.name">{{item.label}}
                                </option>
                            </select> -->
                            <select class="sel-dataset" @change="changeData($event, is, item)">
                                <option  
                                    v-for="(it,i) in datasetsAll" 
                                    :selected="it.name === its.name"
                                    :key="it+i">{{it.name}}</option>
                            </select>
                            <img class="del-icon" :src="del_icon" @click="del_dataset_trigger(item, is)" v-if="is !== 0">
                        </div>
                    </el-form-item>
                    <el-form-item label="">
                        <el-button class="add-ds" type="primary" @click="addDataset(item)">增加数据集</el-button>
                    </el-form-item>
                    <el-form-item label="数据集完成更新" class="datasetTime">
                        <el-input disabled value=""></el-input>
                        <span>分钟后，开始运行</span>
                    </el-form-item>
                </el-form>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
import ElCollapse from "element-ui/packages/collapse/index"
import ElCollapseItem from "element-ui/packages/collapse-item/index"
import ElSwitch from "element-ui/packages/switch/index"
import ElForm from "element-ui/packages/form/index"
import ElFormItem from "element-ui/packages/form-item/index"
import ElInput from "element-ui/packages/input/index"
import ElCol from "element-ui/packages/col/index"
import ElButton from "element-ui/packages/button/index"
import moment from 'moment'
import datetime from 'vuejs-datetimepicker'
import { staticFilePath } from '../../config/envConfig'
// import { Message } from 'element-ui'

export default {
    data() {
        return {
            val: "",
            options: [
                {
                    index: 0,
                    cat: "timer",
                    desc: "基于时间自动运行",
                    disable: false
                },
                {
                    index: 1,
                    cat: "dataset",
                    desc: "基于数据集更新的自动运行",
                    disable: false
                }
            ],
            period: [
                {
                    cat: "second",
                    desc: "秒",
                    disable: true
                },
                {
                    cat: "minute",
                    desc: "分钟",
                    disable: false
                },
                {
                    cat: "hour",
                    desc: "小时",
                    disable: false
                },
                {
                    cat: "day",
                    desc: "天",
                    disable: false
                },
                {
                    cat: "week",
                    desc: "周",
                    disable: false
                },
                {
                    cat: "month",
                    desc: "月",
                    disable: false
                }
            ],
            labelPosition: 'left',
            isEmpty: false,
            triggerId: [],
            triggerArr: [],
            dialogVisible: false,
            dsName: '',
            del_icon: `${staticFilePath}/delete_r.svg`,
            triggerTimeData: '添加触发条件',
            datasetName: ''
        }
    },
    props: {
        triggers: {
            type: Array,
            default: function(){
                [
                    {
                        "dsNames": [
                            "胖胖胖1",
                            "vcb"
                        ],
                        "mode": "dataset",
                        "name": "基于数据集更新的自动运行",
                        "active": false,
                        "scenarioId": "ggjpDje0HUC2JW_4c584129d9f6415aa8b5bcfcfba085d4",
                        "id": "92186975BCF468B6",
                        "index": 0,
                        "traceId": "9c82603c7ecc4e0ebf46023541a23fbc",
                        "edited": false,
                        "deleted": false
                    }
                ]
            }
        },
        datasetsAll: Array,
        scenarioId: String
    },
    components: {
        ElCollapse,
        ElCollapseItem,
        // ElSelect,
        // ElOption,
        ElSwitch,
        ElForm,
        ElFormItem,
        ElInput,
        ElCol,
        // ElDatePicker,
        ElButton,
        datetime
        // VueTimepicker,
        // Datepicker
    },
    computed: {

    },
    mounted() {
        // this.getDataObj()
    },
    watch: {
        
    },
    methods: {
        del_dataset_trigger(data, i) {
            data.dsNames.splice(i,1)
        },
        getDataObj(){
            let Data = this.triggers.filter(it => it.mode == 'dataset')
            if(Data.length !== 0){
                Data.forEach((value)=>{
                    value.dsNames.forEach(i=>{
                        this.obj[i] = i
                    })
                })
            }
            
        },
        addDataset(item){
            item.dsNames.push({
                name: ""
            })
        },
        changeData(e, i, data){
            const val = e.target.value
            data.dsNames[i].name = val
        },
        changeName(item,index){
            this.triggers[index].name = item.name
        },
        changeTime(item,index){
            if(this.isNotTrue(item.value)){
                this.isEmpty = true
            }else{
                this.isEmpty = false
                this.triggers[index].value = item.value
            }

            let indexId = this.triggerId.indexOf(index)
            if (indexId >= 0){
                this.triggerId.splice(indexId, 1, index)
                this.triggerArr.splice(indexId, 1, this.isEmpty)
            } else {
                this.triggerArr.push(this.isEmpty)
                this.triggerId.push(index)
            }
            this.$emit('isTriggerTrue',this.triggerArr)
        },
        isNotTrue(item){
            if (item.length == 0){
                return true
            } else {
                return false
            }
        },
        changeTrigger(item, index){
            this.triggers[index].name = item.name
            this.triggers[index].value = item.value
            this.triggers[index].period = item.period
            this.triggers[index].start = item.start
        },
        addNewTriggerClick() {
            this.$refs.addNewTriggerSelect.value = "添加触发条件"
            this.triggerTimeData = '添加触发条件'
        },
        addNewTrigger(value) {
            const result = {}
            const idx = this.triggers.length > 0 ? 1 + Math.max(...this.triggers.map(x => x.index)) : 0
            if (value == 'timer') {
                result["name"] = '基于时间自动运行'
                result["start"] = moment().format('YYYY-MM-DD HH:m:s')
                result["period"] = "minute"
                result["value"] = 10
                result["timezone"] = "中国北京"
                result["mode"] = "timer"
                result["active"] = false
                result["scenarioId"] = this.scenarioId
                result["id"] = this.genId()
                result["index"] = idx
                result["resourceArn"] = ""
                result["traceId"] = this.genId()
                result["edited"] = true
                result["deleted"] = false
                this.triggers.push(result)
            } else {
                result["name"] = '基于数据集更新的自动运行'
                result["mode"] = "dataset"
                result["active"] = false
                result["scenarioId"] = this.scenarioId
                result["id"] = this.genId()
                result["index"] = idx
                result["resourceArn"] = ""
                result["dsNames"] = [{name: ""}]
                result["traceId"] = this.genId()
                result["edited"] = true
                result["deleted"] = false
                this.triggers.push(result)
            }
            this.$refs.addNewTriggerSelect.value = "添加触发条件"
            this.triggerTimeData = '添加触发条件'
        },
        genId(len=16, radix=16) {
            const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
            let uuid = [], i;
            radix = radix || chars.length;

            if (len) {
                // Compact form
                for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
            } else {
                // rfc4122, version 4 form
                var r;

                // rfc4122 requires these characters
                uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
                uuid[14] = '4';

                // Fill in random data.  At i==19 set the high bits of clock sequence as
                // per rfc4122, sec. 4.1.5
                for (i = 0; i < 36; i++) {
                    if (!uuid[i]) {
                        r = 0 | Math.random()*16;
                        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
                    }
                }
            }

            return uuid.join('');
        }
    }
}
</script>

<style lang="scss">
    
    /deep/.year-month-wrapper{
        background-color: #409eff !important;
    }

    input{
        // min-width: 226px;
        // width:100%;
        height: 30px;
        padding: 3px;
        border: 1px solid #ddd;
    }
    .input-con{
        width:226px;
        height:30px;
        margin-right: 170px;
        position: relative;
    }
    .trigger-input{
        width: 226px;
        height: 24px;
        min-width: none;
        border-radius: 5px;
        padding-left: 10px;
        position: absolute;
        top:0;
        left:0;
    }
    .minute{
        position: relative;
        .el-input__inner {
            height: 32px;
        }
        span{
            color: red;
            font-size: 12px;
            position: absolute;
            top: 26px;
            left: 0;
        }
    }
    .isEmpty{
        height: 32px;
        line-height: 32px;
        border: 1px solid red;
        border-radius: 4px;
    }
    
    .datasetTime{
        .el-form-item__content{
            display: flex;
            flex-direction: row;
        }
        .el-input {
            width: 40px;
            margin-right: 10px;
            height: 30px;
        }
        .el-input__inner{
            width: 40px;
            height: 30px;
        }
    }
    .el-switch{
        height: 30px !important;
        // margin-left: 170px;
        line-height: 40px;
        position: absolute !important;
        top:0;
        left:0;
    }
    .el-collapse-item__header{
        position:relative;
    }
    .el-collapse-item__arrow{
        position: absolute;
        top: 15px;
        left: 6px;
        font-size: 18px;
    }
    .calender-div{
        min-width: 270px;
        box-shadow: 1px 2px 5px #ccc;
        background: #FFF;
        position: relative !important;
        display: inline-block;
        left: 0;
        top: 35px;
        color: #444;
        font-size: 14px;
        margin-bottom: 15px;
        z-index: 100;
    }
    .port, .days{
        display: inline-block;
        width: 30px;
        height: 30px;
        padding: 5px 3px;
        margin: 2px;
        border-radius: 2px;
        text-align: center;
        vertical-align: top;
        cursor: pointer;
    }
    /deep/.days{
        color: #409eff !important;
        font-weight: bold;
    }
    /deep/.port:hover{
        color: #409eff !important;
        font-weight: bold;
    }
    /deep/.activePort, .activePort:hover {
        background-color: #409eff !important;
        color: white;
    }
    .month-setter, .year-setter{
        margin: 0 1px;
        width: 48.2%;
        color: white;
        font-weight: 900;
        display: inline-block;
    }
    .nav-l:hover, .nav-r:hover {
        background-color: #dc3c00;
    }
    /deep/.nav-l, .nav-r {
        display: inline-block;
        width: 25px;
        background-color: #409eff !important;
        color: white;
        font-size: 16px;
        cursor: pointer;
        border: 0;
        padding: 7px;
        margin:0;
    }
    .nav-l:focus, .nav-r:focus{
        outline: none;
    }
    .nav-l{
        float: left;
    }
    .nav-r{
        float: right;
    }
    .month, .year{
        width: 40px;
        text-align: right;
        display: inline-block;
        color: white;
        padding: 7px 0;
    }
    /* .headers>span{

    } */
    .hour-selector, .minute-selector{
        width: 30px;
        display: inline-block;
        text-align: center;
        font-weight: bold;
        position: relative;
        cursor: pointer;
    }
    .time-separator{
        display: inline-block;
        font-weight: bold;
    }
    .time-picker{
        margin: 10px
    }
    .nav-t, .nav-d{
        font-weight: bold;
        cursor: pointer;
    }
    .scroll-hider {
        display: none;
        vertical-align:top;
        overflow:hidden;
        border:0;
        position: absolute;
        top: -40px;
        left: 0;
        box-shadow: 0 0 3px #333;
        background-color: white;
    }
    .scroll-hider ul {
        padding:5px;
        margin:-5px -13px -5px -5px;
        list-style-type: none;
        height: 100px;
        overflow: auto;
        width:55px;
        color: #999;
        overflow-x: hidden;
    }
    .showSelector{
        display:inline-block;
    }
    /deep/li.active{
        background-color: #409eff !important;
        color: white;
    }
    li{
        padding: 4px;
        font-size: 16px;
        width: 100%;
        cursor: pointer;
    }
    .time-picker{
        display: inline-block;
    }
    .noDisplay{
        display: none;
    }
    /deep/.okButton{
        color: #409eff !important;
        font-size: 15px;
        font-weight: bold;
        padding: 0;
        float: right;
        border: 0;
        margin-right: 10px;
        margin-top: 10px;
        cursor: pointer;
        background: transparent;
    }

    .scenario-triggers {
        // border: 1px solid #666;
        background-color: #fff;
        margin: 1px auto !important;
        padding: 14px 36px !important;
        width: 800px;
        margin-bottom: 40px !important;
        display: flex;
        flex-direction: column;

        .dataset-trigger {
            margin-top:20px;

            .del-icon {
                width: 20px;
                height: 20px;
                cursor: pointer;
                margin-top: 2px;
            }

            .trigger-area {
                display:flex;
                flex-direction: row;

                .sel-dataset {
                    height: 30px;
                    border-radius: 4px;
                    width: 451px;
                    margin-bottom:10px;
                }
            }
        }

        

        .time-space {
            // width: 60px;
            // height: 40px;
            border: 1px solid #DCDFE6;
            color: #666;
            width: 200px;
            height: 32px;
            min-width: none;
            border-radius: 5px;
            padding-left: 10px;
        }

        .scenario-trigger-create {
            height: 60px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            margin-bottom: 10px;
            align-items: center;
            .add-trigger-select {
                height: 24px;
            }
        }
        
        .time {
            .el-form-item__content {
                display: flex;
            }
            .datetime-picker{
                // margin-left: 200px;
                position: relative;
            }
            #tj-datetime-input{
                width: 438px;
                height: 24px;
                // min-width: none;
                border-radius: 5px;
                padding-left: 10px;
                position: absolute;
                top:0;
                left:0;
            }
        }
        .area{
            .el-input__inner{
                width: 453px;
                height: 32px;
                // min-width: none;
                border-radius: 5px;
                padding-left: 10px;
            }
        }
        .scenario-trigger-item-title {
            display: flex;
            flex-direction: row;
            // justify-content: space-between;
            flex-grow: 1;
            padding-left: 234px;
            height: 30px;

            .scenario-trigger-item-delbtn {
                border: none !important;
                line-height: 0;
                margin-left: 14px;
                padding: 8px;
            }
        }
     }
</style>
