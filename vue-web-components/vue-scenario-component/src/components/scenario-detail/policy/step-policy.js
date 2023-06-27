
// import { hostName } from "../../../config/envConfig"
// import { Message } from 'element-ui'

export default class PhScenarioStepPolicy {
    constructor(id, projectId = 'ggjpDje0HUC2JW', scenarioName = 'alfredtest') {
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


    // isJSON_test(str, errorStr="json字符串") {
    //     if (typeof str == 'string') {
    //         try {
    //             this.jsonValue = JSON.parse(str);
    //             return true;
    //         } catch(e) {
    //             if(str != "") {
    //                 Message.error( `请输入正确的${errorStr}！`, { duration: 0, showClose: true} )
    //                 return false;
    //             } else {
    //                 return true
    //             }
    //         }
    //     }
    // }

    isJSON_test(value) {
        try {
            var obj = JSON.parse(value);
            if (Object.prototype.toString.call(obj) == '[object Object]' && obj) {
                return false
            } else {
                return true
            }
        } catch (e) {
            return true
        }
    }

    dealStepDisplay(stepArray) {
        let arr = []
        stepArray.forEach(step => {
            let detail = {}
            detail = {
                "type": step.type,
                "recursive": step.recursive,
                "ignore-error": step.ignoreError,
                "name": step.ds
            }
            // step.confData = step.confData ? step.confData : "{}"
            // step.confData = step.confData 
            // let isJSON = this.isJSON_test(step.confData)
            // if(!isJSON) {
            //     // throw new Error("配置参数错误")
            //     Message({
            //         type: 'error',
            //         showClose: true,
            //         duration: 3000,
            //         message: '请修改step参数！'
            //     })
            // }
            // if (step.confData) {
            // arr.push({
            //     confData: JSON.stringify(JSON.parse(step.confData)),
            //     scenarioId: step.scenarioId,
            //     index: step.index,
            //     detail: detail,
            //     traceId: step.traceId,
            //     mode: step.mode,
            //     name: step.name,
            //     id: step.id
            // })
            // } else {
            arr.push({
                confData: step.confData,
                scenarioId: step.scenarioId,
                index: step.index,
                detail: detail,
                traceId: step.traceId,
                mode: step.mode,
                name: step.name,
                id: step.id
            })

        })
        return arr
    }
}
