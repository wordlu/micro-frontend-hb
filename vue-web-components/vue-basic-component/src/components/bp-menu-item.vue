<template>
<div>
    <li class="bp-push-button bp-menu-item" :disabled="disabled" @click="menu_item_data.click_event(subIndex,itemIndex)" :class="[{'active-menu': activeIndex == itemIndex && activeSubIndex == subIndex && menuType == 'subitem'}]">
        <!--<img  class="svg-icon" :src="menu_item_data.src" alt="example" v-if="menu_item_data.src" />-->
        <span>{{menu_item_data.text}}</span>
    </li>
</div>
</template>

<script>
export default {
    props: {
        menu_item_data: Object,
        disabled: {
            type: Boolean,
            default: false
        },
        subIndex: Number,
        itemIndex: Number,
        activeSubIndex: Number,
        activeIndex: Number,
        menuType: String
    }
}
</script>

<style lang="scss" scoped>
    * {
        box-sizing: border-box;
    }
    .svg-icon {
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
    .active-menu {
        background: rgba(37,35,45,0.08);
        align-items: center;
    }
</style>