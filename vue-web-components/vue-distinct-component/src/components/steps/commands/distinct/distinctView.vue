<template>
    <div class="distinct">
        <link rel="stylesheet" href="https://components.hubadata.com/element-ui/element-ui.css">
        <div class="distinct-title">
            <div class="distinct-title-p">
                <h2>Distinct</h2>
            </div>
        </div>
        <div v-if="datasource">
			<div class="error-msg" v-show="!isAllCols && datasource.command.retrievedCols.length === 0">请选择至少一个条件列！</div>
            <div class="distinct-select" >
                <el-radio-group v-model="isAllCols">
                    <el-radio :label="true">去除所有列的重复数据</el-radio>
                    <el-radio :label="false">去除选中列的重复数据</el-radio>
                </el-radio-group>
            </div>
            <div class="retrieved-keys" v-if="!isAllCols">
                <el-transfer
					v-model="datasource.command.retrievedCols"
					:data="candiData">
                </el-transfer>
            </div>
            <el-checkbox v-model="datasource.globalCount">计算源数据重复行数量</el-checkbox>
        </div>
    </div>
</template>
<script>
import ElTransfer from 'element-ui/packages/transfer/index'
import ElRadioGroup from 'element-ui/packages/radio-group/index'
import ElRadio from 'element-ui/packages/radio/index'
import ElCheckbox from 'element-ui/packages/checkbox/index'
import { PhDistinctDefs } from "./defs"
import PhDistinctStep from "./step"

export default {
    data() {
        return {
            datasource: null,
            isAllCols: true,
            // candiData: []
        }
    },
    props: {
        step: Object,
        schema: Array,
        concretDefs: {
            type: Object,
            default: () => {
                return PhDistinctDefs
            }
        }
    },
    components: {
        ElRadioGroup,
        ElRadio,
        ElTransfer,
        ElCheckbox
    },
    mounted() {
        this.datasource = new PhDistinctStep(this.step)
        this.isAllCols = this.datasource.command.retrievedCols.length === 0
    },
    updated() {

    },
    methods: {
        validate() {
            const ErrorVales = !this.isAllCols && this.datasource.command.retrievedCols.length === 0
            this.$emit('statusChange', ErrorVales)
        }
    },
    computed: {
        candiData() {
            const result = []
            for (let idx = 0; idx < this.schema.length; ++idx) {
                result.push({
                    key: this.schema[idx].src,
                    label: this.schema[idx].src
                })
            }
            return result
        }
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
    .distinct {
        margin-top: 4px;
        min-width: 800px;
        display: flex;
        flex-direction: column;
		background: #fff;
		height: fit-content;
		padding: 20px;

        .distinct-title {
            display: flex;
            flex-direction: column;

            .distinct-title-p {
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
		
		.error-msg {
			font-size: 13px;
			color: #ce1228;
		}
    }

    .disabled {
        pointer-events: none;
        opacity: 0.4;
    }
</style>
