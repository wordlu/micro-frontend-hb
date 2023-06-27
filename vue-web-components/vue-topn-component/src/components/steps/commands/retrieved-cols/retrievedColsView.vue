<template>
    <div class="retrieved">
        <link rel="stylesheet" href="https://components.hubadata.com/element-ui/element-ui.css">
        <div class="retrieved-title">
            <div class="retrieved-title-p">
                <h2>Retrieved Columns</h2>
            </div>
        </div>
        <div v-if="datasource">
            <div class="retrieved-select" >
                <el-radio-group v-model="isAllCols">
                    <el-radio :label="true">全部列</el-radio>
                    <el-radio :label="false">选中列</el-radio>
                </el-radio-group>
            </div>
            <div class="retrieved-keys" v-if="!isAllCols">
                <el-transfer
                        v-model="datasource.command.retrievedCols"
                        :data="candiData">
                </el-transfer>
            </div>
        </div>
    </div>
</template>
<script>
import ElTransfer from 'element-ui/packages/transfer/index'
import ElRadioGroup from 'element-ui/packages/radio-group/index'
import ElRadio from 'element-ui/packages/radio/index'
import { PhRetrievedColsDefs } from "./defs"
import PhRetrievedColsStep from "./step"

export default {
    data() {
        return {
            datasource: null,
            isAllCols: true
        }
    },
    props: {
        step: Object,
        schema: Array,
        concretDefs: {
            type: Object,
            default: () => {
                return PhRetrievedColsDefs
            }
        }
    },
    components: {
        ElRadioGroup,
        ElRadio,
        ElTransfer
    },
    mounted() {
        this.datasource = new PhRetrievedColsStep(this.step)
        this.isAllCols = this.datasource.command.retrievedCols.length === 0
        this.validate()
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
                    key: this.schema[idx].title,
                    label: this.schema[idx].title
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
    .retrieved {
        margin-top: 4px;
        /*width: 100%;*/
        min-width: 800px;
        padding: 4px;
        display: flex;
        flex-direction: column;
		background: #fff;
		height: fit-content;
		padding: 20px;

        .retrieved-title {
            display: flex;
            flex-direction: column;

            .retrieved-title-p {
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

    .disabled {
        pointer-events: none;
        opacity: 0.4;
    }
</style>
