<template>
<div class="mapping-area">
    <div class="mapping-data-area">
        <div class="header-area">
            <span class="header-title">自定映射</span>
            <img :src="closeIcon" class="icon-close" alt="" @click="cancel">
        </div>
        <div class="mapping-content">
            <div class="shine-transfer left-area">
                <span class="title">映射关系</span>
                <span class="file">目标文件</span>
                <div class="shine-list">
                    <ul class="fixed-field">
                        <li v-for="(field,index) in targetsList" :key="'target'+index">{{field}}</li>
                    </ul>
                    <ul class="drag-field">
                        <li 
                            v-for="(field, index) in infoList" 
                            :key="'info'+index" 
                            draggable="true" @dragstart="dragStart($event, index, field)" @dragover="allowDrop" @drop="drop($event, index,field)"
                        >{{field}}</li>
                    </ul>
                </div>
            </div>

            <div class="shine-transfer right-area">
                <span class="title">对应映射库</span>
                <span class="file">源文件：{{fileName}}</span>
                <div class="shine-list" @dragover="allowDrop" @drop="fileDrop($event)">
                    <ul class="shine-ul">
                        <li v-for="(ls,index) in schemaList" :key="index+'source'" draggable="true" @dragstart="fileDragStart($event, ls, index)" >
								{{ls}}
							<span class="moveIcon">
								<img :src="iconMove" alt="" class="img">
							</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="button-area">
            <bp-button text="取消" class="cancel" @click="cancel"></bp-button>
            <bp-button text="确认" class="confirm" @click="confirm"></bp-button>
        </div>
    </div>
</div>
</template>

<script>
import bpButton from '../../node_modules/vue-components/src/components/bp-button.vue'
import bpInput from '../../node_modules/vue-components/src/components/bp-input.vue'
import bpTextarea from '../../node_modules/vue-components/src/components/bp-textarea.vue'
import { staticFilePath } from '../config/envConfig'

export default {
    components: {
        bpButton,
        bpInput,
        bpTextarea
    },
    data() {
        return {
            closeIcon: `${staticFilePath}` + "/icon_close.svg",
            middleData: '',
            middleIndex: -1,
            fileMiddleData: '',
            fileMddleIndex: -1,
            infoList: [],
            schemaList: [],
            targetsList:[],
            iconMove: `${staticFilePath}` + "/icon_move.svg"
        }
    },
    props: {
        fileName: String,
        targetList: Array,
        sourceList:  Array,
        projectData: Array
    },
    created() {
        // 数据回显
        this.infoList = []
        this.targetsList = []
        //拆分对象
        if(this.projectData) {
            this.projectData.forEach((item) => {
                this.infoList.push(Object.values(item)[0])
                this.targetsList.push(Object.keys(item)[0])
            })
            this.schemaList = this.sourceList.filter((x) => x && !this.infoList.some((item) => x === item));
        }
    },
    methods: {
        cancel() {
            this.$emit("cancel")
        },
        selectFile() {
            this.$emit("selectFile")
        },
        confirm() {
            const event = new Event("event")
            event.args = {
                callback: "confirmMapping",
                element: this,
                param: {
                    mappingList: this.infoList,
                    targetsList: this.targetsList,
                    sourceList: this.schemaList
                }
            }
            this.$emit('confirmMappingEvent', event)
        },
        // 目标文件表拖动
        dragStart(e, index, field){
            this.clearBakData() // 清空上一次拖动时保存的数据
            e.dataTransfer.setData('Text', index);
            this.fileMiddleData= field // 设置此次拖动时保存的数据
            this.fileMddleIndex = index //设置此次拖动时保存的数据Index
        },
        // 源文件表的拖动
        fileDragStart(e, field, index){
            this.clearBakData() // 清空上一次拖动时保存的数据
            e.dataTransfer.setData('Text', field);
            this.middleData = field
            this.middleIndex = index
        },
        drop(e, index,field){
            // 取消默认行为
            this.allowDrop(e);
            // 判断拖起的元素是映射表中的数据，还是当前备选表中的数据
            if(this.middleData !== ''){
                if(this.infoList[index]) {
                    this.schemaList.push(this.infoList[index])
                } 
                // 放置到当前的数组中
                this.infoList.splice(index, 1, this.middleData)
                // 清除当前拖动的在另一个表中的数据
                if(this.middleIndex!==-1){
                    this.schemaList.splice(this.middleIndex, 1)
                }
            }else{
                // 拖动的元素在当前张表时，交换两个数据的位置
                // this.clearBakData()
                //使用一个新数组重新排序后赋给原变量
                let arr = this.infoList.concat([])
                let temp = arr[index];
                arr[index] = arr[this.fileMddleIndex];
                arr[this.fileMddleIndex] = temp;

                this.infoList = arr;
            }
            this.clearBakData()
        },
        // 从目标文件拖拽到源文件
        fileDrop(e){
            //取消默认行为
            if(this.middleData == ''){
                this.allowDrop(e);
                this.schemaList.push(this.fileMiddleData) //源文件增加一条
                this.fileMiddleData=''
                this.infoList.splice(this.fileMddleIndex,1,this.fileMiddleData)
                this.clearBakData()
            }
        },
        allowDrop(e){
            e.preventDefault()
        },
        clearBakData(){
            // 此处写清除各列表的操作
            this.middleData=''
            this.middleIndex=-1
            this.fileMiddleData=''
            this.fileMddleIndex=-1
        }
    }
}
</script>

<style lang="scss">
* {
    box-sizing: border-box;
}
.textarea-border {
    border-color: red !important;
}
.mapping-area {
    height: 100vh;
    width: 100vw;
    background: rgba(37, 35, 45, 0.55);
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9999;
    justify-content: center;
    align-items: center;
    .mapping-data-area {
        height: 718px;
        width: 600px;
        background: #FFFFFF;
        border-radius: 2px;
        overflow-y: auto;
    }
    .header-area {
        height: 56px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 20px 12px;
        background: #FAFBFC;
        border: 1px solid rgba(37,35,45,0.05);
        .icon-close {
            cursor: pointer;
        }
        .header-title {
            font-family: SFProText-Regular;
            font-size: 16px;
            color: #25232D;
            letter-spacing: 0.25px;
            line-height: 24px;
            font-weight: 400;
        }
    }
    .mapping-content {
        display: flex;
        align-items: center;
        .shine-transfer {
            display: flex;
            flex-direction: column;
            border: 1px solid rgba(37,35,45,0.12);
            border-radius: 2px;
            height: 566px;
            overflow: auto;
            .title {
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: #25232D;
                letter-spacing: 0.25px;
                text-align: left;
                font-weight: 400;
                height: 36px;
                background: #f6f6f7;
                display: flex;
                align-items: center;
                padding: 8px;
                border-bottom: 1px solid rgba(37,35,45,0.12);
            }
            .file {
                font-family: PingFangSC-Regular;
                font-size: 12px;
                color: #706F79;
                letter-spacing: 0.25px;
                text-align: left;
                border-bottom: 1px solid rgba(37,35,45,0.12);
                line-height: 16px;
                font-weight: 400;
                height: 30px;
                display: flex;
                padding: 8px;
                align-items: center;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                min-height: 30px;
            }
            .shine-list {
                display: flex;
                .fixed-field, .shine-ul {
                    width: 180px;
                    padding: 0;
                    margin: 0;
                }
                .drag-field {
                    width: 180px;
                    padding: 0;
                    margin: 0;
                    border-left: 1px solid rgba(37,35,45,0.12);
                }
                .shine-ul {
                    padding: 0;
                    margin: 0;
                    li {
                        width: 160px;
						position: relative;
						.moveIcon {
							width: 20px;
							height: 20px;
							position: absolute;
							top: 6px;
							right: 6px;
						}
                    }
                }
                li {
                    height: 32px;
                    display: flex;
                    align-items: center;
                    border-bottom: 1px solid rgba(37,35,45,0.12);
                    padding: 6px 8px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap
                }
            }
        }
        .left-area {
            width: 360px;
            margin: 20px;
        }
        .right-area {
            width: 180px;
        }
        ul li {
            list-style-type: none;
        }
    }
    .button-area {
        display: flex;
        justify-content: flex-end;
        margin-right: 20px;
        margin-top: 12px;
        button {
            width: 80px;
            height: 32px;
            font-family: PingFangSC-Medium;
            font-size: 14px;
            letter-spacing: 0;
            text-align: center;
            line-height: 20px;
            font-weight: 500;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .cancel {
            background: none;
            color: #57565F;
        }
        .confirm {
            background: #7163C5;
            color: #FFFFFF;
        }
    }
}
</style>
