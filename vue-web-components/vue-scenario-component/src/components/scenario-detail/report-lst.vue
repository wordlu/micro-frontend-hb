<template>
    <div class="scenario-reports">
        <div class="scenario-report-create">
			<h2>通知</h2>
			<select ref="addNewReporterSelect" @change="addNewReporter"
				@click="addNewReporterClick" placeholder="添加通知" value="添加通知" name="" id=""
                style="width:182px;height:24px;">
				<option value="添加通知" label="添加通知"></option>
				<option v-for="item in options" :key="item.index" :label="item.desc" :disabled="item.disable"
					:value="item.cat">{{item.desc}}</option>
			</select>
		</div>
        <el-collapse>
			<el-collapse-item v-for="(item, index) in reports" :key="index" v-show="item.deleted === false" @change="changeReport(item,index)">
				<template slot="title">
					<div class="scenario-report-item-title">
						<div @click.stop class="input-con">
							<input v-model="item.name" class="report-input" @input="changeName(item,index)">
						</div>
						<div @click.stop style="width:40px;height:20px;position:relative;">
							<el-switch v-model="item.active" @change="item.edited = true"></el-switch>
						</div>
						<el-button class="el-icon-close" @click="item.deleted = true">
						</el-button>
					</div>
				</template>
				<el-form :model="item" label-width="120px" style="margin-top:20px;" :label-position="labelPosition">
					<el-form-item label="收件人邮箱" class="area">
						<el-input value="请输入邮箱"
                        :class="{'isTrue':isNotTrue(item, index)}" v-model="item.destination" @input="changeEmail(item,index)"></el-input>
                        <span v-show="isNotTrue(item,index)">请输入正确的邮箱格式！</span>
					</el-form-item>
				</el-form>
			</el-collapse-item>
		</el-collapse>
    </div>
</template>

<script>
// import CreateScenarioDlg from "./create-scenario-dlg"
import ElCollapse from "element-ui/packages/collapse/index"
import ElCollapseItem from "element-ui/packages/collapse-item/index"
// import ElSelect from "element-ui/packages/select/index"
// import ElOption from "element-ui/packages/option/index"
import ElSwitch from "element-ui/packages/switch/index"
import ElForm from "element-ui/packages/form/index"
import ElFormItem from "element-ui/packages/form-item/index"
import ElInput from "element-ui/packages/input/index"
import ElButton from "element-ui/packages/button/index"
// import ElCol from "element-ui/packages/col/index"

export default {
    data() {
        return {
            options: [
                {
                    index: 0,
                    cat: "email",
                    desc: "Email",
                    disable: false
                },
                {
                    index: 1,
                    cat: "sms",
                    desc: "SMS",
                    disable: true
                }
            ],
            labelPosition: 'left',
            isTrue: false,
            EmailArr: [],
            EmailId: []
        }
    },
    props: {
        reports: Array,
        scenarioId: String
    },
    components: {
        ElCollapse,
        ElCollapseItem,
        ElButton,
        // ElSelect,
        // ElOption,
        ElSwitch,
        ElForm,
        ElFormItem,
        ElInput,
        // ElCol
    },
    computed: {

    },
    mounted() {
        // this.reportsDisplay = this.reports
    },
    watch: {
        // "item.destination": function(newValue){
        //     if(newValue == ''){
        //         this.isTrue = false
        //     }
        // }
     },
    methods: {
        isNotTrue(item){
            const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
            if (reg.test(item.destination)) {
                return false
            } else if (item.destination == ''){
                return false
            } else {
                return true
            }
        },
        changeName(item, index){
            this.reports[index].name = item.name
		},
		changeEmail(item, index){
            const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
            if (reg.test(item.destination)) {
                this.isTrue = this.isNotTrue(item)
                this.reports[index].destination = item.destination
            } else if (item.destination == ''){
                 this.isTrue = this.isNotTrue(item)
            } else {
                 this.isTrue = this.isNotTrue(item)
            }
            
            let indexId = this.EmailId.indexOf(index)
            if (indexId >= 0){
                this.EmailId.splice(indexId, 1, index)
                this.EmailArr.splice(indexId, 1, this.isTrue)
            } else {
                this.EmailArr.push(this.isTrue)
                this.EmailId.push(index)
            }
            this.$emit('isTrue',this.EmailArr)
		},
		changeReport(item, index){
			this.reports[index].name = item.name
			this.reports[index].destination = item.destination
		},
        addNewReporterClick() {
			this.$refs.addNewReporterSelect.value = "添加通知"
		},
        addNewReporter() {
            const result = {}
			const idx = this.reports.length > 0 ? 1 + Math.max(...this.reports.map(x => x.index)) : 0
			result["name"] = 'report1'
            result["active"] = true
            result["scenarioId"] = this.scenarioId
            result["id"] = this.genId()
            result["index"] = idx
            result["traceId"] = this.genId()
            result["edited"] = true
            result["deleted"] = false
            result["type"] = "EMAIL"
            result["mode"] = "EMAIL"
            result['destination'] = ''
            this.reports.push(result)
            console.log(result,222222)
			this.$refs.addNewReporterSelect.value = "添加通知"
        },
        genId(len=16, radix=16) {
            const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
            let uuid = [], i;
            radix = radix || chars.length;

            if (len) {
                // Compact form
                for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
            } else {
                // rfc4122, version 4 form
                var r;

                // rfc4122 requires these characters
                uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
                uuid[14] = '4';

                // Fill in random data.  At i==19 set the high bits of clock sequence as
                // per rfc4122, sec. 4.1.5
                for (i = 0; i < 36; i++) {
                    if (!uuid[i]) {
                        r = 0 | Math.random()*16;
                        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
                    }
                }
            }

            return uuid.join('');
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

	input{
		height: 30px;
		padding: 3px;
		border: 1px solid #ddd;
	}
	.input-con{
		width: 226px;
		height: 30px;
		position: relative;
	}
	.report-input{
		width: 241px;
		height: 32px;
		min-width: none;
		border-radius: 5px;
		padding-left: 10px;
		position: absolute;
		top:0;
		left:0;
	}
	
	.el-switch{
		height: 30px !important;
		line-height: 40px;
		position: absolute !important;
		top: 0px;
		left: 170px;
	}
	.el-collapse-item__header{
		position:relative;
	}
	.el-collapse-item__arrow{
		position: absolute;
		top: 15px;
		left: 6px;
		font-size: 18px;
	}
	
    .isTrue{
        border: 1px solid red !important;
    }
    .scenario-reports {
		background-color: #fff;
		margin: 1px auto !important;
		padding: 14px 36px !important;
		width: 800px;
		margin-bottom: 40px !important;
        display: flex;
        flex-direction: column;

        .scenario-report-create {
			height: 60px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
			margin-bottom: 10px;
			align-items: center;
			.add-report-select {
				height: 24px;
			}
        }
		
		.area{
            height: 30px;
            .el-form-item__content{
                position: relative;
            }
            .el-input{
                width: 478px;
                height:32px;
                position: relative;
                border-radius: 5px;
                border: 1px solid #ccc;
            }
			/deep/.el-input__inner{
				width: 476px !important;
				height: 30px !important;
				border-radius: 5px;
				padding-left: 10px;
                border: none;
                position: absolute;
                top: 0;
                left: 0;
			}
            span{
                font-size: 12px;
                color: red;
                position: absolute;
                top: 28px;
                left: 0;
            }
		}
        .scenario-report-item-title {
            display: flex;
            flex-direction: row;
            // justify-content: space-between;
            flex-grow: 1;
			padding-left: 234px;
			height: 30px;
            position: relative;

            .el-icon-close {
                border: none !important;
				line-height: 0;
				margin-left: 14px;
				padding: 8px;
                position: absolute;
                top: 8px;
                right: 19px;
            }
        }
     }

    .scenario-reports {
        background-color: #fff;
        margin: 1px auto;
        padding: 14px 36px;
        width: 800px;

        display: flex;
        flex-direction: column;


        .scenario-reports-create {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
        }

        .scenario-report-item-switch {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
    }
</style>
