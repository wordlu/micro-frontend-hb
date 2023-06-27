
export default class PhExcelPreviewSchema {
    constructor(id) {
        this.id = id
        this.schema = []
        this.cols = []
        this.dtype = []
        this.cellWidth = []
        this.cols = this.schema
    }

    resetSchema(schema, dtype, cellWidth) {
        this.schema = schema
        this.dtype = dtype
        this.cellWidth = cellWidth
        this.cols = this.schema
    }

    colWidth(index) {
        return this.cellWidth[index]
    }

    totalWidth() {
        let idx_arr = []
        if(this.cols) {
            for (var idx = 0; idx < this.cols.length; ++idx) {
                const tmp = this.cols[idx]
                idx_arr.push(this.schema.indexOf(tmp))
            }
        }

        let width_arr = []
        for (var iter = 0; iter < idx_arr.length; ++iter) {
            const tmp = idx_arr[iter]
            width_arr.push(this.cellWidth[tmp])
        }

        if (width_arr.length > 0)
            return width_arr.reduce((a, v) => a + v)
        else return 0
    }

    requestSchema(url, arr) {
        return new Promise((resolve, reject) => {
            this.resetSchema(
                arr,
                ["Text", "Text", "Text", "Text", "Text", "Text", "Text", "Text", "Text", "Text", "Text"],
                [118, 118, 118, 118, 118, 118, 118, 118, 118, 118, 118]
            )
            resolve(true)
        })
    }
}
