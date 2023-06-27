import React, {Component, createRef} from "react"
// import "@pharbers-node/react-nested-components"

export default class BridgeComp extends Component {
	// exampleRef = useRef()
	constructor(props) {
		super(props);
		this.exampleRef = createRef()
		this.onEventCallback = props.onEventCallback
	}

	componentDidMount() {
		console.log('alfred test')
		this.exampleRef.current.addEventListener("example-nest-event", (e) => {
			console.log("nest event in react")
			this.onEventCallback(e)
		})
	}

	render() {
		return(
			<div>
				<p>Click on an emoji to view the emoji short name.</p>
				<react-nested-components componentTitle="alfred title" ref={this.exampleRef}></react-nested-components>
			</div>
		)
	}
}
