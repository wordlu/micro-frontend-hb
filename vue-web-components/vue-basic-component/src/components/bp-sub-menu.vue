<template>
<li :class="[{'bp-sub-menu': sub_menu_data.type === 'sub'}, {'bp-push-button bp-menu-item': sub_menu_data.type === 'item'}, {'active-menu': activeIndex == index && menuType === 'item'}, {'first-item': index == 0}]" :disabled="disabled" @click="sub_menu_data.click_event(index)">
    <!-- 二级菜单 -->
    <div class="bp-submenu-title" @click="toggleShow" v-if="sub_menu_data.type === 'sub'">
        <div class="text-area">
            <img svg-inline class="svg-icon" :src="sub_menu_data.src" alt="example" v-if="sub_menu_data.src" />
            <span>{{sub_menu_data.text}}</span>
        </div>
        <!-- <img class="svg-icon-big" :src="icon-right" alt="" v-if="!this.show">
        <img class="svg-icon-big" :src="icon-down" alt="" v-if="this.show"> -->
        <div class="icon-right" v-if="!this.show"></div>
        <div class="icon-down" v-if="this.show"></div>
    </div>
    <ul :class="show ? 'menu-sub' : 'd-none'" v-if="sub_menu_data.type === 'sub'">
        <bpMenuItem v-for="(sub_menu_item,itemIndex) in sub_menu_data.item_data" :key="sub_menu_item.text" :menu_item_data="sub_menu_item" :itemIndex="itemIndex" :subIndex="index" :activeIndex="activeIndex" :activeSubIndex="activeSubIndex" :menuType="menuType"></bpMenuItem>
    </ul>

    <!-- 末级菜单 -->
    <img svg-inline class="svg-icon" :src="sub_menu_data.src" alt="example" v-if="sub_menu_data.src && sub_menu_data.type === 'item'" />
    <span v-if="sub_menu_data.type === 'item'">{{sub_menu_data.text}}</span>
    <!-- <bpMenuItem v-if="sub_menu_data.type === 'item'" :menu_item_data="sub_menu_data"></bpMenuItem> -->
</li>
</template>

<script>
import bpMenuItem from './bp-menu-item.vue';
export default {
    components: { bpMenuItem },
    data: function () {
        return {
            show: false
        }
    },
    props: {
        disabled: {
            type: Boolean,
            default: false
        },
        sub_menu_data: Object,
        index: Number,
        activeIndex: Number,
        activeSubIndex: Number,
        menuType: String
    },
    methods: {
        toggleShow() {
            this.show = !this.show
        }
    }
};
</script>

<style lang="scss" scoped>
$size-5x: 5*8px;
$spacing-5x: 5*8px;

* {
    box-sizing: border-box;
}

ul {
    margin: 0;
    padding: 0;
}

.svg-icon {
    width: 2em;
    height: 2em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
    margin-right: 4px;
}
.svg-icon-big {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
    margin-right: 4px;
}
svg:focus {
    outline: none;
}

.bp-sub-menu {
    height: auto;
    width: 100%;
    margin-left: 8;
    margin-right: 8;
    margin-top: 8;
    margin-bottom: 8;
    padding-left: 8;
    padding-right: 8;
    padding-top: 8;
    padding-bottom: 8;
    background: transparent;
    min-height: 40px;
    color: #505F79;
    padding: 0 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
}

.bp-sub-menu:hover {
    color: #3172E0;
}

.bp-submenu-title {
    display: flex;
    height: $size-5x;
    align-items: center;
    cursor: pointer;
    width: 100%;
    justify-content: space-between;
    .text-area {
        display: flex;
        flex-direction: row;
        align-items: center;
    }
}

.menu-sub {
    /* padding-left: $spacing-5x; */
    width: 100%;
}

.d-none {
    display: none;
}
.first-item {
	padding: 17px 0 !important;
    border-top: 1px solid rgba(37,35,45,0.08);
    box-sizing: content-box !important;
    margin-bottom: 17px !important;
    border-bottom: 1px solid rgba(37,35,45,0.08);
	margin: 0 12px 17px!important;
    width: 176px !important;
}
.bp-menu-item {
    height: 40px;
    width: 100%;
    margin-left: 8;
    margin-right: 8;
    margin-top: 8;
    margin-bottom: 8;
    padding-left: 8;
    padding-right: 8;
    padding-top: 8;
    padding-bottom: 8;
    background: transparent;
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 0 12px;
    color: #505F79;
    box-sizing: border-box;
}

.bp-menu-item:hover {
    color: #3172E0;
}

.active-menu{
    background: rgba(37,35,45,0.08);
    align-items: center;
}
.icon-right {
    width: 20px;
    height: 20px;
    background: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M0 0h20v20H0z'/%3E%3Cpath d='M8.854 7.146a.5.5 0 0 0-.765.638l.057.07 2.647 2.646-2.647 2.646a.5.5 0 0 0-.057.638l.057.07a.5.5 0 0 0 .638.057l.07-.057 3-3a.5.5 0 0 0 .057-.638l-.057-.07-3-3z' fill='%23ffffff'/%3E%3C/g%3E%3C/svg%3E") no-repeat center/100% !important; 
}
.icon-down {
    width: 20px;
    height: 20px;
    background: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6.646 8.854a.5.5 0 0 1 .638-.765l.07.057L10 10.793l2.646-2.647a.5.5 0 0 1 .638-.057l.07.057a.5.5 0 0 1 .057.638l-.057.07-3 3a.5.5 0 0 1-.638.057l-.07-.057-3-3z' fill='%23ffffff' fill-rule='evenodd'/%3E%3C/svg%3E") no-repeat center/100% !important; 
}
</style>
