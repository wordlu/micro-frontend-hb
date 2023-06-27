
export default class PhDlgCollectionController {
    constructor(id) {
        this.collections = []
        this.shownCollections = []
        this.selectCollections = []
        this.sortCollections = []
        this.isIndeterminate = false //check-all的不确定状态
        this.checkAll = true
    }

    resetCollections(cols) {
        this.collections = cols
        this.shownCollections = this.collections
        this.selectCollections = this.collections
    }

    resetSortCollections() {
        if (this.sortCollections.length !== 0) {
            this.shownCollections = this.shownCollections.filter(x => this.sortCollections.indexOf(x) === -1)
        }
    }

    resetShowingCollections() {
        if (this.selectCollections.length === 0) {
            return this.collections
        } else {
            return this.selectCollections
        }
    }

    checkAllCollections(val) {
        // this.selectCollections = val ? this.collections : [];
        this.selectCollections = val ? this.shownCollections: [];
        this.isIndeterminate = false;
    }
    // 选中多选框
    checkCollectionsItem(val) {
        let checkedCount = val.length;
        this.checkAll = checkedCount === this.shownCollections.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.collections.length;
    }

    filterCollectionsByChar(val) {
        if (val.length > 0)
        // this.shownCollections = this.collections.filter(x => x.startsWith(val))
            this.shownCollections = this.collections.filter(x => x.indexOf(val) > -1)
        else {
            this.shownCollections = this.collections
        }
    }

    pushSortCols(val) {
        this.shownCollections = this.shownCollections.filter(x => x !== val)
        this.sortCollections.push(val)
    }

    popSortCols(val) {
        this.sortCollections = this.sortCollections.filter(x => x !== (val))
        this.shownCollections.push(val)
    }

    clearShownCollectionFilter() {
        this.shownCollections = this.collections
    }
}
