// eslint-disable-next-line no-unused-vars
export async function pharbersHomeRouteModel(route) {
	let lang = localStorage.getItem("lang")
	if (lang === "中文") {
		lang = 1
	} else {
		lang = 0
	}
	const activityList = route.store.query("activity", {
		sort: "-startDate",
		"page[limit]": 3,
		"page[offset]": 0,
		"filter[language]": lang,
		include: "logo,gallery"
	})

	const reportsList = route.store.query("report", {
		sort: "-date",
		"page[limit]": 1,
		"filter[language]": lang,
		include: "cover"
	})

	const articlesList = route.store.query("article", {
		sort: "-date"
	})

	const homeArticles = [
		"第五轮VBP，内外资企业不同之伤！",
		"法伯科技重磅发布《VBP政策下的用药分析》",
		"看国谈已执行品种是否获益，新版医保谈判目录如何变化"
	]

	let results = await Promise.all([activityList, reportsList, articlesList])
	return {
		activities: results[0].filter((it) => it.language === lang),
		reports: results[1].filter((it) => it.language === lang),
		articles: results[2].filter((it) => homeArticles.indexOf(it.title) > -1)
	}
}
