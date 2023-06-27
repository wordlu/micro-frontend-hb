import FilterOnValueDesc from "../md/filterOnValue.md"
import FilterOnNumericalRangeDesc from  "../md/FilterOnNumericalRange.md"
import replaceValueDesc from  "../md/replaceValue.md"
import replaceColumnDesc from "../md/replaceColumn.md"
import FillEmptyWithValueDesc from "../md/FillEmptyWithValue.md"


export const PhProcessorsDefs = [
    {
        id: 1,
        opt_name: "Filter data",
        opt_condition_num: 2,
        opt_condition_data: [
            {
                id: 1,
                name: "Filter on Value",
                type: "FilterOnValue",
                desc: FilterOnValueDesc
            },
            {
                id: 2,
                name: "Filter on Numerical Range",
                type: "FilterOnNumericalRange",
                desc: FilterOnNumericalRangeDesc
            }
        ]
    }, {
        id: 2,
        opt_name: "String",
        opt_condition_num: 2,
        opt_condition_data: [
            {
                id: 1,
                name: "Replace value",
                type: "ReplaceValue",
                desc: replaceValueDesc
            },
            {
                id: 2,
                name: "Replace column",
                type: "ReplaceColumn",
                desc: replaceColumnDesc
            }
        ]
    }, {
        id: 3,
        opt_name: "Data cleaning",
        opt_condition_num: 1,
        opt_condition_data: [
            {
                id: 1,
                name: "Fill empty cell with value",
                type: "FillEmptyWithValue",
                desc: FillEmptyWithValueDesc
            }
        ]
    }
]
