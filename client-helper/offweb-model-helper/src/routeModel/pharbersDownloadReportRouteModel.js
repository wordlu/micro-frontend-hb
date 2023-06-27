// eslint-disable-next-line no-unused-vars
export async function pharbersDownloadReportRouteModel(route, parseParams) {
	let lang = localStorage.getItem("lang")
	if (lang === "中文") {
		lang = 1
	} else {
		lang = 0
	}
	const id = parseParams.param.report_id
	const reportsList = await route.store.query("report", {
		"filter[language]": lang,
		"page[limit]": 1,
		"page[offset]": id,
		sort: "-date",
		include: "cover"
	})
	this.afterModel = function () {
		if (this.loadingService.afterLoading) {
			this.loadingService.loading.style.display = "none"
		}
	}
	return {
		reports: reportsList.filter((it) => it.language === lang)
	}
}
