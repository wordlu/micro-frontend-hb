
// import { hostName } from "../../../config/envConfig"

export default class PhScenarioTriggerPolicy {
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

	dealTriggerDisplay(triggerArray) {
		let arr = []
		triggerArray.forEach(trigger => { 
			let detail = {}
            if(trigger.mode == 'timer'){
                detail = {
                    "timezone": trigger.timezone,
                    "cron": trigger.cron,
                    "start": trigger.start,
                    "period": trigger.period,
                    "value": trigger.value
                }
            }else{
                detail = {
                    "dsNames": trigger.dsNames.map(it => it.name)
                }
            }
			
			arr.push({
				scenarioId: trigger.scenarioId,
				id: trigger.id,
				index: trigger.index,
				active: trigger.active,
				detail: detail,
				mode: trigger.mode,
				traceId: trigger.traceId,
                name: trigger.name
			})
		})
		return arr
	}
}
