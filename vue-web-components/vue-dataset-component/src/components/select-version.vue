<template>
    <div>
        <div class="version_dialog_container_version">
            <div class="dialog_area">
                <div class="header">
                        <span>可调用数据集</span>
                </div>
                <div class="prompt">
                    <div class="dlg-version-container">
                        <div class="dlg-flex-version" >
                            <div class="dlg-flex-version-item" v-show="selectCatalogNameTag != ''">
                                <span :title="selectCatalogNameTag">{{selectCatalogNameTag}}</span>
                                <img :src="close_icon" class="close_icon" @click="removeselectCatalogNameTag(selectCatalogNameTag)" alt="">
                            </div>
                        </div>
                        <div class="dlg-version-spliter"></div>
                        <input placeholder="搜索" v-model="searchRow" @input="searchRowInput(searchRow)" class="search_row_input" />
                        <img :src="search_row" class="search_row_icon" alt="">
                        <div class="dlg-all-version-container">
                            <div class="dlg-flex-version-item" v-for="(item, index) in versionArrShow" :key="item+index" @click="appendselectCatalogNameTag(item, index)">
                                <span>{{item}}</span>
                            </div>
                        </div>
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
// import PhDagDatasource from './model/datasourcev2'
import { staticFilePath, hostName } from '../config/envConfig'

export default {
    data() {
        return{
            selColName: "version",
            versionArrShow: [],
            selectCatalogNameTag: "",
            searchRow: [],
            search_row: `${staticFilePath}` + "/%E6%90%9C%E7%B4%A2.svg",
            close_icon: `${staticFilePath}` + "/icon_close.svg"
        }
    },
    props: {

    },
    computed: {},
    async mounted() {
        const url = `${hostName}/hbgetgluetable`
        const accessToken = this.getCookie("access_token")
        let body = {
            "glue_database_name": this.getCookie("company_id")
        }
        let options = {
            method: "POST",
            headers: {
                "Authorization": accessToken,
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                "accept": "application/json"
            },
            body: JSON.stringify(body)
        }
        let results = await fetch(url, options).then(res => res.json())
        this.versionArr = results.data.map((obj,index) => {
            return obj["attributes"]["name"];
        })
        this.versionArrShow = this.versionArr
    },
    watch: {},
    methods: {
        appendselectCatalogNameTag(data) {
            this.selectCatalogNameTag = data
        },
        // 搜索框
        searchRowInput(data) {
            if(data == "") {
                this.versionArrShow = this.versionArr
            } else {
                this.versionArrShow = this.versionArr.filter(it => it.indexOf(data) > -1)
            }
        },
        //取消选中version
        removeselectCatalogNameTag() {
            this.selectCatalogNameTag = ""
        },
        getCookie(name) {
            let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg))
                return (arr[2]);
            else
                return null;
        },
        save() {
            if(this.selectCatalogNameTag === "") {
                alert("请选择数据目录")
                return false
            }
            const event = new Event("event")
            event.args = {
                callback: "selectCatalogName",
                element: this,
                param: {
                    name: this.selectCatalogNameTag
                }
            }
            this.$emit('selectCatalogNameConfirm', event)
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
.version_dialog_container_version {
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
	.dialog_area {
		width: 400px;
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
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #fff;
		color: #000;
		font-size: 16px;
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
}

</style>