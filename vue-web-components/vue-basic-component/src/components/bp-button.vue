<template>
    <button
        class="bp-button"
        @click="handleClick"
        @dblclick="handleDBClick"
        :disabled="buttonDisabled"
        :type="type"
        :class="[
            type ? 'button-' + type : 'button-primary',
            density ? 'button-density-' + density : 'button-density-default',
            {'btn-block': block}
        ]"
    >
        <img svg-inline class="svg-icon" :src="src" alt="example" v-if="src"/>
        {{text}}
    </button>
</template>

<script>
export default {
    props: {
        text: String,
        type: String, // standard, subtle, destructive, warning,
        density: String, // comfy, default, compact
        block: Boolean, //button是否占满一行
        disabled: Boolean, //加了disabled就是disabled
        src: String
    },
    computed: {
        buttonDisabled() {
            return this.disabled
        }
    },
    methods: {
        handleClick(data) {
            var that = this
            // 开启延时器，300ms的间隔区分单击和双击，解决双击时执行两次单击事件
            clearTimeout(that.time)
            that.time = setTimeout(() => {
                // 写单击事件执行的逻辑代码
                this.$emit('click', data);
            },300)
        },
        handleDBClick(data) {
            clearTimeout(this.time)
            this.$emit('dbclick', data)

        }
    }
}
</script>

<style lang=scss scoped>
    $color-primary-b400: #7163C5;
    $color-neutrals-n000: #ffffff;
    $color-primary-b300: #9084D2;
    $color-primary-b500: #5342B3;
    $color-neutrals-n060: rgba(#091e42,0.31);
    $color-neutrals-n020: rgba(#091e42,0.04);
    $color-neutrals-n400: rgba(#091e42,0.71);
    $color-neutrals-n030: #E5EAEC;
    $color-primary-b050: #F2F0F9;
    $color-negative-r400: #de350b;
    $color-negative-r300: #ff5630;
    $color-negative-r500: #bf2600;
    $color-notice-y300: #ffe380;
    $color-notice-y200: #ffc400;
    $color-notice-y400: #fff0b3;
    $size-density-comfy: 5*8px;
    $size-5x: 5*8px;
    $size-density-default: 4*8px;
    $size-density-compact: 3*8px;
    $size-3x: 3*8px;
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
    .hide {
        display: none
    }
    .bp-button {
        height: auto;
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
        font-size: 14px;
        text-align: center;
        padding: 0 12px;
        border: 0;
        border-radius: 4px;
        cursor: pointer;
        outline: none;
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .bp-button-group {
        height: auto;
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
    }

    button {
        outline: none;
    }
    /* button 通用样式 */
    button:focus {
        outline: none !important;
    }

    button.button-primary {
        background: $color-primary-b400;
        color: $color-neutrals-n000;
    }

    .button-primary:hover {
        background: $color-primary-b300;
    }

    .button-primary:active {
        background: $color-primary-b500;
    }

    .button-primary .button-icon-color path {
        fill: $color-neutrals-n000;
    }

    .button-primary:disabled .button-icon-color path{
        fill: $color-neutrals-n060;
    }

    button.button-standard {
        background: $color-neutrals-n020;
        color: $color-neutrals-n400;
    }

    .button-standard:hover {
        background: $color-neutrals-n030;
    }

    .button-standard:active {
        background: $color-primary-b050;
        color: $color-primary-b400;
    }

    .button-standard .button-icon-color path {
        fill: $color-neutrals-n400;
    }

    .button-standard:disabled .button-icon-color path {
        fill: $color-neutrals-n060;
    }

    .button-standard:active .button-icon-color path {
        fill: $color-primary-b400;
    }

    .button-primary:disabled,.button-standard:disabled {
        background: $color-neutrals-n020;
        color: $color-neutrals-n060;
        cursor: not-allowed;
    }


    button.button-subtle {
        background: $color-neutrals-n000;
        color: $color-neutrals-n400;
    }

    .button-subtle:hover {
        background: $color-neutrals-n030;
    }

    .button-subtle:active {
        background: $color-primary-b050;
    }

    .button-subtle:disabled {
        color: $color-neutrals-n060;
        cursor: not-allowed;
    }

    .button-subtle .button-icon-color path {
        fill: $color-neutrals-n400;
    }

    .button-subtle:disabled .button-icon-color path {
        fill: $color-neutrals-n060;
    }

    .button-subtle:active .button-icon-color path {
        fill: $color-primary-b400;
    }

    .button-destructive {
        background: $color-negative-r400;
        color: $color-neutrals-n000;
    }

    .button-destructive:hover {
        background: $color-negative-r300;
    }

    .button-destructive:active {
        background: $color-negative-r500;
    }

    .button-warning {
        background: $color-notice-y300;
        color: $color-neutrals-n400;
    }

    .button-warning:hover {
        background: $color-notice-y200;
    }

    .button-warning:active {
        background: $color-notice-y400;
    }

    .button-density-comfy {
        height: $size-density-comfy;
        line-height: $size-5x;
    }

    .button-density-default {
        height: $size-density-default;
        line-height: 32px;
    }

    .button-density-compact {
        height: $size-density-compact;
        line-height: $size-3x;
    }

    .bp-button.btn-block {
        width: 100%;
    }


    .icon-and-opacity path{
        fill: rgba(255, 255, 255, 0.8)
    }

    .agenda-text-center {
        line-height: 104px;
        width: 70px;
    }

    .button-official-gray-line {
        width: 80px;
        height: 32px;
        line-height: 32px;
        background: linear-gradient(45deg,rgba(22,28,57,0.2) 0,rgba(22,28,57,0.2) 5%, transparent 5%, transparent 50%,rgba(22,28,57,0.2) 50%,rgba(22,28,57,0.2) 55%, transparent 55%, transparent) !important;
        background-size: 10px 10px !important;
        border: none;
        font-weight: 500;
        font-size: 12px;
        color: #2D334D;
    }

    .button-official-yellow-line-inverse {
        padding: 0 24px;
        height: 32px;
        line-height: 32px;
        background: linear-gradient(45deg, rgba(255,221,77,0.5) 0, rgba(255,221,77,0.5) 5%, transparent 5%, transparent 50%, rgba(255,221,77,0.5) 50%, rgba(255,221,77,0.5) 55%, transparent 55%, transparent) !important;
        background-size: 10px 10px !important;
        border: none;
        font-weight: 500;
        font-size: 12px;
        color: rgba(255, 255, 255, 0);
    }

    .button-official-yellow-line {
        padding: 0 24px;
        height: 32px;
        line-height: 32px;
        background: linear-gradient(45deg, rgba(255,221,77,0.5) 0, rgba(255,221,77,0.5) 5%, transparent 5%, transparent 50%, rgba(255,221,77,0.5) 50%, rgba(255,221,77,0.5) 55%, transparent 55%, transparent) !important;
        background-size: 10px 10px !important;
        border: none;
        font-weight: 500;
        font-size: 12px;
        color: #2D334D;
    }

    .button-official-yellow-line-compact {
        height: 40px;
        padding: 0 24px;
        line-height: 40px;
        background: linear-gradient(45deg, rgba(255,221,77,0.5) 0, rgba(255,221,77,0.5) 5%, transparent 5%, transparent 50%, rgba(255,221,77,0.5) 50%, rgba(255,221,77,0.5) 55%, transparent 55%, transparent) !important;
        background-size: 8px 8px !important;
        border: none;
        font-weight: 500;
        font-size: 14px;
        color: #2D334D;
    }

    .button-report-download {
        width: 200px !important;
        height: 40px !important;
        border-radius: 0 !important;
        text-align: center !important;
        display: inline-block !important;
        background: #161C39;
        color: #FFFFFF;
        border: none;
        cursor: inherit;
    }

    .button-fixed-nav-login {
        line-height: 37px !important;
        height: 37px !important;
        width: 80px !important;
        background: transparent !important;
        color: #2D334D !important;
        font-size: 14px;
        border: 1px solid rgba(22,28,57,0.12) !important;
        border-radius: 16px !important;
        text-align: center !important;
        display: inline-block !important;
    }

    .button-fixed-nav-login-inverse {
        line-height: 37px !important;
        height: 37px !important;
        width: 80px !important;
        background: transparent !important;
        color: rgba(255,255,255,0.9) !important;
        font-size: 14px;
        border: 1px solid rgba(255,255,255,0.60) !important;
        border-radius: 16px !important;
        text-align: center !important;
        display: inline-block !important;
    }
</style>
