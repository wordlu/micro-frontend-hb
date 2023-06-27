/**
 * pqian@hubadata.com 2022.2.10
 */

// import PhAWSMQTT from "./PhAWSMqtt"
import PhHttpMQTT from "./PhHttpMqtt"

const contextIot = {
	// "aws-mqtt": PhAWSMQTT,
	"http-mqtt": PhHttpMQTT
}

const PhIot = {}
PhIot.newInstance = (config, callBack, destroyQueue) => {
	const mqtt = config.type || "aws-mqtt"
	const method = contextIot[mqtt].PhMQTT
	return method(config, callBack, destroyQueue)
}
export { PhIot }
