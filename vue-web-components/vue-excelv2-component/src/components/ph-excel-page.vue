<template>
    <div class="ph-excel-page">
        <div v-if="showing" :style="style">
            <ph-row v-for="(item, index) in data" :value="item" :rowState="rowState(item)"
                :schema="schema" :key="index"></ph-row>
        </div>
        <div class="ph-placeholder" v-else :style="style">&nbsp;</div>
    </div>
</template>
<script>
import PhDataSource from './model/datasource'
import PhExcelDataSchema from './model/schema'
import PhRow from './ph-excel-row'
export default {
    data() {
        return {
            state: "loading",
            dataIsReady: 0,
            data: [],
            forceRefresh: 0,
            refreshTimer: null
        }
    },
    computed: {
        showing: function() {
            const tmp = this.curPage.indexOf(this.page) !== -1
            if (this.refreshTimer !== null) {
                clearTimeout(this.refreshTimer)
                this.refreshTimer = null
            }
            this.refreshTimer = setTimeout(() => {
                this.forceRefresh++
            }, 500)
            return tmp
        },
        style: function() {
            if (this.page ===  this.totalPageCount)
                return "height: " + this.lastPageHeight + "px; width: " + this.pageWidth + "px;"

            return "height: " + this.pageHeight + "px; width: " + this.pageWidth + "px;"
        }
    },
    components: {
        PhRow
    },
    props: {
        page: {
            type: Number,
            default: 0
        },
        curPage: {
            type: Array,
            default: []
        },
        pageSize: {
            type: Number,
            default: 100
        },
        pageHeight: {
            type: Number,
            default: 2400
        },
        lastPageHeight: {
            type: Number,
            default: 2400
        },
        pageWidth: {
            type: Number,
            default: 1298
        },
        datasource: {
            type: Object,
            default: function () {
                return new PhDataSource('1')
            }
        },
        schema: {
            type: Object,
            default: function() {
                return new PhExcelDataSchema()
            }
        },
        totalPageCount: {
            type: Number,
            default: 0
        }
    },
    methods: {
        getCookie(name) {
            let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg))
                return (arr[2]);
            else
                return null;
        },
	    rowState: function(value) {
		    let result = "normal"
		    if (this.datasource.funcChains) {
			    if (!this.datasource.funcChains.exec(value, this.schema)) {
				    result = "reverse"
			    }
		    }
		    return result
	    }
    },
    watch: {
        dataIsReady(n, o) {
            if (n !== 0) {
                this.state = "Ready"
            } else this.state = "Loading"
        },
        forceRefresh(n, o) {
            if (this.showing) {
                if (this.data.length === 0) {
                    this.dataIsReady = 0
                    this.datasource.refreshData(this, this.page, this.schema)
                }
            } else {
                this.data = []
                this.dataIsReady = 0
            }
        }
    }
};
</script>
<style lang="scss">
    .ph-excel-page {
        display: flex;
        flex-direction: row;

        .ph-placeholder {
            background: red;
        }
    }
</style>
