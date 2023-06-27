<template>
    <div class="retrieved">
        <link rel="stylesheet" href="https://components.hubadata.com/element-ui/element-ui.css">
        <div class="retrieved-title">
            <div class="retrieved-title-p">
                <h2>Select Columns</h2>
				<div v-show="noCol" class="error-msg"> 请至少选择一列 </div>
				<div v-show="rep" class="error-msg"> 不能选择重复列 </div>
            </div>
        </div>
        <div class="retrieved-lst" v-if="datasource">
            <selected-card 
				v-for="(item, index) in datasource.commands" 
				:key="index"
				:index="index" 
				:command="item" 
				:schema="schema[item.ds]" />
        </div>
    </div>
</template>
<script>
import SelectedCard from './detail-view/select-card'
import { PhSelectedColsDefs } from "./defs"
import PhSelectedColsStep from "./step"
import PhSelectedColsCmd from "./cmd"

export default {
    data() {
        return {
            datasource: null,
			noCol: false,
			rep: false
        }
    },
    props: {
        step: Object,
        schema: Object,
        concretDefs: {
            type: Object,
            default: () => {
                return PhSelectedColsDefs
            }
        }
    },
    components: {
        SelectedCard
    },
    mounted() {
        this.datasource = new PhSelectedColsStep(this.step)
		this.validate()
    },
    methods: {
        validate() {
			let nameArr = []
			let ErrorVales = false
			this.datasource.commands.forEach(item => {
				const names = item.retrievedCols.map(it => it)
				nameArr = nameArr.concat(names)
			})
			const newNameArr = new Set(nameArr)

			this.noCol = false
			this.rep = false
			if(nameArr.length === 0) {
				ErrorVales = true
				this.noCol = true
			} else if (newNameArr.size !== nameArr.length) {
				ErrorVales = true
				this.rep = true
			}
			
			const event = new Event("event")
            event.args = {
                element: this,
                param: {
                    status: false,
                    errors: ErrorVales
                }
            }
            this.$emit('statusChange', event)
        },
		updateData(n, o, unreset) {
            if (!unreset) {
                this.datasource.commands.push(new PhSelectedColsCmd({
                    "ds": n.name,
                    "index": n.index,
                    "prefix": "",
                    "type": "select",
                    "columns": []
                }))
            }
            this.datasource.commands.push(new PhSelectedColsCmd({
                "ds": n.name,
				"index": n.index,
                "prefix": "",
                "type": "select",
                "columns": []
            }))
        },
        deleteData(dss, ids) {
            this.datasource.commands.forEach((itds, i) => {
                if(!dss.includes(itds.ds) || !ids.includes(itds.index)) {
                    delete this.datasource.commands[i]
                }
            })
            this.datasource.commands = this.datasource.commands.filter(it => it)
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
    .retrieved {
        width: 100%;
        padding: 4px;
        display: flex;
        flex-direction: column;
        background: #fff;
        padding: 20px;
		flex-grow: 1;
		width: calc(100vw - 300px);

        .retrieved-title {
            display: flex;
            flex-direction: column;

            .retrieved-title-p {
                display: flex;
                flex-direction: column;

				h2 {
					margin-bottom: 0;
				}

				.error-msg {
					font-size: 13px;
					color: #ce1228;
					margin: 10px 0;
                }

                .ver-center {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;
                }
            }
        }
    }

    .retrieved-lst {
        display: flex;
        flex-direction: row;
		flex-grow: 1;
		overflow: auto;

		.select-card-container:nth-child(even) {
            background-color:rgb(242, 242, 242); 
        }
    }

    .disabled {
        pointer-events: none;
        opacity: 0.4;
    }
</style>
