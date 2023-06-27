
//dev, prod
const env = "prod" 
const staticFilePath = env === "dev" 
    ? "https://components.hubadata.com/dev/offweb/public"
    : "https://components.hubadata.com/prod/offweb/public"
const hostName =
	env === "dev" ? "https://api.hubadata.com" : "https://api.hubadata.com"
export { staticFilePath, hostName }
