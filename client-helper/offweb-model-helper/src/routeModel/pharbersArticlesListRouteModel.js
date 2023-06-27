// eslint-disable-next-line no-unused-vars
export async function pharbersArticlesListRouteModel(route) {
	let lang = localStorage.getItem("lang")
	if (lang === "中文") {
		lang = 1
	} else {
		lang = 0
	}
	const articlesList = await route.store.query("article", { sort: "-date" })
	console.log(articlesList)
	return {
		articlesList: articlesList.filter((it) => it.avatar && it.avatar !== "")
	}
}
