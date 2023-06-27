import Component from "@glimmer/component"

export default class ShellComponentComponent extends Component {
	/**
	 * 3. 动态加载Component, 这里的作用是将事件利用Event隔离
	 */
	get engine() {
		return this.args.model.page.engine
	}

	get name() {
		return this.args.model.page.name
	}
}
