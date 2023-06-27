
import PhExcelPreviewSource from "../previewDatasource"
import PhExcelPreviewSchema from "../previewSchema"

export default class PhCsvFormat {
    constructor(id, file, proxy, delimiter=",") {
        this.id = id
        this.batchSize = 10     // 显示条目
        this.bufferSize = 100   // 缓存条目
        this.destinationBufferSize = 50000      // 一次性上传的最大条目
        this.file = file
        this.data = []
        this.delimiter = delimiter
        this.left = ""
        this.proxy = proxy

        this.reader = this.file.stream().getReader()
        this.reader.read().then(value => this.resetDataEvent(value))

        this.datasource = new PhExcelPreviewSource(id)
        this.schema = new PhExcelPreviewSchema(id)
        this.skipFirstLines = 0
        this.skipNextLines = 0
        this.headerLine = 0

        this.schemaArray = []
    }

    getDatasource() {
        return this.datasource
    }

    getSchema() {
        return this.schema
    }

    getSkipFirstLines() {
        return this.skipFirstLines
    }

    getSkipNextLines() {
        return this.skipNextLines
    }

    getSheetNames() {
        return ["csv"]
    }

    getCurrentSheetName() {
        return "csv"
    }

    getType() {
        return "csv"
    }

    resetDataEvent(v) {
        const text = this.left + new TextDecoder("utf-8").decode(v.value)
        const lastIndex = text.lastIndexOf("\n")
        this.left = text.substring(lastIndex + 1)
        const lines = text.substring(0, lastIndex).split(/\r\n|\n/)
        for (let idx = 0; idx < lines.length; ++idx) {
            this.data.push(lines[idx].split(this.delimiter))
        }
        if (this.data.length < this.bufferSize) {
            this.reader.read().then(value => this.resetDataEvent(value))
        } else {
            this.__headerRefresh()
            this.__dataRefresh()
            this.proxy.readyCallback(this.id)
        }
    }

    __headerRefresh() {
        const header = [...this.data[this.headerLine]]
        const colsLength = header.length

        let idx = 0
        for (let tmp = 0; tmp < colsLength; ++tmp) {
            if (header[tmp] === "") {
                header[tmp] = "col_" + idx.toString()
                idx += 1
            }
        }

        const dtype = new Array(colsLength).fill("Text")
        const colsWidth = new Array(colsLength).fill(118)
        this.schemaArray = []
        header.forEach(item => {
            this.schemaArray.push({
                src: item ? item.replace(/["'“”‘’]/g, "_") : item,
                des: item ? item.replace(/["'“”‘’]/g, "_") : item,
                type: "String"
            })
        })
        this.schemaArray.push({
            src: "version",
            des: "version",
            type: "String"
        })
        this.schema.resetSchema(header, dtype, colsWidth)
    }

    __dataRefresh() {
        const startPos = this.skipFirstLines + 1 + this.skipNextLines
        const endPos = this.skipFirstLines + 1 + this.skipNextLines + this.batchSize
        this.datasource.resetData(this.data.slice(startPos, endPos))
    }

    setSkipFirstLines(v) {
        this.skipFirstLines = v
        this.headerLine = v
        this.__headerRefresh()
        this.__dataRefresh()
    }

    setSkipNextLines(v) {
        this.skipNextLines = v
        this.__headerRefresh()
        this.__dataRefresh()
    }

    setCurrentSheet(v) {
        // Do nothing ...
        console.log(v)
    }

    uploadCurrentData(destination, to) {
        if (!to) {
            to = this.file.name
        }

        const that = this
        const reader = this.file.stream().getReader()
        let left = ""
        let stepData = []

        function text2Data(t, d) {
            const lastIndex = t.lastIndexOf("\n")
            left = t.substring(lastIndex + 1)
            const lines = t.substring(0, lastIndex).split(/\r\n|\n/)
            for (let idx = 0; idx < lines.length; ++idx) {
                const tmp = lines[idx].split(that.delimiter)
                d.push(tmp)
            }
        }

        async function stepDataProcessor(v, n=0) {
            const text = left + new TextDecoder("utf-8").decode(v.value)
            text2Data(text, stepData)

            if (stepData.length > that.destinationBufferSize) {
                // TODO: @wodelu 加入skip lines 的逻辑
                if (n === 0) {
                    const startPos = that.skipFirstLines + 1 + that.skipNextLines
                    // const endPos = that.skipFirstLines + 1 + that.skipNextLines + that.batchSize
                    const endPos = stepData.length
                    stepData = stepData.slice(startPos, endPos)
                }
                await destination.upload(stepData, to, new Date().getTime())
                stepData = []
                ++n
            }

            if (!v.done) {
                that.proxy.uploadProgress("uploading")
                reader.read().then(x => stepDataProcessor(x, n))
            } else {
                text2Data(left, stepData)
                await destination.upload(stepData, to, new Date().getTime())
                that.proxy.uploadProgress("uploading ended")
            }
        }

        that.proxy.uploadProgress("uploading started")
        reader.read().then(x => stepDataProcessor(x))
    }
}
