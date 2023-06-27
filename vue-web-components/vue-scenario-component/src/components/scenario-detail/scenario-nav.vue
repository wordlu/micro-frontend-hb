<template>
    <div class="scenario-nav">
        <div class="scenario-nav-title">
            <img :src="defs.iconsByName('scenario')" class="header-img" alt="">
            <p>{{scenario["scenario-name"]}}</p>
        </div>
        <div class="scenario-nav-btns">
            <el-radio-group v-model="activeName" @change="clickTab" class="content">
                <el-radio-button label="Setting"></el-radio-button>
                <el-radio-button label="Steps"></el-radio-button>
                <el-radio-button label="脚本参数"></el-radio-button>
                <el-radio-button label="历史记录"></el-radio-button>
            </el-radio-group>
            <el-button type="primary" @click="$emit('save')">Save</el-button>
            <el-button type="primary" @click="$emit('trigger')" >运行</el-button>
        </div>
    </div>
</template>

<script>
import ElButton from "element-ui/packages/button/index"
import ElRadioGroup from "element-ui/packages/radio-group/index"
import ElRadioButton from "element-ui/packages/radio-button/index"
import PhDagDefinitions from "../policy/definitions/definitions"

export default {
    components: {
        ElButton,
        ElRadioGroup,
        ElRadioButton
    },
    data() {
        return {
            activeName: "Setting"
        }
    },
    props: {
        activeTrue: Object,
        scenario: Object,
        defs: {
            type: Object,
            default: function () {
                return new PhDagDefinitions("1");
            }
        }
    },
    computed: {

    },
    mounted() { },
    watch: {
        activeName(n){
            this.activeName  = n
        }
    },
    methods: {
        clickTab(name){
            this.$emit("active", name)
            if (this.activeTrue.active) {
                this.activeName = name
            } else {
                if (name == 'Setting') {
                    this.activeName = 'Steps'
                } else {
                    this.activeName = "Setting"
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
    }

    .scenario-nav {
        display: flex;
		align-items: center;
        flex-direction: row;
		align-items: center;
        justify-content: space-between;
		border-bottom: 1px solid #ccc;
		// margin-bottom: 60px;
		height: 50px;

		.scenario-nav-title {
			padding: 0 10px;
			.header-img {
				width: 30px;
				padding-right: 10px;
			}
		}

		

        .scenario-nav-tabs {
            display: flex;
            flex-direction: row;
        }

        .scenario-nav-title {
            display: flex;
            flex-direction: row;
        }

        .scenario-nav-btns {
			margin: 5px 10px;
			.content {
				margin-right: 40px;
			}
        }
    }
</style>
