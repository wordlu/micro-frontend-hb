
//dev, prod
const env = "prod"
const staticFilePath = env === "dev"
    ? "https://components.hubadata.com/dev/general/public"
    : "https://components.hubadata.com/prod/general/public"
const hostName =
	env === "dev" ? "https://api.hubadata.com" : "https://api.hubadata.com"
export { staticFilePath, hostName }

