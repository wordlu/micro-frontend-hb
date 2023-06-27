<template>
    <span
        class="bp-status"
        @click="handleClick"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
        :class="[
            subtle ? 'status-subtle' : 'status-bold',
            type ? 'status-' + type : 'status-success'
        ]">
        {{text}}
    </span>
</template>

<script>
export default {
    props: {
        text: {
            type: String,
            default: "status test"
        },
        subtle: {
            type: Boolean,
            default: false
        },
        type: {
            type: String,
            default: "success"
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
    $color-neutrals-n040: rgba(#091e42,0.13);
    $color-neutrals-n500: rgba(#091e42,0.77);
    $color-neutrals-n000: #ffffff;
    $color-positive-g050: #e2ffee;
    $color-positive-g500: #006644;
    $color-positive-g400: #00875a;
    $color-negative-r050: #ffebe6;
    $color-negative-r500: #bf2600;
    $color-negative-r400: #de350b;
    $color-primary-b050: #F2F0F9;
    $color-primary-b500: #5342B3;
    $color-primary-b400: #7163C5;
    $color-informative-p050: #eae6ff;
    $color-informative-p500: #403294;
    $color-informative-p400: #5243aa;
    $color-notice-y075: #ff991f;
    $color-neutrals-n800: rgba(#091e42,0.95);
    $color-notice-y500: #fffae6;
    
    .bp-status {
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
        background: #FFFFFF;
        padding: 0 4px;
        font-size: 12px;
        line-height: 16px;
        text-align: center;
        border-radius: 4px;
    }
    /* status 通用样式 */

    .status-default.status-subtle {
        background: $color-neutrals-n040;
        color: $color-neutrals-n500;
    }

    .status-default.status-bold {
        background: $color-neutrals-n500;
        color: $color-neutrals-n000;
    }

    .status-success.status-subtle {
        background: $color-positive-g050;
        color: $color-positive-g500;
    }

    .status-success.status-bold {
        background: $color-positive-g400;
        color: $color-neutrals-n000;
    }

    .status-removed.status-subtle {
        background: $color-negative-r050;
        color: $color-negative-r500;
    }

    .status-removed.status-bold {
        background: $color-negative-r400;
        color: $color-neutrals-n000;
    }

    .status-in-progress.status-subtle {
        background: $color-primary-b050;
        color: $color-primary-b500;
    }

    .status-in-progress.status-bold {
        background: $color-primary-b400;
        color: $color-neutrals-n000;
    }

    .status-new.status-subtle {
        background: $color-informative-p050;
        color: $color-informative-p500;
    }

    .status-new.status-bold {
        background: $color-informative-p400;
        color: $color-neutrals-n000;
    }

    .status-moved.status-subtle {
        background: $color-notice-y075;
        color: $color-neutrals-n800;
    }

    .status-moved.status-bold {
        background: $color-notice-y500;
        color: $color-neutrals-n800;
    }
</style>
