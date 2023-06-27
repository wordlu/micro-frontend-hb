<template>
    <div class="container_nav">
        <div class="header">
            <div class="left">
				<img @click="linkToPage('project')" class="home" :src="home" alt="">
                <span class="project_name" @click="linkToPage('project')" :title="allData.projectName">
                {{projectName}}
                </span>
                <div class="expand_bg bg_blue" @mouseover="focusExpand" @mouseout="focusOutExpand">
                    <img :src="img1" alt="" class="expand">
                    <nav class="expand_popup popup_position_l1" v-show="expangPopup" @mouseover="focusExpand" @mouseout="focusOutExpand">
                        <ul>
                            <li @click="linkToPage('flow')">数据流程</li>
                            <li @click="linkToPage('datasets')">数据集</li>
                            <li @click="linkToPage('scripts')">脚本</li>
                            <li>数据看板</li>
                        </ul>
                    </nav>
                </div>
				<div class="expand_bg bg_purple" @mouseover="focusExpandL2" @mouseout="focusOutExpandL2">
                    <img :src="img2" alt="" class="expand">
                    <nav class="expand_popup popup_position_l2" v-show="expangPopupL2" @mouseover="focusExpandL2" @mouseout="focusOutExpandL2">
                        <ul>
                            <li @click="linkToPage('executions')">运行记录</li>
							<li @click="linkToPage('scenarios')">Scenarios</li>
                        </ul>
                    </nav>
                </div>
            </div>
            <div class="right">
            </div>
        </div>
    </div>
</template>
<script>
import { staticFilePath } from '../config/envConfig'

export default {
    data() {
        return {
            expangPopup: false,
            expangPopupL2: false,
            airflow: `${staticFilePath}` + "/icons/Airflow_switch.svg",
            home: `${staticFilePath}` + "/icons/%E4%B8%BB%E9%A1%B5.svg",
            img1: `${staticFilePath}` + "/%E6%8B%93%E5%B1%95.svg",
            img2: `${staticFilePath}` + "/job_button.svg",
            projectName: ""
        }
    },
    components: {},
    props: {
        allData: {
            type: Object,
            default: function() {
                return {
                    projectName: "",
                    popupBack: false
                }
            }		
        }
    },
    beforeMount() {},
    mounted() {
        let href = window.location.href
        let paramArr = href.split("?")[1].split("&")
        this.projectName = this.getUrlParam(paramArr, "projectName")
    },
    methods: {
        getUrlParam (arr, value) {
            let data = arr.find(item => item.indexOf(value) > -1)
            return data ? decodeURI(data).split("=")[1] : undefined
        },
        linkToPage(name) {
            // 弹框询问跳转
            if(this.allData.popupBack) {
                let sel = confirm("您还没有保存更改，确认返回吗?")
                if(sel) {
                    const event = new Event("event")
                    event.args = {
                        callback: "linkToPage",
                        element: this,
                        param: {
                            "name": name,
                            "projectName": this.allData.projectName,
                            "projectId": this.allData.projectId
                        }
                    }
                    this.$emit('event', event)
                }
            } else {
                // 直接跳转
                const event = new Event("event")
                event.args = {
                    callback: "linkToPage",
                    element: this,
                    param: {
                        "name": name,
                        "projectName": this.allData.projectName,
                        "projectId": this.allData.projectId
                    }
                }
                this.$emit('event', event)
            }
        },
        focusOutExpand() {
            this.expangPopup = false
        },
        focusExpand() {
            this.expangPopup = true
        },
        focusExpandL2() {
            this.expangPopupL2 = true
        },
        focusOutExpandL2() {
            this.expangPopupL2 = false
        }
    }
};
</script>
<style lang="scss">
	* {
		box-sizing: border-box;
	}
    .container_nav {
        box-sizing: border-box;
    }
    .header {
        // width: 100vw;
        height: 40px;
        background: #222;
        color: #fff;
        font-size: 20px;
        padding: 0 20px;
        .left {
            display: flex;
            align-items: center;
            .icon {
                width: 28px;
                height: 28px;
                margin-left: 20px;
                cursor: pointer;
            }
			.home {
				width: 28px;
                height: 28px;
                cursor: pointer;
				margin-right: 10px;
			}
        }
        .project_name {
            cursor: pointer;
            width: 100px;
            overflow: hidden;
            text-overflow: ellipsis;
        }
		.bg_blue {
            background: #28a9dd;
		}
		.bg_purple {
            background: #8541aa;
		}
        .expand_bg {
            width: 40px;
            height: 40px;
            margin-left: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
			cursor: pointer;
            .expand {
                width: 20px;
                height: 20px;
                position: relative;
                left: 0;
            }
        }
    }
	.popup_position_l1 {
        left: 166px;
        top: 40px;
	}
	.popup_position_l2 {
        left: 220px;
        top: 40px;
	}
    .expand_popup {
        background-color: #333333;
        box-shadow: 0 5px 5px -3px rgba(34, 34, 34, 0.2), 0 3px 14px 2px rgba(34, 34, 34, 0.12), 0 8px 10px 1px rgba(34, 34, 34, 0.14);
        width: 200px;
        height: auto;
        position: absolute;
        z-index: 3001;
        font-size: 14px;
        font-weight: 400px;
        ul, li {
            list-style: none;
            padding-left: 0;
            margin: 0 auto;
        }
        li {
            color: #ffffff;
            width: 180px;
            padding: 10px;
            border-bottom: 1px solid #444;
            cursor: pointer;
        }
        li:hover {
            background: #444;
        }
    }
    
</style>