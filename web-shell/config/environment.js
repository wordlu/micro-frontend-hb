"use strict"

module.exports = function (environment) {
	let ENV = {
		modulePrefix: "web-shell",
		environment,
		rootURL: "/",
		locationType: "auto",
		EmberENV: {
			FEATURES: {
				// Here you can enable experimental features on an ember canary build
				// e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
			},
			EXTEND_PROTOTYPES: {
				// Prevent Ember Data from overriding Date.parse.
				Date: false
			}
		},

		APP: {
			// Here you can pass flags/options to your application instance
			// when it is created
			redirectUri: "https://general.hubadata.com/oauth-callback",
			redirectClientId: "V5I67BHIRVR2Z59kq-a-",
			pharbersUri: "https://www.hubadata.com",
			accountsUri: "https://accounts.hubadata.com",
			host: "https://oauth.hubadata.com",
			// apiUri: "https://api.hubadata.com",
			apiUri: "https://api.hubadata.com",
			apiUriDev: "https://api.hubadata.com",
			apiHost: "api.hubadata.com",
			/* offweb */
			// clientId: "fjjnl2uSalHTdrppHG9u",
			// clientName: "offweb",
			/* general */
			// clientId: "V5I67BHIRVR2Z59kq-a-",
			// clientName: "platform",
			/* deploy */
			clientId: "rB9jOc347FswXebo",
			clientName: "project",
			/* 发布 */
			// clientId: "replaceClientId",
			// clientName: "replaceClientName",
			auth: true, //需要登录（目前只有官网不需要登录）
			typeArray: ["activity", "cooperation", "event", "image", "page", "participant", "report", "zone", "layout", "article"],
			clientSecret:
				"961ed4ad842147a5c9a1cbc633693438e1f4a8ebb71050d9d9f7c43dbadf9b72",
			AWS_ACCESS_KEY: "AKIAWPBDTVEAI6LUCLPX",
			AWS_SECRET_KEY: "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",
			// AWS_IOT_ENDPOINT: "a23ve0kwl75dll-ats.iot.cn-northwest-1.amazonaws.com.cn",
			AWS_IOT_ENDPOINT: "/hbnotification/",
			AWS_REGION: "cn-northwest-1",
			AWS_IOT_DEFAULT_CLIENT_ID: "VQ4L9e4RGDZEI2Ln7fvE",
			MQTT_TYPE: "http-mqtt", // aws-mqtt|http-mqtt
			OBSERVER_TIME_OUT: 86400, // 86400秒  1天 24小时
			scope: "APP|*|R",
			isNeedMenu: true,
			maxResourceNumber: 6
		}
	}

	if (environment === "development") {
		ENV.APP.DEV = {}
		ENV.APP.DEV.redirectClientId = "wsOelHMK2tLAVhj0"

		// ENV.APP.DEV.clientId = "wsOelHMK2tLAVhj0" //general
		ENV.APP.DEV.clientId = "fxXKqdI26bZEBywu" //deploy

		ENV.APP.DEV.redirectUri = "http://general.hubadata.com:4200/oauth-callback"
		ENV.APP.debugToken =
			"cf6d8ec882da07ca6a4579ffb474d5669a5509e3508b800b1f26ee3556d169da"
	}

	if (environment === "test") {
		// Testem prefers this...
		ENV.locationType = "none"

		// keep test console output quieter
		ENV.APP.LOG_ACTIVE_GENERATION = false
		ENV.APP.LOG_VIEW_LOOKUPS = false

		ENV.APP.rootElement = "#ember-testing"
		ENV.APP.autoboot = false
	}

	if (environment === "production") {
		// here you can enable a production-specific feature
	}

	return ENV
}
