<template>
    <label 
        class="body-primary"
        :for="forLabel">
        {{text}}
    </label>
</template>

<script>
export default {
    props: {
        forLabel: String,
        text: {
            type: String,
            default: "test text"
        }
    },
    computed: {
    },
    methods: {
    }
}
</script>

<style lang=scss scoped>
   .body-primary { 
        color: rgba(#091e42,0.95);
        font-size: 14px;
        font-weight: 500;
    };
</style>
