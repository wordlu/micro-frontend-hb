<template>
    <div class="schema-item box" :style="style" >
        <span class="schema-title">{{title}}</span>
        <select name="" id="" v-model="itemValueType" class="schema-type" ref="schemaType" @change="selectScript" v-if="isNeedPopmenu">
            <option class="schema-select-item" value="String" >String</option>
            <option class="schema-select-item" value="Double" >Double</option>
            <option class="schema-select-item" value="Bigint" >Bigint</option>
        </select>
        <span v-else class="schema-type">&nbsp&nbsp&nbsp</span>
        <span class="split">&nbsp;&nbsp;</span>
    </div>
</template>
<script>
export default {
    data() {
        return {
            selectIcon: "https://general.hubadata.com/drop_down_icon.svg",
            selectValue: "String",
            showSelectOptionParam: false,
            closeTosts: false,
            itemValueType: "String"
        }
    },
    computed: {
        style: function() {
            let tmp = ""
            tmp = "width: " + this.itemWidth + 'px;'
            if (this.title === "__match") {
                tmp += "display: none;"
            }
            return tmp
        }
    },
    components: {
    },
    props: {
        valueType: {
            type: String,
            default: "String"
        },
        isNeedPopmenu: {
            type: Boolean,
            default: true
        },
        itemWidth: {
            type: Number,
            default: 118
        },
        title: {
            type: String,
            default: "title"
        },
        titleType: {
            type: String,
            default: "string"
        },
        dataGuess: {
            type: String,
            default: "String"
        }
    },
    mounted() {
        this.itemValueType = this.valueType
    },
    methods: {
        selectScript() {
            const event = new Event("event")
            event.args = {
                callback: "changeSchemaType",
                element: this,
                param: {
                    title: this.title,
                    originalType: this.selectValue,
                    itemValueType: this.itemValueType
                }
            }
            this.selectValue = this.itemValueType
            this.$emit('changeSchemaTypeEvent', event)
        },
        showSelectOption() {
            this.showSelectOptionParam = true
        }
    }
};
</script>
<style lang="scss">
    .schema-item {
        display: flex;
        justify-content: center;
        background: #F0F0F0;
        border: 1px solid #CFCFCF;
        overflow: hidden;
        box-sizing: border-box;
        .schema-title {
            font-weight: 500;
            font-size: 13px;
            color: #333333;
            margin-left: 8px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .schema-type {
            color: #666666;
            font-family: 'Monaco';
            font-size: 10px;
            height: 20px !important;
            border: none;
            background: rgba(9,30,66,.04);
        }
    }
    .box {
        flex-direction: column;
    }
    .split {
        height: 10px;
        width: 100%;
        background: #81c784;
        border-color: #81c784;
        border-width: 5px;
        margin: 0 2px;
    }
    .bp-option-group {
        margin: 0px;
        padding: 0px 0px;
        background: #ffffff;
        box-shadow: 0 4px 8px -2px rgb(9, 30, 66);
        border-radius: 3px;
        z-index: 99;
        position: fixed;
    }
</style>
