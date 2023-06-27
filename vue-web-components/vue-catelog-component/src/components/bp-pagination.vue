<template>
    <div class="pagination-container">
        <div class="pagination">
            <button id="chevron-left" @click="changePage('pre')" :disabled="data_curPage === 1" :class="data_curPage === 1 ? 'chevron_left_unable cursor-not-allowed' : 'chevron_left cursor-pointer'"></button>

            <div v-for="(page,index) in forEachArray" :key="index" @click="changePage('',page)" :class="data_curPage === page ? 'pagination-page pagination-active' : 'pagination-page'">{{page}}</div>
            
            <button id="chevron-right" @click="changePage('next')" :disabled="data_curPage === pageArray.length" :class="data_curPage === pageArray.length ? 'chevron_right_unable cursor-not-allowed' : 'chevron_right cursor-pointer'"></button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            forEachArray: null,
            data_curPage: this.curPage
        }
    },
    props: {
        curPage: {
            type: Number,
            default: 1
        },
        pages: {
            type: Number,
            default: 12
        }
    },
    computed: {
        pageArray() {
            return [...Array(this.pages)].map( (it,i) => i + 1 )
        }
    },
    methods: {
        changePageArray() {
            // 折叠符...位置的改变
            if (this.pageArray.length > 7) {
                let newArr = []
                // 首页始终显示
                newArr.push(this.pageArray[0])
                // 与尾页距离大于5，... 在后方显示
                // 与首页距离大于5，... 在前方显示
                // 与首页尾页距离大于5，使用双 ...
                if (this.data_curPage < 5) {
                    for(let i = 2; i <= 5; i++) {
                        newArr.push(i)
                    }
                    newArr.push('...')
                } else if ((this.pageArray.length - this.data_curPage) < 4) {
                    newArr.push('...')
                    for(let i = this.pageArray.length - 4; i <= this.pageArray.length -1; i++) {
                        newArr.push(i)
                    }
                } else {
                    newArr.push('...')
                    newArr.push(this.data_curPage -1)
                    newArr.push(this.data_curPage)
                    newArr.push(this.data_curPage + 1)
                    newArr.push('...')
                }
                // 尾页始终显示
                newArr.push(this.pageArray[this.pageArray.length-1])
                this.forEachArray = newArr
            }
        },
        changePage(type, page) {
            if (type === 'next') {
                this.data_curPage = Math.min(this.data_curPage + 1, this.pageArray.length)
                this.changePageArray()
                this.$emit('changePage', this.data_curPage)
            } else if (type === 'pre') {
                this.data_curPage = Math.max( this.data_curPage - 1, 1)
                this.changePageArray()
                this.$emit('changePage', this.data_curPage)
            } else {
                let cur = Number(page)
                if (!isNaN(cur) && page !== this.data_curPage) {
                    this.data_curPage = cur
                    this.changePageArray()
                    this.$emit('changePage', this.data_curPage)
                }
            }
        }
    },
    created() {
        this.forEachArray = this.pageArray
        this.changePageArray()
    }
}
</script>

<style lang="scss" scoped>
    $color-neutrals-n400: rgba(#091e42,0.71);
    $font-size-2: 14px;
    $size-3x: 3*8px;
    $spacing-none: 0px;
    $spacing-compact-1x: 2px;
    $spacing-compact-2x: 2*2px;
    $color-neutrals-n000: #ffffff;

    .cursor-not-allowed {
        cursor: not-allowed !important;
    }

    .cursor-pointer {
        cursor: pointer !important;
    }
    .pagination {
        display: flex;
        flex-direction: row;
        width: max-content;
        align-items: center;
        font-size: $font-size-2;
        color: $color-neutrals-n400;

        button {
            border: none;
        }

        .chevron_left {
            width: 24px;
            height: 24px;
            background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 0 24 24' width='24'%3E%3Cpath d='M0 0h24v24H0V0z' fill='none'/%3E%3Cpath d='M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59z'/%3E%3C/svg%3E") no-repeat center/100% !important; 
        }

        .chevron_right {
            width: 24px;
            height: 24px;
            background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 0 24 24' width='24'%3E%3Cpath d='M0 0h24v24H0V0z' fill='none'/%3E%3Cpath d='M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z'/%3E%3C/svg%3E") no-repeat center/100% !important; 
        }

        .chevron_left_unable {
            width: 24px;
            height: 24px;
            background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 0 24 24' width='24'%3E%3Cpath d='M0 0h24v24H0V0z' fill='none'/%3E%3Cpath d='M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59z' fill='%23E5EAEC' /%3E%3C/svg%3E") no-repeat center/100% !important; 
        }

        .chevron_right_unable {
            width: 24px;
            height: 24px;
            background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 0 24 24' width='24'%3E%3Cpath d='M0 0h24v24H0V0z' fill='none'/%3E%3Cpath d='M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z' fill='%23E5EAEC' /%3E%3C/svg%3E") no-repeat center/100% !important; 
        }

        .pagination-page {
            letter-spacing: 0;
            text-align: center;
            height: 20px;
            min-width: 20px;
            margin: $spacing-none $spacing-compact-1x;
            cursor: pointer;
        }

        .pagination-active {
            background: $color-neutrals-n400;
            border-radius: 2px;
            color: $color-neutrals-n000;
            margin: $spacing-none $spacing-compact-2x;
        }
    }
</style>