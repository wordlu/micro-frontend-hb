
export default class PhEngineModel {
    constructor(dict) {
        this.role = dict["role"]
        this.ctype = dict["ctype"]
        this.owner = dict["owner"]
        this.ownership = dict["ownership"]
        this.platform = dict["platform"]

        this.metadata = JSON.parse(dict["properties"])[0]
        this.applicationType = this.metadata["type"]
        this.applicationVersion = this.metadata["version"]
        this.applicationLabels = this.parseLabels(this.metadata["label"])

        this.masterMachineType = this.metadata["parameters"]["MasterInstanceType"]
        this.masterMachineVCore = 8
        this.masterMachineCount = 1
        this.masterMachineMem = 32
        this.masterRootVolumeStorage = this.metadata["parameters"]["RootVolumeSize"]
        this.masterVolumeStorage = this.metadata["parameters"]["MasterStorage"]
        this.masterVolumeStorageCount = 1

        this.coreMachineType = this.metadata["parameters"]["MasterInstanceType"]
        this.coreMachineVCore = 8
        this.coreMachineMinCount = this.metadata["parameters"]["InitialCoreSize"]
        this.coreMachineMaxCount = this.metadata["parameters"]["MaxCoreSize"]
        this.coreMachineMem = 32
        this.coreRootVolumeStorage = this.metadata["parameters"]["RootVolumeSize"]
        this.coreVolumeStorage = this.metadata["parameters"]["CoreStorage"]
        this.coreVolumeStorageCount = 4

        this.taskMachineType = this.metadata["parameters"]["TaskInstanceType"]
        this.taskMachineVCore = 8
        this.taskMachineMinCount = this.metadata["parameters"]["InitialTaskSize"]
        this.taskMachineMaxCount = this.metadata["parameters"]["MaxTaskSize"]
        this.taskMachineMem = 32
        this.taskRootVolumeStorage = this.metadata["parameters"]["RootVolumeSize"]
        this.taskVolumeStorage = this.metadata["parameters"]["TaskStroage"]
        this.taskVolumeStorageCount = 4
    }

    parseLabels(dict) {
        const result = []
        for (let idx = 0; idx < Object.keys(dict).length; ++idx) {
            const k = Object.keys(dict)[idx]
            const v = dict[k]
            result.push([k, v].join(" : "))
        }
        return result
    }
}
