export const PhFilterStepDefs = {
}

const PhInitialFEWVExpressions = {
    type: "FillEmptyWithValue",
    code: "pyspark",
    params: {
        "columns": [""],
        "value": ""
    }
}

export const PhInitialFEWVEStepDefs = {
    attributes: {
        "pj-name": "",
        "step-id": "",
        index: 0,
        ctype: "FillEmptyWithValue",
        expressions: JSON.stringify(PhInitialFEWVExpressions),
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
