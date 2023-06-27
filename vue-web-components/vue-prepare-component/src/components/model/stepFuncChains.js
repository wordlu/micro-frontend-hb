
export class FunctionChains {
    chains() {
        if (!this._chains)
            this._chains = []
        return this._chains
    }

    push(cat, bindKey, bindValue) {
        switch (cat) {
            case "filter-eq":
                this.chains().push(new eqFilterValueFunctionStep(bindKey, bindValue))
                break
            default:
                throw new Error("Not Implemented")
        }
        return this
    }

    exec(rowValue, schema) {
        let result = true
        for (let idx = 0; idx < this.chains().length; ++idx) {
            result &= this.chains()[idx].exec(rowValue, schema)
            if (!result) break
        }
        return result
    }

}

export class FunctionStep {
    constructor(bindKey, bindValue) {
        this._key = bindKey
        this._val = bindValue
    }

    // eslint-disable-next-line no-unused-vars
    exec(rowValue, schema) {
        throw new Error("Not Implemented")
    }
}

export class eqFilterValueFunctionStep extends FunctionStep {
    exec(rowValue, schema) {
        let result = false
        if (schema.schema.includes(this._key)) {
            const idx = schema.schema.indexOf(this._key)
            const curValue = rowValue[idx]
            result = curValue.toString() === this._val.toString()
        }
        return result
    }
}
