
export default class PhStatusModel {
    constructor(resourceId, status, traceId, detail) {
        this.resourceId = resourceId
        this.status = status
        this.switch = false
        this.editable = true
        this.traceId = traceId
        this.detail = detail

        this.resetMessage()
    }

    resetMessage() {
        if (this.status === 0) {
            this.message = "已停止"
        } else if (this.status === 1) {
            this.message = "启动中"
        } else if (this.status === 2) {
            this.message = "已启动"
        } else if (this.status === 4) {
            this.message = "停止中 "
        }
    }
}
