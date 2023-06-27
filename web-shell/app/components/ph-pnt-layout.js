import Component from "@glimmer/component"
import { action } from "@ember/object"
import { tracked } from "@glimmer/tracking"
import { inject as service } from "@ember/service"

export default class PhPntLayoutComponent extends Component {
	@service cookies
	@service router
	@tracked projectName
	@tracked projectId
	@service("resource-action-service") resourceActionService

	get navComponent() {
		if (this.args.navComponent) {
			return this.args.navComponent
		} else return "ph-analyze-bp-nav-top-max"
	}

	get checkResource() {
		return this.resourceActionService.checkStarted()
	}

	@action
	async listener(e) {
		switch (e.detail[0].args.callback) {
			case "linkToPage":
				let params = e.detail[0].args.param
				let uri = ""
				if (
					this.checkResource &&
					params.name !== "projects" &&
					params.name !== "project"
				) {
					alert("请先启动项目资源！")
					return false
				}
				if (params.name === "projects") {
					window.open(`https://general.hubadata.com/projects`)
				} else {
					if (params.name === "project") {
						//返回project
						uri = `projects/${this.projectId}?projectName=${this.projectName}&projectId=${this.projectId}`
					} else if (params.name == "datasets") {
						uri =
							"dataset-lst?projectName=" +
							this.projectName +
							"&projectId=" +
							this.projectId
					} else if (params.name === "scripts") {
						uri =
							"recipes?projectName=" +
							this.projectName +
							"&projectId=" +
							this.projectId
					} else if (params.name == "flow") {
						uri =
							"flow?projectName=" +
							this.projectName +
							"&projectId=" +
							this.projectId
					} else if (params.name == "airflow") {
						uri =
							"airflow?projectName=" +
							this.projectName +
							"&projectId=" +
							this.projectId
					} else if (params.name == "dashboards") {
						uri =
							"dashboards?projectName=" +
							params.projectName +
							"&projectId=" +
							params.projectId
					} else if (params.name == "executions") {
						uri =
							"executions?projectName=" +
							params.projectName +
							"&projectId=" +
							params.projectId
					} else if (params.name == "scenarios") {
						uri =
							"scenarios?projectName=" +
							params.projectName +
							"&projectId=" +
							params.projectId
					}
					this.router.transitionTo("shell", uri)
				}
				break
			default:
				console.log("other click event!")
		}
	}

	@action
	registerListener(element) {
		let paramArr = window.location.href.split("?")[1].split("&")
		this.projectId = this.getUrlParam(paramArr, "projectId")
		this.projectName = this.getUrlParam(paramArr, "projectName")
		element.allData = {
			projectName: this.projectName,
			projectId: this.projectId,
			_isVue: true
		}
		element.addEventListener("event", this.listener)
	}

	@action
	getUrlParam(arr, value) {
		let data = arr.find((item) => item.indexOf(value) > -1)
		return data ? decodeURI(data).split("=")[1] : undefined
	}

	@action
	unregisterListener(element) {
		element.removeEventListener("event", this.listener)
	}
}
