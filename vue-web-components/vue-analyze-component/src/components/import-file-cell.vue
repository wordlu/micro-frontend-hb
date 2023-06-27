<template>
    <div class="import-file-cell" :id="selected ? 'is-selected' : ''">
        <div class="import-file-cell-left" @click="selectFile('file')">
            <span class="file-name">{{fileArr.name}}</span>
            <div class="user-icon-name">
                <img :src="userIcon" alt="" class="icon">
                <span class="user-name">{{fileArr.labels[1]}}</span>
            </div>
        </div>

        <div class="import-file-cell-right" >
            <span class="state" :class="state">{{stateDisplay}}</span>
            <span class="import" v-if="state == 'mapped'" @click="selectFile('import')">导入</span>
			<span v-if="stateDisplay === '失败'" class="import" @click="selectFile('rollback')">回滚</span>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            fileArr: [],
            userIcon: "https://www.hubadata.com/public/icon_home_user.svg",
            state: ''
        }
    },
    props: {
        data: Object,
        selected: {
            type: Boolean,
            default: false
        },
        index: Number,
        stateList: Array
    },
    computed: {
        stateDisplay() {
            // 列表状态
            let stateName= ''
            let lists = this.stateList.filter(it => it.version == this.data.version)

            if(lists.length > 0) {
                lists.forEach(item => {
                    if(item.jobDesc === 'succeed') {
                        this.state = item.jobDesc
                        stateName = '成功'
                    } else if(item.jobDesc === 'mapped') {
                        this.state = item.jobDesc
                        stateName = '已映射'
                    } else if(item.jobDesc === 'failed') {
                        this.state = item.jobDesc
                        stateName = '失败'
                    } else {
                        this.state = "unmapped"
                        stateName = '未映射'
                    }
                })
            } else {
                this.state = "unmapped"
                stateName = '未映射'
            }
            return stateName
        }
    },
    created() {
        let message = null
        if(this.isJSON(this.data.message)) {
            message = JSON.parse(this.data.message);
        }
        // console.log("message.label", message.label)
        this.fileArr = {
            name: message.name, 
            labels: message.label ? message.label.split(',') : []
        }
    },
    methods: {
        selectFile(name) {
            const event = new Event("event")
            event.args = {
                callback: "clickFile",
                element: this,
                param: {
                    attr: this.data,
                    select: this.index,
                    name: name
                }
            }
            this.$emit('clickfile', event)
        },
        isJSON(str) {
            if (typeof str == 'string') {
                try {
                    var obj=JSON.parse(str);
                    if(typeof obj == 'object' && obj ){
                        return true;
                    }else{
                        return false;
                    }

                } catch(e) {
                    // console.log('error：'+str+'!!!'+e);
                    return false;
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    * {
        box-sizing: border-box;
    }

    @mixin heading-small {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #25232D;
        letter-spacing: 0.25px;
        text-align: left;
        line-height: 20px;
        font-weight: 400;
    }

    @mixin body-tertiary {
        font-family: PingFangSC-Light;
        font-size: 12px;
        color: #706F79;
        letter-spacing: 0.25px;
        line-height: 16px;
        font-weight: 200;
    }

    #is-selected {
        border: 1px solid #7163C5;
        border-radius: 2px;
        background-color: #F2F0F9;
    }

    .import-file-cell {
        display: flex;
        width: 218px;
        height: 60px;
        border: 1px solid #E1DFE9;
        border-radius: 2px;
        padding: 10px;
        cursor: pointer;

        .import-file-cell-left {
            display: flex;
            flex-direction: column;
            
            .file-name {
                @include heading-small;
                width: 150px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                margin-bottom: 4px;
            }

            .user-icon-name {
                display: flex;
                margin-left: 2px;
                .user-name {
                    @include body-tertiary;
                }
                .icon {
                    width: 16px;
                    height: 16px;
                    margin-right: 4px;
                }
            }
        }

        .import-file-cell-right {
            width: 44px;
            // height: 18px;
            display: flex;
            align-items: center;
            letter-spacing: 0;
            font-family: PingFangSC-Light;
            font-size: 12px;
            text-align: center;
            line-height: 16px;
            font-weight: 200;
            flex-direction: column;
            height: 40px;
            justify-content: space-between;
			// .back {
			// 	width: 44px;
			// 	height: 24px;
			// 	text-align: center;
			// 	line-height: 20px;
			// 	font-size: 8px;
			// 	background-color: #7163c5;
			// 	color: #fff;
			// 	margin-top: 4px;
			// 	font-weight: 500;
			// 	border-radius: 2px;
			// 	font-family: PingFangSC-Medium;
			// }
            .import {
                width: 44px;
                height: 24px;
                background: #7163c5;
                border-radius: 2px;
                font-family: PingFangSC-Medium;
                font-size: 8px;
                color: #fff;
                text-align: center;
                line-height: 20px;
                font-weight: 500;
                margin-top: 4px;
            }
        }

        .succeed {
            border-radius: 2px;
            width: 44px;
            height: 18px;
            color: #23A959;
            border: 1px solid #23A959;
        }

        .failed {
            border-radius: 2px;
            width: 44px;
            height: 18px;
            color: #DB4D71;
            border: 1px solid #DB4D71;
        }

        .mapped {
            border-radius: 2px;
            width: 44px;
            height: 18px;
            color: #7163C5;
            border: 1px solid #7163C5;
        }

        .unmapped {
            border-radius: 2px;
            width: 44px;
            height: 18px;
            color: #706F79;
            border: 1px solid #706F79;
        }
    }
</style>