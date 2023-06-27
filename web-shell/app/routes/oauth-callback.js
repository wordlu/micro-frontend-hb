import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class OauthCallbackRoute extends Route {
	@service oauthService;
	@service router

	beforeModel( transition ) {
		this.oauthService.oauthCallback( transition )
		throw Error
	}
}
