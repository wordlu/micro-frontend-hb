import { helper } from "@ember/component/helper"

export default helper(function tbcNavInverse(arr, cur) {
	return arr.includes(cur)
})
