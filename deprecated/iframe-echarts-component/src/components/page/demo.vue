<template>
	<div>
		<div class="page">
			<div class="item" @click="linkTo('map')">
				<img src="./map.png" alt="">
				<h2>地图组件</h2>
			</div>
			<div class="item" @click="linkTo('waterfull')">
				<img src="./waterfull.png" alt="">
				<h2>waterfull组件</h2>
			</div>
			<div class="item" @click="linkTo('heatmap')">
				<img src="./heatmap.png" alt="">
				<h2>热力图组件</h2>
			</div>
		</div>
		<div class="page">
			<div class="item" @click="linkTo('bubble')">
				<img src="./bubble.png" alt="">
				<h2>气泡图组件</h2>
			</div>
			<div class="item" @click="linkTo('per')">
				<img src="./per.png" alt="">
				<h2>等高堆叠图组件</h2>
			</div>
			<div class="item" @click="linkTo('mix')">
				<img src="./mix.png" alt="">
				<h2>堆叠图和折线图混合组件</h2>
			</div>
		</div>
	</div>
</template>

<script>

export default {
    methods: {
        linkTo(name) {
            this.$router.push({path:name})
        }
    }
}
</script>
<style scoped lang="scss">
.page {
    padding: 30px;
    display: flex;
    align-items: center;
}
.item {
    width: 300px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    img {
        width: 250px;
        height: 200px;
    }
    h2 {
        font-size: 20px;
    }
}
</style>