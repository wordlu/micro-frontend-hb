<template>
    <div class="custom-agg">
        <link rel="stylesheet" href="https://components.hubadata.com/element-ui/element-ui.css">
        <div class="custom-agg">
            <div class="custom-agg-title-p">
                <h2>Custom Aggregation</h2>
            </div>
        </div>
        <el-empty description="暂无数据"></el-empty>
    </div>
</template>
<script>
import ElEmpty from 'element-ui/packages/empty/index'
import { PhCustomAggDefs } from "./defs"
import PhCustomAggStep from "./step"

export default {
    data() {
        return {
            datasource: null,
        }
    },
    props: {
        step: Object,
        schema: Array,
        concretDefs: {
            type: Object,
            default: () => {
                return PhCustomAggDefs
            }
        }
    },
    components: {
        ElEmpty
    },
    mounted() {
        this.datasource = new PhCustomAggStep(this.step)
    },
    methods: {
        validate() {
            this.$emit('statusChange', true)
        }
    },
}
</script>
<style lang="scss" scoped>
    * {
        letter-spacing: .4px;
        line-height: 1.6;
        box-sizing: border-box;
    }
    .custom-agg {
        margin-top: 4px;
        min-width: 800px;
        display: flex;
        flex-direction: column;
		background: #fff;
		height: fit-content;
		padding: 20px;

        .custom-agg-title {
            display: flex;
            flex-direction: column;

            .custom-agg-title-p {
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
