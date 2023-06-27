<template>
    <input 
        class="bp-input"
        ref="input"
        :disabled= "inputDisabled"
        :placeholder= "placeholder"
        :type= "type"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
        :class="[
            states ? 'input-' + states : '',
            size ? 'input-' + size : 'input-default'
        ]" 
    />
</template>

<script>
export default {
    name: 'bpInput',

    componentName: 'bpInput',

    data() {
        return {
            hovering: false,
            focused: false,
            isComposing: false
        };
    },

    props: {
        value: [String, Number],
        disabled: Boolean,
        placeholder: {
            type: String,
            default: "test placeholder"
        },
        states: {
            type: String,
            default: ''
        },
        size: {
            type: String,
            default: "comfy"
        },
        type: String
    },
    computed: {
        inputDisabled() {
            return this.disabled;
        }
    },
    watch: {
        nativeInputValue() {
            this.setNativeInputValue();
        },
        value(val) {
            if (this.validateEvent) {
                this.dispatch('ElFormItem', 'el.form.change', [val]);
            }
        }
    },
    methods: {
        handleBlur(event) {
            this.$emit('blur', event);
        },
        handleFocus(event) {
            this.$emit('focus', event);
        },
        handleChange(event) {
            this.$emit('change', event.target.value);
        },
        handleInput(event) {
            this.$emit('input', event.target.value);
        },
        getInput() {
            return this.$refs.input;
        }
    }
}
</script>

<style lang=scss scoped>
    $color-neutrals-n020: rgba(#091e42,0.04);
    $color-neutrals-n060: rgba(#091e42,0.31);
    $size-3x: 3*8px;
    $size-5x: 5*8px;
    $size-4x: 4*8px;
    $color-negative-r400: #de350b;
    $border-regular: 1px;
    $color-notice-y300: #ffe380;
    $color-positive-g300: #36b37e;
    $color-informative-p500: #403294;

    .bp-input {
        height: 32px;
        width: 240px;
        margin-left: 0;
        margin-right: 0;
        margin-top: 0;
        margin-bottom: 0;
        padding-left: 0;
        padding-right: 0;
        padding-top: 0;
        padding-bottom: 0;
        background: #FFFFFF;
        line-height: 14px;
        font-size: 14px;
        padding: 10px 8px;
        border: 1px solid #DFE1E6;
        border-radius: 4px;
        color: #172B4D;
        box-sizing: border-box;
    }
    .bp-input:focus {
        border: 1px solid #3172E0;
    }
    .bp-input:focus {
        outline: none;
    }

    /*input 通用样式*/

    input:disabled {
        background: $color-neutrals-n020 !important;
        border: none !important;
        color:  $color-neutrals-n060;
        cursor: not-allowed;
    }

    .input-compact {
        height: $size-3x;
    }

    .input-comfy {
        height: $size-5x;
    }

    .input-default {
        height: $size-4x;
    }

    .input-error {
        border: $border-regular solid $color-negative-r400 !important;
    }

    .input-warning {
        border: $border-regular solid $color-notice-y300 !important;
    }

    .input-success {
        border: $border-regular solid $color-positive-g300 !important;
    }

    .input-info {
        border: $border-regular solid $color-informative-p500 !important;
    }

</style>
