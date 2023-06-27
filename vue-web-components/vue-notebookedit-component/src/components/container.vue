<template>
    <div class="page-container">
        <div class="header">
            <div class="title">
                <img :src="defs.iconsByName(allData.type.split('-')[1])" class="title_icon" alt="">
                <span class="name">{{allData.detailName}}</span>
            </div>
            <div class="coding-title">
                <button class="button" >操作</button>
                <button class="button btn-fir">创建脚本</button>
                <button class="button btn-fir">强制刷新</button>
            </div>
        </div>
        <div class="content" v-if="datasource.isReady">
            <iframe width="100%" height="100%"
                    :src="datasource.data.uri">
            </iframe>
        </div>
    </div>
</template>

<script>
import PhDagDefinitions from "./policy/definitions/definitions";
import PhDatasource from "./model/datasource";
// import { staticFilePath, hostName } from "../config/envConfig"

export default {
    name: 'notebook-editor',
    components: {

    },
    props: {
        allData: {
            type: Object,
            default: () => ({
                "resourceId": null,
                "projectName": "",
                "projectId": "",
                "_isVue": true
            })
        },
        datasource: {
            type: Object,
            default: function() {
                return new PhDatasource('1')
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
            projectId: String,
            projectName: String,
            tenantId: String,
            resourceId: String,
        }
    },
    mounted() {
        this.projectId = this.getUrlParam("projectId")
        this.projectName = this.getUrlParam("projectName")
        this.tenantId = this.getUrlParam("tenantId")
        this.resourceId = this.getUrlParam("resourceId")
        this.datasource.queryResourceData(this.tenantId, this.resourceId)
    },
    watch: {

    },
    methods: {
        getUrlParam(value) {
            let href = window.location.href
            let paramArr = href.split("?")[1].split("&")
            let data = paramArr.find(item => item.indexOf(value) > -1)
            // return data ? decodeURI(data).split("=")[1] : undefined
            return data ? data.substr(data.indexOf("=") + 1) : undefined
        },
    }
}
</script>

<style lang='scss' scoped>
    .page-container {
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 40px;
            padding: 0 20px;
            border-bottom: 1px solid #979797;
            .title_icon {
                height: 30px;
                width: 30px;
            }
            .title {
                display: flex;
                align-items: center;
                .title_icon {
                    margin-right: 10px;
                }
            }
            .coding-title {
                display: flex;
                flex-direction: row-reverse;
                .button {
                    width: 87px;
                    height: 26px;
                    border: 1px solid #57565F;
                    border-radius: 2px;
                    background: #fff;
                    cursor: pointer;
                }
                .btn-fir {
                    margin-left: 10px;
                }
            }
        }

        .content {
            flex-grow: 1;
            height: calc(100vh - 80px);
            background-color: #ccc;
        }
    }
</style>
