export const PhFilterStepDefs = {
    actions: [
        {
            desc: "只保留匹配行",
            cal: "KEEP_ROW"
        },
        {
            desc: "去除匹配行",
            cal: "REMOVE_ROW"
        },
        {
            desc: "清除匹配单元格",
            cal: "CLEAR_CELL"
        },
        {
            desc: "清除不匹配单元格",
            cal: "DONTCLEAR_CELL"
        }
    ],
    relations: [
        {
            desc: "交集（AND）",
            cal: "AND"
        },
        {
            desc: "并集（OR）",
            cal: "OR"
        }
    ],
    pattern: [
        {
            desc: "完全匹配",
            cal: "FULL_STRING"
        },
        {
            desc: "不完全匹配",
            cal: "SUBSTRING"
        },
        {
            desc: "正则表达式",
            cal: "REGX"
        }
    ],
    stepNameDesc: {
        actionsDesc: {
            "KEEP_ROW": "保留",
            "REMOVE_ROW": "去除",
            "CLEAR_CELL": "清除",
            "DONTCLEAR_CELL": "清楚"
        },
        relationsDesc: {
            "AND": "和",
            "OR": "或"
        },
        patternDesc: {
            "FULL_STRING": "等于",
            "SUBSTRING": "包含",
            "REGX": "符合"
        }
    }
}

const PhInitialFONRExpressions = {
    type: "FilterOnNumericalRange",
    code: "pyspark",
    params: {
        action: "KEEP_ROW",
        booleanMode: "AND",
        appliesTo: "COLUMNS",
        columns: [""],
        min: 1,
        max: 2
    }
}

export const PhInitialFONRStepDefs = {
    attributes: {
        "pj-name": "",
        "step-id": "",
        index: 0,
        ctype: "FilterOnNumericalRange",
        expressions: JSON.stringify(PhInitialFONRExpressions),
        runtime: "prepare",
        "group-name": "",
        "group-index": 0,
        "expressions-value": "JSON",
        "step-name": "Initial Filter on Numerical Range"
    },
    id: "",
    type: "steps"
}

export function step2SaveObj(step) {
    return {
        pjName: step['pj-name'],
        stepId: step['step-id'],
        index: step['index'],
        ctype: step['ctype'],
        expressions: step['expressions'],
        runtime: step['runtime'],
        groupName: step['group-name'],
        groupIndex: step['group-index'],
        expressionsValue: step['expressions-value'],
        stepName: step['step-name'],
        id: step['id']
    }
}
