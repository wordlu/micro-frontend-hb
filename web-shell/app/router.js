import EmberRouter from "@ember/routing/router"
import config from "web-shell/config/environment"

export default class Router extends EmberRouter {
    location = config.locationType
    rootURL = config.rootURL
}

Router.map(async function () {
  this.route("shell", { path: "/" })
  this.route("shell", { path: "/*path" })
  this.route('oauth-callback')
})
