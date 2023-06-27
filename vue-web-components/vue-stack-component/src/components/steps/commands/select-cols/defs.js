export const PhSelectColsDefs = {
    typeDefs: [
        {
            desc: "整型",
            cal: "int"
        },
        {
            desc: "大整型",
            cal: "bigint"
        },
        {
            desc: "浮点",
            cal: "float"
        },
        {
            desc: "双浮点",
            cal: "double"
        },
        {
            desc: "布尔类型",
            cal: "boolean"
        },
        {
            desc: "字符串",
            cal: "string"
        }
    ],
    pattern: [
        {
            desc: "SQL Expression",
            cal: "SQL Expression"
        }
    ]
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
