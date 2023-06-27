<template>
    <div class="bp_operator_card">
        <div class="card" v-if="type === 'FilterOnValue'">
            <filterOnValueCard 
                @delCardItem="delCardItem" :step="step" :schema="schema"/>
        </div>
        <div class="card" v-else-if="type === 'FilterOnNumericalRange'">
            <FilterOnNumericalRangeCard
                @delCardItem="delCardItem" :step="step" :schema="schema"/>
        </div>
        <div class="card" v-else-if="type === 'ReplaceValue'">
            <ReplaceValue
                @delCardItem="delCardItem" :step="step" :schema="schema"/>
        </div>
        <div class="card" v-else-if="type === 'FillEmptyWithValue'">
            <FillEmptyWithValue
                @delCardItem="delCardItem" :step="step" :schema="schema"/>
        </div>
    </div>
</template>
<script>
import FilterOnValueCard from "./steps/commands/filter-on-value/FOVcard"
import FilterOnNumericalRangeCard from "./steps/commands/filter-on-numerical-range/FONRcard"
import ReplaceValue from "./steps/commands/replace-value/RVcard"
import FillEmptyWithValue from "./steps/commands/fill-empty-with-value/FEWVcard"

export default {
    data() {
        return {

        }
    },
    props: {
        type: String,
        step: Object,
        schema: Array
    },
    components: {
        FilterOnValueCard,
        FilterOnNumericalRangeCard,
        ReplaceValue,
        FillEmptyWithValue
    },
    methods: {
        delCardItem(data) {
            this.$emit("delCardItem", data)
        }
    }
}
</script>
<style lang="scss" scoped>

</style>
