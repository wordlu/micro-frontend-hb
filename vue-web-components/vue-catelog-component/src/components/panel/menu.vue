<template>
<div class="menu-download-left-part">
    <div class="user-info">
        <div class="user-name-container">
            <div class="user-name-area">
                <bpText class="inverse-heading-medium">{{allData.name_show}}</bpText>
                <img :src="img1" alt="">
            </div>
            <img :src="img2" alt="">
        </div>
        <bpText class="body-tertiary-inverse">{{allData.company_name_show}}</bpText>
    </div>
    <bpMenu :menu_data="menu_data" class="" :activeIndex="activeIndex" :activeSubIndex="activeSubIndex" :menuType="menuType"></bpMenu>
	<div class="log-out" @click="logOut">
		<span class="log-out-menu">
            <img :src="img3" alt="">
            <span class="log-out-text">退出登录</span>
        </span>
	</div>
</div>
</template>
<script>
import bpMenu from "../../../node_modules/vue-components/src/components/bp-menu.vue";
import bpText from "../../../node_modules/vue-components/src/components/bp-text.vue";
import { staticFilePath } from '../../config/envConfig'
import PhDagDefinitions from "../policy/definitions/definitions";

export default {
    components: {
        bpMenu,
        bpText
    },
    props: {
        allData: {
            type: Object,
            default: function() {
                return {
                    personalData: {},
                    employerData: {}
                }
            }
        },
        defs: {
            type: Object,
            default: function () {
                return new PhDagDefinitions("1");
            }
        }
    },
    data() {
        return {
            activeIndex: 0,
            activeSubIndex: 0,
            menuType: "",
            img1: `${staticFilePath}` + "/icon_dropdown.svg",
            img2: `${staticFilePath}` + "/icon_data.svg",
            img3: `${staticFilePath}` + "/icon_sign_out.svg",
            menu_data: [
                {
                    type: "item",
                    text: "开放资源",
                    src: this.defs.iconsByName('menuIcons', 'projects'),
                    content: this,
                    click_event: function (data) {
                        this.content.activeIndex = data
                        this.content.menuType = this.type
                        const event = new Event("event")
                        event.args = {
                            callback: "linkToPage",
                            element: this.content,
                            param: {
                                name: this.text,
                                index: 0
                            }
                        }
                        this.content.$emit('event', event)
                    }
                },
                {
                    type: "item",
                    text: "公有文件",
                    src: this.defs.iconsByName('menuIcons', 'assets'),
                    content: this,
                    click_event: function (data) {
                        this.content.activeIndex = data
                        this.content.menuType = this.type
                        const event = new Event("event")
                        event.args = {
                            callback: "linkToPage",
                            element: this.content,
                            param: {
                                name: this.text,
                                index: 3
                            }
                        }
                        this.content.$emit('event', event)
                    }
                },
                {
                    type: "item",
                    text: "数据资产",
                    src: this.defs.iconsByName('menuIcons', 'assets'),
                    content: this,
                    click_event: function (data) {
                        this.content.activeIndex = data
                        this.content.menuType = this.type
                        const event = new Event("event")
                        event.args = {
                            callback: "linkToPage",
                            element: this.content,
                            param: {
                                name: this.text,
                                index: 4
                            }
                        }
                        this.content.$emit('event', event)
                    }
                },
                {
                    type: "item",
                    text: "工作平台",
                    content: this,
                    src: this.defs.iconsByName('menuIcons', 'projects'),
                    click_event: function (data) {
                        this.content.activeIndex = data
                        this.content.menuType = this.type

                        const event = new Event("event")
                        event.args = {
                            callback: "linkToPage",
                            element: this.content,
                            param: {
                                name: this.text,
                                index: 2
                            }
                        }
                        this.content.$emit('event', event)
                    }
                },
                {
                    type: "item",
                    text: "平台资源",
                    content: this,
                    src: this.defs.iconsByName('menuIcons', 'resource'),
                    click_event: function (data) {
                        this.content.activeIndex = data
                        this.content.menuType = this.type

                        const event = new Event("event")
                        event.args = {
                            callback: "linkToPage",
                            element: this.content,
                            param: {
                                name: this.text,
                                index: 5
                            }
                        }
                        this.content.$emit('event', event)
                    }
                }
            ]
        }
    },
    methods: {
        logOut() {
            const event = new Event('event')
            event.args = {
                callback: 'logOut',
                element: this
            }
            this.$emit('event', event)
        }
    }
}
</script>
<style lang="scss" scoped>
     * {
        letter-spacing: .4px;
        line-height: 1.6;
        box-sizing: border-box;
    }
    .menu-download-left-part {
        width: 200px;
        min-height: 100vh;
        background: #FCFCFD !important;
        padding-top: 20px;
        position: relative;
        border-right: 2px solid #f6f6f7;
        /deep/.bp-menu-item, /deep/.bp-sub-menu {
            font-family: SFProText-Medium;
            font-size: 14px;
            color: #57565F;
            letter-spacing: 0;
            line-height: 20px;
            font-weight: 500;
        }
        /deep/.bp-menu-item {
            height: 28px !important;
            border-radius: 2px;
            height: 28px;
            margin: 1px 0;
            padding: 0 12px;
            display: flex;
        }
        /deep/.bp-menu-item:hover {
            color: #57565F !important;
        }
        .log-out {
            position: absolute;
            bottom: 40px;
            padding-left: 12px;
            cursor: pointer;
            .log-out-menu {
                display: flex;
                align-items: center;
                .log-out-text {
                    font-family: SFProText-Medium;
                    font-size: 14px;
                    color: #57565F;
                    letter-spacing: 0;
                    line-height: 20px;
                    font-weight: 500;
                }
            }
        }
        .user-info {
            background: #FCFCFD;
            height: 44px;
            margin: 0 12px 20px;
            .user-name-container {
                height: 24px;
                background: #FCFCFD;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                .user-name-area {
                    display: flex;
                    align-items: center;
                }
                .inverse-heading-medium {
                    font-family: SFProText-Regular;
                    font-size: 14px;
                    color: #25232D;
                    letter-spacing: 0.25px;
                    text-align: left;
                    line-height: 20px;
                    font-weight: 400;
                }
                .icon_notification-initial {
                    width: 20px;
                    height: 20px;
                    background: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M0 0h20v20H0z'/%3E%3Cpath d='M10 18c.825 0 1.5-.692 1.5-1.538h-3C8.5 17.308 9.168 18 10 18zm4.5-4.615V9.538c0-2.361-1.23-4.338-3.375-4.861V3h-2.25v1.677C6.723 5.2 5.5 7.169 5.5 9.538v3.847L4 14.923v.77h12v-.77l-1.5-1.538z' fill='%23FFF'/%3E%3C/g%3E%3C/svg%3E") no-repeat center/100% !important;
                }
            }
            .body-tertiary-inverse {
                font-family: SFProText-Light;
                font-size: 12px;
                color: #706F79;
                letter-spacing: 0.25px;
                line-height: 16px;
                font-weight: 200;
            }
         }
        .icon_upload {
            width: 20px;
            height: 20px;
            background: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2357565F' fill-rule='evenodd'%3E%3Cpath d='M14.358 7.74l-4-4.091-.048-.043-.103-.063-.094-.032-.07-.011h-.086l-.09.016-.089.034-.067.04-.069.059-4 4.09a.5.5 0 0 0 .647.758l.069-.058 3.141-3.213.001 7.772a.5.5 0 0 0 .992.09l.008-.09-.001-7.774 3.143 3.215a.5.5 0 0 0 .773-.63l-.057-.07z'/%3E%3Cpath d='M16 10.5a.5.5 0 0 1 .492.41l.008.09v5.5h-13V11a.5.5 0 0 1 .992-.09L4.5 11v4.5h11V11a.5.5 0 0 1 .41-.492L16 10.5z'/%3E%3C/g%3E%3C/svg%3E") no-repeat center/100% !important;
        }
    }
</style>
