<template>
    <button
        class="bp-button-item button-item"
        @click="handleClick"
        @dblclick="handleDBClick"
        :disabled="disabled"
        :class="[
            density ? 'button-density-' + density : 'button-density-default',
            {'active': active}
        ]"
    >
        {{text}}
    </button>
</template>

<script>
export default {
    props: {
        text: {
            type: String,
            default: "test text"
        },
        active: Boolean,
        density: String, // comfy, default, compact
        disabled: Boolean, //加了disabled就是disabled
        first: Boolean,
        last: Boolean
    },
    methods: {
        handleClick(data) {
            var that = this
            // 开启延时器，300ms的间隔区分单击和双击，解决双击时执行两次单击事件
            clearTimeout(that.time)
            that.time = setTimeout(() => {
                // 写单击事件执行的逻辑代码
                let event = new Event("click")
                event.data = data
                this.$emit('click', event);
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
    $color-neutrals-n020: rgba(#091e42,0.04);
    $color-neutrals-n400: rgba(#091e42,0.71);
    $font-size-2: 14px;
    $border-none: 0px;
    $spacing-compact-1x: 2px;
    $radius-medium: 2*2px;
    $radius-none: 0px;
    $spacing-none: 0px;
    $color-neutrals-n000: #ffffff;
    $size-density-comfy: 5*8px;
    $size-5x: 5*8px;
    $size-density-default: 4*8px;
    $size-density-compact: 3*8px;
    $size-3x: 3*8px;

    /*button group*/

    .button-group .button-item {
        background: $color-neutrals-n020;
        color: $color-neutrals-n400;
        font-size: $font-size-2;
        outline: none;
        cursor: pointer;
        border: $border-none;
        margin-right: $spacing-compact-1x;
    }

    .button-group button:first-child {
        border-radius: $radius-medium $radius-none $radius-none $radius-medium;
    }

    .button-group button:last-child {
        border-radius: $radius-none $radius-medium $radius-medium $radius-none;
        margin-right: $spacing-none;
    }

    .button-group .button-item.active {
        background: $color-neutrals-n400;
        color: $color-neutrals-n000;
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
</style>
