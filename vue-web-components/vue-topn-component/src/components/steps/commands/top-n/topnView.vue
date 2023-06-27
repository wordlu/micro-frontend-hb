<template>
    <div class="topn-container">
        <link rel="stylesheet" href="https://components.hubadata.com/element-ui/element-ui.css">
        <div class="topn-title">
            <div class="topn-title-p">
                <h2>Top N</h2>
            </div>
        </div>
        <div class="topn-content" v-if="datasource">
            <div class="topn-container-rows">
                <h3 class="title">检索</h3>
				<div class="error-msg" v-show="datasource.command.firstRows === 0 && datasource.command.lastRows === 0">请选择检索行数！</div>
                <el-form label-width="60px" >
                    <el-form-item label="顶部行">
                        <el-input-number 
							:min="0"
							v-model="datasource.command.firstRows"></el-input-number>
                    </el-form-item>
                    <el-form-item label="底部行">
                        <el-input-number 
							:min="0"
							v-model="datasource.command.lastRows"></el-input-number>
                    </el-form-item>
                </el-form>
            </div>
            <div class="topn-container-sort">
                <h3 class="title">排序</h3>
				<div class="error-msg" v-show="datasource.command.orders.length === 0">请选择至少一个排序条件列！</div>
                <div class="topn-sort-item-list" v-for="(item, index) in datasource.command.orders" :key="index">
                    <div class="topn-sort-item">
                        <span class="topn-sort-title">{{item.column}}</span>
                        <div topn-sort-btn-group>
                            <!-- <el-switch
                                    class="topn-sort-desc-btn"
                                    v-model="item.desc"
                                    active-text="降序"
                                    active-color="#13ce66" /> -->
							<img class="sort-icon" v-show="!item.desc" @click="item.desc = !item.desc" :src="defs.iconsByName('topn', 'asce')" alt="">
							<img class="sort-icon" v-show="item.desc" @click="item.desc = !item.desc" :src="defs.iconsByName('topn', 'desc')" alt="">
                            <el-button class="topn-sort-del-btn" type="text" icon="el-icon-close" @click="sortDeletion(item, index)" />
                        </div>
                    </div>
                </div>
                <div class="topn-add-btn">
                    <select v-model="placeholderSort" @change="sortInserted" onfocus="if(this.options.length>3){this.size=4}" onblur="this.size=1" onchange="this.size=1">
                        <option value="选择列" label="选择列" />
                        <option v-for="(item, index) in schemaArray" :value="item.title" :key="index" :label="item.title" />
                    </select>
                </div>
            </div>
            <div class="topn-container-group">
                <h3 class="title">分组</h3>
                <el-radio-group v-model="datasource.command.isAllCols">
                    <el-radio :label="true">全数据集</el-radio>
                    <el-radio :label="false">按照分组计算</el-radio>
                </el-radio-group>
				<div class="error-msg" v-show="!datasource.command.isAllCols && datasource.command.keys.length === 0">请选择至少一个分组条件列！</div>
                <div class="topn-keys disabled" v-if="datasource.command.isAllCols" >
                    <div class="topn-sort-item-list" v-for="(item, index) in datasource.command.keys" :key="index">
                        <div class="topn-sort-item">
                            <span class="topn-sort-title">{{item}}</span>
                        </div>
                    </div>
                    <div class="topn-add-btn">
                        <select v-model="placeholderKey" >
                            <option v-for="(item, index) in schemaArray" :value="item.title" :key="index" :label="item.title" />
                            <option value="选择列" label="选择列" />
                        </select>
                    </div>
                </div>
                <div class="topn-keys" v-else >
                    <div class="topn-sort-item-list" v-for="(item, index) in datasource.command.keys" :key="index">
                        <div class="topn-sort-item">
                            <span class="topn-sort-title">{{item}}</span>
                            <el-button class="topn-sort-del-btn" type="text" icon="el-icon-close" @click="keyDeletion(item, index)" />
                        </div>
                    </div>
                    <div class="topn-add-btn">
                        <select v-model="placeholderKey" @change="keyInserted" onfocus="if(this.options.length>3){this.size=4}" onblur="this.size=1" onchange="this.size=1">
                            <option value="选择列" label="选择列" />
                            <option v-for="(item, index) in schemaArray" :value="item.title" :key="index" :label="item.title" />
                        </select>
                    </div>
                </div>
            </div>
            <el-divider></el-divider>
            <div class="topn-additional">
                <h3  class="title">对每一行进行</h3>
                <el-checkbox v-model="datasource.command.duplicateCount">总行数计数</el-checkbox>
                <el-checkbox v-model="datasource.command.rowNumber">显示行号</el-checkbox>
                <el-checkbox v-model="datasource.command.rank">排序</el-checkbox>
                <el-checkbox v-model="datasource.command.denseRank">密集排序</el-checkbox>
            </div>
        </div>

    </div>
</template>
<script>
import ElButton from 'element-ui/packages/button/index'
import ElCheckbox from 'element-ui/packages/checkbox/index'
import ElDivider from 'element-ui/packages/divider/index'
import ElRadioGroup from 'element-ui/packages/radio-group/index'
import ElRadio from 'element-ui/packages/radio/index'
// import ElSwitch from 'element-ui/packages/switch/index'
import ElInputNumber from 'element-ui/packages/input-number/index'
import ElForm from 'element-ui/packages/form/index'
import ElFormItem from 'element-ui/packages/form-item/index'
import { PhTopNDefs } from "./defs"
import PhDefinitions from '../../../policy/definitions/definitions'
import PhTopNStep from "./step"

export default {
    data() {
        return {
            datasource: null,
            placeholderSort: "选择列",
            placeholderKey: "选择列",
			schemaArray: [],
			schema: []
        }
    },
    props: {
        step: Object,
        // schema: Array,
        concretDefs: {
            type: Object,
            default: () => {
                return PhTopNDefs
            }
        },
		defs: {
            type: Object,
            default: function() {
                return new PhDefinitions(1)
            }
        }
    },
    components: {
        ElFormItem,
        ElForm,
        ElInputNumber,
        ElButton,
        ElCheckbox,
        ElRadioGroup,
        ElRadio,
        // ElSwitch,
        ElDivider
    },
    mounted() {
        this.datasource = new PhTopNStep(this.step)
		this.validate()
    },
    methods: {
		renderSchema() {
			const schemas = this.$parent.computeSchema()

			const columns = schemas.map(it => it.title)
			this.datasource.command.orders = this.datasource.command.orders.filter(it => columns.includes(it.column))
			this.datasource.command.keys = this.datasource.command.keys.filter(it => columns.includes(it))

			const orders = this.datasource.command.orders.map(it => it.column)
			const keys = this.datasource.command.keys.map(it => it)
			const arrs = orders.concat(keys)
			this.schemaArray = schemas.filter(it => !arrs.includes(it.title))
			this.schema = this.schemaArray
		},
		addtionCols() {
			let arr = []
			if (this.datasource.command.duplicateCount) {
				arr.push({
					type: "bigint",
					title: "__duplicate_count"
				})
			}

			if (this.datasource.command.rowNumber) {
				arr.push({
					type: "bigint",
					title: "__row_number"
				})
			}

			if (this.datasource.command.rank) {
				arr.push({
					type: "bigint",
					title: "__rank"
				})
			}

			if (this.datasource.command.denseRank) {
				arr.push({
					type: "bigint",
					title: "__dense_rank"
				})
			}

			return arr
		},
        sortInserted() {
            this.datasource.command.insertSortCloase(this.placeholderSort)
			this.schemaArray = this.schemaArray.filter(it => it.title !== this.placeholderSort)
            this.placeholderSort = "选择列"
        },
        sortDeletion(item, idx) {
            this.datasource.command.deleteSortCloase(idx)
			const schemaItem = this.schema.filter(it => it.title === item.column)
			if (schemaItem.length > 0) {
				this.schemaArray = this.schemaArray.concat(schemaItem)
			}
        },
        keyInserted() {
            this.datasource.command.insertKeyCloase(this.placeholderKey)
			this.schemaArray = this.schemaArray.filter(it => it.title !== this.placeholderKey)
            this.placeholderKey = "选择列"
        },
        keyDeletion(item, idx) {
            this.datasource.command.deleteKeyCloase(idx)
			const schemaItem = this.schema.filter(it => it.title === item.column)
			if (schemaItem.length > 0) {
				this.schemaArray = this.schemaArray.concat(schemaItem)
			}
        },
        validate() {
			this.renderSchema()
			const ErrorVales = 
				(this.datasource.command.firstRows < 1 && this.datasource.command.lastRows < 1) || 
				this.datasource.command.orders.length === 0 || 
				(!this.datasource.command.isAllCols && this.datasource.command.keys.length === 0)
            this.$emit('statusChange', ErrorVales)
        }
    },
    computed: {},
	watch: {
		"datasource.command.isAllCols": function(n) {
			if (n) { 
				this.datasource.command.keys = []
			}
		}
	}
}
</script>
<style lang="scss" scoped>
    * {
        letter-spacing: .4px;
        line-height: 1.6;
        box-sizing: border-box;
    }
    .topn-container {
        margin-top: 4px;
        /*width: 100%;*/
        min-width: 800px;
        padding: 4px;
        display: flex;
        flex-direction: column;    
        background: #fff;
        height: fit-content;
        padding: 20px;

        .topn-title {
            display: flex;
            flex-direction: column;

            .topn-title-p {
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

        .topn-content {
			/deep/input.el-input__inner {
				height: 23px;
			}
			.title {
				margin: 10px 0;
			}
			.el-form-item {
				margin-bottom: 0;
			}
			.error-msg {
				font-size: 13px;
				color: #ce1228;
			}
        }

        .topn-sort-item-list {
            display: flex;
            flex-direction: column;

            .topn-sort-item {
                display: flex;
				flex-direction: row;
				align-items: center;

				.sort-icon {
					width: 16px;
				}

                .topn-sort-btn-group {
                    display: flex;
                    flex-direction: row;
                }
            }
        }
        .topn-add-btn {
            display: flex;
            flex-direction: row;
			margin-top: 10px;
			select {
				width: 300px;
				min-height: 26px;
				border: 1px solid #ccc;
				color: #666;
			}
        }

        .topn-container-group {
            display: flex;
            flex-direction: column;

        }

        .disabled {
            pointer-events: none;
            opacity: 0.4;
        }

        .topn-sort-title {
            // text-align: center;
            vertical-align: middle;
			vertical-align: middle;
			padding: 3px 10px;
			min-width: 200px;
			max-width: 400px;
			border-radius: 4px;
			background-color: #c4e0fe;
			font-size: 13px;
			color: #333;
			margin-right: 30px;
        }

        .topn-sort-del-btn {
            margin-left: 30px;
        }

        .topn-additional {
            margin-top: 30px;

            display: flex;
            flex-direction: column;
        }
    }
</style>
