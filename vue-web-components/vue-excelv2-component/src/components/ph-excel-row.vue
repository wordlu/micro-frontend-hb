<template>
    <div class="ph-row" :style="style">
        <ph-cell v-for="(item, index) in value" :value="item" :cellWidth="cellWidth(index)"
                 :cellHeight="rowHeight" :state="rowState" :dtype="dtype(index)" :key="index"/>
    </div>
</template>
<script>

import PhExcelDataSchema from './model/schema'
import PhCell from './ph-excel-cell'

export default {
    data() {
        return {

        }
    },
    computed: {
        style: function() {
        	if (this.rowState === "reverse") {
        	    return "background-color: #aaa"
            } else return ""
        }
    },
    components: {
        PhExcelDataSchema,
        PhCell
    },
    props: {
        schema: {
            type: Object,
            default: new PhExcelDataSchema('1')
        },
        rowHeight: {
            type: Number,
            default: 24
        },
        value: {
            type: Array,
            default: []
        },
        rowState: {
        	type: String,
            default: "normal" // normal, reverse
        }
    },
    beforeMount() {

    },
    mounted() {

    },
    methods: {
        dtype: function(index) {
            return this.schema.dtype[index]
        },
        cellWidth: function(index) {
            return this.schema.cellWidth[index]
        }
    },
    watch: {

    }
};
</script>
<style lang="scss" scoped>
    .ph-row {
        display: flex;
        flex-direction: row;

    }
</style>
