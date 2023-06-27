// eslint-disable-next-line no-unused-vars
export async function pharbersBoyunhuiRouteModel(route, parseParams) {
	let lang = localStorage.getItem("lang")
	if (lang === "中文") {
		lang = 1
	} else {
		lang = 0
	}
	const id = parseParams.param.boyunhui_id
	const activityList = route.store.query("activity", {
		"filter[activityType]": "boyunhui",
		"filter[language]": lang,
		"page[limit]": 1,
		"page[offset]": id,
		sort: "-startDate",
		include: "gallery"
	})
	const reportList = route.store.query("report", {
		"filter[language]": lang,
		"page[limit]": 1,
		"page[offset]": id,
		sort: "-date",
		include: "cover"
	})
	//get zones
	const zoneList = activityList.then((x) => {
		const zidsArr = x.map((activity) => {
			return activity.hasMany("agendas").ids()
		})
		const ids = [
			...new Set(zidsArr.reduce((acc, val) => acc.concat(val), []))
		]
		return route.store.query("zone", { "ids[]": ids })
	})
	//get events
	const eventList = zoneList.then((x) => {
		const eidArr = x.map((zone) => {
			return zone.hasMany("agendas").ids()
		})
		const ids = [
			...new Set(eidArr.reduce((acc, val) => acc.concat(val), []))
		]

		return route.store.query("event", { "ids[]": ids })
	})
	//get hosts
	let hostIds = []
	const hostList = zoneList.then((x) => {
		const hostArr = x.map((zone) => {
			return zone.hasMany("hosts").ids()
		})
		hostIds = [
			...new Set(hostArr.reduce((acc, val) => acc.concat(val), []))
		]

		return route.store.query("participant", { "ids[]": hostIds })
	})

	//get participant
	const participantList = eventList.then((x) => {
		const pidArr = x.map((event) => {
			return event.hasMany("speakers").ids()
		})
		pidArr.push(hostIds)
		const ids = [
			...new Set(pidArr.reduce((acc, val) => acc.concat(val), []))
		]
		return route.store.query("participant", { "ids[]": ids })
	})

	//get days
	const activityDays = await zoneList.then((x) => {
		let days = x.map((it) => {
			return it.subTitle
		})
		let arr = [...new Set(days.reduce((acc, val) => acc.concat(val), []))]
		//日期升序排序
		return arr.sort(function (a, b) {
			return Date.parse(a) - Date.parse(b)
		})
	})

	let allZone = []

	activityDays.forEach(async function (day, i) {
		allZone[i] = await zoneList.then((x) =>
			x.filter((it) => it.subTitle === day)
		)
	})

	// // get images
	const imageList = participantList.then((x) => {
		const idArr = x.map((event) => {
			return event.belongsTo("avatar").id()
		})
		const ids = [
			...new Set(idArr.reduce((acc, val) => acc.concat(val), []))
		].filter((x) => x)
		return route.store.query("image", { "ids[]": ids })
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

	const cooperationList = activityList.then((x) => {
		const cidsArr = x.map((activity) => {
			return activity.hasMany("partners").ids()
		})
		const ids = [
			...new Set(cidsArr.reduce((acc, val) => acc.concat(val), []))
		]
		return route.store.query("cooperation", { "ids[]": ids })
	})

	const cooperationLogoList = cooperationList.then((x) => {
		const cidsArr = x.map((cooperation) => {
			return cooperation.belongsTo("logo").id()
		})
		const ids = [
			...new Set(cidsArr.reduce((acc, val) => acc.concat(val), []))
		]
		return route.store.query("image", { "ids[]": ids })
	})
	this.afterModel = function () {
		if (this.loadingService.afterLoading) {
			this.loadingService.loading.style.display = "none"
		}
	}
	let results = await Promise.all([
		activityList,
		reportList,
		zoneList,
		eventList,
		hostList,
		participantList,
		activityDays,
		imageList,
		galleryList,
		galleryShow,
		cooperationList,
		cooperationLogoList
	])
	let participants = results[5].filter((it) => it.language === lang)
	let nameArr = []
	if (lang === 1) {
		nameArr = [
			"郭云沛",
			"梁万年",
			"胡大洋",
			"王丽敏",
			"蒋孙明",
			"王威",
			"庞成林",
			"张华",
			"连春玲",
			"徐海瑛",
			"张文杰",
			"任波",
			"颜国伟",
			"薛林桐",
			"陆鹏",
			"刘运霆",
			"赵东锷",
			"姚滇",
			"王锐",
			"罗志勇",
			"黄奕",
			"张志强",
			"王桢",
			"李勇",
			"黄靖昱",
			"何树真",
			"吴谨伊",
			"李贤",
			"王兴国",
			"周生来",
			"舒展",
			"赵子昂"
		]
	} else {
		nameArr = [
			"Yunpei GUO",
			"Wannian LIANG",
			"Dayang HU",
			"Limin WANG",
			"Sunming JIANG",
			"Wei WANG",
			"Chenglin PANG",
			"Hua ZHANG",
			"Crystal LIAN",
			"Haiying Xu",
			"Wenjie Zhang",
			"Bo REN",
			"Guowei YAN",
			"Lintong XUE",
			"Peng LU",
			"Yunting LIU",
			"Donge ZHAO",
			"Dian YAO",
			"Rui WANG",
			"Zhiyong Luo",
			"Yi HUANG",
			"Zhiqiang ZHANG",
			"Zhen WANG",
			"Yong LI",
			"Jingyu HUANG",
			"Shuzhen He",
			"Jinyi WU",
			"Xian LI",
			"Shenglai ZHOU",
			"Xingguo WANG",
			"Zhan SHU",
			"Ziang ZHAO"
		]
	}
	const sortFunc = (propName, referArr) => {
		return (prev, next) => {
			return (
				referArr.indexOf(prev[propName]) -
				referArr.indexOf(next[propName])
			)
		}
	}
	const nameList = participants.filter((it) => {
		return it.avatar.get("path") != undefined
	})
	nameList.sort(sortFunc("name", nameArr))
	// logo图片排序
	const logoArr = ["cphmra", "法伯科技", "中国县域医院院长联盟"]
	let cooperationListB = results[10]
		.filter((it) => it.companyType === "主办单位" && it.language === lang)
		.sort(sortFunc("name", logoArr))

	return {
		activitys: results[0].filter((it) => it.language === lang),
		reportList: results[1].filter((it) => it.language === lang),
		zoneList: results[2].filter((it) => it),
		eventList: results[3].filter((it) => it.language === lang),
		hostList: results[4].filter((it) => it),
		participants: participants,
		activityDays: results[6],
		imageList: results[7].filter((it) => it),
		galleryList: results[8].filter((it) => it.path != ""),
		galleryShow: results[9],
		cooperationListA: results[10].filter(
			(it) => it.companyType === "指导单位" && it.language === lang
		),
		cooperationListB: cooperationListB,
		cooperationLogoList: results[11],
		allZone: allZone,
		index: id,
		participantsImageList: nameList
	}
}
