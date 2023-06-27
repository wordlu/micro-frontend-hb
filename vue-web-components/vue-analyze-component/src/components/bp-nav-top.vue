<template>
<div>
    <div class="fixed-nav nav">
        <div class="nav-border bordernav">
            <img :src="imgSrc" class="bp-img fixed-nav-icon cursor-pointer" />
            <div class="navButton">
                <img src="https://www.hubadata.com/public/icon_home_user.svg" alt="" @click="logOut">
                <span class="name">{{allData.name_show}}</span>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    created() {},
    mounted() {},
    components: {
    },
    props: {
        allData: {
            type: Object,
            default: function() {
                return {
                    name_show: String
                }
            }
        }
    },
    data() {
        return {
            imgSrc: "https://www.hubadata.com/public/img_logo_ph_theme.svg"
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
};
</script>

<style lang="scss" scoped>
    $spacing-none: 0px;
    $spacing-compact-2x: 2*2px;
    $color-neutrals-n000: #ffffff;
    $color-neutrals-n400: rgba(#091e42,0.71);
    
    * {
        letter-spacing: .4px;
        line-height: 1.6;
        box-sizing: border-box;
    }
    
    .cursor-pointer {
        cursor: pointer;
    }
    
    .bordernav {
        // border-bottom: 1px solid rgba(22, 28, 57, 0.12);
		box-shadow: 0 0 1px 0 rgba(37,35,45,0.12), 0 1px 1px 0 rgba(37,35,45,0.25);
    }
    .fixed-nav {
        height: 80px;
        width: 100%;
        display: flex;
        flex-direction: row;
        top: 0;
        // padding: 0 100px;
        position: fixed;
        justify-content: space-between;
        align-items: center;
        z-index: 1000;
		background: #fff;
		// margin-bottom: 24px;
        .nav-border {
            height: 80px;
            width: 100%;
            display: flex;
            align-content: flex-start;
            align-items: center;
            justify-content: space-between;
            .fixed-nav-icon {
                padding-left: 20px;
            }
        }

        .navButton {
            display: flex;
            align-content: flex-start;
            align-items: center;
            justify-content: flex-start;
            padding-right: 20px;
            .name {
                margin-left: 4px;
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: #25232D;
                letter-spacing: 0.25px;
                text-align: left;
                line-height: 20px;
                font-weight: 400;
            }
        }
    }
</style>
