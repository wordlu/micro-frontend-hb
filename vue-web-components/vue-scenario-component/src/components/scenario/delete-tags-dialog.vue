<template>
    <div>
        <div class="clear_dialog_container">
            <div class="dialog_area">
               <div class="header">
                   <img :src="label_icon" class="label" alt="">
                   管理标签
               </div>
               <div class="prompt">
                   <img :src="search_icon" class="search" alt="">
                   <input type="text" placeholder="筛选标签或创建新标签" class="text_input" v-model="searchValue" @keyup.enter.prevent="submit" >

                   <span class="tags_name">标签名</span>
                   <span class="useing">正在使用</span>
                   <div class="tags" v-for="(item,index) in searchData" :key="index">
                       <span class="round"></span>
                       <span>
                           <input type="text" v-for="(tag,ind) in item.label" :key="ind" :value="tag" class="deleteTags" @keyup.enter.prevent="sub" ref="input" />
                       </span>
                       <span class='num_tags'>0</span>
                       <span class='bgc_tags' @click="deleteTag(index)">
                           <img :src="delete_icon" alt="" class="img_tags">
                       </span>
                   </div>
                   <div class="create" v-if="searchData.length == 0 " @click="addTags">
                        <img :src="add_icon" alt="" class="add">
                        <p>Create《{{searchValue}}》</p>
                        <img :src="enter_icon" alt="" class="enter">
                   </div>
               </div>
              <div class="btn">
                       <button class="cancel" @click="close">取消</button>
                       <button class="save">保存</button>
              </div>
            </div>
        </div>
    </div>
</template>

<script>
import { staticFilePath } from '../../config/envConfig'

export default {
    data() {
        return{
            label_icon: `${staticFilePath}` + "/tag.svg",
            search_icon: `${staticFilePath}` + "/search.png",
            delete_icon: `${staticFilePath}` + "/delete_r.svg",
            add_icon: `${staticFilePath}` + "/add.svg",
            enter_icon: `${staticFilePath}` + "/enter.svg",
            // tagList: ['lalalal','12345','nxjksdcjk','啦啦啦啦'],
            searchValue: '',
            ent: false

        }
    },
    props: {
        allData: {
            type: Object,
            default: () => ({
                projectName: "项目名称",
                scenarios: [
                    // {projectId:1,name:'Data_0001',label: ['lalalla','lll']},
                    // {projectId:2,name:'Data_0002',label: ['bbbbbbb','aaaaaaaa']}
                ]
            })
        }
    },
    computed: {
        searchData: function() {
            let searchValue = this.searchValue
            if(searchValue) {
                return this.allData.scenarios.filter(function(pro) {
                    // return Object.keys(pro).some(function(key) {
                    return String(pro).toLowerCase().indexOf(searchValue) > -1
                    // })
                })
            }
            return this.allData.scenarios
        }
    },
    methods: {
        close() {
            this.$emit('closeDeleteTags');
        },
        sub() {
            this.$refs.input.disabled = true;
            console.log(this.$refs.input);
        },
        deleteTag(index) {
            this.tags.splice(index,1)
        },
        addTags() {
            this.tags.push(this.searchValue)
            this.searchValue = ''
        },
        submit() {
            this.tags.push(this.searchValue)
            this.searchValue = ''
            console.log('回车');
        }
    }
}
</script>

<style lang="scss" scoped>
*{
    margin: 0;
    padding: 0;
}
.clear_dialog_container {
	height: 100vh;
    width: 100vw;
    background: rgba(37,35,45,0.55);
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
    padding-left: 50px;
    font-weight: 500;
}
.prompt {
    height: 440px;
    padding-left: 40px;
    padding-top: 20px;
    border-bottom: 1px solid #ddd;
	box-sizing: border-box;
    .tags_name {
        color: #111;
        font-size: 12px;
        font-weight: 600;
        margin-left: 27px;
        margin-top: 10px;
    }
    .tags {
        display: flex;
        margin-top: 10px;
        .checkout {
            margin-top: 5px;
        }
        .round {
            display: inline-block;
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
    }
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
.label {
    width: 20px;
    height: 20px;
    position: absolute;
    top: 22px;
    left: 20px;
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
.deleteTags {
    display: inline-block;
    width: 200px;
    height: 25px;
    padding-left: 10px;
    margin-left: 5px;
    border-style: none;
    // outline: none;
}
.deleteTags:hover {
    border: 1px solid #ddd;
    // background-color: #000;
}
.useing {
    color: #111;
    font-size: 12px;
    font-weight: 600;
    margin-left: 27px;
    margin-top: 10px;
    position: absolute;
    right: 80px;
}
.num_tags {
    position: absolute;
    right: 100px;
    color: #ddd;
}
.img_tags {
    width: 13px;
    height: 13px;
    // position: absolute;
    // right: 70px;
    // margin-top: 5px;
}
.bgc_tags {
    width: 20px;
    height: 20px;
    padding-left: 4px;
    // background-color: pink;
    position: absolute;
    right: 50px;
    margin-top: 3px;
}
.bgc_tags:hover {
    background-color:#f9e3e5;
    cursor: pointer;
}
</style>
