/**
 * 这个就是我所说的Command Instance
 */
export default class PhFilterOnValueCmd {
    constructor(defs) {
        this.name = defs["type"]
        this.code = defs["code"]
        this.mapping = defs["params"]["mapping"]
        this.columns = defs["params"]["columns"]
        this.matchingMode = defs["params"]["matchingMode"]
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
            mapping: this.mapping,
            columns: this.columns,
            matchingMode: this.matchingMode
        }

        return {
            type: this.name,
            code: this.code,
            params: params
        }
    }

    // 生成描述
    stepDesc(ele) {
        const stepNameDesc = ele.stepNameDesc
        let desc = 
            "替换 将列 " +
            this.columns.join(",")+
            " 中 " +
            stepNameDesc["patternDesc"][this.matchingMode] +        
            this.mapping[0]["from"] + " 的值替换为 " + 
            this.mapping[0]["to"]
        return desc
    }
}
