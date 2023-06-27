import { staticFilePath } from "../../../config/envConfig"

export default class PhDagDefinitions {
    constructor(id) {
        this.id = id
    }

    iconsByName(name, status='normal', suffix='.svg') {
        return `${staticFilePath}` + "/icons/" + name + "/" + status + suffix
    }
}
