<template>
    <textarea class="bp-textarea form-textarea" :maxlength="maxlength" @input="input_event"></textarea>
</template>

<script>
export default {
    props: {
        maxlength: {
            type: Number,
            default: 140
        }
    },
    methods: {
        input_event(event){
            this.$emit("input", event.target.value)
        }
    }
}
</script>

<style lang="scss" scoped>
    * {
        box-sizing: border-box;
    }
    .form-textarea {
        height: 80px;
        width: 536px;
        background: rgba(22,28,57,0.01);
        font-size: 14px;
        color: #747789;
        border: none;
        border-bottom: 1px solid rgba(22,28,57,0.1);
        outline: none;
        padding: 8px;
    }
</style>