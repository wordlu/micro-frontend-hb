/**
 * 这个就是我所说的Command Instance
 */
export default class PhFilterOnValueCmd {
    constructor(defs) {
        this.name = defs["type"]
        this.code = defs["code"]
        this.value = defs["params"]["value"]
        this.columns = defs["params"]["columns"]
        this.isEdit = false
        this.isDelete = false
    }

    exec() {

    }

    validations() {
        return true
    }

    //删除列
    delCol(i) {
        this.columns.splice(i, 1)
    }

    // 增加列
    addSelCol() {
        this.columns.push("")
    }

    revert2Defs() {
        const params = {
            columns: this.columns,
            value: this.value
        }

        return {
            type: this.name,
            code: this.code,
            params: params
        }
    }

    // 生成描述
    // stepDesc(ele) {
    stepDesc() {
        // const stepNameDesc = ele.stepNameDesc
        let desc =
            "填充 将列 " +
            this.columns.join(",")+
            " 中的空值替换为 " +
            this.value
        return desc
    }
}
