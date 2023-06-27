<template>
    <div class="origin">
        <div class="origin-title">
            <div class="origin-title-p">
                <h2>Origin Columns</h2>
            </div>
        </div>
        <div class="origin-container" v-if="datasource">
            <div class="origin-container-header">
                <div class="origin-container-title">
                    <p>标记原始数据集</p>
                </div>
                <div class="origin-container-op">
                    <el-switch v-model="datasource.command.enabled" ></el-switch>
                </div>
            </div>
            <el-form ref="form" label-width="200px">
                <el-form-item label="Column Name">
                    <el-input v-model="datasource.command.columnName"></el-input>
                </el-form-item>
                <el-form-item v-for="(item, index) in datasource.command.originDatasets" :label="item.ds" :key="index">
                    <el-input v-model="item.value"></el-input>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import ElInput from 'element-ui/packages/input/index'
import ElForm from 'element-ui/packages/form/index'
import ElFormItem from 'element-ui/packages/form-item/index'
import ElSwitch from 'element-ui/packages/switch/index'
import { PhStackOriginDefs } from "./defs"
import PhStackOriginStep from "./step"

export default {
    data() {
        return {
            datasource: null,
        }
    },
    props: {
        step: Object,
        // schema: Array,
        concretDefs: {
            type: Object,
            default: () => {
                return PhStackOriginDefs
            }
        }
    },
    components: {
        // ElSwitch,
        // ElButton,
        // ElCheckbox,
        ElSwitch,
        ElFormItem,
        ElForm,
        ElInput
    },
    mounted() {
        this.datasource = new PhStackOriginStep(this.step)
    },
    updated() {

    },
    methods: {
        validate() {
            const event = new Event("event")
			event.args = {
				element: this,
				param: {
					status: !this.datasource.command.enabled
				}
			}
			this.$emit('statusChange', event)
        },
		updateData(name) {
			this.datasource.command.originDatasets.push({
				ds: name,
                value: name
			})
		},
		deleteData(name, i) {
			this.datasource.command.originDatasets.splice(i, 1)
		}
			
    },
    computed: {

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
    .origin {
        margin-top: 4px;
        min-width: 800px;
        display: flex;
        flex-direction: column;
		background: #fff;
		height: fit-content;
		padding: 20px;

        .origin-title {
            display: flex;
            flex-direction: column;

            .origin-title-p {
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

        .origin-container {
            display: flex;
            flex-direction: column;

            .origin-container-header {
                display: flex;
                flex-direction: row;
                justify-content: space-between;

                .origin-container-title {

                }

                .origin-container-op {

                }
            }

        }
    }
</style>
