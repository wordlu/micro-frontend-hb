<template>
    <div class="data-list-detail">
        <div  class="data-detail-container">
            <div class="header-area">
                <bp-text class="header-title">{{detailData.name}}</bp-text>
                <img :src="closeIcon" class="icon-close" alt="" @click="closeModel">
            </div>
            <div class="body-area" v-if="!showPart">
                <div class="view-part">
                    <bp-text class="last-modify-time">{{lastModifyTime}}: {{formatDateStandard(detailData.tables[index].meta.updated, 0)}}
                    </bp-text>
                    <bp-button  :text="viewPart" class="btn_primary" @click="viewPartClick"></bp-button>
                </div>
                <div class="overview">
                    <bp-text class="title">{{overTitle}}</bp-text>
                    <div class="name-value-area">
                        <div class="name-value">
                            <bp-text class="subtitle">名称：</bp-text>
                            <bp-text class="subvalue">{{detailData.tables[index].name}}</bp-text>
                        </div>
                        <div class="name-value">
                            <bp-text class="subtitle">描述：</bp-text>
                            <bp-text v-if="detailData.tables[index].meta.describe != ''" class="subvalue">{{detailData.tables[index].meta.describe}}</bp-text>
                            <bp-text v-if="detailData.tables[index].meta.describe == ''" class="subvalue">暂无描述</bp-text>
                        </div>
                        <div class="name-value">
                            <bp-text class="subtitle">数据库：</bp-text>
                            <bp-text class="subvalue">{{detailData.name}}</bp-text>
                        </div>
                        <div class="name-value">
                            <bp-text class="subtitle">分类：</bp-text>
                            <template v-if="detailData.tables[index].meta.parameters">
                                <bp-text class="subvalue">{{detailData.tables[index].meta.parameters.classification}}</bp-text>
                            </template>
                        </div>
                        <div class="name-value mb-5">
                            <bp-text class="subtitle">上次更新时间：</bp-text>
                            <bp-text class="subvalue">{{formatDateStandard(detailData.tables[index].meta.updated, 0)}}</bp-text>
                        </div>
                        <div class="name-value">
                            <bp-text class="subtitle">输入格式：</bp-text>
                            <bp-text class="subvalue">{{detailData.tables[index].meta['input-format']}}</bp-text>
                        </div>
                        <div class="name-value">
                            <bp-text class="subtitle">输出格式：</bp-text>
                            <bp-text class="subvalue">{{detailData.tables[index].meta['output-format']}}</bp-text>
                        </div>
                        <div class="name-value">
                            <bp-text class="subtitle">Serde 序列化库：</bp-text>
                            <bp-text class="subvalue">{{detailData.tables[index].meta['serde-info'].SerializationLibrary}}</bp-text>
                        </div>
                    </div>
                </div>
                <div class="property">
                    <div class="name-value-area">
                        <div class="name-value">
                            <bp-text class="subtitle">Serde 参数：</bp-text>
                            <div class="name-value-area">
                                <template v-if="detailData.tables[index].meta['serde-info']">
                                    <div class="parameter" v-for="(val, key, index) in detailData.tables[index].meta['serde-info'].Parameters" :key="index+'Serde'">
                                        <bp-text class="name">{{key}}</bp-text>
                                        <bp-text class="value">{{val}}</bp-text>
                                    </div>
                                </template>
                            </div>
                        </div>
                         <div class="name-value">
                            <bp-text class="subtitle">表属性：</bp-text>
                            <div class="name-value-list">
                                <template v-if="detailData.tables[index].meta">
                                    <div class="parameter" v-for="(val, key, index) in detailData.tables[index].meta.parameters" :key="index+'table'">
                                        <template v-if="key != 'classification'">
                                        <bp-text class="name">{{key}}</bp-text>
                                        <bp-text class="value">{{val}}</bp-text>
                                        </template>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="architecture">
                    <bp-text class="title">{{architecture}}</bp-text>
                    <div class="architecture-table">
                        <div class="table-title">
                            <span class="index-text"></span>
                            <span class="column-name">列名称
                            </span>
                            <span class="data-type">数据类型
                            </span>
                            <span class="partition">分区键
                            </span>
                            <span class="comment">评论
                            </span>
                        </div>

                        <div class="main-container">
                            <div v-for="(file,index) in schemas" :key="index" class="OneRecord">
                                <div class="index-text">{{index+1}}</div>
                                <div class="column-name">
                                    <div class="column-name-text overflow-text" >{{file.Name}}</div>
                                </div>

                                <div class="data-type">
                                    <bp-text class="body-primary">{{file.Type}}</bp-text>
                                </div>

                                <div class="partition">
                                    <bp-text class="body-tertiary">{{file.parameters}}</bp-text>
                                </div>

                                <div class="comment">
                                    <bp-text class="body-tertiary">
                                        {{file.comment}}
                                    </bp-text>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 查看分区 -->
            <div class="body-area" v-if="showPart">
                <div class="view-part">
                    <bp-text class="last-modify-time">{{lastModifyTime}}: {{formatDateStandard(detailData.tables[index].meta.updated, 0)}}
                    </bp-text>
                    <bp-button  :text="closePart" class="btn_primary" @click="closePartClick"></bp-button>
                </div>
                <div class="architecture">
                    <div class="architecture-table architecture-table-part">
                        <div class="table-title-part">
                            <span class="column-name-part" v-for="tableName in detailData.tables[index].meta['partition-keys']" :key="tableName.Name">{{tableName.Name}}
                            </span>
                            <span class="partition"></span>
                        </div>

                        <div class="main-container">
                            <div v-for="(file,idx) in detailData.partTables" :key="idx" class="OneRecord-part">
                                <div class="column-name-part" v-for="tableField in detailData.tables[index].meta['partition-keys']" :key="tableField.Name+'0'">
                                    <div class="column-name-text" >{{file.schema[tableField.Name]}}</div>
                                </div>
                                <div class="partition-part">
                                    <bp-text class="view-char" @click="viewChar(file)">查看属性</bp-text>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="allPage && curPage" class="page-container">
                    <bp-pagination :curPage="curPage" :pages="allPage" @changePage="changePage"></bp-pagination>
                </div>
            </div>
        </div>
        <jsonModel :JsonData="JsonData" v-if="showJson" @closeJsonModal="closeJsonModal" ></jsonModel>
    </div>
</template>
<script>
import bpPagination from '../bp-pagination.vue'
import bpSelectVue from '../../../node_modules/vue-components/src/components/bp-select-vue.vue'
import bpOptionVue from '../../../node_modules/vue-components/src/components/bp-option-vue.vue'
import bpText from '../../../node_modules/vue-components/src/components/bp-text.vue'
import bpButton from '../../../node_modules/vue-components/src/components/bp-button.vue'
import bpImg from '../../../node_modules/vue-components/src/components/bp-img.vue'
import jsonModel from '../panel/view-json.vue'
import { staticFilePath } from '../../config/envConfig'

export default {
    components: {
        bpPagination,
        bpSelectVue,
        bpOptionVue,
        bpText,
        bpButton,
        bpImg,
        jsonModel
    },
    data() {
        return {
            closeIcon: `${staticFilePath}` + "/icon_close.svg",
            lastModifyTime: "上次更新时间",
            viewPart: "查看分区",
            closePart: "关闭分区",
            overTitle: "概述",
            architecture: "架构",
            // showPart: false
            showJson: false,
            JsonData: {}
        }
    },
    props: {
        detailData: {
            type: Object,
            default: function() {
                return { 
                    name: "phdatacat",
                    partTables: [],
                    tables:[{
                        "meta": {
                            "columns": [],
                            "serde-info": {
                                "Parameters": {}
                            },
                            "parameters": {},
                            "partition-keys": []
                        }
                    }]
                }
            }
        },
        index: {
            type: Number,
            default: 0
        },
        showPart: Boolean,
        random: Number
    },
    computed: {
        allPage() {
            const total = this.detailData.partitionsCount
            const perPage = 100
            if (Math.ceil(total / perPage) <= 1) {
                return 0
            }
            return Math.max(1, Math.ceil(total / perPage))
        },
        curPage() {
            return this.detailData.page + 1
        },
        schemas() {
            // 分区键
            if(this.detailData.tables[this.index] && this.detailData.tables[this.index].meta && this.detailData.tables[this.index].meta['partition-keys'] && this.detailData.tables[this.index].meta['partition-keys'].length > 0) {
                this.detailData.tables[this.index].meta['partition-keys'].forEach((item, index) => {
                    item.parameters = "Partition (" + index + ")"
                })
            }
            let schemasArr = []
            if(this.detailData.tables[this.index].meta) {
                schemasArr =  this.detailData.tables[this.index].meta.columns.concat(this.detailData.tables[this.index].meta['partition-keys'])
            }
            return schemasArr
        }
    },
    watch: {
        random: function() {
            this.$forceUpdate()
        }
    },
    methods: {
        changePage(page) {
            this.$emit('changePartPage', page, this.index)
        },
        closeJsonModal() {
            this.showJson = false
        },
        viewChar(data) {
            this.JsonData = JSON.parse(data.attribute)
            this.showJson = true
        },
        closeModel() {
            this.$emit("closeModal")
        },
        viewPartClick() {
            this.$emit("viewPartClick")
        },
        closePartClick() {
            this.$emit("closePartClick")
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
        }
    } 
}
</script>
<style lang="scss" scoped>
    * {
        box-sizing: border-box;
    }
    .mb-5 {
        margin-bottom: 20px !important;
    }
    .data-list-detail {
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
        .data-detail-container {
            width: 1080px;
            height: 90%;
            background: #FFFFFF;
            border-radius: 2px;
            .header-area {
                height: 56px;
                background: #fbfbfb;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px 20px 12px;
                border-bottom: 1px solid rgba(37,35,45,0.08);
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
            .body-area {
                padding: 12px 20px 20px;
                display: flex;
                flex-direction: column;
                height: 90%;
                overflow-y: auto;
                //隐藏滚动条
                &::-webkit-scrollbar {
                    width: 0 !important;
                }
                .title {
                    font-family: PingFangSC-Regular;
                    font-size: 14px;
                    color: #25232D;
                    letter-spacing: 0.25px;
                    text-align: left;
                    line-height: 20px;
                    font-weight: 400;
                    margin-bottom: 12px;
                    display: block;
                }
                .name-value-area {
                    display: flex;
                    flex-direction: column;
                    .name-value {
                        display: flex;
                        margin-bottom: 12px;
                        .name-value-list {
                            display: flex;
                            flex-wrap: wrap;
                        }
                        .subtitle {
                            font-family: SFProText-Regular;
                            font-size: 12px;
                            color: #706F79;
                            letter-spacing: 0.25px;
                            text-align: left;
                            line-height: 16px;
                            font-weight: 400;
                            width: 110px;
                            min-width: 110px;
                        }
                        .subvalue {
                            font-family: SFProText-Regular;
                            font-size: 14px;
                            color: #25232D;
                            letter-spacing: 0.25px;
                            text-align: left;
                            line-height: 20px;
                            font-weight: 400;
                        }
                    }
                }
                .view-part {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 12px;
                    .last-modify-time {
                        font-family: PingFangSC-Thin;
                        font-size: 12px;
                        color: #706F79;
                        letter-spacing: 0.25px;
                        line-height: 16px;
                        font-weight: 200;
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
                .overview, .property {
                    border-bottom: 1px solid rgba(37,35,45,0.08);
                    margin-bottom: 12px;
                }
                .property {
                    .parameter {
                        display: flex;
                        align-items: center;
                        margin-right: 20px;
                        margin-bottom: 12px;
                        .name {
                            font-family: SFProText-Regular;
                            font-size: 14px;
                            color: #25232D;
                            letter-spacing: 0.25px;
                            text-align: left;
                            line-height: 20px;
                            font-weight: 400;
                            background: #f6f6f7;
                            height: 20px;
                            padding: 1px 6px;
                            display: flex;
                            align-items: center;
                            border-radius: 2px;
                        }
                        .value {
                            background: #57565F;
                            border-radius: 2px;
                            height: 20px;
                            padding: 1px 6px;
                            display: flex;
                            align-items: center;
                            font-family: SFProText-Regular;
                            font-size: 14px;
                            color: #FFFFFF;
                            letter-spacing: 0.22px;
                            line-height: 24px;
                            font-weight: 400;
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
        .architecture {
            display: flex;
            flex-direction: column;
            height: 90%;
            .architecture-table-part {
                overflow-x: auto;
            }
            .architecture-table {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                min-height: 100px;
                .index-text {
                    width: 100px;
                }
                .table-title-part {
                    display: flex;
                    align-items: center;
                    width: 100%;
                    font-family: SFProText-Regular;
                    font-size: 12px;
                    color: #57565F;
                    letter-spacing: 0.25px;
                    text-align: left;
                    line-height: 16px;
                    font-weight: 400;
                    .column-name-part {
                        display: flex;
                        align-items: center;
                        width: 200px;
                        min-width: 200px;
                        height: 33px !important;
                        border-bottom: 0.5px solid rgba(31, 37, 50, 0.08);
                    }
                    .partition {
                        flex: 1;
                        min-width: 200px;
                        padding: 0 8px;
                        height: 33px !important;
                        border-bottom: 0.5px solid rgba(31, 37, 50, 0.08);
                    }
                }
                .table-title {
                    display: flex;
                    align-items: center;
                    width: 100%;
                    height: 33px !important;
                    border-bottom: 0.5px solid rgba(31, 37, 50, 0.08);
                    font-family: SFProText-Regular;
                    font-size: 12px;
                    color: #57565F;
                    letter-spacing: 0.25px;
                    text-align: left;
                    line-height: 16px;
                    font-weight: 400;
                    .column-name {
                        width: 200px;
                        min-width: 200px;
                    }

                    .data-type {
                        min-width: 300px;
                        width: 300px;
                        padding: 0 8px;
                    }

                    .partition {
                        width: 200px;
                        min-width: 200px;
                        padding: 0 8px;
                    }

                    .comment {
                        flex: 1;
                        min-width: 160px;
                    }
                }

                .main-container {
                    width: 100%;
                    // overflow: scroll;
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    //隐藏滚动条
                    &::-webkit-scrollbar {
                        width: 0 !important;
                    }
                    -ms-overflow-style: none;
                    .OneRecord-part {
                        width: 100%;
                        display: flex;
                        align-items: center;
                        cursor: pointer;
                        font-family: SFProText-Light;
                        font-size: 12px;
                        color: #706F79;
                        letter-spacing: 0.25px;
                        line-height: 16px;
                        font-weight: 200;
                        .column-name-part{
                            display: flex;
                            align-items: center;
                            width: 200px;
                            min-width: 200px;
                            border-bottom: 1px solid rgba(37, 35, 45, 0.08);
                            height: 44px;
                            .column-name-text {
                                font-family: SFProText-Regular;
                                font-size: 14px;
                                color: #25232D;
                                letter-spacing: 0.25px;
                                text-align: left;
                                line-height: 20px;
                                font-weight: 400;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                overflow: hidden;
                                padding-right: 10px;
                            }
                        }
                        //分区
                        .partition-part {
                            width: 200px;
                            min-width: 200px;
                            padding: 0 8px;
                            display: flex;
                            justify-content: flex-end;
                            align-items: center;
                            border-bottom: 1px solid rgba(37, 35, 45, 0.08);
                            height: 44px;
                            flex: 1;
                            .view-char {
                                font-family: PingFangSC-Medium;
                                font-size: 14px;
                                color: #5342B3;
                                letter-spacing: 0;
                                line-height: 20px;
                                font-weight: 500;
                            }
                        }
                    }
                    .OneRecord {
                        width: 100%;
                        height: 44px;
                        display: flex;
                        align-items: center;
                        border-bottom: 1px solid rgba(37, 35, 45, 0.08);
                        cursor: pointer;
                        font-family: SFProText-Light;
                        font-size: 12px;
                        color: #706F79;
                        letter-spacing: 0.25px;
                        line-height: 16px;
                        font-weight: 200;
                        // 列名
                        .column-name{
                            width: 200px;
                            min-width: 200px;
                            .column-name-text {
                                font-family: SFProText-Regular;
                                font-size: 14px;
                                color: #25232D;
                                letter-spacing: 0.25px;
                                text-align: left;
                                line-height: 20px;
                                font-weight: 400;
                            }
                            .overflow-text {
                                height: 20px;
                                width: auto;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                            }
                        }
                        // 数据类型
                        .data-type {
                            min-width: 300px;
                            width: 300px;
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
                        //分区
                        .partition {
                            width: 200px;
                            min-width: 200px;
                            padding: 0 8px;
                            display: flex;
                            align-items: center;

                            .view-char {
                                font-family: PingFangSC-Medium;
                                font-size: 14px;
                                color: #5342B3;
                                letter-spacing: 0;
                                line-height: 20px;
                                font-weight: 500;
                            }
                        }
                        // 评论
                        .comment {
                            flex: 1;
                            min-width: 160px;
                            height: 100%;
                            padding: 0 8px;
                            display: flex;
                            align-items: center;
                        }
                    }
                }
            }
        }
    }
</style>