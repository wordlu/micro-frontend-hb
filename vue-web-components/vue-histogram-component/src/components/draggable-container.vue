<template>
    <VueDragResize v-if="checkEditableShowing()" @onclick="onActive" :isActive="active"
                   :parentLimitation="true"
                   :h="rect.height" :w="rect.width"
                   :x="rect.left" :y="rect.top"
                   @resizestop="resizeStop" @dragstop="resizeStop"
                   v-on:resizing="resize" v-on:dragging="resize">
        <Insight :init-width="rect.width" :init-height="rect.height" :policy="activeContent.policy"  ref="histogram" />
    </VueDragResize>
    <div class="view" :style="resetInsightPosition()" v-else-if="checkViewableShowing()">
        <Insight :init-width="rect.width" :init-height="rect.height" :policy="activeContent.policy"  @selected="insightSelected" ref="histogram" />
    </div>
</template>

<script>
import Insight from "./insight"
import VueDragResize from './drag-resize'

export default {
    props: {
        activeContent: {
            type: Object,
            default: function() {
                return null
            }
        },
        position: Array,
        editable: {
            type: Boolean,
            default: true
        },
        editable: {
            type: Boolean,
            default: true
        }
    },
    data: () => {
        return {
            isMounted: 0,
            name: "draggable-container",
            rect: null,
            timer: null,
            stopTimer: null,
            leftIndex: 0,
            topIndex: 1,
            rightIndex: 2,
            bottomIndex: 3
        }
    },
    components: {
        Insight,
        VueDragResize
    },
    mounted () {
        this.isMounted++
        this.rect = this.computedRect()
    },
    updated() {

    },
    methods: {
        adjustLeft(l) {
            const w = this.$parent.$refs.container.offsetWidth
            const margin = this.$parent.initGrids.margin
            const columns = this.$parent.initGrids.columns
            const stepW = (w - margin) / columns - margin
            return margin + l * (stepW + margin)
        },
        adjustWidth(l, r) {
            const w = this.$parent.$refs.container.offsetWidth
            const margin = this.$parent.initGrids.margin
            const columns = this.$parent.initGrids.columns
            const stepW = (w - margin) / columns - margin
            const left = margin + l * (stepW + margin)
            const right = margin + (r + 1) * (stepW + margin)
            return right - left
        },
        adjustTop(t) {
            const h = this.$parent.$refs.container.offsetHeight
            const margin = this.$parent.initGrids.margin
            const lines = this.$parent.initGrids.lines
            const stepH = (h - margin) / lines - margin
            return margin + t * (stepH + margin)
        },
        adjustHeight(t, b) {
            const h = this.$parent.$refs.container.offsetHeight
            const margin = this.$parent.initGrids.margin
            const lines = this.$parent.initGrids.lines
            const stepH = (h - margin) / lines - margin
            const top = margin + t * (stepH + margin)
            const bottom = margin + (b + 1) * (stepH + margin)
            return bottom - top
        },
        resizeStop() {
            const top = this.rect.top
            const left = this.rect.left
            const width = this.rect.width
            const height = this.rect.height

            const w = this.$parent.$refs.container.offsetWidth
            const h = this.$parent.$refs.container.offsetHeight
            const margin = this.$parent.initGrids.margin
            const columns = this.$parent.initGrids.columns
            const lines = this.$parent.initGrids.lines
            const stepW = (w - margin) / columns - margin
            const stepH = (h - margin) / lines - margin

            if (this.adjustRange(top, this.adjustTop(this.position[this.topIndex]))) {
                this.position[this.topIndex] = Math.floor(top / stepH)
                this.$nextTick(() => {
                    this.rect.top = this.adjustTop(this.position[this.topIndex])
                })
            } else if (this.adjustRange(height, this.adjustHeight(this.position[this.topIndex], this.position[this.bottomIndex]))) {
                // this.position[this.bottomIndex] = Math.floor((top + height - 2 * margin - 1) / stepH) - 1
                this.position[this.bottomIndex] = Math.min(Math.floor((top + height - 2 * margin - 1) / stepH), 12)
                this.$nextTick(() => {
                    this.rect.height = this.adjustHeight(this.position[this.topIndex], this.position[this.bottomIndex])
                })
            } else if (this.adjustRange(left, this.adjustLeft(this.position[this.leftIndex]))) {
                this.position[this.leftIndex] = Math.floor(left / stepW)
                this.$nextTick(() => {
                    this.rect.left = this.adjustLeft(this.position[this.leftIndex])
                })
            } else if (this.adjustRange(width, this.adjustWidth(this.position[this.leftIndex], this.position[this.rightIndex]))) {
                // this.position[this.rightIndex] = Math.floor((left + width - 2 * margin - 1) / stepW) - 1
                this.position[this.rightIndex] = Math.min(Math.floor((left + width - 2 * margin - 1) / stepW), 12)
                this.$nextTick(() => {
                    this.rect.width = this.adjustWidth(this.position[this.leftIndex], this.position[this.rightIndex])
                })
            }
        },
        adjustRange(l, r, s = 1) {
            return l - r > s || r - l > s
        },
        resize(newRect) {
            this.rect.width = newRect.width
            this.rect.height = newRect.height
            this.rect.top = newRect.top
            this.rect.left = newRect.left

            if (this.timer)
                return

            const that = this
            this.timer = setTimeout(() => {
                that.$refs.histogram.resizeHandler(that.rect.width, that.rect.height)
                that.timer = null
            }, 100)
        },
        onActive() {
            this.active = !this.active
        },
        checkEditableShowing() {
            return this.isMounted > 0 && this.editable
        },
        checkViewableShowing() {
            return this.isMounted > 0 && !this.editable
        },
        resetInsightPosition() {
            return "left: " + this.rect.left + "px; top: " + this.rect.top + "px; width: " + this.rect.width + "px; height: " + this.rect.height + "px;"
        },
        insightSelected() {
            const event = new Event("event")
            event.param = {
                contentIdx: this.activeContent.index
            }
            this.$emit("selected", event)
        },
        computedRect() {
            return {
                top: this.adjustTop(this.position[this.topIndex]),
                left: this.adjustLeft(this.position[this.leftIndex]),
                width: this.adjustWidth(this.position[this.leftIndex], this.position[this.rightIndex]),
                height: this.adjustHeight(this.position[this.topIndex], this.position[this.bottomIndex])
            }
        }
    },
    watch: {

    }
}
</script>

<style scoped lang="scss">
    .view {
        position: absolute;
    }

    .page {
        display: flex;
        flex-direction: column;
        min-height: 100vh;

        .title-panel {
            display: flex;
            flex-direction: row;
            background-color: grey;
            height: 45px;

            img {
                width: 40px;
                height: 40px;
                margin: auto 0;
                border: 2px solid gray;
                padding: 1px;
            }

            h2 {
                margin: auto 0;
            }
        }

        .edit-container {
            flex-grow: 1;

            .mid-container {
                position: absolute;
                z-index: -2;


                .grid-container {
                    position: relative;
                    z-index: -1;

                    .grid-item {
                        position: absolute;
                        background-color: beige;
                    }
                }
            }

            .high-container {
                position: absolute;

                .histogram-container {
                    position: relative;
                    z-index: 99;
                }
            }
        }
    }
</style>
