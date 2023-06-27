<template>
<!-- 最外层div -->
<div :class="carouselClasses" @mouseenter.stop="handleMouseEnter" @mouseleave.stop="handleMouseLeave">
    <div class="el-carousel__container" :style="{ height: height }">
        <!-- 左边切换箭头 -->
        <transition v-if="arrowDisplay" name="carousel-arrow-left">
            <button type="button" v-show="(arrow === 'always' || hover) && (loop || activeIndex > 0)" 
                @mouseenter="handleButtonEnter('left')" @mouseleave="handleButtonLeave" 
                @click.stop="prev()"
                class="el-carousel__arrow el-carousel__arrow--left">
                <i class="el-icon-arrow-left"></i>
            </button>
        </transition>
        <!-- 右边切换箭头 -->
        <transition v-if="arrowDisplay" name="carousel-arrow-right">
            <button type="button" v-show="(arrow === 'always' || hover) && (loop || activeIndex < items.length - 1)" @mouseenter="handleButtonEnter('right')" @mouseleave="handleButtonLeave" 
            @click.stop="next()"
            class="el-carousel__arrow el-carousel__arrow--right">
                <i class="el-icon-arrow-right"></i>
            </button>
        </transition>
        <!-- 幻灯片内容显示区域 -->
        <slot></slot>
    </div>
    <!-- 底部切换指示器 -->
    <ul v-if="indicatorPosition !== 'none'" :class="indicatorsClasses">
        <li v-for="(item, index) in items" :key="index" :class="[
          'el-carousel__indicator',
          'el-carousel__indicator--' + direction,
          { 'is-active': index === activeIndex }]" @click.stop="handleIndicatorClick(index)">
            <button class="el-carousel__button">
                <span v-if="hasLabel">{{ item.label }}</span>
            </button>
        </li>
    </ul>
</div>
</template>

<script>
//监听元素高度变化
import ResizeObserver from 'resize-observer-polyfill';

export default {
    name: 'bpCarousel',

    props: {
        initialIndex: { //初始幻灯片索引，从0开始
            type: Number,
            default: 0
        },
        height: String,
        trigger: { // 底部指示器触发方式
            type: String,
            default: 'hover'
        },
        autoplay: { // 是否自动切换
            type: Boolean,
            default: true
        },
        interval: { // 自动切换时间间隔
            type: Number,
            default: 3000
        },
        indicatorPosition: String, // 指示器位置
        indicator: {
            type: Boolean,
            default: true
        },
        arrow: { //切换箭头的显示时机 always/hover/never
            type: String,
            default: 'hover'
        },
        type: String, //走马灯的类型,card
        loop: { //是否循环显示
            type: Boolean,
            default: true
        },
        direction: {
            type: String,
            default: 'horizontal',
            validator(val) {
                return ['horizontal', 'vertical'].indexOf(val) !== -1;
            }
        }
    },

    data() {
        return {
            items: [], // 幻灯片数组
            activeIndex: -1, // 当前索引
            containerWidth: 0,
            timer: null,
            hover: false
        };
    },

    computed: {
        arrowDisplay() {
            return this.arrow !== 'never' && this.direction !== 'vertical';
        },

        hasLabel() {
            return this.items.some(item => item.label.toString().length > 0);
        },

        carouselClasses() {
            const classes = ['el-carousel', 'el-carousel--' + this.direction];
            if (this.type === 'card') {
                classes.push('el-carousel--card');
            }
            return classes;
        },

        indicatorsClasses() {
            const classes = ['el-carousel__indicators', 'el-carousel__indicators--' + this.direction];
            if (this.hasLabel) {
                classes.push('el-carousel__indicators--labels');
            }
            if (this.indicatorPosition === 'outside' || this.type === 'card') {
                classes.push('el-carousel__indicators--outside');
            }
            return classes;
        }
    },

    watch: {
        items(val) {
            if (val.length > 0) this.setActiveItem(this.initialIndex);
        },

        activeIndex(val, oldVal) {
            this.resetItemPosition(oldVal);
            if (oldVal > -1) {
                this.$emit('change', val, oldVal);
            }
        },

        autoplay(val) {
            val ? this.startTimer() : this.pauseTimer();
        },

        loop() {
            this.setActiveItem(this.activeIndex);
        },

        interval() {
            this.pauseTimer();
            this.startTimer();
        }
    },

    methods: {
        handleMouseEnter() {
            this.hover = true;
            this.pauseTimer();
        },

        handleMouseLeave() {
            this.hover = false;
            this.startTimer();
        },

        itemInStage(item, index) {
            const length = this.items.length;
            if (index === length - 1 && item.inStage && this.items[0].active ||
                (item.inStage && this.items[index + 1] && this.items[index + 1].active)) {
                return 'left';
            } else if (index === 0 && item.inStage && this.items[length - 1].active ||
                (item.inStage && this.items[index - 1] && this.items[index - 1].active)) {
                return 'right';
            }
            return false;
        },

        handleButtonEnter(arrow) {
            if (this.direction === 'vertical') return;
            this.items.forEach((item, index) => {
                if (arrow === this.itemInStage(item, index)) {
                    item.hover = true;
                }
            });
        },

        handleButtonLeave() {
            if (this.direction === 'vertical') return;
            this.items.forEach(item => {
                item.hover = false;
            });
        },
        // 将所有的幻灯片放入items数组中
        updateItems() {
            this.items = this.$children.filter(child => child.$options.name === 'bpCarouselItem');
        },
        //  重置幻灯片位置
        resetItemPosition(oldIndex) {
            this.items.forEach((item, index) => {
                item.translateItem(index, this.activeIndex, oldIndex);
            });
        },
        // 改变当前的幻灯片
        playSlides() {
            if (this.activeIndex < this.items.length - 1) {
                this.activeIndex++;
            } else if (this.loop) {
                this.activeIndex = 0;
            }
        },
        // 清空定时器
        pauseTimer() {
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
        },
        // 如果自动切换的时间间隔小于等于0时，或者用户未设置自动播放时，直接返回，幻灯片不自动播放
        startTimer() {
            if (this.interval <= 0 || !this.autoplay || this.timer) return;
            this.timer = setInterval(this.playSlides, this.interval);
        },
        // 设置当前页    
        setActiveItem(index) {
            if (typeof index === 'string') {
                const filteredItems = this.items.filter(item => item.name === index);
                if (filteredItems.length > 0) {
                    index = this.items.indexOf(filteredItems[0]);
                }
            }
            index = Number(index);
            if (isNaN(index) || index !== Math.floor(index)) {
                console.warn('[Element Warn][Carousel]index must be an integer.');
                return;
            }
            let length = this.items.length;
            const oldIndex = this.activeIndex;
            if (index < 0) {
                this.activeIndex = this.loop ? length - 1 : 0;
            } else if (index >= length) {
                this.activeIndex = this.loop ? 0 : length - 1;
            } else {
                this.activeIndex = index;
            }
            if (oldIndex === this.activeIndex) {
                this.resetItemPosition(oldIndex);
            }
        },

        prev() {
            this.setActiveItem(this.activeIndex - 1);
        },

        next() {
            this.setActiveItem(this.activeIndex + 1);
        },

        handleIndicatorClick(index) {
            this.activeIndex = index;
        },

        handleIndicatorHover(index) {
            if (this.trigger === 'hover' && index !== this.activeIndex) {
                this.activeIndex = index;
            }
        }
    },

    created() {},

    mounted() {
        this.updateItems();

        const isServer = typeof window === 'undefined';

        /* istanbul ignore next */
        const resizeHandler = function (entries) {
            for (let entry of entries) {
                const listeners = entry.target.__resizeListeners__ || [];
                if (listeners.length) {
                    listeners.forEach(fn => {
                        fn();
                    });
                }
            }
        };
        /* istanbul ignore next */
        const addResizeListener = function (element, fn) {
            if (isServer) return;
            if (!element.__resizeListeners__) {
                element.__resizeListeners__ = [];
                element.__ro__ = new ResizeObserver(resizeHandler);
                element.__ro__.observe(element);
            }
            element.__resizeListeners__.push(fn);
        };

        this.$nextTick(() => {
            addResizeListener(this.$el, this.resetItemPosition);
            if (this.initialIndex < this.items.length && this.initialIndex >= 0) {
                this.activeIndex = this.initialIndex;
            }
            this.startTimer();
        });
    },

    beforeDestroy() {
        /* istanbul ignore next */
        const removeResizeListener = function (element, fn) {
            if (!element || !element.__resizeListeners__) return;
            element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
            if (!element.__resizeListeners__.length) {
                element.__ro__.disconnect();
            }
        };
        if (this.$el) removeResizeListener(this.$el, this.resetItemPosition);
        this.pauseTimer();
    }
};
</script>

<style scoped>
.el-carousel__container {
    text-align: center;
}

.el-carousel {
    position: relative;
}

.el-carousel--horizontal {
    overflow-x: hidden;
}

.el-carousel--vertical {
    overflow-y: hidden;
}

.el-carousel__container {
    position: relative;
    height: 300px;
}

.el-carousel__arrow {
    border: none;
    outline: none;
    padding: 0;
    margin: 0;
    height: 36px;
    width: 36px;
    cursor: pointer;
    -webkit-transition: .3s;
    transition: .3s;
    border-radius: 50%;
    background-color: rgba(31, 45, 61, 0.11);
    color: #FFFFFF;
    position: absolute;
    top: 50%;
    z-index: 10;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
    text-align: center;
    font-size: 12px;
}

.el-carousel__arrow--left {
    left: 16px;
}

.el-carousel__arrow--right {
    right: 16px;
}

.el-carousel__arrow:hover {
    background-color: rgba(31, 45, 61, 0.23);
}

.el-carousel__arrow i {
    cursor: pointer;
}

.el-carousel__indicators {
    position: absolute;
    list-style: none;
    margin: 0;
    padding: 0;
    z-index: 2;
}

.el-carousel__indicators--horizontal {
    bottom: 0;
    left: 50%;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
}

.el-carousel__indicators--vertical {
    right: 0;
    top: 50%;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
}

.el-carousel__indicators--outside {
    bottom: 26px;
    text-align: center;
    position: static;
    -webkit-transform: none;
    transform: none;
}

.el-carousel__indicators--outside .el-carousel__indicator:hover button {
    opacity: 0.64;
}

.el-carousel__indicators--outside button {
    background-color: #C0C4CC;
    opacity: 0.24;
}

.el-carousel__indicators--labels {
    left: 0;
    right: 0;
    -webkit-transform: none;
    transform: none;
    text-align: center;
}

.el-carousel__indicators--labels .el-carousel__button {
    height: auto;
    width: auto;
    padding: 2px 18px;
    font-size: 12px;
}

.el-carousel__indicators--labels .el-carousel__indicator {
    padding: 6px 4px;
}

.el-carousel__indicator {
    background-color: transparent;
    cursor: pointer;
}

.el-carousel__indicator:hover button {
    opacity: 0.72;
}

.el-carousel__indicator--horizontal {
    display: inline-block;
    padding: 12px 4px;
}

.el-carousel__indicator--vertical {
    padding: 4px 12px;
}

.el-carousel__indicator--vertical .el-carousel__button {
    width: 2px;
    height: 15px;
}

.el-carousel__indicator.is-active button {
    opacity: 1;
    background-color: #2A7AFE;
}

.el-carousel__button {
    display: block;
    opacity: 0.48;
    width: 15px;
    height: 15px;
    background-color: #cccccc;
    border: none;
    outline: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    -webkit-transition: .3s;
    transition: .3s;
    border-radius: 50%;
    margin: 0 5px;
}

.carousel-arrow-left-enter,
.carousel-arrow-left-leave-active {
    -webkit-transform: translateY(-50%) translateX(-10px);
    transform: translateY(-50%) translateX(-10px);
    opacity: 0;
}

.carousel-arrow-right-enter,
.carousel-arrow-right-leave-active {
    -webkit-transform: translateY(-50%) translateX(10px);
    transform: translateY(-50%) translateX(10px);
    opacity: 0;
}
</style>
