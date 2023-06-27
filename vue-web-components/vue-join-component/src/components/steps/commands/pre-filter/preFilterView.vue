<template>
    <div class="pre-filter">
        <link rel="stylesheet" href="https://components.hubadata.com/element-ui/element-ui.css">
        <div class="condition-title">
            <div class="condition-title-p">
                <h2>Pre Filter</h2>
            </div>
        </div>
        <div class="condition-ds-container" v-if="datasource">
            <div class="sel-ds" v-show="datasource.commands.length === 0">
                <div class="title">no input dataset</div>
                <el-button @click="$emit('addDataset')">请选择</el-button>
            </div>
            <div class="condition-ds-item" v-for="(item, index) in datasource.commands" :key="index">
                <div class="condition-ds-item-title">
                    <h3>{{item.meta.name}}</h3>
                    <div class="ver-center" >
                        <!-- <el-switch v-model="item.meta.enabled" ></el-switch> -->
                        <el-button type="text" @click="$emit('addDataset', item.meta.name, item.meta.index)">添加</el-button>
                        <el-button type="text" @click="$emit('delDataset', item.meta.name, item.meta.index)">删除</el-button>
                    </div>
                </div>
                <div class="condition-ds-item-content">
                    <div class="switch">
                        <div class="item">
                            <div class="title">Distinct</div>
                            <el-switch v-model="item.meta.distinct"  @change="validate()"></el-switch>
                        </div>
                        <div class="item">
                            <div class="title">Filter</div>
                            <el-switch v-model="item.meta.enabled"  @change="validate()"></el-switch>
                        </div>
                    </div>
                    <div v-show="item.meta.enabled">
                        <div class="error-msg" v-show="item.detail.cloases && item.detail.cloases.length === 0">需要添加至少一个Filter条件！</div>
                        <el-form class="show-filter">
                            <el-form-item label="保留符合条件的列">
                                <select v-model="item.detail.action">
                                    <option v-for="(it, index) in concretDefs.actions" :value="it.cal" :key="index" :label="it.desc" />
                                </select>
                            </el-form-item>
                        </el-form>
                        <div class="condition-selection">
                            <div class="condition-selection-item" v-for="(cur, index) in item.detail.cloases" :key="index">
                                <div class="condition-selection-content">
                                    <select v-model="cur['left']">
                                        <option v-for="(it, index) in schema[item.meta.name]" :value="it.src" :key="index" :label="it.src" />
                                    </select>
                                    <select v-model="cur['op']">
                                        <option v-for="(item, index) in concretDefs.includes" :value="item.cal" :key="index" :label="item.desc" />
                                    </select>
                                    <el-input 
                                        v-if="cur['op'] !== 'EXISTS' && cur['op'] !== 'NOT-EXISTS'" 
                                        v-model="cur['right']" 
                                        :class="[{'el-input-error': cur['right'] === ''}]">
                                    </el-input>
                                    <el-input v-else disabled ></el-input>
                                </div>
                                <el-button type="text" @click="item.detail.delcloases(index)">删除</el-button>
                            </div>
                        </div>
                        <div class="condition-add-button">
                            <el-button type="primary" @click="addFilter(item)">添加</el-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { PhPreFilterDefs } from "./defs"
import ElForm from 'element-ui/packages/form/index'
import ElFormItem from 'element-ui/packages/form-item/index'
import ElInput from 'element-ui/packages/input/index'
import ElButton from 'element-ui/packages/button/index'
import ElSwitch from 'element-ui/packages/switch/index'
import PhFilterStep from "./step"
import PhPreFilterCmd from "./cmd"

export default {
    data() {
        return {
            datasource: null
        }
    },
    props: {
        step: Object,
        schema: Object,
        datasetArray: Array,
        concretDefs: {
            type: Object,
            default: () => {
                return PhPreFilterDefs
            }
        }
    },
    components: {
        ElFormItem,
        ElForm,
        ElInput,
        ElButton,
        ElSwitch
    },
    // updated() {
    mounted() {
        this.datasource = new PhFilterStep(this.step)
        this.validate()
    },
    methods: {
        validate() {
            const enabled = this.datasource.commands.filter(it => it.meta.enabled).length > 0
            const distinct = this.datasource.commands.filter(it => it.meta.distinct).length > 0
            let ErrorVales = false
            let error = 0
            if (enabled) {
                this.datasource.commands.forEach(item => {
                    if(item.meta.enabled) {
                        const len1 = item.detail.cloases.filter(it =>  it['op'] !== 'EXISTS' && it['op'] !== 'NOT-EXISTS' && it['right'].replace(/\s*/g,"").length === 0)
                        error = error + len1.length
                        const len2 = item.detail.cloases.length === 0
                        if (len2) error = error + 1
                    }
                })
                ErrorVales = error > 0
            }

            const event = new Event("event")
            event.args = {
                element: this,
                param: {
                    onlyDistinct: distinct && !enabled,
                    status: !enabled && !distinct,
                    errors: ErrorVales
                }
            }
            this.$emit('statusChange', event)
        },
        addFilter(item) {
            const leftDs = this.datasetArray.filter(it => it.name === item.meta.name)[0]
            const ls = JSON.parse(leftDs["schema"])
            item.detail.insertcloases(ls[0].src)
        },
        updateData(n, o, unreset) {
            console.log(n, o)
            if (!unreset) {
                this.datasource.commands.push({
                    meta: {
                        "name": o.name,
                        "index": o.index,
                        "distinct": false,
                        "enabled": false,
                    },
                    detail: new PhPreFilterCmd("")
                })
            }
            this.datasource.commands.push({
                 meta: {
                    "name": n.name,
                    "index": n.index,
                    "distinct": false,
                    "enabled": false,
                },
                detail: new PhPreFilterCmd("")
            })
        },
        deleteData(dss, ids) {
            this.datasource.commands.forEach((itds, i) => {
                if(!dss.includes(itds.meta.name) || !ids.includes(itds.meta.index)) {
                    delete this.datasource.commands[i]
                }
            })
            this.datasource.commands = this.datasource.commands.filter(it => it)
        }
    },
    computed: {

    }
}
</script>
<style lang="scss" scoped>
    * {
        letter-spacing: .4px;
        line-height: 1.6;
        box-sizing: border-box;
    }
    .pre-filter {
        width: 100%;
        padding: 4px;
        display: flex;
        flex-direction: column;
        background: #fff;
        padding: 20px;
        flex-grow: 1;
		width: calc(100vw - 300px);

        .sel-ds {
            margin: 10px auto;
            display: flex;
            flex-direction: column;
            .title {
                color: #666666;
                font-size: 13px;
                margin-bottom: 20px;
            }
        }

        .condition-title {
            display: flex;
            flex-direction: column;

            .condition-title-p {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
            }
        }

        .condition-selection {
            margin-top: 30px;

            .condition-selection-item {
                display: flex;
                flex-direction: row;
                margin-bottom: 10px;
            }

            .condition-selection-content {
                display: flex;
                flex-direction: row;

            }
        }

        .condition-ds-container {
            display: flex;
            flex-direction: row;
            flex-grow: 1;
			overflow-x: scroll;
        }
        .condition-ds-item:nth-child(odd) {
            background-color: rgb(242, 242, 242)
        }
        .condition-ds-item {
            width: 500px;
            margin: 1px;
            border: 1px dashed #aaa;
            border-top: none;
			min-width: 500px;

            .condition-ds-item-title {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                padding: 0 10px;
                border: 1px solid #ddd;
                height: 40px;
                background: #fff;

                .ver-center {
                    display: flex;
                }
            }

            .condition-ds-item-content {
                padding: 32px;

                .el-input-error {
                    /deep/input.el-input__inner {
                        border-color: #ce1228;
                    }
                }
                
                .error-msg {
                    font-size: 13px;
                    color: #ce1228;
                }
                .switch {
                    display: flex;
                    flex-direction: column;

                    .title {
                        font-size: 16px;
                        font-weight: bold;
                    }

                    .item {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 10px;
                        padding-bottom: 10px;
                        border-bottom: 1px solid #ccc;
                    }
                }

                .show-filter {
                    margin-top: 40px;
                }

                .el-input {
                    /deep/input.el-input__inner {
                        height: 48px;
                    }
                }
            }

            .condition-add-button {
                display: flex;
                flex-direction: row;
                justify-content: space-around;
                margin-top: 80px;
            }
        }
    }
</style>
