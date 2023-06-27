<template>
<div class="activity-list-container">
    <div class="fixed-tabs">
        <div class="activity-tabs">
            <div class="activity-tab"  
                v-for="(item, index) in tabArr" :key="index" @click="
                whichIndex = index
                componentId = item.componentId
            ">
                <bpText :class="{ highLight: whichIndex == index }">{{ item.componentName }}</bpText>
            </div>
        </div>
    </div>
    <keep-alive>
        <bpPane :is="componentId" :content="content" :responseMini="responseMini" :tabIndex="whichIndex" @linkToActivity="linkToActivity"></bpPane>
    </keep-alive>
</div>
</template>

<script>
import bpPane from "./bp-tabs-pane.vue"
import bpText from "./bp-text.vue"
export default {
    components: {
        bpPane,
        bpText
    },
    data() {
        return {
            whichIndex: 0,
            componentId: "bpPane"
        }
    },
    props: {
        allData: {
            type: Object,
            default: function() {
                return {}
            }
        },
        tabArr: {
            type: Array,
            default: function() {
                return []
            }
        },
        responseMini: {
            type: Boolean,
            default: false
        },
        tabIndex: {
            type: Number,
            default: 0
        }
    },
    computed: {
        content: function(val) {
            if(this.whichIndex == 0) {
                return this.allData.byhData
            } else if (this.whichIndex == 1) {
                return this.allData.AboveData
            } else if (this.whichIndex == 2) {
                return this.allData.industryData
            }
        }
    },
    watch: {
        tabIndex(val) {
            this.whichIndex = val
        }
    },
    mounted() {
        this.whichIndex = this.tabIndex
    },
    methods: {
        linkToActivity: function(data) {
            this.$emit('linkToActivity', data.avtivityType, data.idx)
        }
    }
};
</script>

<style lang="scss" scoped>
* {
    letter-spacing: .4px;
    line-height: 1.6;
    box-sizing: border-box;
}
.fixed-tabs {
    top: 80px;
    height: 66px;
    background-color: #fff!important;
    position: sticky;
    z-index: 1;
    display: flex;
    .activity-tabs {
        border-bottom: 2px solid rgba(22,28,57,.1);
        margin-bottom: 0!important;
        padding-bottom: 0!important;
        display: flex;
        align-items: flex-end;
        .activity-tab {
            height: 30px;
            margin-right: 24px;
            line-height: 30px;
            flex: 1;
            display: flex;
            align-items: flex-start;
            transform: translateY(-3px);
            white-space: nowrap;
            cursor: pointer;
            .avtive {

            }
        }
        .activity-tab:nth-last-of-type(1) {
            margin-right: 0;
        }
        .highLight {
            border-bottom: 2px solid #f5c924;
            color: #f5c924;
            padding-bottom: 8px;
        }
    }
}
 @media (max-width: 549px), (width: 549px) {
    .fixed-tabs {
        height: 48px !important;
        display: flex;
        justify-content: flex-start;
        width: 90%;
    } 
 }
                  
</style>
