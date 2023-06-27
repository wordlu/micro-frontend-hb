<template>
    <div>
        <link rel="stylesheet" href="https://components.hubadata.com/element-ui/element-ui.css">
        <div class="clear_dialog_container">
            <div class="dialog_area">
               <div class="header">
                    <div class="left">
                        <p class="dataset_name">新建 {{runtimeShow[runtime]}} 脚本</p>
                    </div>
                    <img :src="img1" alt="" class="close_icon" @click="close">
               </div>
               <div class="prompt">
                    <div class="left">
                        <div class="title">输入数据</div>
                        <div class="left_content content_area">
                            <!-- 选中的input -->
                            <div class="select_dataset_list" v-show="!datasetListShow">
                                <div class="select_dataset_list_area">
                                    <div class="select_dataset" v-for="(item,index) in addDatasetList" :key="item+index">
                                        <div class="sel_name">
                                            <img :src="sel_dataset_icon" alt="" class="sel_dataset_icon">
                                            <span :title="item.name" class="title title_name">{{item.name}}</span>
                                        </div>
                                        <img :src="del_icon" class="del_icon" @click="on_clickdeldataset(item, index)" alt="">
                                    </div>
                                </div>
                                <el-button class="add" type="primary" v-if="singleInputRuntime.includes(runtime) && addDatasetList.length > 0" @click="on_clickAddInput">更改</el-button>
                                <el-button class="add" type="primary" v-else @click="on_clickAddInput">增加</el-button>
                            </div>
                            <!-- 未选的input -->
                            <div class="addInput" v-show="datasetListShow">
                                <div class="search_area">
                                    <div class="search_input">
                                        <el-input placeholder="搜索" v-model="searchInput"  class="search_row"></el-input>
                                        <img :src="search_row" class="search_row_icon" alt="">
                                    </div>
                                    <img class="close" 
                                        @click="closeAddDs()" 
                                        :src="defs.iconsByName('close', 'red')" alt="">
                                </div>
                                <div class="dataset_list">
                                    <div @click="addDataset(item)" class="dataset" v-for="(item,index) in remainDatasetListSearch" :key="item+index">
                                        <img :src="add_icon" alt="" class="add_icon">
                                        <span class="name" :title="item.name">{{item.name}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="right">
                        <div class="title">输出数据</div>
                        <!-- 新建output -->
                        <div class="right_content" v-show="!datasetOutputListShow  && showOldDataset">
                            <div class="add_ds">
                                <span class="ds_title">添加数据集</span>
                            </div>
                            <div class="input_area">
                                <div class="input_list">
                                    <span class="label">名称</span>
                                    <el-input v-model="dsName.name" placeholder="" ref="newDs" @change="inputStrChecked(dsName.name, 'newDs', 'dsName')"></el-input>
                                </div>
                                <!-- 正常新建脚本 -->
                                <div class="input_list" v-if="runtime!=='download'">
                                    <span class="label">存储到</span>
                                    <el-input placeholder="" value="本集群" :disabled="true">></el-input>
                                </div>
                                <div class="input_list" v-if="runtime!=='download'">
                                    <span class="label">格式</span>
                                    <el-input placeholder="" value="SQL" :disabled="true">></el-input>
                                </div>
                                <!-- 下载 -->
                                 <div class="input_list" v-if="runtime === 'download'">
                                    <span class="label">存储到</span>
                                    <el-input placeholder="请输入路径" v-model="path"></el-input>
                                </div>
                                <div class="input_list" v-if="runtime === 'download'">
                                    <span class="label">格式</span>
                                    <bpSelectVue :choosedValue="format" :src='select_icon'>
                                        <bpOptionVue text="Parquet" @click="changeFormat('Parquet')" :choosedValue="format"></bpOptionVue>
                                        <bpOptionVue text="CSV" @click="changeFormat('CSV')" :choosedValue="format"></bpOptionVue>
                                    </bpSelectVue>
                                </div>
                            </div>
                            <div class="btn_area">
                                <el-button class="add_input" :disabled="dsName.length  == 0" type="primary" @click="on_clickAddOutput">增加</el-button>
                            </div>
                            <!-- <div class="tab">
                                <div class="new_data" @click="satasetTab('new')">新数据集</div>
                                 ｜ 
                                <div class="old_data" @click="satasetTab('old')">现有数据集</div>
                            </div> -->
                        </div>
                        <!-- 已选中output -->
                        <div class="change" v-show="datasetOutputListShow && showOldDataset">
                            <div class="select_dataset">
                                <div class="sel_name">
                                    <img :src="sel_dataset_icon" alt="" class="sel_dataset_icon">
                                    <span class="title selectedName" :title="dsName.name">{{dsName.name}}</span>
                                </div>
                                <img :src="del_icon" class="del_icon" @click="on_clickChangeOutput(item)" alt="">
                            </div>
                            <div class="btn_area">
                                <el-button class="add_input" :disabled="dsName.length  == 0" type="primary" @click="on_clickChangeOutput">更改</el-button>
                            </div>
                        </div>
                        <!-- 选择现有output -->
                        <!-- <div class="oldDatasetList" v-show="!showOldDataset">
                             <el-input placeholder="搜索" v-model="searchOutput"  class="search_row"></el-input>
                            <img :src="search_row" class="search_row_icon" alt="">
                            <div class="dataset_list">
                                <div @click="addOldDataset(item)" class="dataset" v-for="(item,index) in remainDatasetListOutputsSearch" :key="item+index">
                                    <img :src="add_icon" alt="" class="add_icon">
                                    <span class="name" :title="item.name">{{item.name}}</span>
                                </div>
                            </div>
                            <div class="tab">
                                <div class="new_data" @click="satasetTab('new')">新数据集</div>
                                 ｜ 
                                <div class="old_data" @click="satasetTab('old')">现有数据集</div>
                            </div>
                        </div> -->
                    </div>
               </div>
              <div class="btn">
                    <button class="cancel" @click="close">取消</button>
                    <button class="save" @click="save">保存</button>
              </div>
            </div>
        </div>
    </div>
</template>

<script>
import ElButton from "element-ui/packages/button/index"
import ElInput from "element-ui/packages/input/index"
import bpSelectVue from '../../node_modules/vue-components/src/components/bp-select-vue.vue'
import bpOptionVue from '../../node_modules/vue-components/src/components/bp-option-vue.vue'
import { staticFilePath } from '../config/envConfig'
import PhDagDefinitions from "./policy/definitions/definitions";

export default {
    data() {
        return{
            img1: `${staticFilePath}` + "/icon_close.svg",
            add_icon: `${staticFilePath}` + "/add.svg",
            search_row: `${staticFilePath}` + "/%E6%90%9C%E7%B4%A2.svg",
            datasetListShow: false,
            datasetOutputListShow: false, //显示选中的output
            searchInput: "",
            searchOutput: "",
            addDatasetList: [], //已经选中的输入数据
            remainDatasetList: [], //剩余未选中的输入数据
            remainDatasetListOutputs: [],  //剩余未选中的输出数据
            sel_dataset_icon: `${staticFilePath}` + "/%E7%BB%93%E6%9E%9CDS.svg",
            del_icon: `${staticFilePath}` + "/%E5%88%A0%E9%99%A4+(1).svg",
            select_icon: `${staticFilePath}` + "/drop_down_icon.svg",
            dsName: {
                name: "",
                id: ""
            },
            oldDatasetList: [], //现有数据集
            showOldDataset: true,
            path: "",
            format: "请选择",
            runtimeShow: {
                "python3": "Python",
                "pyspark": "PySpark",
                "r": "R",
                "sparkr": "SparkR",
                "prepare": "Prepare",
                "distinct": "Distinct",
                "sort": "Sort",
                "topn": "Topn",
                "sync": "Sync",
                "join": "Join",
                "stack": "Stack",
                "group": "Group",
                "pivot": "Pivot"
            },
            singleInputRuntime: ["group", "sync", "topn", "sort", "distinct", "prepare"]
        }
    },
    components: {
        ElButton,
        ElInput,
        bpSelectVue,
        bpOptionVue
    },
    props: {
        datasets: Array,
        runtime: String,
        defs: {
            type: Object,
            default: function () {
                return new PhDagDefinitions("1");
            }
        }
    },
    computed: {
        remainDatasetListSearch: function() {
            //input未选中列表
            let searchValue = this.searchInput
            let remainDatasetListInputData = this.remainDatasetList.filter(item => item.cat !== "output_index")
            if(searchValue) {
                return remainDatasetListInputData.filter(item => item.name.toLowerCase().indexOf(searchValue.toLowerCase()) > -1)
            }
            return remainDatasetListInputData
        },
        remainDatasetListOutputsSearch: function() {
            // output未选中列表
            let searchValueOutput = this.searchOutput
            let remainDatasetListOutputsData = this.remainDatasetList.filter(item => item.cat === "output_index" || item.cat === "intermediate")
            if(searchValueOutput) {
                return remainDatasetListOutputsData.filter(item => item.name.toLowerCase().indexOf(searchValueOutput.toLowerCase()) > -1)
            } 
            return remainDatasetListOutputsData
        }
    },
    mounted() {
        //输入输出数据的dataset列表
        let that = this
        this.remainDatasetList = []
        this.remainDatasetListOutputs = []
        this.datasets.forEach((item, index) => {
            that.remainDatasetList.push({
                name: item.name,
                id: item.id,
                cat: item.cat
            })
            that.remainDatasetListOutputs.push({
                name: item.name,
                id: item.id,
                cat: item.cat
            })
        })
    },
    methods: {
        closeAddDs() {
            this.datasetListShow = false
        },
        changeFormat(data) {
            this.format = data
        },
        save() {
            if(this.addDatasetList.length > 0 && this.datasetOutputListShow && this.showOldDataset && this.dsName.name) {
                /**
                 * 1. 先判断output是新增还是选择原有数据
                 * 2. 若新增，生成一个id,创建一个dataset，否则直接3
                 * 3. 调用赵的接口，往action里面插数据
                */
                const event = new Event("event")
                event.args = {
                    callback: "createScripts",
                    element: this,
                    param: {
                        name: "createScripts",
                        jobName: "compute_" + this.dsName.name,
                        jobId: "",
                        targetJobId: "",
                        inputs: this.addDatasetList,
                        outputs: [{
                            "name": this.dsName.name,
                            "id": this.dsName.id
                        }],
                        jobVersion: this.dsName.name + "_version1",
                        runtime: this.runtime,
                        labels: [],
                        path: this.path,
                        format: this.format
                    }
                }
                this.$emit("createScripts", event)
            } else {
                alert("请填写输入数据和输出数据！")
            }
        },
        // 验证输入字符串时候的特殊字符
        inputStrChecked(value, ref, dsname) {
            // let r = /[(|)|（|）| 【|】| @ # $ % & * ^ \ - = ——\[|\] ]/;、
            // 只允许输入数字、字母、汉字、下划线
            let r = /^[a-zA-Z0-9_^\u4E00-\u9FA5]{1,}$/
            if (r.test(value)) {
                if(value.length > 30) {
                    this.$refs[ref].value = ""
                    this[dsname].name = ""
                    alert("输入内容过长！")
                    return false;
                }
                return value
            } else {
                this.$refs[ref].value = ""
                this[dsname].name = ""
                alert("请勿输入特殊字符！")
                return false;
            }
        },
        close() {
            this.$emit("closeCreateDialog")
        },
        on_clickAddInput() {
            //增加input
            this.datasetListShow = true
        },
        on_clickAddOutput() {
            let tds = this.remainDatasetListOutputs.filter(item => item.name == this.dsName.name)
            if(tds.length > 0) {
                alert("数据集重复!")
                return false
            }
            //新增output
            if(this.runtime != "download" && this.dsName.name && this.dsName.name !== "") {
                this.datasetOutputListShow = true
            } else if(this.runtime === "download" && this.path !== "" && this.format !== "请选择" && this.dsName.name && this.dsName.name !== "") {
                this.datasetOutputListShow = true
            } else {
                alert("请输入完整数据!")
            }
        },
        on_clickChangeOutput() {
            this.datasetOutputListShow = false
            this.dsName.name = ""
        },
        addDataset(data) {
            this.datasetListShow = false
            // 可多选input流程
            if(!this.singleInputRuntime.includes(this.runtime)) {
                this.addDatasetList.push(data)
                this.remainDatasetList.splice(this.remainDatasetList.indexOf(data), 1)
            } else {
                // 只能选择一个input流程
                if(this.addDatasetList.length > 0) {
                    let selData = this.addDatasetList[0]
                    this.remainDatasetList.push(selData)
                    this.addDatasetList = []
                }
                this.addDatasetList.push(data)
                this.remainDatasetList.splice(this.remainDatasetList.indexOf(data), 1)
            }
        },
        on_clickdeldataset(data, index) {
            //删除dataset
            this.remainDatasetList.push(data)
            this.addDatasetList.splice(index, 1)
        },
        satasetTab(data) {
            //切换tab
            if(data == "old") {
                this.showOldDataset = false
            } else {
                this.showOldDataset = true
            }
        },
        addOldDataset(data) {
            this.dsName = JSON.parse(JSON.stringify(data))
            this.showOldDataset = true
            this.datasetOutputListShow = true
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
    z-index: 10;
    justify-content: center;
    align-items: center;
    background: rgba(0,0,0,0.31);
}
.dialog_area {
    width: 560px;
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
    background: #fff;
    color: #000;
    .left {
        display: flex;
        align-items: center;
        .label {
            width: 20px;
            height: 20px;
            margin-right: 5px;
        }
        .dataset_name {
            height: 60px;
            white-space: nowrap;
            overflow: hidden;
            width: 400px;
            text-overflow: ellipsis;
            line-height: 60px;
            cursor: pointer;
        }
    }
    .close_icon {
        width: 24px;
        height: 24px;
        cursor: pointer;
    }
}
.prompt {
    height: 440px;
    border-bottom: 1px solid #ccc;
    box-sizing: border-box;
    display: flex;
    .title {
        height: 40px;
        display: flex;
        justify-content: center;
        padding: 10px;
        border-bottom: 1px solid #ccc;
    }
    .title_name {
        display: block;
        border-bottom: none;
        font-size: 14px;
        width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .content_area {
        padding: 20px;
        .search_area {
            display: flex;
            align-items: center;
            padding-bottom: 20px;
            .search_input {
                height: 40px;
            }
            .close {
                cursor: pointer;
                margin-left: 10px;
            }
        }
        button {
            width: 100%;
            height: 40px;
            min-height: 40px;
            margin-top: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .select_dataset_list {
            display: flex;
            flex-direction: column;
            .select_dataset_list_area {
                max-height: 300px;
                overflow: auto;
                width: 240px;
                overflow-x: hidden;
            }
        }
        .select_dataset {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border: 1px solid #ccc;
            padding: 10px;
            height: 40px;
            width: 225px;
            margin-bottom: 10px;
            border-radius: 5px;
            .sel_name {
                display: flex;
                align-items: center;
            }
            .del_icon {
                cursor: pointer;
            }
            img {
                width: 14px;
                height: 14px;
            }
        }
        /deep/input.el-input__inner {
            padding-left: 40px;
        }
        .search_row_icon {
            width: 20px;
            position: relative;
            top: -30px;
            left: 10px;
        }
        .dataset_list {
            display: flex;
            flex-direction: column;
            font-size: 14px;
            height: 230px;
            overflow: auto;
            .dataset {
                display: flex;
                align-items: center;
                padding: 10px 0;
                border-top: 1px solid #ccc;
                cursor: pointer;
                .add_icon {
                    width: 12px;
                    height: 12px;
                    margin-right: 10px;
                }
                .name {
                    width: 180px;
                    display: block;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
            .dataset:hover {
                color: #0088cc
            }
            .dataset:last-of-type {
                border-bottom: 1px solid #ccc;
            }
        }
    }
    .right {
        width: 280px;
        .select_dataset {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border: 1px solid #ccc;
            padding: 10px;
            height: 40px;
            margin-bottom: 10px;
            border-radius: 5px;
            margin: 20px;
            .sel_name {
                display: flex;
                align-items: center;

                .selectedName {
                    display: block;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    width: 180px;
                    white-space: nowrap;
                }
            }
            .del_icon {
                cursor: pointer;
            }
            img {
                width: 14px;
                height: 14px;
            }
        }

        .btn_area {
            width: 100%;
            display: flex;
            justify-content: center;
            .add_input {
                margin: 0 20px;
                width: 100%;
                text-align: center;
                height: 40px;
            }
        }
        .oldDatasetList {
            padding: 20px;
            /deep/input.el-input__inner {
                padding-left: 40px;
            }
            .tab {
                display: flex;
                margin-top: 55px;
                justify-content: center;
                font-size: 12px;
                cursor: pointer;
            }
            .search_row_icon {
                width: 20px;
                position: relative;
                top: -30px;
                left: 10px;
            }
            .dataset_list {
                display: flex;
                flex-direction: column;
                font-size: 14px;
                height: 230px;
                height: 230px;
                overflow: auto;
                .dataset {
                    display: flex;
                    align-items: center;
                    padding: 10px 0;
                    border-top: 1px solid #ccc;
                    cursor: pointer;
                    .add_icon {
                        width: 12px;
                        height: 12px;
                        margin-right: 10px;
                    }
                }
                .dataset:hover {
                    color: #0088cc
                }
                .dataset:last-of-type {
                    border-bottom: 1px solid #ccc;
                }
            }
        }
    }
    .right_content {
        .add_ds {
            height: 40px;
            line-height: 40px;
            padding-left: 20px;
            border-bottom: 1px solid #ccc;
        }
        .input_area {
            padding: 10px 20px;
        }
        .btn_area {
            width: 100%;
            display: flex;
            justify-content: center;
            .add_input {
                margin: 0 20px;
                width: 100%;
                text-align: center;
            }
        }
        .tab {
            display: flex;
            margin-top: 55px;
            justify-content: center;
            font-size: 12px;
            cursor: pointer;
        }
        .input_list {
            .label {
                font-size: 14px;
                display: block;
                margin: 5px 0;
            }
            .bp-select {
                border: 1px solid #DCDFE6;
                background: #fff;
            }
        }
    }
    .left {
        width: 280px;
        border-right: 1px solid #ccc;
    }
}
.btn {
    position: absolute;
    right: 23px;
    bottom: 15px;
    button {
        width: 60px;
        height: 28px;
        border: 0;
        cursor: pointer;
    }
}
.cancel {
    margin-right: 20px;
    color: #409EFF;
    border-radius: 4px;
}
.save {
    background-color: #409EFF;
    color: #fff;
    border-radius: 4px;
}
</style>