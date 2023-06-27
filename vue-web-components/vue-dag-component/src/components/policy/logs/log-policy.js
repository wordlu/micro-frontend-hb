// import { staticFilePath, hostName } from "../../config/envConfig"

export default class PhLogsPolicy {
    constructor(id, parent) {
        this.id = id
        this.parent = parent
    }

    showLogs(data) {
        window.open(`http://deploy.hubadata.com/executions-logs?projectName=${this.parent.projectName}&projectId=${this.parent.projectId}&jobName=${data.jobName}&runnerId=${data.runnerId}`)
    }
}
