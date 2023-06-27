<template>
    <span
        class="bp-tag"
        @click="handleClick"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
        :class="[
            subtle ? 'tag-subtle' : 'tag-bold',
            type ? 'tag-' + type : 'tag-blue',
            {'hide': hide}
        ]">
        {{text}}
    </span>
</template>

<script>
export default {
    props: {
        text: {
            type: String,
            default: "tag test"
        },
        subtle: {
            type: Boolean,
            default: false
        },
        type: {
            type: String,
            default: "blue"
        },
        hide: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        handleClick(data) {
            this.$emit('click', data);
        },
        onMouseEnter(data) {
            this.$emit('mouseenter', data);
        },
        onMouseLeave(data) {
            this.$emit('mouseleave', data);
        }
    }
}
</script>

<style lang=scss scoped>
    $color-neutrals-n030: #E5EAEC;
    $color-neutrals-n600: rgba(#091e42,0.82);
    $color-neutrals-n500: rgba(#091e42,0.77);
    $color-neutrals-n000: #ffffff;
    $color-primary-b075: #D7D2EE;
    $color-primary-b100: #BCB5E3;
    $color-neutrals-n800: rgba(#091e42,0.95);
    $color-positive-g100: #79f2c0;
    $color-positive-g500: #006644;
    $color-positive-g200: #57d9a3;
    $color-informative-p075: #c0b6f2;
    $color-informative-p500: #403294;
    $color-informative-p100: #998dd9;
    $color-accent-t100: #79e2f2;
    $color-accent-t200: #00c7e6;
    $color-negative-r075: #ffbdad;
    $color-negative-r100: #ff8f73;
    $color-notice-y100: #ffab00;
    $color-notice-y200: #ffc400;

    .bp-tag {
        height: 20px;
        width: max-content;
        margin-left: 0;
        margin-right: 0;
        margin-top: 0;
        margin-bottom: 0;
        padding-left: 0;
        padding-right: 0;
        padding-top: 0;
        padding-bottom: 0;
        background: #FFFFFF;
        padding: 0 4px;
        border-radius: 4px;
        font-size: 14px;
        text-align: center;
        line-height: 20px;
    }
   .hide { 
        display: none;
    }

    /* tag 通用样式 */

    .tag-default.tag-subtle {
        background: $color-neutrals-n030;
        color: $color-neutrals-n600;
    }

    .tag-default.tag-bold {
        background: $color-neutrals-n500;
        color: $color-neutrals-n000;
    }

    .tag-blue.tag-subtle {
        background: $color-primary-b075;
        color: #0049B0;
    }

    .tag-blue.tag-bold {
        background: $color-primary-b100;
        color: $color-neutrals-n800;
    }
    .tag-green.tag-subtle {
        background: $color-positive-g100;
        color: $color-positive-g500;
    }

    .tag-green.tag-bold {
        background: $color-positive-g200;
        color: $color-neutrals-n800;
    }
    .tag-purple.tag-subtle {
        background: $color-informative-p075;
        color: $color-informative-p500;
    }

    .tag-purple.tag-bold {
        background: $color-informative-p100;
        color: $color-neutrals-n800;
    }
    .tag-teals.tag-subtle {
        background: $color-accent-t100;
        color: $color-neutrals-n600;
    }

    .tag-teals.tag-bold {
        background: $color-accent-t200;
        color: $color-neutrals-n800;
    }
    .tag-red.tag-subtle {
        background: $color-negative-r075;
        color: $color-neutrals-n800;
    }

    .tag-red.tag-bold {
        background: $color-negative-r100;
        color: $color-neutrals-n800;
    }
    .tag-yellow.tag-subtle {
        background: $color-notice-y100;
        color: $color-neutrals-n800;
    }

    .tag-yellow.tag-bold {
        background: $color-notice-y200;
        color: $color-neutrals-n800;
    }
</style>
