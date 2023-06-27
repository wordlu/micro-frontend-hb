// eslint-disable-next-line no-unused-vars
export async function pharbersReportListRouteModel(route) {
	let lang = localStorage.getItem("lang")
	if (lang === "中文") {
		lang = 1
	} else {
		lang = 0
	}
	const reportsList = await route.store.query("report", {
		sort: "-date",
		"filter[language]": lang,
		include: "cover"
	})
	this.afterModel = function () {
		if (this.loadingService.afterLoading) {
			this.loadingService.loading.style.display = "none"
		}
	}
	return {
		reportsList: reportsList.filter((it) => it.language === lang)
	}
}
