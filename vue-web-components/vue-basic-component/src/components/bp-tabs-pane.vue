<template>
<div>
    <div class="activity-list-container" v-if="!responseMini">
        <div class="activity-in-large" v-for="(item,index) in content" :key="index" @click="toActivity(index)">
            <div class="little-space">
                <bpText class="ph-H-Large_2">{{item.activity.title}}</bpText>
                <bpText class="ph-body-small">{{item.activity.subTitle}}</bpText>
                <bpText class="ph-body-small">{{transDate(item.activity.startDate)}} | {{item.activity.location}}</bpText>
                <div class="main-flex-start">
                    <bpText class="more-photo-text">查看详情</bpText>
                    <bpImg :src="moreIcon" class="icon_go"></bpImg>
                </div>
            </div>
            <div class="activity-img-container">
                <bpImg :src="item.image.get('path')" class="activity-list-img"></bpImg>
            </div>
        </div>
    </div>
     <div class="activity-list-container" v-if="responseMini">
        <div class="activity-in-little"  v-for="(item, index) in content" :key="item.activity.title"  @click="toActivity(index)">
            <div class="activity-img-container">
                <bpImg :src="item.image.get('path')" class="activity-img"></bpImg>
            </div>
            <bpText class="ph-H-Large_2">{{item.activity.title}}</bpText>
            <bpText class="ph-body-small">{{item.activity.subTitle}}</bpText>
            <bpText class="ph-body-small">{{transDate(item.activity.startDate)}} | {{item.activity.location}}</bpText>
            <div class="main-flex-start">
                <bpText class="more-photo-text">查看详情</bpText>
                <bpImg :src="moreIcon" class="icon_go"></bpImg>
            </div>
        </div>
     </div>
</div>
</template>

<script>
import bpText from './bp-text'
import { staticFilePath } from '../config/envConfig'
import bpImg from './bp-img'
export default {
    name: 'bpPane',
    componentName: 'bpPane',
    props: {
        content: {
            type: Array,
            default: function() {
                return []
            }
        },
        responseMini: {
            type: Boolean,
            default: false
        },
        tabIndex: Number
    },
    components: {
        bpText,
        bpImg
    },
    data() {
        return {
            index: null,
            loaded: false,
            activityImg: `${staticFilePath}` + "/photo_events_2020-06-04_boyun_00030.jpg",
            moreIcon: `${staticFilePath}` + "/icon_go.svg"
        };
    },

    computed: {
        isClosable() {
            return this.closable || this.$parent.closable;
        },
        active() {
            const active = this.$parent.currentName === (this.name || this.index);
            if (active) {
                this.loaded = true;
            }
            return active;
        },
        paneName() {
            return this.name || this.index;
        }
    },

    updated() {
        this.$parent.$emit('tab-nav-update');
    },

    methods: {
        transDate(param) {
            let date = new Date(param)
            let y = date.getUTCFullYear()
            let d = date.getUTCDate()
            let m = date.getUTCMonth()
            return y + "-" + (m+1) + "-" + d
        },
        toActivity(index) {
            let param = {}
            if(this.tabIndex == 0) {
                param = {
                    avtivityType: 'boyunhui',
                    idx: index
                }
            } else if(this.tabIndex == 1) {
                param = {
                    avtivityType: 'above-data-detail',
                    idx: index
                }
            } else if(this.tabIndex == 2) {
                param = {
                    avtivityType: 'industry-activity-detail',
                    idx: index
                }
            }
            this.$emit('linkToActivity', param)
        }
    }
};
</script>

<style lang="scss" scoped>
    .activity-list-container {
        display: flex;
        flex-direction: column;
        .ph-H-Large_2 {
            width: 500px;
            margin-bottom: 16px;
            font-size: 24px;
            color: #2D334D;
        }
        .ph-body-small {
            margin-bottom: 16px;
            font-size: 14px;
            color: #747789;
        }
        .main-flex-start {
            display: flex;
            cursor: pointer!important;
            .more-photo-text {
                font-weight: 600;
                font-size: 14px;
                color: #2D334D;
                letter-spacing: 1px;
                line-height: 24px;
                margin-right: 8px;
                cursor: pointer!important;
            }
            .icon_go {
                width: 24px;
                height: 24px;
            }
        }
        .activity-in-large {
            border-bottom: 1px solid rgba(22,28,57,.08);
            padding-bottom: 64px;
            flex: 1;
            width: 1000px;
            height: auto;
            display: flex;
            cursor: pointer!important;
            .little-space {
                margin-top: 108px;
                display: flex;
                flex-direction: column;
            }
            .activity-img-container {
                width: 418px;
                height: 235px;
                border-radius: 2px;
                margin-top: 64px;
                display: flex;
				.activity-list-img {
					width: 380px;
					height: 235px;
				}
                .activity-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 2px;
                }
            }
        }
        .activity-in-large:nth-last-of-type(1) {
            border-bottom: none;
            padding-bottom: 0;
        }
        @media (max-width: 549px), (width: 549px) {
            .activity-in-little {
                display: flex;
                flex-direction: column;
                margin-top: 40px;
                align-items: center;
                justify-content: space-between;
                cursor: pointer!important;
                .activity-img-container {
                    width: 90%;
                    height: 242px;
                    border-radius: 2px;
                    display: flex;
                    .activity-img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        border-radius: 2px;
                        cursor: pointer!important;
                    }
                }
                .ph-H-Large_2 {
                    width: 90%;
                    margin-top: 24px;
                    margin-bottom: 16px;
                }
                .ph-body-small {
                    width: 90%;
                    margin-bottom: 16px;
                }
                .main-flex-start {
                    width: 90%;
                    border-bottom: 1px solid rgba(22,28,57,.08);
                    padding-bottom: 39px;
                }
            }
            .activity-in-little:nth-last-of-type(1) {
                .main-flex-start {
                    border-bottom: none;
                    padding-bottom: 0;
                }
            }
        }
    }
</style>