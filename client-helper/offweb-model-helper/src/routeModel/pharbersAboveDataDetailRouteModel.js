// eslint-disable-next-line no-unused-vars
export async function pharbersAboveDataDetailRouteModel(route, parseParams) {
	let lang = localStorage.getItem("lang")
	if (lang === "中文") {
		lang = 1
	} else {
		lang = 0
	}
	const id = parseParams.param.activity_id
	// filter activity type
	const activityList = route.store.query("activity", {
		"filter[activityType]": "Above Data",
		"filter[language]": lang,
		"page[limit]": 1,
		"page[offset]": id,
		sort: "-startDate",
		include: "agendas"
	})

	// get zones
	const zoneList = activityList.then((x) => {
		const zidsArr = x.map((activity) => {
			return activity.hasMany("agendas").ids()
		})
		const ids = [
			...new Set(zidsArr.reduce((acc, val) => acc.concat(val), []))
		]
		ids.push("") //todo
		return route.store.query("zone", { "ids[]": ids })
	})

	// get events
	const eventList = zoneList.then((x) => {
		const eidArr = x.map((activity) => {
			return activity.hasMany("agendas").ids()
		})
		const ids = [
			...new Set(eidArr.reduce((acc, val) => acc.concat(val), []))
		]
		return route.store.query("event", { "ids[]": ids })
	})
	// get participant
	const participantList = eventList.then((x) => {
		const pidArr = x.map((event) => {
			return event.hasMany("speakers").ids()
		})
		const ids = [
			...new Set(pidArr.reduce((acc, val) => acc.concat(val), []))
		]
		return route.store.query("participant", { "ids[]": ids })
	})
	// get images
	const imageList = participantList.then((x) => {
		const idArr = x.map((event) => {
			return event.belongsTo("avatar").id()
		})
		return route.store.query("image", { "ids[]": idArr })
	})
	const imageIds = participantList.then((x) => {
		const isArr = x.filter((it) => it.language === lang)
		const idArr = isArr.map((event) => {
			return event.belongsTo("avatar").id()
		})
		return idArr
	})
	// get gallery
	const galleryList = activityList.then((x) => {
		const idArr = x.map((activity) => {
			return activity.hasMany("gallery").ids()
		})
		const ids = [
			...new Set(idArr.reduce((acc, val) => acc.concat(val), []))
		]
		return route.store.query("image", { "ids[]": ids })
	})
	// get gallery show,six photos
	const galleryShow = galleryList.then((x) => {
		let obj = {}
		x.filter(function (ele) {
			switch (ele.tag) {
				case "galleryshow-a":
					obj["a"] = ele.path
					break
				case "galleryshow-b":
					obj["b"] = ele.path
					break
				case "galleryshow-c":
					obj["c"] = ele.path
					break
				case "galleryshow-d":
					obj["d"] = ele.path
					break
				case "galleryshow-e":
					obj["e"] = ele.path
					break
				case "galleryshow-f":
					obj["f"] = ele.path
					break
				default:
					break
			}
		})
		return [obj]
	})
	this.afterModel = function () {
		if (this.loadingService.afterLoading) {
			this.loadingService.loading.style.display = "none"
		}
	}
	let results = await Promise.all([
		activityList,
		zoneList,
		eventList,
		participantList,
		imageList,
		imageIds,
		galleryList,
		galleryShow
	])

	let image = []
	let participantListAll = []
	let eventListAll = []
	let imageLists = results[4].filter((it) => it.path != "")
	let participantLists = results[3].filter((it) => it.language === lang)
	let eventLists = results[2].filter((it) => it.title != "")
	for (let x = 0; x < imageLists.length; x++) {
		image[x] = imageLists.filter((it) => results[5][x].indexOf(it.id) != -1)
	}
	for (let i = 0; i < participantLists.length; i++) {
		participantListAll[i] = {
			participant: participantLists[i],
			image: image[i][0]
		}
	}
	for (let x = 0; x < eventLists.length; x++) {
		eventLists[x].speakers.then((a) => {
			eventListAll[x] = {
				eventList: eventLists[x],
				speaker: a.firstObject ? a.firstObject.name : ""
			}
		})
	}

	return {
		data: results[0].filter((it) => it.language === lang),
		agendas: results[1].filter((it) => it),
		eventList: eventLists,
		participantList: participantLists,
		imageList: imageLists,
		imageIds: results[5],
		cover: results[6].find((it) => it.tag === "cover"),
		galleryList: results[6].filter((it) => it.path != ""),
		galleryShow: results[7],
		index: id,
		participantListAll: participantListAll,
		eventListAll: eventListAll
	}
}
