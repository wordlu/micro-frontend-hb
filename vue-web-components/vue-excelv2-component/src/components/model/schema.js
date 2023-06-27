
export default class PhExcelDataSchema {
    constructor(id) {
        this.id = id
        this.schema = []
        this.cols = []
        this.dtype = []
        this.cellWidth = []
        // this.schema = ["Index", "Id", "Hospname", "Province", "City", "lHospname", "lHospalias", "lDistrict", "lLevel", "lCat", "lOffweb"]
        // this.dtype= ["Text", "Text", "Text", "Text", "Text", "Text", "Text", "Text", "Text", "Text", "Text"]
        // this.cellWidth= [118, 118, 118, 118, 118, 118, 118, 118, 118, 118, 118]
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
        if (this.cellWidth.length > 0)
            return this.cellWidth.reduce((a, v) => a + v)
        else return 0
    }

    requestSchema(url, arr) {
        return new Promise((resolve, reject) => {
            this.resetSchema(
                ["Index", "Id", "Hospname", "Province", "City", "lHospname", "lHospalias", "lDistrict", "lLevel", "lCat", "lOffweb"],
                ["Text", "Text", "Text", "Text", "Text", "Text", "Text", "Text", "Text", "Text", "Text"],
                [118, 118, 118, 118, 118, 118, 118, 118, 118, 118, 118]
            )
            resolve(true)
        })
    }
}
