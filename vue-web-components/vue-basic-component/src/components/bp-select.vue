<template>
    <div class="bp-select" :class="[{'select-disabled': disabled},classNames]">
        <div class="bp-select-title" @click="toggleShow">
            <span>{{choosed_text}}</span>
            <img svg-inline 
                :src="src" 
                alt="example" 
                :class="[iconClass,'svg-icon']"
                v-if="src"
            />
        </div>
        <ul :class="show ? 'bp-option-group' : 'd-none'">
            <bpOption 
                v-for="optionData in options_data" 
                :key="optionData.text" 
                :text="optionData.text" 
                :choosed_value="choosed_text" 
                :src="optionData.src" 
                :click_event="optionData.click_event" @chooseOption="changeLanguage" @click.native="close"
                @linkToPage="linkToPage">
                <div class="bp-text ph-body-xsmall-tertiary">
                    {{optionData.spanText}}
                </div>
            </bpOption>
        </ul>
    </div>
</template>
<script>
import bpOption from "./bp-option.vue"
export default {
    components: {
        bpOption
    },
    props: {
        iconClass: {
            type: String,
            default: "svg-icon"
        },
        classNames: String,
        choosed_value: String,
        options_data: Array,
        changeValue: {
            type: Boolean,
            default: false
        },
        src: String,
        disSelected: {
            type: Boolean,
            default: false
        }
        // show: {
        //     type: Boolean,
        //     default: false
        // }
    },
    data: function() {
        return {
            disabled: false,
            show: false,
            choosed_text: this.choosed_value
        }
    },
    mounted() {
        let that = this
        document.addEventListener('click',function (e) {
            //获取鼠标最新的坐标
            if(e.clientY > 80) {
                that.show = false
            }
        })
    },
    methods: {
        toggleShow() {
            if(!this.disabled) {
                this.show = !this.show
            }
            // if(!this.disabled) {
            //     const event = new Event("event")
            //     event.args = {
            //         callback: "clickSelect",
            //         element: this,
            //         param: {
            //             name: "show",
            //             value: this.show
            //         }
            //     }
            //     this.$emit('clickEvent', event)
            // }
        },
        changeLanguage(value) {
            if (this.choosed_value && !this.disSelected) {
                this.choosed_text = value
            }
        },
        close() {
            this.show = false
        },
        linkToPage(value) {
            this.$emit("linkToPage", value)
        }
    },
    watch: {
        choosed_value: function(val) {
            this.choosed_text = val
        }
    }
}
</script>
<style lang="scss" scoped>
    $spacing-none: 0px;
    $spacing-compact-2x: 2*2px;
    $color-neutrals-n000: #ffffff;
    * {
        box-sizing: border-box;
    }
    .svg-icon {
        width: 16px;
        height: 16px;
    }

    .bp-option-group {
        margin: $spacing-none;
        padding: $spacing-compact-2x $spacing-none;
        background: $color-neutrals-n000;
        box-shadow: 0 4px 8px -2px rgba(9, 30, 66, 0.25);
        border-radius: 3px;
    }
    .bp-select-title {
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        padding: 0 8px;
        justify-content: space-between;
    }
    .d-none {
        display: none;
    }
    svg:focus {
        outline: none;
    }
    .bp-select {
        height: 40px;
        width: 240px;
        margin-left: 8;
        margin-right: 8;
        margin-top: 8;
        margin-bottom: 8;
        padding-left: 8;
        padding-right: 8;
        padding-top: 8;
        padding-bottom: 8;
        background: rgba(9,30,66,0.04);
        padding: 0;
        margin: 0;
        position: relative;
        cursor: pointer;
        box-sizing: border-box;
        border-radius: 4px;
    }
    
    .bp-select:hover {
        background: #EBECF0;
    }
    .bp-text {
        height: auto;
        width: auto;
        background: 0 0;
        padding: 0;
    }
    .ph-body-xsmall-tertiary {
        font-size: 12px;
        color: #A2A5B0;
    }
</style>