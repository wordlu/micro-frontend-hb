<template>
<!--页面容器-->
<div class="gallery-box">
    <div class="gallery-img-container">
        <div class="gallery-img-box" @click="showMorePhoto">
            <div class="gallery-left">
                <div class="gallery-left-top">
                    <bpImg :src="galleryShow.a" class="gallery-img-a"></bpImg>
                    <bpImg :src="galleryShow.b" class="gallery-img-b"></bpImg>
                </div>
                <bpImg :src="galleryShow.c" class="gallery-img-c"></bpImg>
            </div>
            <div class="gallery-right">
                <div class="gallery-right-top">
                    <bpImg :src="galleryShow.d" class="gallery-img-d"></bpImg>
                    <bpImg :src="galleryShow.e" class="gallery-img-e"></bpImg>
                </div>
                <bpImg :src="galleryShow.f" class="gallery-img-c"></bpImg>
            </div>
        </div>
        <div class="gallery-mask"></div>
        <div class="more-img" @click="showMorePhoto">
            <bpText class="more-photo-text">更多时刻</bpText>
            <bpImg :src="more" class="icon_go"></bpImg>
        </div>
    </div>
    <div class="bp-modal-photos" v-if="showPhoto">
        <div class="bp-modal-photos-content">
            <div class="photos-cross-icon" @click="closeModel">
                <div class="closeMorePhoto_icon_and"></div>
            </div>
            <div id="bp-viewport-photo" style="height:605px;width:1032px;" class="bp-viewport-photo">
                <div @click="previ">
                    <bpImg :src="prev"  class="official-icon-style-left"></bpImg>
                </div>
                
                <div class="photos-content">
                    <div class="transform-list">
                        <bpImg v-for="(item,i) in galleryList" :key="i" :src="item.path" v-show="i==n" class="photo"></bpImg>
                    </div>
                </div>
                <div @click="next">
                    <bpImg :src="prev" class="official-icon-style-right" ></bpImg>
                </div>
            </div>
            <bpText class="text-white">{{n}} / {{galleryList.length}}</bpText>
        </div>
    </div>
</div>

</template>

<script>
import bpText from '../bp-text'
import { staticFilePath } from '../../config/envConfig'
import bpImg from '../bp-img'
export default {
    components: {
        bpText,
        bpImg
    },
    data() {
        return {
            language: '中文',
            showPhoto: false,
            n: 2,
            more: `${staticFilePath}` + "/icon_go.svg",
            prev: `${staticFilePath}` + "/icon_drop_new.svg",
            close: `${staticFilePath}` + "/close_icon.svg"
        }
    },
    created() {
        this.language = window.localStorage.getItem('lang')
    },
    computed: {
        translation_data: function () {
            if (this.language === '中文') {
                return this.translation_basedata.cn
            } else if (this.language === 'English') {
                return this.translation_basedata.en
            }
        }
    },
    methods: {
        showMorePhoto() {
            this.showPhoto = !this.showPhoto
        },
        closeModel() {
            this.showPhoto = !this.showPhoto
        },
        previ() {
            if(this.n > 0) {
                this.n--
            } else {
                this.n = this.galleryList.length - 1
            }
        },
        next() {
            if(this.n == this.galleryList.length - 1) {
                this.n = 0
            } else {
                this.n++
            }
        }
    },
    mounted:function(){  
    },
    props: {
        galleryShow: {
            type: Object,
            default: function() {
                return {
                }
            }
        },
        galleryList: {
            type: Array,
            default: function() {
                return []
            }
        }
    }
}
</script>

<style lang="scss" scoped>
* {
    box-sizing: border-box;
    line-height: 1.6;
}
.gallery-box {
    width: 100vw;
}
.gallery-img-container {
    height: auto;
    width: auto;
    overflow: hidden;
    background: 0 0;
    align-items: center;
    display: flex;
    flex-direction: column;
    .gallery-img-box {
        height: auto;
        width: auto;
        background: 0 0;
        justify-content: center;
        display: flex;
        .gallery-img-c {
            height: 378px;
            width: 504px;
            margin-right: 32px;
            background: 0 0;
            border-radius: 2px;
            object-fit: cover;
            cursor: pointer!important;
        }
        .gallery-left {
            height: auto;
            width: auto;
            background: 0 0;
            align-items: flex-end;
            display: flex;
            flex-direction: column;
            .gallery-left-top {
                height: auto;
                width: auto;
                background: 0 0;
                display: flex;
                align-items: flex-end;
                justify-content: flex-end;
                .gallery-img-a {
                    height: 334px;
                    width: 263px;
                    margin-right: 32px;
                    margin-bottom: 32px;
                    background: 0 0;
                    align-items: flex-end;
                    border-radius: 2px;
                    object-fit: cover;
                    cursor: pointer!important;
                }
                .gallery-img-b {
                    height: 418px;
                    width: 335px;
                    margin-right: 32px;
                    margin-bottom: 32px;
                    background: 0 0;
                    align-items: flex-end;
                    border-radius: 2px;
                    object-fit: cover;
                    cursor: pointer!important;
                }
            }
        }
        .gallery-right {
            display: flex;
            flex-direction: column;
            .gallery-right-top {
                height: auto;
                width: auto;
                background: 0 0;
                align-items: flex-end;
                display: flex;
                .gallery-img-d {
                    height: 504px;
                    width: 378px;
                    margin-right: 32px;
                    margin-bottom: 32px;
                    background: 0 0;
                    border-radius: 2px;
                    object-fit: cover;
                    cursor: pointer!important;
                }
                .gallery-img-e {
                    height: 334px;
                    width: 260px;
                    margin-right: 32px;
                    margin-bottom: 32px;
                    background: 0 0;
                    border-radius: 2px;
                    object-fit: cover;
                    cursor: pointer!important;
                }
            }
            
        }
    }
    .gallery-mask {
        height: 15px;
        width: 100%;
        background: 0 0;
        position: relative;
        top: -15px;
        background-image: linear-gradient(180deg,rgba(255,255,255,0) 0,#FFF 100%);
    }
    .more-img {
        height: auto;
        width: auto;
        background: 0 0;
        position: relative;
        justify-content: center;
        display: flex;
        flex-direction: row;
        cursor: pointer!important;
        .more-photo-text {
            font-size: 14px;
            color: #2D334D;
            letter-spacing: 1px;
            line-height: 24px;
            margin-right: 8px;
        }
        .icon_go {
            width: 24px;
            height: 24px; 
        }
    }
}
.bp-modal-photos {
    height: 100vh;
    width: 100vw;
    background: rgba(27,29,40,.96);
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    z-index: 9999;
    justify-content: center;
    align-items: center;
    .bp-modal-photos-content {
        height: 605px;
        width: 1032px;
        background: 0 0;
        justify-content: space-between;
        position: relative;
        align-items: center;
        display: flex;
        flex-direction: column;
        .text-white {
            color: #FFF;
            font-size: 14px;
        }
        .photos-cross-icon {
            padding: 5px;
            height: 32px;
            width: 32px;
            background: 0 0;
            border-radius: 50%;
            border: 1px solid #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            top: 0;
            right: 0;
            cursor: pointer !important;
            z-index: 2;
            .closeMorePhoto_icon_and {
                background: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23FFF' fill-rule='nonzero' d='M20 .588L10.588 10 20 19.412l-.588.588L10 10.588.588 20 0 19.412 9.412 10 0 .588.588 0 10 9.411 19.412 0z'/%3E%3C/svg%3E")  no-repeat center/100% !important;
                padding: 5px;
            }
        }
        
        
    }
    .bp-viewport-photo {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0 24px;
        position: relative;
        background: 0 0;
        display: flex;
        .official-icon-style-left {
            transform: rotate(90deg);
            height: 48px;
            width: 48px;
            border-radius: 50%;
            border: 1px solid rgba(255,255,255,.6);
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            // position: absolute;
        }
        .official-icon-style-right {
            transform: rotate(270deg);
            height: 48px;
            width: 48px;
            border-radius: 50%;
            border: 1px solid rgba(255,255,255,.6);
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            // position: absolute;
            right: 0;
        }
        .photos-content {
            height: 468px;
            width: 832px;
            background: 0 0;
            overflow: hidden;
            display: flex;
            .transform-list {
                height: auto;
                width: auto;
                background: 0 0;
                display: flex;
                .photo {
                    width: 832px;
                    background: 0 0;
                    object-fit: contain;
                }
            }
        }
        
    }
}
@media (max-width: 992px) and (min-width: 769px) {
    .gallery-img-container, .gallery-img-container .gallery-img-box {
        width: 100% !important;

        .gallery-img-a,
        .gallery-img-b,
        .gallery-img-c,
        .gallery-img-d,
        .gallery-img-e,
        .gallery-img-f {
            margin-right: 12px !important;
            margin-bottom: 12px !important;
        }
  
        .gallery-img-a {
            width: 38% !important;
            height: 277px !important;
        }

        .gallery-img-b {
            width: 56% !important;
            height: 370px !important;
        }

        .gallery-img-c {
            width: 84% !important;
            height: 314px !important;
        }

        .gallery-right-top .gallery-img-d {
            width: 64% !important;
            height: 420px !important;
        }

        .gallery-right-top .gallery-img-e {
            width: 44% !important;
            height: 278px !important;
        }
    }
    .bp-modal-photos .bp-modal-photos-content {
        width: 100% !important;
        height: 460px !important;

        .photos-cross-icon {
            top: -50px !important;
        }

        .bp-viewport-photo {
            height: 100% !important;
            width: 100% !important;

            .photos-content {
                height: 100% !important;
                width: 100% !important;

                .photo {
                    width: 100% !important;
                    height: 100% !important;
                }
            }
        }
    }
}
@media (max-width: 768px) and (min-width: 550px) {
    .gallery-img-container, .gallery-img-container .gallery-img-box {
        width: 100% !important;

        .gallery-left .gallery-left-top {
            justify-content: flex-end !important;
        }
  
        .gallery-left .gallery-left-top .gallery-img-a {
            width: 38% !important;
            height: 142px !important;
            margin-right: 12px !important;
            margin-bottom: 12px !important;
        }

        .gallery-left .gallery-left-top .gallery-img-b {
            width: 60% !important;
            height: 178px !important;
            margin-right: 12px !important;
            margin-bottom: 12px !important;
        }

        .gallery-img-c {
            width: 90% !important;
            height: 160px !important;
            margin-right: 12px !important;
            margin-bottom: 12px !important;
        }

        .gallery-right-top .gallery-img-d {
            width: 68% !important;
            height: 215px !important;
            margin-right: 12px !important;
            margin-bottom: 12px !important;
        }

        .gallery-right-top .gallery-img-e {
            width: 46% !important;
            height: 142px !important;
            margin-right: 12px !important;
            margin-bottom: 12px !important;
        }
    }
    .bp-modal-photos .bp-modal-photos-content {
        width: 100% !important;
        height: 35% !important;

        .photos-cross-icon {
            top: -50px !important;
        }

        .bp-viewport-photo {
            height: 100% !important;
            width: 100% !important;

            .photos-content {
                height: 100% !important;
                width: 100% !important;
                // overflow: scroll !important;

                .photo {
                    width: 100% !important;
                    height: 100% !important;
                    // margin: 0 10px !important;
                }
            }
        }
    }
}
@media (max-width: 549px), (width: 549px) {
    .gallery-img-container, .gallery-img-container .gallery-img-box {
        width: 100% !important;
  
        .gallery-left .gallery-left-top .gallery-img-a {
            width: 23% !important;
            height: 142px !important;
            margin-right: 12px !important;
            margin-bottom: 12px !important;
        }

        .gallery-left .gallery-left-top .gallery-img-b {
            width: 60% !important;
            height: 178px !important;
            margin-right: 12px !important;
            margin-bottom: 12px !important;
        }

        .gallery-img-c {
            width: 90% !important;
            height: 160px !important;
            margin-right: 12px !important;
            margin-bottom: 12px !important;
        }

        .gallery-right-top .gallery-img-d {
            width: 68% !important;
            height: 215px !important;
            margin-right: 12px !important;
            margin-bottom: 12px !important;
        }

        .gallery-right-top .gallery-img-e {
            width: 46% !important;
            height: 142px !important;
            margin-right: 12px !important;
            margin-bottom: 12px !important;
        }
    }
    .bp-modal-photos .bp-modal-photos-content {
        width: 100% !important;
        height: 35% !important;

        .photos-cross-icon {
            top: -50px !important;
        }

        .bp-viewport-photo {
            height: 100% !important;
            width: 100% !important;

            .photos-content {
                height: 100% !important;
                width: 100% !important;
                // overflow: scroll !important;

                .photo {
                    width: 100% !important;
                    height: 100% !important;
                    // margin: 0 10px !important;
                }
            }
            .official-icon-style-left {
                position: absolute;
            }
            .official-icon-style-right {
                position: absolute;
            }
        }
    }
}
</style>
