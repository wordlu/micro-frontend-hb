<template>
    <div>
        <div class="clear_dialog_container">
            <div class="dialog_area">
               <div class="header">
                    <div class="left">
                        <img :src="label_icon" class="label" alt="">
                        <p v-show="datasetcheckedIds.length >= 2">为 {{datasetcheckedIds.length}} 个数据集添加标签</p>
                        <p class="dataset_name" :title="datasetcheckedNames[0]" v-show="datasetcheckedIds.length < 2">为 {{datasetcheckedNames[0]}} 添加标签</p>
                    </div>
                    <img :src="img1" alt="" class="close_icon" @click="close">
               </div>
               <div class="prompt">
                    <img :src="search_icon" class="search" alt="">
                    <input type="text" placeholder="筛选标签或创建新标签" class="text_input" v-model="searchValue" @keyup.enter="submit">
                    <p class="tags_name">标签名</p>
                    <div class="tags_list" v-if="tagsArrayShow.length != 0 ">
                        <div class="tags" @click.stop="checkedOneTag(tag)" v-for="(tag,index) in tagsArrayShow" :key="index+'tag'">
                            <input type="checkbox" class="checkout" :checked="selectedTags.indexOf(tag) > -1">
                            <span class="round" :style="{background: tagsColorArray[tagsArray.indexOf(tag)]}"></span>
                            <div class="create_tags" :title="tag">
                                {{tag}}
                            </div>
                        </div>
                    </div>
                    <div class="create" v-if="tagsArrayShow.length == 0 " @click="submit" >
                        <img :src="add_icon" alt="" class="add">
                        <p>Create《{{searchValue}}》</p>
                        <img :src="enter_icon" alt="" class="enter">
                    </div>
               </div>
              <div class="btn">
                    <button class="cancel" @click="close">取消</button>
                    <button class="save" @click="save">保存</button>
              </div>
            </div>
        </div>
    </div>
</template>

<script>
import { staticFilePath } from '../config/envConfig'

export default {
    data() {
        return{
            img1: `${staticFilePath}` + "/icon_close.svg",
            label_icon: `${staticFilePath}` + "/tag.svg",
            search_icon: `${staticFilePath}` + "/search.png",
            add_icon: `${staticFilePath}` + "/add.svg",
            enter_icon: `${staticFilePath}` + "/enter.svg",
            searchValue: '',
            tagsArrayShow: [], //展示的tag数组
            selectedTags: [], //选中的tag数组
            newTagsArray: [] //新增的tag数组
        }
    },
    props: {
        datasetcheckedIds: Array,
        datasetcheckedNames: Array,
        datasets: Array,
        tagsArray: Array, //后端返回的tag数组
        tagsColorArray: Array
    },
    computed: {},
    mounted() {
        this.tagsArrayShow = this.tagsArray.filter(it => it != '')
        if(this.datasetcheckedIds.length == 1) {
            let selDatasetId = this.datasetcheckedIds[0]
            let selDataset = this.datasets.filter(item => item.id == selDatasetId)[0]
            this.selectedTags = selDataset.label
        }
    },
    watch: {
        searchValue: function() {
            let that = this
            if(this.searchValue.trim() == '') {
                if(this.tagsArrayShow.length < this.tagsArray.length) {
                    this.tagsArrayShow = this.tagsArray
                }
            } else {
                this.tagsArrayShow = []
                let allArray = this.tagsArray.concat(this.newTagsArray)
                allArray.forEach(item => {
                    let idx = item.indexOf(that.searchValue)
                    if(idx == 0) {
                        this.tagsArrayShow.push(item)
                    }
                })
            }
        }
    },
    methods: {
        save() {
            // 将选中的tag添加到选中的dataset上
            // 新增但未选中的tag不保存
            this.tagsArrayShow = []

            const event = new Event("event")
            event.args = {
                callback: "addTags",
                element: this,
                param: {
                    name: "addTags",
                    selectedTags: this.selectedTags
                }
            }
            this.$emit('addTagsEvent', event)
        },
        close() {
            this.tagsArrayShow = []
            this.tagsArrayShow = this.tagsArray
            this.$emit('closeCreateDialog');
        },
        submit() {
            if(this.searchValue.trim() != '' && this.tagsArrayShow.indexOf(this.searchValue) == -1) {
                this.tagsArrayShow = this.tagsArray.filter(it => it != '')
                this.selectedTags.push(this.searchValue) //默认选中新增tag
                this.newTagsArray.push(this.searchValue) //关闭弹框前新增的tag array
                this.tagsArrayShow = this.tagsArrayShow.concat(this.newTagsArray) //将新增tag添加到tagShow数组
                this.searchValue = ''
            }
        },
        checkedOneTag(tag) {
            let idIndex = this.selectedTags.indexOf(tag)
            if(idIndex >= 0) {
                this.selectedTags.splice(idIndex, 1)
            } else {
                this.selectedTags.push(tag)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
.clear_dialog_container {
       height: 100vh;
    width: 100vw;
    // background: rgba(37,35,45,0.55);
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
    background: rgba(0,0,0,0.31);
}
.dialog_area {
    width: 600px;
    height: 560px;
    border: 1px solid #ddd;
    background-color: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    box-sizing: border-box;
}
.header {
    height: 60px;
    border-bottom: 1px solid #ddd;
    line-height: 60px;
    padding: 20px;
    font-weight: 500;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
        display: flex;
        align-items: center;
        .label {
            width: 20px;
            height: 20px;
            margin-right: 5px;
        }
        .dataset_name {
            height: 60px;
            white-space: nowrap;
            overflow: hidden;
            width: 400px;
            text-overflow: ellipsis;
            line-height: 60px;
            cursor: pointer;
        }
    }
    .close_icon {
        width: 24px;
        height: 24px;
        cursor: pointer;
    }
}
.prompt {
    height: 440px;
    padding-left: 40px;
    padding-top: 20px;
    box-sizing: border-box;
    .tags_name {
        color: #111;
        font-size: 12px;
        font-weight: 600;
        margin-left: 27px;
        margin-top: 10px;
    }
    .tags_list {
        height: 350px;
        overflow: auto;
    }
    .tags {
        display: flex;
        margin-top: 10px;
        width: 100%;
        cursor: pointer;
        .checkout {
            margin-top: 5px;
        }
        .round {
            display: inline-block;
            min-width: 14px;
            width: 14px;
            height: 14px;
            border-radius: 7px;
            background: #7163C5;
            margin-top: 5px;
            margin-left: 15px;
        }
        .create_tags {
            font-size: 14px;
            margin-left: 15px;
            margin-top: 2px;
            max-width: 450px;
            overflow: hidden;
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
        }
        .green {
            background: green;
        }
        .blue {
            background: #28aadd;
        }
    }
}
.text_input {
    height: 24px;
    width: 520px;
    padding-left: 30px;
    outline: none;
    border: 1px solid #dddddd;
}
.btn {
    position: absolute;
    right: 23px;
    bottom: 15px;
    button {
        width: 60px;
        height: 28px;
        border: 0;
        cursor: pointer;
    }
}
.useing {
    color: #111;
    font-size: 12px;
    font-weight: 600;
    margin-left: 27px;
    margin-top: 10px;
    position: absolute;
    right: 80px;
    top: 105px;
}
.num_tags {
    position: absolute;
    right: 100px;
}
.cancel {
    margin-right: 20px;
    // background-color:#DB4D71;
    color: #7163C5;
}
.save {
    background-color: #7163C5;
    color: #fff;
}
.search {
    height: 20px;
    width: 20px;
    position: absolute;
    left: 45px;
    top: 82px;
}
.create {
    display: flex;
    position: relative;
    width: 520px;
    height: 30px;
    line-height: 30px;
    padding-left: 30px;
    font-size: 12px;
    margin-top: 10px;
    .add {
        position: absolute;
        top: 7px;
        left: 5px;
        // margin-top: 5px;
        width: 15px;
        height: 15px;

    }
    .enter {
        position: absolute;
        top: 7px;
        right: 10px;
        // margin-top: 5px;
        width: 15px;
        height: 15px;
    }
    // background-color: pink;
}
.create:hover {
    background-color: #e8e8e8;
    cursor: pointer;
}
</style>