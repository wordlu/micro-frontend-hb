<template>
    <div class="sort-sort">
        <link rel="stylesheet" href="https://components.hubadata.com/element-ui/element-ui.css">
        <div class="sort-title">
            <div class="sort-title-p">
                <h2>Sort</h2>
            </div>
        </div>
        <div v-if="datasource">
            <h3>定义排序规则</h3>
            <div class="sort-item-list" v-for="(item, index) in datasource.command.orders" :key="index">
                <div class="sort-sort-item">
                    <span class="sort-sort-title">{{item.column}}</span>
                    <div class="sort-btn-group">
                        <el-switch
                                class="topn-sort-desc-btn"
                                v-model="item.desc"
                                active-text="降序"
                                active-color="#13ce66" />
                        <el-button class="sort-del-btn" type="text" icon="el-icon-close" @click="sortDeletion(item, index)" />
                    </div>
                </div>
            </div>
            <div class="sort-add-btn">
                <select v-model="placeholderSort" @change="sortInserted" onfocus="if(this.options.length>3){this.size=4}" onblur="this.size=1" onchange="this.size=1">
                    <option value="选择列" label="选择列" />
                    <option v-for="(item, index) in schemaArray" :value="item.title" :key="index" :label="item.title" />
                </select>
            </div>
        </div>
        <div v-if="datasource">
            <h3>统计</h3>
            <div class="sort-select-items">
                <el-checkbox v-model="datasource.rowNumber">总行数计数</el-checkbox>
                <el-checkbox v-model="datasource.rank">排序</el-checkbox>
                <el-checkbox v-model="datasource.denseRank">密集排序</el-checkbox>
            </div>
        </div>
    </div>
</template>
<script>
import ElSwitch from 'element-ui/packages/switch/index'
import ElButton from 'element-ui/packages/button/index'
import ElCheckbox from 'element-ui/packages/checkbox/index'
import { PhSortDefs } from "./defs"
import PhSortStep from "./step"

export default {
    data() {
        return {
            datasource: null,
            placeholderSort: "选择列",
            schemaArray: [],
			schema: []
        }
    },
    props: {
        step: Object,
        concretDefs: {
            type: Object,
            default: () => {
                return PhSortDefs
            }
        }
    },
    components: {
        ElSwitch,
        ElButton,
        ElCheckbox
    },
    mounted() {
        this.datasource = new PhSortStep(this.step)
		this.validate()
    },
    methods: {
		renderSchema() {
			const cols = this.$parent.computeSchema()
			const colsArr = cols.map(it => it.title)
			this.datasource.command.orders = this.datasource.command.orders.filter(it => colsArr.includes(it.column))
			const arr = this.datasource.command.orders.map(it => it.column)
            this.schemaArray = cols.filter(it => !arr.includes(it.title))
			this.schema = cols
        },
        sortInserted() {
            this.datasource.command.insertSortCloase(this.placeholderSort)
			this.schemaArray = this.schemaArray.filter(it => it.title !== this.placeholderSort)
            this.placeholderSort = "选择列"
        },
        sortDeletion(item, idx) {
            this.datasource.command.deleteSortCloase(idx)
			this.schemaArray = this.schemaArray.concat(this.schema.filter(it => it.title === item.column))
        },
        validate() {
            this.renderSchema()

            const ErrorVales = this.datasource.command.orders.length === 0
            this.$emit('statusChange', ErrorVales)
        }
    },
    computed: {

    },
    watch: {
        isAllCols(n) {
            if (n) {
                this.datasource.command.retrievedCols = []
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
    .sort-sort {
        margin-top: 4px;
        min-width: 800px;
        display: flex;
        flex-direction: column;
		background: #fff;
		height: fit-content;
		padding: 20px;

        .sort-title {
            display: flex;
            flex-direction: column;

            .sort-title-p {
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

    .sort-item-list {
        display: flex;
        flex-direction: column;

        .sort-sort-item {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			font-size: 16px;

            .sort-btn-group {
                display: flex;
                flex-direction: row;
				align-items: center;
            }
        }
    }

    .sort-add-btn {
		display: flex;
		flex-direction: row;

		select {
		width: 200px;
		min-height: 26px;
		border: 1px solid #ccc;
		color: #666;
		}
	}


    .sort-del-btn {
        margin-left: 30px;
    }

    .sort-select-items {
        display: flex;
        flex-direction: column;
    }
</style>
