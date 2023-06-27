<template>
    <div class="excel-container" ref="excelContainer" @scroll="scrollGetExcel($event)">
        <div class="schemas" style="width: 100%" ref="schemas">
            <div class="view" ref="heasders">
                <header-item 
					v-for="(item, index) in schema.cols" :isNeedPopmenu="isNeedPopmenu" 
					:title="item" 
					:valueType="schema.dtype[index]"
                	@changeSchemaTypeEvent="changeSchemaTypeEvent"
                	:itemWidth="schema.colWidth(index)" :key="index"/>
                <header-item v-if="isShowScrollBar" :isNeedPopmenu=false :itemWidth=8 key="placeholder"/>
            </div>
        </div>
        <div v-if="countIsReady === 0" :style="{height: '100%', width: '100%'}">&nbsp;</div>
        <div ref="viewport" class="viewport" :style="style" @scroll="scrollGet($event)">
            <div class="body" :style="{height: totalHeight +'px'}">
				<div v-if="isLazyRendering">
					<ph-lazy-excel-page  v-for="(item, index) in pageRange"
						:page="index" :curPage="curPage"
						:datasource="datasource"
						:schema="schema"
						:rowHeight="rowHeight"
						:page-height="pageHeight"
						:last-page-height="lastPageHeight"
						:page-width="schema.totalWidth()"
						:needRefresh="item"
						:totalPageCount="pageRange.length - 1"
						:key="index"/>
				</div>
                <div v-else>
					<ph-excel-page v-for="(item, index) in pageRange"
						:page="index" :curPage="curPage"
						:datasource="datasource"
						:schema="schema"
						:rowHeight="rowHeight"
						:page-height="pageHeight"
						:last-page-height="lastPageHeight"
						:page-width="schema.totalWidth()"
						:needRefresh="item"
						:totalPageCount="pageRange.length - 1"
						:key="index"/>
				</div>

            </div>
        </div>
    </div>
</template>
<script>
import PhDataSource from './model/datasource'
import PhExcelDataSchema from './model/schema'
import PhExcelPage from './ph-excel-page'
import PhLazyExcelPage from './ph-excel-lazy-page'
export default {
    data() {
        return {
            schemaIsReady: 0,
            countIsReady: 0,
            dataRefresh: 0,
            lastPage: [],
            curPage: [],
            pageRange: [],
            dataCount: 0,
            scrollBarWidth: 8,
            rowHeight: 24,
            style: "",
            totalHeight: 0,
            pageHeight: 0,
            lastPageHeight: 0,
            isShowScrollBar: true
        }
    },
    computed: {

    },
    components: {
        headerItem:require('./ph-excel-header.vue').default,
        PhExcelPage,
        PhLazyExcelPage
    },
    props: {
        isNeedPopmenu: {
            type: Boolean,
            default: true
        },
        viewHeight: {
            type: String,
            default: '600px'
        },
        schema: {
            type: Object,
            default: function() {
                return new PhExcelDataSchema()
            }
        },
        datasource: {
            type: Object,
            default: function() {
                return new PhDataSource('1')
            }
        },
        isLazyRendering: {
        	type: Boolean,
            default: true
        }
    },
    mounted() {
        if (this.schema.schema.length === 0) {
            this.schema.requestSchema().then((result) => {
                if (result) {
                    this.schemaIsReady++
                }
            })
        } else this.schemaIsReady++
    },
    methods: {
        scrollGetExcel(e) {
            console.log(e.target.scrollLeft)
            // this.$refs.headerCell.refs.cellType.scrollLeft = e.target.scrollLeft
        },
        changeSchemaTypeEvent(data) {
            this.$emit('changeSchemaTypeEvent', data)
        },
        scrollGet (e) {
            this.$refs.schemas.scrollLeft = e.target.scrollLeft
            let scroll_to_line = Math.floor(e.target.scrollTop / this.pageHeight)
            const tmp = [scroll_to_line - 1, scroll_to_line, scroll_to_line + 1]
            const different = tmp.concat(this.curPage).filter(item => !this.curPage.includes(item))
            if (different.length > 0) {
                this.curPage = tmp
            }
        },
        getCookie(name) {
            let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg))
                return (arr[2]);
            else
                return null;
        }
    },
    watch: {
        schemaIsReady(n, o) {
            let that = this
            this.datasource.queryTotalCount(this).then(count => {
                that.dataCount = parseInt(count)
                if(typeof(count) === "string" && count.indexOf("doesn't exist") !== -1) {
                    this.$emit("sample")
                }
                that.$emit("countIsReady", that.dataCount);
                that.countIsReady++
            })
            let viewHeight = this.viewHeight
            let schema = this.schema
            this.style = "height: " + viewHeight + ";" + "width: " + (schema.totalWidth() + this.scrollBarWidth) + "px;"
        },
        countIsReady(n, o) {
            this.curPage = [-1, 0, 1]
            this.pageRange = []
            for (var idx = 0; idx < this.dataCount/this.datasource.batch_size; ++idx) {
                this.pageRange.push(0)
            }
            let dataCount = this.dataCount
            this.totalHeight = dataCount * this.rowHeight
            let batchSize = this.datasource.batch_size
            this.pageHeight = batchSize * this.rowHeight
            this.lastPageHeight = this.totalHeight - this.pageHeight * this.pageRange.length

            const domHeight = this.$refs.viewport.offsetHeight
            this.isShowScrollBar = domHeight < this.totalHeight
            this.lastPage = this.curPage
        },
        dataRefresh(n, o) {
            for (var idx in this.$children) {
                const tmp = parseInt(idx)
                if (this.$children[tmp] && this.$children[tmp].$el._prevClass === "ph-excel-page") {
                    this.$children[tmp].$data.data = []
                }
            }
            this.schemaIsReady++
        }
    }
};
</script>
<style lang="scss" scoped>
    .excel-container {
        display: flex;
        flex-direction: column;

        // TODO: 我只做了chrome 浏览器
        /* 滚动槽（轨道）宽高 */
        ::-webkit-scrollbar {
            width: 8px; /*对垂直流动条有效*/
            height: 8px; /*对水平流动条有效*/
            // background-color:red
            :vertical {
                width: 8px
            }
        }
        /* 滚动槽（轨道）样式 */
        ::-webkit-scrollbar-track{
            box-shadow: inset 0 0 1px rgba(0,0,0,.3);
            background-color: gray;
            border-radius: 2px;
        }

        /*定义滑块颜色、内阴影及圆角*/
        ::-webkit-scrollbar-thumb{
            border-radius: 2px;
            box-shadow: inset 0 0 1px rgba(0,0,0,.3);
            background-color: #E8E8E8;
        }

        /*定义两端按钮的样式*/
        ::-webkit-scrollbar-button {
            height: 0px;
            width: 0px;
            background-color: gray;
        }

        /*定义右下角汇合处的样式*/
        ::-webkit-scrollbar-corner {
            /* border-radius: 50%; */
            background:khaki;
        }
        ::-webkit-scrollbar-thumb:window-inactive {
            background:rgba(255,0,0,0.4);
        }

        .viewport {
            overflow: auto;
            overflow-y: visible;
            position: relative;
            display: flex;
            .body {
                // overflow: auto;
                position: relative;
            }
        }
        .schemas {
            display: flex;
            margin-left: 0px;
            /*margin-right: 10px;*/
            overflow: hidden;
            min-height: 50px;
            .view {
                display: flex;
            }
        }
        .canvas {
            // margin-top: 46px;
        }
        .hidden {
            position: absolute;
            top:50px;
            left:0;
            margin-left:10px
        }
    }
</style>
