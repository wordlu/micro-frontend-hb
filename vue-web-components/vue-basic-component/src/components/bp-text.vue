<template>
	<span class="bp-text" :title="title" @click="click_event">
		<slot></slot>
	</span>
</template>

<script>
export default {
    props: {
        title: String
    },
    methods: {
        click_event(event) {
            this.$emit('click', event)
        }
    }
}
</script>

<style lang="scss" scoped>
	.bp-text {
		height: auto;
		width: auto;
		margin-left: 8;
		margin-right: 8;
		margin-top: 8;
		margin-bottom: 8;
		padding-left: 8;
		padding-right: 8;
		padding-top: 8;
		padding-bottom: 8;
		background: transparent;
		padding: 0;
	}
</style>