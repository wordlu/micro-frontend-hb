<template>
    <div class="outputs">
        <link rel="stylesheet" href="https://components.hubadata.com/element-ui/element-ui.css">
        <div class="outputs-title">
            <div class="outputs-title-p">
                <h2>Outputs Column Names</h2>
            </div>
            <div class="outputs-content">
                <div class="outputs-content-item" v-for="(item, index) in schema" :key="index">
                    <span class="outputs-content-item-index">{{index}}</span>
<!--                    <span class="outputs-content-item-type">({{item.type}})</span>-->
                    <span class="outputs-content-item-title">{{item.title}}</span>
                </div>
            </div>
        </div>
        <div v-if="datasource">
        </div>
    </div>
</template>
<script>
// import ElCheckbox from 'element-ui/packages/checkbox/index'
// import ElInput from 'element-ui/packages/input/index'
// import { staticFilePath } from '../../../../config/envConfig'
// import ElButton from 'element-ui/packages/button/index'
import { PhOutputsDefs } from "./defs"
// import PhOutputsStep from "./step"

export default {
    data() {
        return {
            datasource: null
        }
    },
    props: {
        // step: Object,
        schema: Array,
        concretDefs: {
            type: Object,
            default: () => {
                return PhOutputsDefs
            }
        }
    },
    components: {
        // ElCheckbox,
        // ElButton,
        // ElInput
    },
    mounted() {
        // this.datasource = new PhOutputsStep(this.step)
        // this.$emit('schemaCompute', true)
    },
    methods: {
        validate() {
            this.$emit('statusChange', true)
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
    .outputs {
        margin-top: 4px;
        min-width: 800px;
        display: flex;
        flex-direction: column;
		background: #fff;
		height: fit-content;
		padding: 20px;

        .outputs-title {
            display: flex;
            flex-direction: column;

            .outputs-title-p {
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

        .outputs-content {
            display: flex;
            flex-direction: column;

            .outputs-content-item {
                display: flex;
                flex-direction: row;

                .outputs-content-item-index {

                }

                .outputs-content-item-type {
                    margin-left: 10px;

                }

                .outputs-content-item-title {
                    margin-left: 10px;

                }
            }
        }
    }
</style>
