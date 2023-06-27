<template>
    <div>
        <div class="select_clear_dialog_container">
            <div class="dialog_area">
                <div class="header">
                        <span>数据版本</span>
                </div>
                <div class="prompt">
                    <div class="dlg-version-container">
                        <div class="dlg-flex-version" >
                            <div class="dlg-flex-version-item" v-for="(item, index) in selectVersionTags" :key="item+index">
                                <span :title="item">{{item}}</span>
                                <img :src="close_icon" class="close_icon" @click="removeSelectVersionTags(item)" alt="">
                            </div>
                        </div>
                        <div class="dlg-version-spliter"></div>
                        <input placeholder="搜索" v-model="searchRow" @input="searchRowInput(searchRow)" class="search_row_input" />
                        <img :src="search_row" class="search_row_icon" alt="">
                        <div class="dlg-all-version-container">
                            <div class="dlg-flex-version-item" v-for="(item, index) in versionArrShow" :key="item+index" @click="appendSelectVersionTags(item, index)">
                                <span>{{item}}</span>
								<span v-show="datasource.aliasArray[item] && datasource.aliasArray[item].length > 0">（{{datasource.aliasArray[item]}}）</span>
                            </div>
                        </div>
						<span v-if="datasource.version_total_count > selectVersionTags.length + versionArr.length" class="more" @click="moreVersion">更多</span>
						<span v-else class="more">暂无更多</span>
                    </div>
                </div>
                <div class="btn">
                    <button class="cancel" @click="close">取消</button>
                    <button class="save btn-margin" @click="save" >确定</button>
              </div>
            </div>
        </div>
    </div>
</template>
<script>
import PhDagDatasource from './model/datasource'
import { staticFilePath } from "../config/envConfig"

export default {
    data() {
        return{
            versionArrShow: [],
            versionArr: [],
            selectVersionTags: [],
            searchRow: [],
            search_row: `${staticFilePath}` + "/%E6%90%9C%E7%B4%A2.svg",
            close_icon: `${staticFilePath}` + "/icon_close.svg"
        }
    },
    props: {
        datasource: {
            type: Object,
            default: function() {
                return new PhDagDatasource('1', this.projectId, this)
            }
        },
        datasetName: String,
        projectId: String,
        dsVersion: Array,
        representId: String,
        cat: String
    },
    computed: {},
    mounted() {
        this.selectVersionTags = this.dsVersion
        this.datasource.name = this.datasetName
        this.moreVersion()
    },
    watch: {},
    methods: {
		moreVersion() {
			const that = this
			this.searchRow = []
			this.datasource.queryDlgDistinctCol(this, this.representId, this.cat, this.datasetName).then((data) => {
				//完整的显示行列表数据
				const arr = data.filter(it => that.selectVersionTags.indexOf(it) === -1)
				that.versionArr = that.versionArr.concat(arr)
				that.versionArrShow = that.versionArr
			})
		},
        appendSelectVersionTags(data, index) {
            //去重
            let setArr = new Set(this.selectVersionTags).add(data)
            this.selectVersionTags = Array.from(setArr)
            this.versionArrShow.splice(index, 1)
        },
        // 搜索框
        searchRowInput(data) {
            this.versionArrShow = this.versionArr.filter(it => it.indexOf(data) > -1)
        },
        //取消选中version
        removeSelectVersionTags(data) {
            this.selectVersionTags = this.selectVersionTags.filter(function(item) {
                return item !== data
            });
            this.versionArrShow.push(data)
        },
        getCookie(name) {
            let arr,
                reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if ((arr = document.cookie.match(reg))) return arr[2];
            else return null;
        },
        save() {
            const event = new Event("event")
            event.args = {
                callback: "selectVersion",
                element: this,
                param: {
                    datasetName: this.datasetName,
                    versionArr: this.selectVersionTags
                }
            }
            this.$emit('selectVersionConfirm', event)
        },
        close() {
            this.$emit('closeSelVersionDialog');
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
.select_clear_dialog_container {
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
    background: rgba(0,0,0,0.31);
}
.dialog_area {
    width: 700px;
    height: 500px;
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
    .close_icon {
        width: 24px;
        height: 24px;
        cursor: pointer;
    }
}
.prompt {
    .dlg-version-container {
        display: flex;
        flex-direction: column;
        margin: 24px;
        .dlg-version-spliter {
            height: 1px;
            background-color: #2c3e50;
            margin: 20px 0;
        }
        .search_row_input {
            margin: 20px 0;
            height: 40px;
            line-height: 40px;
            outline: 0;
            padding-left: 30px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        .search_row_icon {
            width: 20px;
            position: relative;
            top: -50px;
            left: 10px;
        }
        .dlg-flex-version {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            max-height: 70px;
            overflow: auto;
            .dlg-flex-version-item {
                font-size: 12px;
                border: 1px solid #ccc;
                display: flex;
                align-items: center;
                padding: 5px;
                border-bottom: 1px solid #ccc;
                margin-right: 5px;
                .close_icon {
                    width: 16px;
                    height: 16px;
                    margin-left: 5px;
                    cursor: pointer;
                }
            }

        }

        .dlg-all-version-container {
            display: flex;
            flex-direction: column;
            flex-wrap: nowrap;
            overflow: auto;
            max-height:150px;
            height: 150px;
                .dlg-flex-version-item {
                    cursor: pointer;
                    padding: 5px;
                    border-bottom: 1px solid #ccc;
                }
        }

		.more {
			margin: 0 auto;
			cursor: pointer;
			margin-top: 20px;
		}
    }

}
.btn {
    position: absolute;
    right: 23px;
    bottom: 15px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 530px;
    box-sizing: border-box;
    button {
        width: 60px;
        height: 28px;
        border: 0;
        cursor: pointer;
    }
    .cancel {
        margin-right: 5px;
        // background-color:#DB4D71;
        color: #7163C5;
    }
    .save {
        background-color: #7163C5;
        color: #fff;
    }
    .btn-margin {
        margin: 5px;
    }
}
</style>