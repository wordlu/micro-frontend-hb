<template>
    <div class="stack-output-v">
        <div class="stack-output-title">
            <h3>Output Columns</h3>
            <div class="stack-output-op">
                <el-button type="text" @click="addSelectColumn">添加</el-button>
                <el-button type="text" @click="delAll">删除全部</el-button>
            </div>
        </div>
        <el-divider class="divider"></el-divider>
        <div class="stack-output-list" v-show="columns.length > 0">
            <div class="stack-output-item" v-for="(item, index) in columns" :key="index">
                <el-input 
                    v-model="item.name" 
                    :class="[{'el-input-error': item.name === ''}]"></el-input>
                <el-button type="text" @click="deleteSelectColumn(index)">删除</el-button>
            </div>
        </div>
        <div class="error-msg" v-show="columns.length === 0">no output columns</div>
    </div>
</template>
<script>
import ElButton from 'element-ui/packages/button/index'
import ElDivider from 'element-ui/packages/divider/index'
import ElInput from 'element-ui/packages/input/index'

export default {
    data() {
        return {

        }
    },
    props: {
        columns: Array,
        command: Object
    },
    components: {
        ElInput,
        ElButton,
        ElDivider
    },
    methods: {
        addSelectColumn() {
			this.$emit("addSelectColumn")
        },
        deleteSelectColumn(index) {
            this.command.deleteSelectColumn(index)
        },
        delAll() {
            this.command.deleteAllSelectColumn()
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

    .stack-output-v {
        display: flex;
        flex-direction: column;
        min-width: 300px;
        border-right: 1px solid #ddd;
        border-top: 1px solid #ddd;

        .error-msg {
            font-size: 13px;
            color: #ce1228;
            margin: 10px 0;
        }

        .stack-output-title {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            margin-right: 10px;
            height: 50px;

            h3 {
                font-size: 13px;
                font-weight: normal;
            }

            .stack-output-op {
                display: flex;
                flex-direction: row;
            }
        }

        .divider {
            margin: 0;
        }

        .stack-output-list {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            margin-right: 10px;
            margin-top: 10px;

            .stack-output-item {
                display: flex;
                flex-direction: row;
                height: 50px;
                align-items: center;

                .el-input-error {
                    /deep/input.el-input__inner {
                        border-color: #ce1228;
                    }
                }
            }
        }
    }
</style>
