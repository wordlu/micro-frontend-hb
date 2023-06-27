<template>
    <div class="join-container">
        <link rel="stylesheet" href="https://components.hubadata.com/element-ui/element-ui.css">
        <div class="join-title">
            <div class="join-title-p">
                <h2>Join</h2>
            </div>
        </div>
        <div class="join-content" v-if="datasource">
            <div class="join-dataset-list" >
                <join-dataset-card 
                    v-for="(item, index) in datasource.datasets"
                    @addDataset="addDataset"
                    @delDataset="delDataset"
                    :hitHeightValue="hitHeightValue"
                    :key="index"
                    :index="datasource.dsIdxArr[index]"
                    :idx="index"
                    :step="datasource"
                    :dataset="item"/>
            </div>
            <div class="sel-ds" v-show="datasource.datasets.length === 0">
                <div class="title">no input dataset</div>
                <el-button @click="showAddDialog = true">请选择</el-button>
            </div>
            <div class="join-join-list" v-if="datasource" :style="joinListStyle">
                <div v-for="(item, index) in datasource.commands" :key="index">
                    <join-relation-card
                        :join-detail="item"
                        :step="datasource"
                        :datasetArray="datasetArray"
                        :index="index" />
                </div>
            </div>
            <el-dialog
                title="Add an input dataset"
                :visible.sync="showAddDialog"
                width="30%" >
                <div>
                    <div class="add-ds-content">
                        <span>dataset</span>
                        <select v-model="newDsName" onfocus="if(this.options.length>3){this.size=4}" onblur="this.size=1" onchange="this.size=1">
                            <option v-for="(op, opi) in datasetArray" :key="opi+'addds'" :value="op.name" :label="op.name" />
                        </select>
                    </div>
                    <div class="add-ds-content" v-show="datasource.datasets.length === 0">
                        <span>dataset</span>
                        <select v-model="newDsNameSecond" onfocus="if(this.options.length>3){this.size=4}" onblur="this.size=1" onchange="this.size=1">
                            <option v-for="(op, opi) in datasetArray" :key="opi+'addds'" :value="op.name" :label="op.name" />
                        </select>
                    </div>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="showAddDialog = false">Cancel</el-button>
                        <el-button type="primary" @click="addDatasetConfirm">Confirm</el-button>
                    </span>
                </div>
            </el-dialog>
			<el-dialog
                title="add schema"
                :visible.sync="showAddSchemaDialog"
                width="30%" >
                <div>
                    当前dataset没有schema，是否要进行配置？
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="showAddSchemaDialog = false">Cancel</el-button>
                        <el-button type="primary" @click="addSchematConfirm">Confirm</el-button>
                    </span>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import JoinDatasetCard from './detail-views/dataset-card'
import JoinRelationCard from './detail-views/relation-card'
import { PhJoinDefs } from "./defs"
import PhJoinStep from "./step"
import PhJoinCmd from "./cmd"
import ElButton from 'element-ui/packages/button/index'
import ElDialog from 'element-ui/packages/dialog/src/component'

export default {
    data() {
        return {
            datasource: null,
            color: ['#133883','#90a8b7','#94be8e','#ff21ee','#1ac2ab','#77bec2','#c7c7c7','#a088bd','#d66b9b','#5354ec','#acacff','#1e8103', '#ec7211','#ec7211', '#ea1c82','#2bb1ac', '#3c498c', '#000', 'blue', '#666'],
            newDsName: "",
            newDsNameSecond: "",
            showAddDialog: false,
			showAddSchemaDialog: false,
            hitHeightValue: 0
        }
    },
    props: {
        step: Object,
        schema: Object,
        datasetArray: Array,
        concretDefs: {
            type: Object,
            default: () => {
                return PhJoinDefs
            }
        }
    },
    components: {
        JoinDatasetCard,
        JoinRelationCard,
		ElButton,
		ElDialog
    },
    mounted() {
        this.datasource = new PhJoinStep(this.step)
        this.hitHeightValue = this.datasource.hitHeight()
		this.validate()
    },
    methods: {
        sortInserted() {
            this.datasource.command.insertSortCloase(this.placeholderSort)
            this.placeholderSort = "选择列"
        },
        sortDeletion(idx) {
            this.datasource.command.deleteSortCloase(idx)
        },
        keyInserted() {
            this.datasource.command.insertKeyCloase(this.placeholderKey)
            this.placeholderKey = "选择列"
        },
        keyDeletion(idx) {
            this.datasource.command.deleteKeyCloase(idx)
        },
        validate() {
			let err = 0
			this.datasource.commands.forEach(item => {
				err = err + item.on.length
			})
            const event = new Event("event")
            event.args = {
                element: this,
                param: {
                    status: false,
                    errors: err === 0
                }
            }
            this.$emit('statusChange', event)
        },
        addDataset(ds, index) {
            const dsidx = this.datasource.datasets.indexOf(ds)
            const iidx = this.datasource.dsIdxArr[dsidx]
            this.showAddDialog = true
            this.leftDsName = ds
            this.leftIndex = index ? index : iidx
        },
		addSchematConfirm() {
			this.$parent.datasource.hasNoSchema = true
			this.$parent.datasource.isMetaReady = false
			this.showAddSchemaDialog = false
			this.showAddDialog = false
		},
        addDatasetConfirm() {
			let nds = this.datasetArray.filter(it => it.name === this.newDsName)[0]
			let nsc = JSON.parse(nds["schema"])
			
			if (nsc.length === 0) {
				this.showAddSchemaDialog = true
				return false
			} else if (this.newDsNameSecond !== "") {
				let ods = this.datasetArray.filter(it => it.name === this.newDsNameSecond)[0]
				let osc = JSON.parse(ods["schema"])
				if (osc.length === 0) {
					this.showAddSchemaDialog = true
					return false
				}
			}
            let newData = {}
            let oldData = {}
            const i = Math.max(...this.datasource.dsIdxArr) + 1
            if (this.datasource.datasets.length > 0) {

                newData = {
                    name: this.newDsName,
                    index: i
                }

                oldData = {
                    name: this.leftDsName,
                    index: this.leftIndex
                }
            } else {
                oldData = {
                    name: this.newDsName,
                    index: 0
                }

                newData = {
                    name: this.newDsNameSecond,
                    index: 1
                }
            }

            this.datasource.commands.push(new PhJoinCmd({
                "datasets": [oldData, newData],
                "caseInsensitive": false,
                "normalizeText": false,
                "type": "LEFT",
                "on": []
            }))

            this.showAddDialog = false
            this.hitHeightValue = this.datasource.hitHeight()
            
            const event = new Event("event")
            event.args = {
                callback: "addDatasetFromJoin",
                element: this,
                param: {
                    name: "addDatasetFromJoin",
                    unreset: this.datasource.datasets.length > 0,
                    oldData,
                    newData
                }
            }
            this.$emit("addDatasetFromJoin", event)

             if (this.datasource.datasets.length > 0) {
                this.datasource.datasets.push(this.newDsName)
                this.datasource.dsIdxArr.push(i)
             } else {
                this.datasource.datasets.push(this.newDsName, this.newDsNameSecond)
                this.datasource.dsIdxArr.push(0, 1)
             }
        },
        delDataset(ds, index) {
            const dsidx = this.datasource.datasets.indexOf(ds)
            const iidx = this.datasource.dsIdxArr[dsidx]
            const ix = index ? index : iidx

            const arr = this.datasource.commands
            const len = arr.length-1;
            
            for (let i=len; i>=0; i--) {
                const cons = arr[i].datasets.filter(its => its.name === ds && its.index === ix)
                const conIs = arr[i].datasets[0].index > ix

                if(cons.length > 0 || conIs) {
                    arr.splice(i, 1)
                }
            }
            this.datasource.datasets = this.datasource.queryDatasets()

            const event = new Event("event")
            event.args = {
                callback: "delDatasetFromJoin",
                element: this,
                param: {
                    name: "delDatasetFromJoin",
                    datasets: this.datasource.datasets,
                    dsIdxArr: this.datasource.dsIdxArr
                }
            }
            this.$emit("delDatasetFromJoin", event)

            //TODO：可以改成 生成datasets之后去各个页面匹配不在这个列表的就删掉
        }
    },
    computed: {
        joinListStyle() {
            return "width: " + this.datasource.hitWidth() + "px; height: " + this.datasource.hitHeight() + "px"
        }
    },
    watch: {
    }
}
</script>
<style lang="scss" scoped>
    * {
        letter-spacing: .4px;
        line-height: 1.6;
        box-sizing: border-box;
    }
    .join-container {
        width: 100%;
        padding: 4px;
        display: flex;
        flex-direction: column;
        background: #fff;
        height: fit-content;
        padding: 20px;
        // min-height: calc( 100vh - 100px);
        width: calc(100vw - 300px);
        overflow: hidden;

        .add-ds-content {
            margin-bottom: 40px;
            position: relative;
            span {
                margin-right: 40px;
            }
            select {
                position: absolute;
                top: 0;
                left: 83px;
                min-height: 26px;
            }
        }
        .dialog-footer {
            display: flex;
            flex-direction: row-reverse;
        }

        .join-title {
            display: flex;
            flex-direction: column;

            .join-title-p {
                display: flex;
                flex-direction: row;
                justify-content: space-between;

                .ver-center {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;
                }
            }
        }
    }

    .join-content {
        position: relative;
        display: flex;
        flex-grow: 1;
        // overflow: auto;
        overflow-x: auto;
        overflow-y: hidden;

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
    }

    .join-dataset-list {
        display: flex;
        flex-direction: row;
    }

    .join-join-list {
        position: absolute;
        left: 30px;
        top: 100px;
        display: flex;
        flex-direction: column;
    }
</style>
