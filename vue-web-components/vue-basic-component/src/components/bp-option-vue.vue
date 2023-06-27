<template>
    <li class="bp-option" @click="close" :class="[{'option-active': isChoosed}, {'disabled': disabled}]">
        <img svg-inline :class="[iconClass, 'svg-icon']" :src="src" alt="" v-if="src"/>
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
    props: {
        text: String,
        choosedValue: String,
        iconClass: String,
        src: String,
        disabled: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        isChoosed() {
            return this.text === this.choosedValue
        }
    },
    methods: {
        close() {
            this.$parent.$data.show = false
            this.$emit("click", this.text)
        }
    }
}
</script>
<style lang=scss scoped>
    $color-neutrals-n000: #ffffff;
    $color-neutrals-n400: rgba(#091e42,0.71);
    .svg-icon {
        width: 16px;
        height: 16px;
    }
    svg:focus {
        outline: none;
    }
    li.option-active {
        color: $color-neutrals-n000 !important;
        background-color: $color-neutrals-n400 !important;
    }
    li.option-active .icon path {
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
        background-color: #EBECF0;
    }

    .disabled {
        cursor: not-allowed;
    }
</style>