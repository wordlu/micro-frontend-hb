<template>
    <bp-carousel :height="height" :autoplay="autoplay">
        <bp-carousel-item v-for="item in itemArr" :key="item">
            <!-- <h3>{{item}}</h3> -->
            <img :src="item" alt="">
        </bp-carousel-item>
    </bp-carousel>
</template>

<script>
import bpCarousel from './bp-carousel.vue'
import bpCarouselItem from './bp-carousel-item.vue'
import { staticFilePath } from '../config/envConfig'

export default {
    name: 'bp-button',
    components: {
        bpCarousel,
        bpCarouselItem
    },
    props: {
        itemArr: {
            type: Array,
            default: function() {
                return [
                    `${staticFilePath}` + "/head1200_B.png",
                    'https://dss2.bdstatic.com/5bVYsj_p_tVS5dKfpU_Y_D3/res/r/image/2021-3-4/hao123%20logo.png',
                    'https://dgss0.bdstatic.com/5bVWsj_p_tVS5dKfpU_Y_D3/res/r/image/2017-09-27/297f5edb1e984613083a2d3cc0c5bb36.png'
                ]
            }
        },
        height: String,
        autoplay: {
            type: Boolean,
            default: false
        }

    },
    methods: {}
}
</script>

<style lang="scss" scoped>
    .el-carousel__item h3 {
        color: #475669;
        font-size: 14px;
        opacity: 0.75;
        line-height: 150px;
        margin: 0;
    }

    .el-carousel__item:nth-child(2n) {
        background-color: #666;
    }
    
    .el-carousel__item:nth-child(2n+1) {
        background-color: #ddd;
    }
    h3 {
        color: red;
    }
</style>
