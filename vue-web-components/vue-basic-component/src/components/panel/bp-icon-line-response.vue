<template>
    <div>
        <div class="case-icon-line">
            <bpImg class="case-icon" v-for="item in imgArr" :key="item" :src="item"></bpImg>
        </div>
    </div>
</template>

<script>
import bpImg from '../bp-img'
import { staticFilePath } from '../../config/envConfig'

export default {
    components: {
        bpImg
    },
    methods: {},
    data() {
        return {
            imgArr: [
                `${staticFilePath}` + "/logo_pfizer_00.png",
                `${staticFilePath}` + "/logo_sanofi_01.png",
                `${staticFilePath}` + "/logo_novartis_02.png",
                `${staticFilePath}` + "/logo_astrazeneca_03.png",
                `${staticFilePath}` + "/logo_bayer_04.png",
                `${staticFilePath}` + "/logo_gilead_05.png",
                `${staticFilePath}` + "/logo_Jessen_08.png",
                `${staticFilePath}` + "/servier_07.png",
                `${staticFilePath}` + "/logo_novo-nordisk_10.png",
                `${staticFilePath}` + "/logo_mylan_11.png",
                `${staticFilePath}` + "/astellas_10.png",
                `${staticFilePath}` + "/logo_merck_13.png",
                `${staticFilePath}` + "/logo_msd_14.png",
                `${staticFilePath}` + "/logo_lilly_15.png",
                `${staticFilePath}` + "/Daiichi-Sankyo_14.png",
                `${staticFilePath}` + "/Takeda_15.png",
                `${staticFilePath}` + "/Salubris_16.png",
                `${staticFilePath}` + "/Lmdbeck_17.png"
            ]
        }
    }
}
</script>

<style lang="scss" scoped>
    * {
        letter-spacing: .4px;
        line-height: 1.6;
        box-sizing: border-box;
    }
    .case-icon-line {
        flex-wrap: wrap;
        height: auto;
        width: 100%;
        background: 0 0;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-bottom: 8px;
        .case-icon {
            height: 49px;
            width: 33%!important;
            object-fit: contain!important;
            margin-bottom: 32px;
            background: 0 0;
        }
    }
    .case-icon-line-three {
        padding: 0 100px;
    }
</style>
