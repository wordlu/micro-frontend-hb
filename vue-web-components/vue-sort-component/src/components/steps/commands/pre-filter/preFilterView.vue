<template>
    <div class="pre-filter">
        <link rel="stylesheet" href="https://components.hubadata.com/element-ui/element-ui.css">
        <div class="condition-title">
            <div class="condition-title-p">
                <h2>Pre Filter</h2>
                <div class="ver-center" v-if="datasource">
                    <el-switch v-model="datasource.enabled" @change="validate()"></el-switch>
                </div>
            </div>
            <el-form v-if="datasource && datasource.enabled">
                <el-form-item label="保留符合条件的列">
                    <select v-model="datasource.command.action">
                        <option v-for="(item, index) in concretDefs.actions" :value="item.cal" :key="index" :label="item.desc" />
                    </select>
                </el-form-item>
            </el-form>
        </div>
        <div class="condition-selection" v-if="datasource && datasource.enabled">
			<div class="error-msg" v-show="datasource.command.cloases && datasource.command.cloases.length === 0">需要添加至少一个Filter条件！</div>
            <div class="condition-selection-item" v-for="(cur, index) in datasource.command.cloases" :key="index">
                <div class="condition-selection-content">
                    <select v-model="cur['left']">
                         <option v-for="(item, index) in schema" :value="item.src" :key="index" :label="item.src" />
                    </select>
                    <select v-model="cur['op']">
                        <option v-for="(item, index) in concretDefs.includes" :value="item.cal" :key="index" :label="item.desc" />
                    </select>
                    <el-input v-if="cur['op'] !== 'EXISTS' && cur['op'] !== 'NOT-EXISTS'" v-model="cur['right']" :class="[{'el-input-error': cur['right'] === ''}]"></el-input>
                    <el-input v-else disabled ></el-input>
                </div>
                <el-button type="text" @click="datasource.command.delcloases(index)">删除</el-button>
            </div>
        </div>
        <div class="condition-add-button"  v-if="datasource && datasource.enabled">
            <el-button type="primary" @click="datasource.command.insertcloases()">添加</el-button>
        </div>
    </div>
</template>
<script>
import { PhPreFilterDefs } from "./defs"
import ElForm from 'element-ui/packages/form/index'
import ElFormItem from 'element-ui/packages/form-item/index'
import ElInput from 'element-ui/packages/input/index'
import ElButton from 'element-ui/packages/button/index'
import ElSwitch from 'element-ui/packages/switch/index'
import PhFilterStep from "./step"

export default {
    data() {
        return {
            datasource: null
        }
    },
    props: {
        step: Object,
        schema: Array,
        concretDefs: {
            type: Object,
            default: () => {
                return PhPreFilterDefs
            }
        }
    },
    components: {
        ElFormItem,
        ElForm,
        ElInput,
        ElButton,
        ElSwitch
    },
    mounted() {
        this.datasource = new PhFilterStep(this.step, this.schema)
        this.validate()
    },
    methods: {
        validate() {
            const ErrorVales = this.datasource.command.cloases.filter(it => it['op'] !== 'EXISTS' && it['op'] !== 'NOT-EXISTS' && it.right.replace(/\s*/g,"").length === 0)
			const event = new Event("event")
			event.args = {
				element: this,
				param: {
					status: this.datasource.enabled,
					errors: this.datasource.command.cloases.length === 0 || ErrorVales.length > 0
				}
			}
            this.$emit('statusChange', event)
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
    .pre-filter {
        margin-top: 4px;
        min-width: 800px;
        display: flex;
        flex-direction: column;
		background: #fff;
		height: fit-content;
		padding: 20px;

		.el-input-error {
			/deep/input.el-input__inner {
				border-color: #ce1228;
			}
		}

        .condition-title {
            display: flex;
            flex-direction: column;

            .condition-title-p {
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

        .condition-selection {
            margin-top: 30px;

			.error-msg {
				font-size: 13px;
				color: #ce1228;
			}

            .condition-selection-item {
                display: flex;
                flex-direction: row;

            }

            .condition-selection-content {
                display: flex;
                flex-direction: row;

				.el-input {
					/deep/input.el-input__inner {
						height: 48px;
					}
				}

            }
        }

        .condition-add-button {
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            margin-top: 80px;
        }
    }
</style>
