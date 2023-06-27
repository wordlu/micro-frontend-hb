<template>
    <div class="editable-component">
        <div class="tag-block" @dblclick="doubleClick">
            <bp-input type="text" placeholder="" :value="name" @keyup.native="keyUp" @blur="focusOut" @input="inputEvent($event,'name')"></bp-input>
            <span class="editable-tag-name">{{name}}</span>
            <section class="icon_cross"></section>
        </div>
    </div>
</template>

<script>
import bpInput from '../../node_modules/vue-components/src/components/bp-input.vue'
export default {
    components: {
        bpInput
    },
    data() {
        return {
            oldValue: '',
            name: this.tagName
        }
    },
    props: {
        tagName: String
    },
    methods: {
        doubleClick(event) {
            let dom = event.target
            this.oldValue = this.name

            if(dom.nodeName.toLowerCase() === "div") {
                dom.classList.replace('tag-block', "tag-input")
                dom.firstElementChild.focus()
            }else if(dom.nodeName.toLowerCase() === "span") {
                dom.parentElement.classList.replace('tag-block', "tag-input")
                dom.previousElementSibling.focus()
            }
        },
        keyUp(event) {
            let dom = event.target,
                parentDom = dom.parentElement

            if(event.key === "Enter") {
                parentDom.classList.replace('tag-input', "tag-block")
                if(!dom.value) {
                    this.name = this.oldValue
                }
            }
        },
        focusOut(event) {
            let dom = event.target,
                parentDom = dom.parentElement
            
            parentDom.classList.replace('tag-input', 'tag-block')
            if (!dom.value) {
                this.name = this.oldValue
            }
        },
        inputEvent(value, key) {
            this[key] = value
        }
    }
}
</script>

<style lang="scss" scoped>
    @mixin label-tags {
        font-family: SFProText-Light;
        font-size: 12px;
        color: #302F39;
        letter-spacing: 0;
        text-align: center;
        line-height: 16px;
    }

    @mixin body-primary {
        font-family: SFProText-Light;
        font-size: 14px;
        color: #302F39;
        letter-spacing: 0.25px;
        line-height: 20px;
    }

    .editable-component {
        .tag-block {
            width: fit-content;
            height: 18px;
            border: 1px solid #E1DFE9;
            border-radius: 2px;
            padding: 1px 4px;
            display: flex;
            cursor: pointer;

            &:hover {
                background: rgba(37, 35, 45, 0.06);
            }

            input {
                display: none;
            }

            .editable-tag-name {
                @include label-tags;
                line-height: 18px;
				max-width: 100px;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
            }

            .icon_cross {
                display: none;
            }
        }

        .tag-input {
            height: 18px;
            width: fit-content;
            position: relative;
            line-height: 18px;
            input {
                height: 18px !important;
                border-radius: 2px;

                &:focus {
                    border: none;
                    padding: 0 16px 0 4px;
                    background: rgba(37, 35, 45, 0.04);
                    max-width: 100px;
                    @include body-primary;
                }
            }

            span {
                display: none;
            }

            .icon_cross {
                width: 12px;
                height: 12px;
                position: absolute;
                top: 2px;
                right: 4px;
            }
        }
    }
</style>