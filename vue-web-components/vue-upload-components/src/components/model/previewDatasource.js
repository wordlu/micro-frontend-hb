

export default class PhExcelPreviewSource {
    constructor(id) {
        this.id = id
        this.data = []
        this.batch_size = 10
        this.name = "not Implemented"
    }

    resetData(data) {
        this.data = data
        this.batch_size = data.length
    }

    refreshData(ele) {
        ele.data = this.data
        ele.dataIsReady++
    }

    queryTotalCount() {
        let that = this
        return new Promise((resolve) => {
            resolve(that.batch_size)
        })
    }
}
