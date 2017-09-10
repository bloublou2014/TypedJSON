"use strict";
//#region "Serializer"
exports.__esModule = true;
var JsonObjectMetadata_1 = require("./JsonObjectMetadata");
var Helpers_1 = require("./Helpers");
var Serializer = (function () {
    function Serializer() {
    }
    Serializer.writeObject = function (object, settings) {
        var objectMetadata = JsonObjectMetadata_1.JsonObjectMetadata.getFromInstance(object);
        var ObjectType;
        if (objectMetadata) {
            ObjectType = objectMetadata.classType;
        }
        else {
            ObjectType = object.constructor;
        }
        return JSON.stringify(this.writeToJsonObject(object, {
            objectType: ObjectType,
            enableTypeHints: settings.enableTypeHints,
            typeHintPropertyKey: settings.typeHintPropertyKey
        }), settings.replacer);
    };
    /**
     * Convert a @JsonObject class instance to a JSON object for serialization.
     * @param object The instance to convert.
     * @param settings Settings defining how the instance should be serialized.
     */
    Serializer.writeToJsonObject = function (object, settings) {
        var _this = this;
        var json;
        var objectMetadata;
        if (!Helpers_1["default"].valueIsDefined(object)) {
            // Uninitialized or null object returned "as-is" (or default value if set).
            if (settings.emitDefault) {
                json = Helpers_1["default"].getDefaultValue(settings.objectType);
            }
            else {
                json = object;
            }
        }
        else if (Helpers_1["default"].isPrimitive(object) || object instanceof Date) {
            // Primitive types and Date stringified "as-is".
            json = object;
        }
        else if (object instanceof Array) {
            json = [];
            for (var i = 0, n = object.length; i < n; i++) {
                json.push(this.writeToJsonObject(object[i], {
                    elements: settings.elements ? settings.elements.elements : null,
                    enableTypeHints: settings.enableTypeHints,
                    objectType: settings.elements ? settings.elements.type : Object,
                    requireTypeHints: settings.requireTypeHints,
                    typeHintPropertyKey: settings.typeHintPropertyKey
                }));
            }
        }
        else {
            // Object with properties.
            objectMetadata = JsonObjectMetadata_1.JsonObjectMetadata.getFromInstance(object);
            if (objectMetadata && typeof objectMetadata.serializer === "function") {
                json = objectMetadata.serializer(object);
            }
            else {
                json = {};
                // Add type-hint.
                if (settings.enableTypeHints && (settings.requireTypeHints || object.constructor !== settings.objectType)) {
                    json[settings.typeHintPropertyKey] = JsonObjectMetadata_1.JsonObjectMetadata.getKnownTypeNameFromInstance(object);
                }
                if (objectMetadata) {
                    // Serialize @JsonMember properties.
                    objectMetadata.sortMembers();
                    Object.keys(objectMetadata.dataMembers).forEach(function (propertyKey) {
                        var propertyMetadata = objectMetadata.dataMembers[propertyKey];
                        json[propertyMetadata.name] = _this.writeToJsonObject(object[propertyKey], {
                            elements: propertyMetadata.elements,
                            emitDefault: propertyMetadata.emitDefaultValue,
                            enableTypeHints: settings.enableTypeHints,
                            name: propertyMetadata.name,
                            objectType: propertyMetadata.type,
                            requireTypeHints: settings.requireTypeHints,
                            typeHintPropertyKey: settings.typeHintPropertyKey
                        });
                    });
                }
                else {
                    // Serialize all own properties.
                    Object.keys(object).forEach(function (propertyKey) {
                        json[propertyKey] = _this.writeToJsonObject(object[propertyKey], {
                            enableTypeHints: settings.enableTypeHints,
                            objectType: Object,
                            requireTypeHints: settings.requireTypeHints,
                            typeHintPropertyKey: settings.typeHintPropertyKey
                        });
                    });
                }
            }
        }
        return json;
    };
    return Serializer;
}());
exports.Serializer = Serializer;
//#endregion 
