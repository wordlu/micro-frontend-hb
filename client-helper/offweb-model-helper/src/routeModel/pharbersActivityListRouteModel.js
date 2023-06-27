// eslint-disable-next-line no-unused-vars
export async function pharbersActivityListRouteModel(route) {
	let lang = localStorage.getItem("lang")
	if (lang === "中文") {
		lang = 1
	} else {
		lang = 0
	}
	const activityList = route.store.query("activity", {
		"filter[language]": lang,
		sort: "-startDate"
	})
	const galleryList = activityList.then(() => {
		return route.store.query("image", { "filter[tag]": "cover" })
	})
	const galleryIds = activityList.then((x) => {
		const isArr = x.filter((it) => it.language === lang)
		const idArr = isArr.map((activity) => {
			return activity.hasMany("gallery").ids()
		})
		return idArr
	})
	this.afterModel = function () {
		if (this.loadingService.afterLoading) {
			this.loadingService.loading.style.display = "none"
		}
	}
	let results = await Promise.all([activityList, galleryList, galleryIds])
	let data = results[0].filter((it) => it.language === lang)
	let gallery = []
	let dataAll = []
	this.tabIndex = 0
	for (let x = 0; x < results[1].length; x++) {
		gallery[x] = results[1].filter(
			(it) => results[2][x].indexOf(it.id) != -1
		)
	}
	for (let i = 0; i < data.length; i++) {
		dataAll[i] = {
			activity: data[i],
			image: gallery[i][0]
		}
	}
	this.allData = {
		byhData: dataAll.filter(
			(it) => it.activity.activityType === "boyunhui"
		),
		AboveData: dataAll.filter(
			(it) => it.activity.activityType === "Above Data"
		),
		industryData: dataAll.filter(
			(it) => it.activity.activityType === "industry"
		)
	}
	return this.allData
}
