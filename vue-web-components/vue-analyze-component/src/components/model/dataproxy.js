
export default class PhExcelPreviewProxy {
    constructor(id, datasource, schema) {
        this.id = id
        this.datasource = datasource
        this.schema = schema
    }

    refreshData(ele) {
        this.datasource.proxyRefreshData(ele)
    }
}
