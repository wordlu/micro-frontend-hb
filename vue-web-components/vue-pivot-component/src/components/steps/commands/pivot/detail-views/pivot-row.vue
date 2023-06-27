<template>
    <div class="pivot-row1">
        <div class="pivot-row-title" >
            <h3>行定义</h3>
        </div>
        <div class="pivot-row-content" >
            <div class="pivot-row-lst">
                <div v-for="(item, index) in idf" :key="index" class="pivot-column-item">
                    <!-- <span>{{index}}</span>
                    &nbsp; -->
                    <span>{{item}}</span>
                    &nbsp;
                    <el-button type="text" @click="selectRemoveIdfColumn(index)">删除</el-button>
                </div>
            </div>
			<span class="warning-msg" v-show="idf.length === 0">若无行定义，结果数据将为单行数据!</span>
        </div>
        <div>
            <select class="sel" v-model="selectValue" @change="selectInsertIdfColumn" onfocus="if(this.options.length>3){this.size=4}" onblur="this.size=1" onchange="this.size=1">
                <option label="选择添加" value="选择添加" ></option>
                <option v-for="(op, idx) in selection" :key="idx" :label="op" :value="op" />
            </select>
        </div>
    </div>
</template>
<script>
// import ElInput from 'element-ui/packages/input/index'
import ElButton from 'element-ui/packages/button/index'
import { PhPivotDefs } from '../defs'

export default {
    data() {
        return {
            selectValue: "选择添加",
        }
    },
    props: {
        defs: {
            type: Object,
            default: () => {
                return PhPivotDefs
            }
        },
        command: Object,
        idf: Array,
        selection: Array
		
    },
    components: {
        ElButton,
        // ElInput
    },
    mounted() {

    },
    methods: {
        selectInsertIdfColumn() {
            this.command.insertIdfColumn(this.selectValue)
            this.selectValue = "选择添加"
            this.$emit("selectionChanged")
        },
        selectRemoveIdfColumn(idx) {
            this.command.removeIdfColumn(idx)
            this.$emit("selectionChanged")
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
    .pivot-row1 {
        /*margin-top: 4px;*/
        display: flex;
        flex-direction: column;
    }

    .pivot-row-content {
        display: flex;
        flex-direction: column;
        height: calc(50vh - 300px);
        overflow-y: auto;
        flex-grow: 1;
    }

    .pivot-row-op {
        display: flex;
        flex-direction: row;
        /*justify-content: space-around;*/
    }

	.warning-msg {
		font-size: 13px;
		color: #c05b0a;
		margin-bottom: 20px;
	}

    .pivot-row-lst {
        display: flex;
        flex-wrap: wrap;

		.pivot-column-item {
			display: flex;
			flex-direction: row;
			width: 210px;
			justify-content: space-between;
			align-items: center;
			background: #c4e0fe;
			margin-bottom: 10px;
			margin-right: 10px;
			font-size: 14px;
			height: 26px;
			padding: 0 20px;
			border-radius: 6px;
		}

        .pivot-row-item {
            display: flex;
            flex-direction: row;
        }
    }

	.sel {
		width: 220px;
		min-height: 26px;
		border: 1px solid #ccc;
		color: #666;
		margin-right: 2px;
	}

    .ver-mid {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

</style>
