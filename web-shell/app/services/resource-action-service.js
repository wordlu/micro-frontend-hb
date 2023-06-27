import Service from '@ember/service';
import { tracked } from '@glimmer/tracking'

export default class ResourceActionServiceService extends Service {
	@tracked boolChecked = false
	// project home页面判断资源是否启动，并通知顶部导航栏状态
	checkStarted() {
		return this.boolChecked
	}
}
