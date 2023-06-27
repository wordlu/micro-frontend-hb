import Component from "@glimmer/component"
import { action } from "@ember/object"

export default class ExampleWebComponentComponent extends Component {
	@action
	handleClick() {
		console.log("alfred test")
		const event = new Event("example-event")
		this.args.eventContext.dispatchEvent(event)
	}
}
