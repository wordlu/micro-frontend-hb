import Service from "@ember/service"
import { computed } from "@ember/object"

// eslint-disable-next-line ember/no-classic-classes
export default Service.extend({
	loading: document.getElementById(
		"loadingio-spinner-double-ring-ho1zizxmctu"
	),
	body: document.getElementsByTagName(
		"body"
	),
	beforeLoading: function() {
		this.loading.style["display"] = "flex"
		this.loading.style["z-index"] = 2
		this.body[0].style["overflow"] = "hidden"
	},
	afterLoading: function () {
		const server = setTimeout(() => {
			if(document.readyState === 'complete' || document.readyState === 'interactive') {
				this.loading.style["display"] = "none"
				this.loading.style["z-index"] = 2
				this.body[0].style["overflow"] = "auto"
				clearInterval(server)
			}
		},100)
	}
})
