
// import { hostName } from "../../../config/envConfig"

export default class PhScenarioReportPolicy {
    constructor(id, projectId='ggjpDje0HUC2JW', scenarioName='alfredtest') {
        this.id = id
        this.projectId = projectId
        this.scenarioName = scenarioName
        this.debugToken = "dae3d1540184499768c8efc58713565349ed36735db0f4566d824604c6b07e20"
    }

    getCookie(name) {
        let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr === document.cookie.match(reg))
            return (arr[2]);
        else
            return null;
    }

	dealReportDisplay(reportArray) {
		let arr = []
		reportArray.forEach(report => {
			let detail = {}
			detail = {
                "type": report.type,
                "destination": report.destination
            }
			arr.push({
				scenarioId: report.scenarioId,
				id: report.id,
				index: report.index,
				active: report.active,
				detail: detail,
				// mode: report.mode,
				traceId: report.traceId,
                name: report.name,
                mode: report.mode
			})
		})
		return arr
	}
}
