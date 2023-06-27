import { dasherize, camelize } from "@ember/string"
import { singularize, pluralize } from "ember-inflector"
import JSONAPISerializer from "@ember-data/serializer/json-api"

export default class ApplicationSerializer extends JSONAPISerializer {
	modelNameFromPayloadKey(key) {
		return singularize(dasherize(key))
	}

	payloadKeyFromModelName(modelName) {
		return pluralize(camelize(modelName))
	}

	keyForAttribute(key) {
		return dasherize(key).toLowerCase()
	}

	keyForRelationship(key) {
		return key
	}
}
