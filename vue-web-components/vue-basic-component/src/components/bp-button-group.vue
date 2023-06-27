<template>
    <div class="bp-button-group button-group">
        <!-- <slot></slot> -->
        <bpButtonItem 
            v-for="(item,index) in buttonArr" 
            :key="index" 
            :active="item.active" 
            :text="item.text">
        </bpButtonItem>
    </div>
</template>

<script>
import bpButtonItem from "./bp-button-item"
export default {
    name: 'bp-button-group',
    components: {
        bpButtonItem
    },
    data() {
        return {
        }
    },
    props: {
        buttonArr: {
            type: Array,
            default: function() {
                return [{
                    text:"test",
                    active: true
                },{
                    text:"test"
                }]
            }
        }
    }
}
</script>
<style lang=scss scoped>
    .bp-button-group {
        height: auto;
        width: max-content;
        margin-left: 0;
        margin-right: 0;
        margin-top: 0;
        margin-bottom: 0;
        padding-left: 0;
        padding-right: 0;
        padding-top: 0;
        padding-bottom: 0;
        background: #FFFFFF;
    }
</style>
