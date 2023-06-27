/**
 * 这个就是我所说的Command Instance
 */
export default class PhOutputsCmd {
    constructor(defs) {
        console.log(defs)
        // this.name = defs["type"]
        // this.code = defs["code"]
        // this.values = defs["params"]["values"]
        // this.matchingMode = defs["params"]["matchingMode"]
        // this.normalizationMode = defs["params"]["normalizationMode"]
        // this.action = defs["params"]["action"]
        // this.booleanMode = defs["params"]["booleanMode"]
        // this.appliesTo = defs["params"]["appliesTo"]
        // this.columns = defs["params"]["columns"]
        // this.stepNameDesc = defs["stepNameDesc"]
        // this.isEdit = false
        // this.isDelete = false
    }

    exec() {

    }

    validations() {
        return true
    }

    revert2Defs() {
        const params = {
            values: this.values,
            matchingMode: this.matchingMode,
            normalizationMode: this.normalizationMode,
            action: this.action,
            booleanMode: this.booleanMode,
            appliesTo: this.appliesTo,
            columns: this.columns
        }

        return {
            type: this.name,
            code: this.code,
            params: params
        }
    }

    //删除值
    delSelVal(i) {
        this.values.splice(i, 1)
    }

    //增加值
    addSelVal() {
        this.values.push("")
    }

    //删除列
    delCol(i) {
        this.columns.splice(i, 1)
    }

    // 增加列
    addSelCol() {
        this.columns.push("")
    }

    // 生成描述
    stepDesc(ele) {
        const stepNameDesc = ele.stepNameDesc
        let desc =
            stepNameDesc["actionsDesc"][this.action] + " 列: "+
            this.columns.join(stepNameDesc["relationsDesc"][this.booleanMode])+
            " 中值 " +
            stepNameDesc["patternDesc"][this.matchingMode] +
            this.values.join(",") +
            "的行"
        return desc
    }
}
