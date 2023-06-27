export const PhPostFilterDefs = {
    actions: [
        {
            desc: "符合所有条件的列",
            cal: "AND"
        },
        {
            desc: "符合至少一个条件",
            cal: "OR"
        },
        {
            desc: "公式",
            cal: "FORMULA"
        },
        {
            desc: "SQL表达式",
            cal: "SQL"
        }
    ],
    includes: [
        {
            desc: "包含",
            cal: "CONTAINS"
        },
        {
            desc: "等于",
            cal: "EQUALS"
        },
        {
            desc: "等于（不区分大小写）",
            cal: "INSENSITIVE-EQUALS"
        },
        {
            desc: "不等于",
            cal: "NOT-EQUALS"
        },
        {
            desc: "与某列相同",
            cal: "COL-EQUALS"
        },
        {
            desc: "与某列不相同",
            cal: "COL-NOT-EQUALS"
        },
        {
            desc: "有值",
            cal: "EXISTS"
        },
        {
            desc: "无值",
            cal: "NOT-EXISTS"
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
    ]
}

const PhInitialFOVExpressions = {
    type: "FilterOnValue",
    code: "pyspark",
    params: {
        values: [""],
        matchingMode: "FULL_STRING",
        normalizationMode: "EXACT",
        action: "KEEP_ROW",
        booleanMode: "AND",
        appliesTo: "COLUMNS",
        columns: [""]
    }
}

export const PhInitialFOVStepDefs = {
    attributes: {
        "pj-name": "",
        "step-id": "",
        index: 0,
        ctype: "FilterOnValue",
        expressions: JSON.stringify(PhInitialFOVExpressions),
        runtime: "prepare",
        "group-name": "",
        "group-index": 0,
        "expressions-value": "JSON",
        "step-name": "Initial Filter On Value"
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
