/**
 * 这个就是我所说的Command Instance
 */
export default class PhPostFilterCmd {
    constructor(preFilterExpression, schema) {
		this.schema = schema
        if (preFilterExpression.includes(" and ")) {
            this.action = "AND"
            this.cloases = preFilterExpression.split(" and ")
        } else if (preFilterExpression.includes(" or ")) {
            this.action = "OR"
            this.cloases = preFilterExpression.split(" or ")
        } else if (!preFilterExpression.includes(" and ") && !preFilterExpression.includes(" or ")) {
            this.action = "AND"
            this.cloases = [preFilterExpression]
        }
        if (this.cloases.length > 0) {
            this.cloases2Struct()
        } else {
            this.cloases = [{
                "left": "",
                "op": "CONTAINS",
                "right": ""
            }]
        }
        
    }

    cloases2Struct() {
        const strArr = this.cloases
        const result = []

        for (let idx = 0; idx < strArr.length; ++idx) {
            try {
                this.tryContainsCloases(strArr[idx])
                this.tryEqualsCloases(strArr[idx])
                this.tryNotEqualsCloases(strArr[idx])
                this.tryExistsCloases(strArr[idx])
                this.tryNotExistsCloases(strArr[idx])
                this.tryColEqualsCloases(strArr[idx])
                this.tryColNotEqualsCloases(strArr[idx])

            } catch (e) {
                result.push(e["result"])
            }
        }
        this.cloases = result
    }

    tryContainsCloases(c) {
        const tmp = {}
        if (c.includes(" like ")) {
            tmp["status"] = "ok"
            tmp["result"] = {
                "left": c.substring(1, c.indexOf("`", 1)),
                "op": "CONTAINS",
                "right": c.substring(c.indexOf("%") + 1, c.lastIndexOf("%"))
            }
            throw tmp;
        }
    }

    tryRevertContainsCloases(t) {
        if (t.op === "CONTAINS") {
            throw "`" + t.left + "`" + " like '%" + t.right + "%'"
        }
    }

    tryNotExistsCloases(c) {
        const tmp = {}
        if (c.includes("is null")) {
            tmp["status"] = "ok"
            tmp["result"] = {
                "left": c.substring(1, c.indexOf("`", 1)),
                "op": "NOT-EXISTS",
                "right": undefined
            }
            throw tmp
        }
    }

    tryRevertNotExistsCloases(t) {
        if (t.op === "NOT-EXISTS") {
            throw "`" + t.left + "`" + " is not null"
        }
    }

    tryExistsCloases(c) {
        const tmp = {}
        if (c.includes("is not null")) {
            tmp["status"] = "ok"
            tmp["result"] = {
                "left": c.substring(1, c.indexOf("`", 1)),
                "op": "EXISTS",
                "right": undefined
            }
            throw tmp
        }
    }

    tryRevertExistsCloases(t) {
        if (t.op === "EXISTS") {
            throw "`" + t.left + "`" + " is not null"
        }
    }

    tryEqualsCloases(c) {
        const tmp = {}
        if (c.includes("'") && c.includes("==")) {
            tmp["status"] = "ok"
            tmp["result"] = {
                "left": c.substring(1, c.indexOf("`", 1)),
                "op": "EQUALS",
                "right": c.substring(c.indexOf("'") + 1, c.lastIndexOf("'"))
            }
            throw tmp
        }
    }

    tryRevertEqualsCloases(t) {
        if (t.op === "EQUALS") {
            throw "`" + t.left + "`" + " == '" + t.right + "'"
        }
    }

    tryNotEqualsCloases(c) {
        const tmp = {}
        if (c.includes("'") && c.includes("!=")) {
            tmp["status"] = "ok"
            tmp["result"] = {
                "left": c.substring(1, c.indexOf("`", 1)),
                "op": "NOT-EQUALS",
                "right": c.substring(c.indexOf("'") + 1, c.lastIndexOf("'"))
            }
            throw tmp
        }
    }

    tryRevertNotEqualsCloases(t) {
        if (t.op === "NOT-EQUALS") {
            throw "`" + t.left + "`" + " != '" + t.right + "'"
        }
    }

    tryColEqualsCloases(c) {
        const tmp = {}
        if (c.includes("==")) {
            tmp["status"] = "ok"
            tmp["result"] = {
                "left": c.substring(1, c.indexOf("`", 1)),
                "op": "COL-EQUALS",
                "right": c.substring(c.lastIndexOf(" ") + 1, c.lastIndexOf("`"))
            }
            throw tmp
        }
    }

    tryRevertColEqualsCloases(t) {
        if (t.op === "COL-EQUALS") {
            throw "`" + t.left + "`" + " == " + "`" + t.right + "`"
        }
    }

    tryColNotEqualsCloases(c) {
        const tmp = {}
        if (c.includes("!=")) {
            tmp["status"] = "ok"
            tmp["result"] = {
                "left": c.substring(1, c.indexOf("`", 1)),
                "op": "COL-NOT-EQUALS",
                "right": c.substring(c.lastIndexOf(" ") + 1, c.lastIndexOf("`"))
            }
            throw tmp
        }
    }

    tryRevertColNotEqualsCloases(t) {
        if (t.op === "COL-NOT-EQUALS") {
            throw "`" + t.left + "`" + " != " + "`" + t.right + "`"
        }
    }

    delcloases(idx) {
        this.cloases.splice(idx, 1)
    }

    insertcloases(schema) {
        this.cloases.push({
            "left": schema.length > 0 ? schema[0].title : "",
            "op": "CONTAINS",
            "right": ""
        })
    }

    exec() {

    }

    validations() {
        return true
    }

    revert2Defs() {
        const result = []
        for (let idx = 0; idx < this.cloases.length; ++idx) {
            try {
                const tmp = this.cloases[idx]
                if (tmp["left"].length > 0) {
                    this.tryRevertContainsCloases(tmp)
                    this.tryRevertExistsCloases(tmp)
                    this.tryRevertNotExistsCloases(tmp)
                    this.tryRevertEqualsCloases(tmp)
                    this.tryRevertNotEqualsCloases(tmp)
                    this.tryRevertColEqualsCloases(tmp)
                    this.tryRevertColNotEqualsCloases(tmp)
                }
            } catch(e) {
                result.push(e)
            }
        }
        return result.join(this.action === "AND" ? " and " : " or ")
    }
}
