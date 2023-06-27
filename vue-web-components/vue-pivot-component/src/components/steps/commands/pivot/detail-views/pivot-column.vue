<template>
    <div class="pivot-column1">
        <div class="pivot-column-title">
            <h3>列定义</h3>
        </div>
        <div class="pivot-column-content">
            <div class="pivot-column-lst">
                <div v-for="(item, index) in kc" :key="index" class="pivot-column-item">
                    <span>{{item}}</span>
                    &nbsp;
                    <el-button type="text" @click="selectDeleteDeyColumn(index)">删除</el-button>
                </div>
                <span class="error-msg" v-show="kc.length === 0">需要添加至少一个列定义!</span>
            </div>
        </div>
        <div class="pivot-column-select">
            <select class="sel" v-model="selectValue" @change="selectAddKeyColumn" onfocus="if(this.options.length>3){this.size=4}" onblur="this.size=1" onchange="this.size=1">
                <option label="选择添加" value="选择添加"></option>
                <option v-for="(op, idx) in selection" :key="idx" :label="op" :value="op" />
            </select>
        </div>
        <div class="pivot-column-op">
            <span style="height:26px;">Pivot Values: &nbsp;</span>
            <select class="sel" v-model="pivotedColumnType" disabled>
                <option v-for="(item, index) in defs.pivotTypes" :key="index" :label="item.desc" :value="item.cal" />
            </select>
            <el-input disabled style="width: 220px;"></el-input>
        </div>
    </div>
</template>
<script>
import ElInput from 'element-ui/packages/input/index'
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
        kc: Array,
        selection: Array,
        pivotedColumnType: String
    },
    components: {
        ElButton,
        ElInput
    },
    mounted() {

    },
    methods: {
        selectAddKeyColumn() {
            this.command.insertKeyColumn(this.selectValue)
            this.selectValue = "选择添加"
            this.$emit("selectionChanged")
        },
        selectDeleteDeyColumn(idx) {
            this.command.removeKeyColumn(idx)
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
    .pivot-column1 {
        /*margin-top: 4px;*/
        display: flex;
        flex-direction: column;
        position: relative;
    }
    .pivot-column-select {
        height: 87px;
        position: absolute;
        bottom: -99px;
        left: 0;
        z-index: 10;
    }

    .pivot-column-content {
        display: flex;
        flex-direction: column;
        height: calc(50vh - 310px);
        overflow: auto;
        flex-grow: 1;
    }

    .pivot-column-op {
		display: flex;
		align-items: center;
		font-size: 14px;
		color: #666;
		// margin-top: -10px;
        position: absolute;
        left: 0;
        bottom: -87px;
    }

    .pivot-column-lst {
        display: flex;
		flex-wrap: wrap;
        // overflow-y: auto;

		.error-msg {
			font-size: 13px;
			color: #ce1228;
			margin-right: 20px;
		}

        .pivot-column-item {
            display: flex;
			flex-direction: row;
			width: 220px;
			justify-content: space-between;
			align-items: center;
			background: #c4e0fe;
			margin-bottom: 10px;
			margin-right: 20px;
			font-size: 14px;
			height: 26px;
			padding: 0 20px;
			border-radius: 6px;
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
