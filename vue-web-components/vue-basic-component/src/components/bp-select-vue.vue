<template>
    <div class="bp-select" :class="[{'select-disabled': disabled},classNames]">
        <div class="bp-select-title" @click="toggleShow">
            <img svg-inline :src="beforeSrc" :alt="beforeAlt" :class="[iconClass,'svg-icon']" v-if="beforeSrc"/>
            <span>{{choosedValue}}</span>
            <img svg-inline :src="src" :alt="alt" :class="[iconClass,'svg-icon']" v-if="src"/>
        </div>
        <ul :class="show ? 'bp-option-group' : 'd-none'">
            <slot></slot>
        </ul>
    </div>
</template>
<script>
export default {
    props: {
        iconClass: String,
        classNames: String,
        choosedValue: {
            type: String,
            default: '请选择'
        },
        src: String,
        beforeSrc: String,
        alt: String,
        beforeAlt: String,
        closeTosts: Boolean
    },
    data: function() {
        return {
            disabled: false,
            show: false
        }
    },
    methods: {
        toggleShow() {
            if(!this.disabled) {
                this.show = !this.show
            }
            this.$emit('showSelectOption', true)
        }
    },
    watch: {
        closeTosts: function(data) {
            this.show = false
        }
    }
}
</script>
<style lang=scss scoped>
    $spacing-none: 0px;
    $spacing-compact-2x: 2*2px;
    $color-neutrals-n000: #ffffff;
    * {
        box-sizing: border-box;
    }
    .svg-icon {
        width: 16px;
        height: 16px;
    }

    .bp-option-group {
        margin: $spacing-none;
        padding: $spacing-compact-2x $spacing-none;
        background: $color-neutrals-n000;
        box-shadow: 0 4px 8px -2px rgba(9, 30, 66, 0.25);
        border-radius: 3px;
    }
    .bp-select-title {
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        padding: 0 8px;
        justify-content: space-between;
    }
    .d-none {
        display: none;
    }
    svg:focus {
        outline: none;
    }
    .bp-select {
        height: 40px;
        width: 240px;
        margin-left: 8;
        margin-right: 8;
        margin-top: 8;
        margin-bottom: 8;
        padding-left: 8;
        padding-right: 8;
        padding-top: 8;
        padding-bottom: 8;
        background: rgba(9,30,66,0.04);
        padding: 0;
        margin: 0;
        position: relative;
        cursor: pointer;
        box-sizing: border-box;
        border-radius: 4px;
    }
    
    .bp-select:hover {
        background: #EBECF0;
    }
</style>