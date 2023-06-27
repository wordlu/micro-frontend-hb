<template>
    <div class="my-data-content-container">
        <div class="header">
            <span class="header-large">
                {{allData.name}}
            </span>
            <bp-button  text="返回列表" @click="goBack(1)"></bp-button>
        </div>
        <div class="data-main-container">
            <template >
                <div class="myData-mine">
                    <div class="subtitle">
                        <span class="heading-xsmall file-name-text">文件名称
                        </span>
                        <span class="heading-xsmall database-name">数据库
                        </span>
                        <span class="heading-xsmall subscribe-location">来源
                        </span>
                        <span class="heading-xsmall last-time">上次更新时间
                        </span>
                    </div>

                    <div class="main-container" v-if="allData.tables">
                        <div v-for="(file,index) in allData.tables" :key="index" class="OneRecord" @click="showDetail(index)">
                            <div class="icon_datafile"></div>
                            <div class="data-name-container">
                                <div class="heading-small overflow-text" data-placement="bottom" data-toggle="tooltip" :title="file.name">{{file.name}}</div>
                            </div>

                            <div class="database">
                                <bp-text class="body-primary">{{allData.name}}</bp-text>
                            </div>

                            <div class="subscribe-location">
                                <bp-text class="body-tertiary">{{file.provider}}</bp-text>
                            </div>

                            <div class="last-time">
                                <bp-text class="body-tertiary">
                                    <template v-if="file.meta">{{formatDateStandard(file.meta.updated, 0)}}</template>
                                </bp-text>
                            </div>
                        </div>
                        <div v-if="allPage && curPage" class="page-container">
                            <bp-pagination :curPage="curPage" :pages="allPage" @changePage="changePage"></bp-pagination>
                        </div>
                    </div>
                </div>
            </template>
        </div>
        <data-detail @closeModal="closeModal" v-if="showDataDetail" :detailData="allData" :index="clickIndex" @viewPartClick="viewPartClick" @closePartClick="closePartClick" :showPart="showPart" @changePartPage="changePartPage" :random="random"></data-detail>
    </div>
</template>
<script>
import bpPagination from '../bp-pagination.vue'
import bpSelectVue from '../../../node_modules/vue-components/src/components/bp-select-vue.vue'
import bpOptionVue from '../../../node_modules/vue-components/src/components/bp-option-vue.vue'
import bpText from '../../../node_modules/vue-components/src/components/bp-text.vue'
import bpButton from '../../../node_modules/vue-components/src/components/bp-button.vue'
import bpImg from '../../../node_modules/vue-components/src/components/bp-img.vue'
import editableComponent from '../editable-component.vue'
import util from '../util.vue'
import dataDetail from '../panel/data-list-detail.vue'
import { staticFilePath } from '../../config/envConfig'
export default {
    components: {
        bpPagination,
        bpSelectVue,
        bpOptionVue,
        bpText,
        bpButton,
        editableComponent,
        bpImg,
        dataDetail
    },
    data() {
        return {
            myDataTab: 0,
            rename: false,
            renameFile: '',
            mineSortUpdatedTimeIcon: '',
            mineSortAscendingIcon: '',
            userName: util.methods.getCookie('user_name'),
            subscribedTitle: "文件名称",
            fileIconDark: `${staticFilePath}` + "/icon_my-data-dark.svg",
            goDetail: "查看详情",
            iconSortAscending: `${staticFilePath}` + "/icon_sorting-descending.svg",
            iconSortDescending: `${staticFilePath}` + "/icon_sorting-descending.svg",
            clickIndex: 0,
            showDataDetail: false,
            showPart: false
        }
    },
    props: {
        allData: {
            type: Object,
            default: function() {
                return {
                    name: "phdatacat",
                    partTables: [],
                    tables: [{
                        "partitionKeys": [],
                        "schemas": [],
                        "serdeArguments": {},
                        "tableAttributes": {}
                    }]
                }
            }
        },
        random: Number
    },
    computed: {
        allPage() {
            const total = this.allData.count
            const perPage = 10
            if (Math.ceil(total / perPage) <= 1) {
                return 0
            }
            return Math.max(1, Math.ceil(total / perPage))
        },
        curPage() {
            return this.allData.page + 1
        },
        timeDisplay() {
            if (this.allData.sort.indexOf('created') !== -1) {
                return true
            } else {
                return false
            }
        }
    },
    methods: {
        changePartPage(page, index) {
            let data = this.allData.tables[index]
            const event = new Event("event")
            event.args = {
                callback: "requestData",
                element: this,
                param: {
                    name: 'partition',
                    queryParams: {
                        "page": page - 1,
                        "database": this.allData.name,
                        "table": data.name
                    }
                }
            }
            this.$emit('event', event)
        },
        showDetail(index) {
            let data = this.allData.tables[index]
            const event = new Event("event")
            event.args = {
                callback: "requestData",
                element: this,
                param: {
                    name: 'partition',
                    queryParams: {
                        "database": this.allData.name,
                        "table": data.name
                    }
                }
            }
            this.$emit('event', event)
            this.clickIndex = index
            this.showDataDetail = true
        },
        closePartClick() {
            this.showPart = false
        },
        viewPartClick() {
            this.$forceUpdate();
            this.showPart = true
        },
        closeModal() {
            this.showPart = false
            this.showDataDetail = false
        },
        formatFileName(...params) {
            let resname = params[0]
            let len = 0

            if (resname === null) {
                return "nameless"
            }

            for (let i = 0; i < resname.length; i++) {
                if (resname.charCodeAt(i)>127 || resname.charCodeAt(i)==94) {
                    len += 2
                } else {
                    len ++
                }
                if (len > 64) {
                    resname = resname.substring(0, i) + '...'
                    break
                }
            }
            return resname
        },
        formatDateStandard(...params) {
            if(params.length === 2) {
                let date = new Date( Number(params[0]) ),
                    Y = date.getFullYear(),
                    M =
                        ( date.getMonth() + 1 < 10 ?
                            `0${date.getMonth() + 1}` :
                            date.getMonth() + 1 ),
                    D0 = ( date.getDate() < 10 ? `0${date.getDate()}` : date.getDate() ),
                    D1 = ( date.getDate() < 10 ? `0${date.getDate()}` : date.getDate() ),

                    h =
                        ( date.getHours() < 10 ? `0${date.getHours()}` : date.getHours() ),
                    m =
                        ( date.getMinutes() < 10 ?
                            `0${date.getMinutes()}` :
                            date.getMinutes() ) ,
                    s = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()

                // 输出结果：yyyy/mm/dd hh:mm
                if(params[1] === 0){
                    return Y + "/" + M + "/" + D0 + " " + h + ":" + m
                }else if(params[1] === 1) {
                    return Y + "-" + M + "-" + D0 + " " + h + ":" + m
                }
            }
        },
        changePage(page) {
            const event = new Event("event")
            event.args = {
                callback: "linkToPage",
                element: this,
                param: {
                    name: 'download/data-directory-table',
                    queryParams: `page=${page - 1}&database=${this.allData.name}`
                }
            }
            this.$emit('event', event)
        },
        goBack(param) {
            const event = new Event("event")
            event.args = {
                callback: "linkToPage",
                element: this,
                param: {
                    name: 'download/my-data',
                    queryParams: `tab=${param}`
                }
            }
            this.$emit('event', event)
        }
    } 
}
</script>
<style lang="scss" scoped>
    * {
        box-sizing: border-box;
    }
    .cursor-not-allow {
        cursor: not-allowed;
    }

    @mixin btn_primary-initial {
        font-family: SFProText-Medium;
        font-size: 14px;
        color: #FFFFFF;
        text-align: center;
        line-height: 20px;
    }

    @mixin btn_disabled {
        font-family: SFProText-Medium;
        font-size: 14px;
        color: #BCBAC4;
        text-align: center;
        line-height: 20px;
    }

    button.btn_primary {
        background: #7163C5 !important;
        border-radius: 2px;
        display: flex;
        justify-content: center;
        align-items: center;
        @include btn_primary-initial;

        &:hover {
            background: #9084D2 !important; 
            @include btn_primary-initial;
        }

        &:active {
            background: #5342B3 !important;
            @include btn_primary-initial; 
        }

        &:disabled {
            background: rgba(37, 35, 45, 0.04) !important;
            @include btn_disabled;
        }
    }

    

    .heading-xsmall {
        font-family: SFProText-Regular;
        font-size: 12px;
        color: #706F79;
        letter-spacing: .25px;
        line-height: 16px;
        text-align: left;
        font-weight: 500;
    }

    .heading-small {
        font-family: SFProText-Regular;
        font-size: 14px;
        color: #302F39;
        letter-spacing: 0.25px;
        text-align: left;
        line-height: 20px;
    }

    .body-primary {
        font-family: SFProText-Light;
        font-size: 14px;
        color: #302F39;
        letter-spacing: 0.25px;
        line-height: 20px;
    }

    .body-tertiary {
        font-family: SFProText-Light;
        font-size: 12px;
        color: #706F79;
        letter-spacing: 0.25px;
        line-height: 16px;
    }

    .body-secondary {
        font-family: SFProText-Light;
        font-size: 14px;
        color: #706F79;
        letter-spacing: 0.25px;
        line-height: 20px;
    }

    @mixin body-primary {
        font-family: SFProText-Light;
        font-size: 14px;
        color: #302F39;
        letter-spacing: 0.25px;
        line-height: 20px;
    }

    @mixin body-primary-red-light {
        font-family: SFProText-Light;
        font-size: 14px;
        color: #DB4D71;
        letter-spacing: 0.25px;
        line-height: 20px;
    }

    @mixin icon_more-v {
        width: 20px;
        height: 20px;
        background: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11.5 10.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0 6a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-12a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z' fill='%2357565F' fill-rule='evenodd'/%3E%3C/svg%3E") no-repeat center/100%;
    }

    .no_data-icon {
        width: 160px;
        height: 160px;
        background: url("data:image/svg+xml,%3Csvg width='160' height='160' viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cellipse fill='%23F5F5F6' cx='80' cy='147' rx='56' ry='5'/%3E%3Cpath d='M150.25 47.75v30.5h-12.636c.407.83.636 1.763.636 2.75a6.23 6.23 0 0 1-1.83 4.42 6.23 6.23 0 0 1-4.42 1.83 6.23 6.23 0 0 1-4.42-1.83 6.23 6.23 0 0 1-1.83-4.42c0-.987.229-1.92.636-2.75H9.75v-30.5h140.5z' stroke='%23E6E6E6' stroke-width='.5' fill='%23FFF'/%3E%3Cpath d='M150 48v30h-12.803a6 6 0 1 1-10.395 0H80V48h70z' fill='%23F2F2F3'/%3E%3Cpath d='M150.25 89.75v30.5H34.002c.161.556.248 1.143.248 1.75a6.23 6.23 0 0 1-1.83 4.42 6.23 6.23 0 0 1-4.42 1.83 6.23 6.23 0 0 1-4.42-1.83 6.23 6.23 0 0 1-1.83-4.42c0-.607.087-1.194.248-1.75H9.75v-30.5h116.957a5.731 5.731 0 0 0-.457 2.25c0 1.588.644 3.025 1.684 4.066A5.732 5.732 0 0 0 132 97.75a5.732 5.732 0 0 0 4.066-1.684A5.732 5.732 0 0 0 137.75 92c0-.798-.163-1.559-.457-2.25h12.957z' stroke='%23E6E6E6' stroke-width='.5' fill='%23FFF'/%3E%3Cpath d='M150 90v30H80V90h46.341a6 6 0 1 0 11.317 0H150z' fill='%23F2F2F3'/%3E%3Cpath fill='%23E8E8E9' d='M16 66h64v-8H16zM16 108h64v-8H16z'/%3E%3Cpath fill='%239794A7' d='M80 66h64v-8H80zM80 108h64v-8H80z'/%3E%3Cpath fill='%23E8E8E9' d='M16 72h16v-4H16zM16 114h16v-4H16z'/%3E%3Cpath d='M148 31.75c.621 0 1.184.252 1.591.659.407.407.659.97.659 1.591v14.25H34.002c.161.556.248 1.143.248 1.75a6.23 6.23 0 0 1-1.83 4.42A6.23 6.23 0 0 1 28 56.25a6.23 6.23 0 0 1-4.42-1.83A6.23 6.23 0 0 1 21.75 50c0-.607.087-1.194.248-1.75H9.75V34c0-.621.252-1.184.659-1.591.407-.407.97-.659 1.591-.659z' stroke='%23E6E6E6' stroke-width='.5' fill='%23FFF'/%3E%3Cpath d='M80 32h68a2 2 0 0 1 2 2v14H80V32z' fill='%23F2F2F3'/%3E%3Ccircle fill='%239B9AAB' cx='18' cy='40' r='2'/%3E%3Ccircle fill='%23BEBBC8' cx='24' cy='40' r='2'/%3E%3Ccircle fill='%23DEDDE2' cx='30' cy='40' r='2'/%3E%3C/g%3E%3C/svg%3E") no-repeat center/100%;
    }

    .icon_datafile {
        width: 24px;
        height: 24px;
        background: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M6 2h7l6 6v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z' fill='%23E1DFE9'/%3E%3Cpath d='M13 2l6 6h-5a1 1 0 0 1-1-1V2z' fill='%23A3A1AB'/%3E%3C/g%3E%3C/svg%3E") no-repeat center/100% !important; 
    }

    .icon_subscribed {
        width: 20px;
        height: 20px;
        background: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3.972 14.586c.812 0 1.471.653 1.471 1.457 0 .805-.659 1.457-1.471 1.457A1.464 1.464 0 0 1 2.5 16.043c0-.804.659-1.457 1.472-1.457zm-.949-6.043c4.624 0 8.372 3.71 8.372 8.288a.52.52 0 0 1-.523.518.52.52 0 0 1-.523-.518c0-4.005-3.28-7.252-7.326-7.252a.52.52 0 0 1-.523-.518.52.52 0 0 1 .523-.518zm0-6.043C11.02 2.5 17.5 8.916 17.5 16.83a.52.52 0 0 1-.523.519.52.52 0 0 1-.524-.518c0-7.343-6.012-13.295-13.43-13.295a.52.52 0 0 1-.523-.518.52.52 0 0 1 .523-.518z' fill='%237163C5' fill-rule='evenodd'/%3E%3C/svg%3E") no-repeat center/100%;
    }

    .cursor-pointer {
        cursor: pointer;
    }

    .mr-3 {
        margin-right: 16px;
    }

    .label_button_theme {
        font-family: SFProText-Medium;
        font-size: 14px;
        letter-spacing: 0;
        line-height: 20px;
        color: #7163C5;
    }

    .btn_secondary_initial {
        font-family: SFProText-Medium;
        font-size: 14px;
        letter-spacing: 0;
        line-height: 20px;
        color: #57565F;
    }

    .my-data-content-container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        .header {
            height: 62px;
            width: 100%;
            padding: 20px 24px 24px;
            border-bottom: 1px solid rgba(37,35,45,.08);
            display: flex;
            justify-content: space-between;
            align-items: center;
            .header-large {
                font-family: SFProText-Regular;
                font-size: 20px;
                color: #302F39;
                letter-spacing: .25px;
                line-height: 28px;
            }
            .button-density-default {
                width: 80px;
                height: 32px;
                background: #f6f6f7;
                border-radius: 2px;
                font-family: SFProText-Medium;
                font-size: 14px;
                color: #57565F;
                letter-spacing: 0;
                text-align: center;
                line-height: 20px;
                font-weight: 500;
            }
        }

        .tabs {
            height: 24px;
            width: 100%;
            padding: 0 24px 0 20px;
            display: flex;
            margin-top: 12px;
            .tab-active {
                border-bottom: 2px solid #7163C5;
            }
        }

        .data-main-container {
            display: flex;
            flex-direction: column;
            flex: 1;
            position: relative;
            .subscribed-container {
                .subscribed-item {
                    .file-icon-dark {
                        width: 38px;
                        height: 38px;
                    }
                }
            }
            .myData-mine {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 12px 20px 8px 20px;
                height: 507px;
                min-height: 0;

                .subtitle {
                    display: flex;
                    align-items: center;
                    width: 100%;
                    height: 33px !important;
                    border-bottom: 0.5px solid rgba(31, 37, 50, 0.08);

                    .file-name-text {
                        // flex: 1;
                        width: 276px;
                        min-width: 276px;
                    }

                    .database-name {
                        min-width: 200px;
                        width: 200px;
                        padding: 0 8px;
                    }

                    .subscribe-location {
                        flex: 1;
                        min-width: 300px;
                        padding: 0 8px;
                    }

                    .last-time {
                        width: 160px;
                        min-width: 160px;
                        display: block;
                        text-align: right;
                    }
                }

                .main-container {
                    width: 100%;
                    overflow: scroll;
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    //隐藏滚动条
                    &::-webkit-scrollbar {
                        width: 0 !important;
                    }
                    -ms-overflow-style: none;

                    .OneRecord {
                        width: 100%;
                        height: 66px;
                        display: flex;
                        align-items: center;
                        border-bottom: 1px solid rgba(37, 35, 45, 0.08);
                        cursor: pointer;
                        // 文件logo
                        .icon_datafile {
                            width: 24px;
                            height: 24px;
                            margin-right: 18px;
                        }
                        // 文件名称及tag
                        .data-name-container {
                            // flex: 1;
                            width: 234px;
                            min-width: 234px;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            .overflow-text {
                                height: 20px;
                                width: 230px !important;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                            }
                            .data-name-bottom {
                                display: flex;
                                height: 18px;
                                
                                .editable-component {
                                    margin-right: 2px;
                                    &:last-of-type {
                                        margin-right: 0;
                                    }
                                }
                            }
                        }
                        // 拥有者owner
                        .database {
                            min-width: 200px;
                            width: 200px;
                            height: 100%;
                            padding: 0 8px;
                            display: flex;
                            align-items: center;
                            .bp-text {
                                height: 20px;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                            }
                        }
                        //订阅人数
                        .subscribe-location {
                            flex: 1;
                            min-width: 300px;
                            padding: 0 8px;
                            display: flex;
                            align-items: center;
                        }
                        // 排序功能
                        .last-time {
                            min-width: 160px;
                            width: 160px;
                            height: 100%;
                            display: block;
                            text-align: right;
                            line-height: 65px;
                            .bp-text {
                                height: 16px;
                            }
                        }
                        // 功能键
                        .action-menu {
                            width: 4.8%;
                            height: 100%;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            /deep/.bp-select-option {
                                width: 20px;
                                height: 20px;
                                background-color: #fff;
                                //在bp-select-title这个div上显示button的图片
                                .bp-select-title {
                                    padding: 0 !important;
                                    @include icon_more-v;
                                }
                                .button-focus {
                                    // @include icon_more-v-focus;
                                }
                                .bp-option-group {
                                    position: absolute;
                                    z-index: 99;
                                    background: #FFFFFF;
                                    box-shadow: 0 0 1px 0 rgba(37, 35, 45, 0.12), 0 4px 8px -2px rgba(37, 35, 45, 0.25);
                                    border-radius: 2px;
                                    right: 0px;
                                    width: 157px !important;
                                    // height: 112px !important;
                                    padding: 0;
                                    display: flex;
                                    flex-direction: column;
                                    justify-content: center;
                                    .bp-option {
                                        padding: 0 0 0 12px !important;
                                        height: 28px;
                                        &:hover {
                                            background: #E5EAEC;
                                        }
                                        &:active {
                                            background: #5D6568;
                                            span {
                                                color: rgba(255, 255, 255, 0.95) !important;
                                            }
                                        }
                                        span {
                                            @include body-primary;
                                        }
                                    }

                                    .option-line {
                                        height: 0.5px;
                                        background: rgba(31, 36, 49, 0.08);
                                        margin: 0.5px 0;
                                    }

                                    .remove-file span {
                                        @include body-primary-red-light;
                                    }
                                }
                            }
                        }
                    }

                    .page-container {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 64px;
                        width: 100%;
                        padding: 20px 0;
                    }
                }
            }

            .blank {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                flex: 1;
                overflow: scroll;

                .no_data-icon {
                    margin-bottom: 20px;
                }

                .body-secondary {
                    padding: 0 2px;
                    width: 312px;
                    text-align: center;
                    margin-top: 16px;
                }
                button {
                    width: 80px;
                    height: 32px;
                    margin-top: 20px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }
        }
    }
</style>