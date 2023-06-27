
export default class PhDlgVersionController {
    constructor(id) {
        this.selectVersionTags = []
        this.versionCandidates = []
    }

    appendSelectVersionTags(tag) {
        //选择行去重
        let setArr = new Set(this.selectVersionTags).add(tag)
        this.selectVersionTags = Array.from(setArr)
    }

    removeSelectVersionTags(tag) {
        this.selectVersionTags = this.selectVersionTags.filter(function(item) {
            return item !== tag
        });
    }
	
}
