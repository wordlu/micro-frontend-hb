import Application from "@ember/application"
import Resolver from "ember-resolver"
import loadInitializers from "ember-load-initializers"
import config from "dummy/config/environment"
import { defineCustomElements } from "@pharbers-node/ember-cli-web-components"

export default class App extends Application {
	modulePrefix = config.modulePrefix
	podModulePrefix = config.podModulePrefix
	Resolver = Resolver
	LOG_RESOLVER = true
}

loadInitializers(App, config.modulePrefix)

defineCustomElements({
	"example-web-component": {
		name: "example-web-component",
		attributes: ["componentTitle"]
	}
})
