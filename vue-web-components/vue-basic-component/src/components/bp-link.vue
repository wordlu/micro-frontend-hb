<template>
    <button 
        class="bp-link"
        @click="handleClick"
        :disabled="linkDisabled"
        :type="type"
        :class="[
            disabled ? 'link-disabled' : '',
            type ? 'link-' + type : 'link-default'
        ]" 
    >
        {{text}}
    </button>
</template>

<script>
import '../assets/css/variables.scss'
import '../assets/css/addon.scss'
import '../assets/css/_base.scss'
export default {
    props: {
        text: {
            type: String,
            default: "test link"
        },
        type: {
            type: String,
            default: "default"
        },
        disabled: Boolean
    },
    computed: {
        linkDisabled() {
            return this.disabled;
        }
    },
    methods: {
        handleClick(data) {
            this.$emit('click', data);
        }
    }
}
</script>

<style lang=scss scoped>
    $color-neutrals-n060: rgba(#091e42,0.31);
    $color-neutrals-n300: rgba(#091e42,0.66);
    $color-neutrals-n080: rgba(#091e42,0.42);
    $color-neutrals-n400: rgba(#091e42,0.71);
    $color-primary-b400: #7163C5;
    $color-primary-b300: #9084D2;
    $color-primary-b500: #5342B3;
    .bp-link {
        height: 14px;
        width: max-content;
        margin-left: 0;
        margin-right: 0;
        margin-top: 0;
        margin-bottom: 0;
        padding-left: 0;
        padding-right: 0;
        padding-top: 0;
        padding-bottom: 0;
        background: transform;
        font-size: 14px;
        text-align: center;
        line-height: 14px;
        cursor: pointer;
        outline: none;
        border: none;
        display: inline-block;

    }
    /*link 通用样式*/
    .link-disabled {
        color: $color-neutrals-n060;
        cursor: not-allowed;
    }

    .link-default {
        color: $color-neutrals-n300;
    }

    .link-default:hover {
        color: $color-neutrals-n080;
    }

    .link-default:active {
        color: $color-neutrals-n400;
    }

    .link-primary {
        color: $color-primary-b400;
    }

    .link-primary:hover {
        color: $color-primary-b300;
    }

    .link-primary:active {
        color: $color-primary-b500;
    }
</style>
