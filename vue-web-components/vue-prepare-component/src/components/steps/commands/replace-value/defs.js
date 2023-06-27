export const PhFilterStepDefs = {
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
        patternDesc: {
            "FULL_STRING": "等于",
            "SUBSTRING": "包含",
            "REGX": "符合"
        }
    }
}

const PhInitialRVExpressions = {
    type: "ValueReplace",
    code: "pyspark",
    params: {
        mapping: [
            {
                from: "",
                to: ""
            }
        ],
        columns: [""],
        matchingMode: "FULL_STRING"
    }
}

export const PhInitialRVStepDefs = {
    attributes: {
        "pj-name": "",
        "step-id": "",
        index: 0,
        ctype: "ReplaceValue",
        expressions: JSON.stringify(PhInitialRVExpressions),
        runtime: "prepare",
        "group-name": "",
        "group-index": 0,
        "expressions-value": "JSON",
        "step-name": "Initial Replace Value"
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
