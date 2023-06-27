<template>
    <ul class="bp-menu">
        <bpSubMenu v-for="(single_data, index) in menu_data" :key="single_data.text" :sub_menu_data="single_data" :index="index" :activeIndex="activeIndex" :activeSubIndex="activeSubIndex" :menuType="menuType"></bpSubMenu>
    </ul>
</template>

<script>
import bpSubMenu from "./bp-sub-menu.vue"
import bpMenuItem from "./bp-menu-item.vue"
export default {
    components: {
        bpSubMenu,
        bpMenuItem
    },
    data: function() {
        return {
            currentIndex: 0
        }
    },
    props: {
        menu_data: Array,
        activeIndex: Number,
        activeSubIndex: Number,
        menuType: String
    }
}
</script>

<style lang="scss" scoped>
    * {
        box-sizing: border-box;
    }
    .bp-menu {
        height: auto;
        width: 200px;
        margin-left: 8;
        margin-right: 8;
        margin-top: 8;
        margin-bottom: 8;
        padding-left: 8;
        padding-right: 8;
        padding-top: 8;
        padding-bottom: 8;
        background: transparent;
        padding: 0;
        margin: 0;
    }
</style>