<template>
    <li class="bp-option" :disabled="disabled" @click="chooseOption" :class="{'option-active': isChoosed}">
        <img svg-inline class="svg-icon" :src="src" alt="" v-if="src"/>
        <div style="display: flex;flex-direction: column;">
            <span>{{text}}</span>
            <div>
                <slot></slot>
            </div>
        </div>
    </li>
</template>
<script>
export default {
    data: function() {
        return {
            disabled: false
        }
    },
    props: {
        text: String,
        choosed_value: String,
        click_event: Function,
        src: String
    },
    computed: {
        isChoosed() {
            return this.text === this.choosed_value
        }
    },
    methods: {
        chooseOption() {
            this.$emit("chooseOption", this.text)
            this.click_event()
        }
    }
}
</script>
<style lang="scss" scoped>
    $color-neutrals-n000: #ffffff;
    $color-neutrals-n400: rgba(#091e42,0.71);
    * {
        box-sizing: border-box;
    }
    .svg-icon {
        width: 16px;
        height: 16px;
    }
    svg:focus {
        outline: none;
    }
    .option-active {
        color: $color-neutrals-n000 !important;
        background-color: $color-neutrals-n400 !important;
    }
    .option-active .icon path {
        fill: $color-neutrals-n000;
    }
    .bp-option {
        height: 32px;
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
        color: #344563;
        display: flex;
        padding: 0 16px;
        align-items: center;
    }
    .bp-option:hover {
        background-color: #EBECF0 !important;
    }
</style>