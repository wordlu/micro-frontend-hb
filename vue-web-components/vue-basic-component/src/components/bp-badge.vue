<template>
    <span
        class="bp-badge"
        @click="handleClick"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
        :class="[
            {'primary': primary},
            {'reverse': reverse}
        ]">
        {{resultData}}
    </span>
</template>

<script>
export default {
    props: {
        primary: {
            type: Boolean,
            default: false
        },
        reverse: {
            type: Boolean,
            default: false
        },
        result: String
    },
    computed: {
        resultData () {
            let num = Number(this.result) || 0;
            return num < 100 ? num : '99+'
        }
    },
    methods: {
        handleClick(data) {
            console.log("badge")
            this.$emit('click', data);
        },
        onMouseEnter(data) {
            console.log("鼠标滑入badge")
            this.$emit('mouseenter', data);
        },
        onMouseLeave(data) {
            console.log("鼠标滑出badge")
            this.$emit('mouseleave', data);
        }
    }
}
</script>

<style lang=scss scoped>
    $color-neutrals-n040: rgba(#091e42,0.13);
    $color-neutrals-n700: rgba(#091e42,0.89);
    $color-primary-b400: #7163C5;
    $color-neutrals-n000: #ffffff;

    .bp-badge {
        height: 16px;
        width: max-content;
        margin-left: 0;
        margin-right: 0;
        margin-top: 0;
        margin-bottom: 0;
        padding-left: 0;
        padding-right: 0;
        padding-top: 0;
        padding-bottom: 0;
        background: #DFE1E6;
        min-width: 20px;
        font-size: 12px;
        color: #253858;
        text-align: center;
        line-height: 16px;
        border: 0;
        border-radius: 8px;
        padding: 0 6px;
        cursor: pointer;
    }
    /* badge 通用样式 */

    .badge-default {
        background: $color-neutrals-n040;
        color: $color-neutrals-n700;
    }

    .badge-primary {
        background: $color-primary-b400;
        color: $color-neutrals-n000;
    }

    /* bp-badge styles */

    .bp-badge.primary {
        background-color: $color-primary-b400;
        color: $color-neutrals-n000;
    }

    .bp-badge.primary.reverse {
        color: $color-primary-b400;
        background-color: $color-neutrals-n000;
    }
</style>
