
//dev, prod
const env = "prod" 
const staticFilePath = env === "dev" 
    ? "https://components.hubadata.com/dev/deploy/public"
    : "https://components.hubadata.com/prod/deploy/public"
const hostName =
	env === "dev" ? "https://api.hubadata.com" : "https://api.hubadata.com"
const actionTableName = env === "dev" ? "action_dev" : "action"

export { staticFilePath, hostName, actionTableName }
