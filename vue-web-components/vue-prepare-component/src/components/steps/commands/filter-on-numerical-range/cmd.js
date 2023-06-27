/**
 * 这个就是我所说的Command Instance
 */
export default class PhFilterOnValueCmd {
    constructor(defs) {
        this.name = defs["type"]
        this.code = defs["code"]
        this.action = defs["params"]["action"]
        this.booleanMode = defs["params"]["booleanMode"]
        this.appliesTo = defs["params"]["appliesTo"]
        this.columns = defs["params"]["columns"]
        this.max = defs["params"]["max"]
        this.min = defs["params"]["min"]
        this.stepNameDesc = defs["stepNameDesc"]
        this.isEdit = false
        this.isDelete = false
    }

    exec() {

    }

    validations() {
        return true
    }

    revert2Defs() {
        const params = {
            matchingMode: this.matchingMode,
            action: this.action,
            booleanMode: this.booleanMode,
            appliesTo: this.appliesTo,
            columns: this.columns,
            max: this.max,
            min: this.min
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
            " 中值大于 " +        
            this.min + " 小于 " + this.max +
            "的行"
        return desc
    }
}
