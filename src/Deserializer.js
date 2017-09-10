"use strict";
exports.__esModule = true;
var JsonObjectMetadata_1 = require("./JsonObjectMetadata");
var Helpers_1 = require("./Helpers");
var Deserializer = (function () {
    function Deserializer() {
    }
    /**
     * Deserialize a JSON string into the provided type.
     * @param json The JSON string to deserialize.
     * @param type The type to deserialize into.
     * @param settings Serializer settings.
     * @throws Error if 'settings' specifies 'maxObjects', and the JSON string exceeds that limit.
     */
    Deserializer.readObject = function (json, type, settings) {
        var value;
        var instance;
        var metadata = JsonObjectMetadata_1.JsonObjectMetadata.getFromType(type);
        if (typeof json === 'object') {
            value = json;
        }
        else {
            value = JSON.parse(json, settings.reviver); // Parse text into basic object, which is then processed recursively.
        }
        if (typeof settings.maxObjects === "number") {
            if (this.countObjects(value) > settings.maxObjects) {
                throw new Error("JSON exceeds object count limit (" + settings.maxObjects + ").");
            }
        }
        instance = this.readJsonToInstance(value, {
            objectType: type,
            typeHintPropertyKey: settings.typeHintPropertyKey,
            enableTypeHints: settings.enableTypeHints,
            strictTypeHintMode: true,
            knownTypes: metadata ? metadata.knownTypes : {}
        });
        return instance;
    };
    Deserializer.countObjects = function (value) {
        var _this = this;
        switch (typeof value) {
            case "object":
                if (value === null) {
                    return 0;
                }
                else if (Helpers_1["default"].isArray(value)) {
                    // Count array elements.
                    var count_1 = 0;
                    value.forEach(function (item) {
                        count_1 += _this.countObjects(item);
                    });
                    return count_1;
                }
                else {
                    // Count object properties.
                    var count_2 = 0;
                    Object.keys(value).forEach(function (propertyKey) {
                        count_2 += _this.countObjects(value[propertyKey]);
                    });
                    return count_2;
                }
            case "undefined":
                return 0;
            default:// Primitives.
                return 1;
        }
    };
    Deserializer.readJsonToInstance = function (json, settings) {
        var _this = this;
        var object;
        var objectMetadata;
        var ObjectType;
        var typeHint;
        var temp;
        var knownTypes;
        if (!Helpers_1["default"].valueIsDefined(json)) {
            if (settings.isRequired) {
                throw new Error("Missing required member.");
            }
            // Uninitialized or null json returned "as-is".
            object = json;
        }
        else if (Helpers_1["default"].isPrimitive(settings.objectType)) {
            // number, string, boolean: assign directly.
            if (json.constructor !== settings.objectType) {
                var expectedTypeName = Helpers_1["default"].getClassName(settings.objectType).toLowerCase();
                var foundTypeName = Helpers_1["default"].getClassName(json.constructor).toLowerCase();
                throw new TypeError("Expected value to be of type '" + expectedTypeName + "', got '" + foundTypeName + "'.");
            }
            object = json;
        }
        else if (settings.objectType === Array) {
            // 'json' is expected to be an Array.
            if (!Helpers_1["default"].isArray(json)) {
                throw new TypeError("Expected value to be of type 'Array', got '" + Helpers_1["default"].getClassName(json.constructor) + "'.");
            }
            object = [];
            // Read array elements recursively.
            json.forEach(function (element) {
                object.push(_this.readJsonToInstance(element, {
                    elements: settings.elements ? settings.elements.elements : null,
                    enableTypeHints: settings.enableTypeHints,
                    knownTypes: settings.knownTypes,
                    objectType: settings.elements ? settings.elements.type : element.constructor,
                    requireTypeHints: settings.requireTypeHints,
                    strictTypeHintMode: settings.strictTypeHintMode,
                    typeHintPropertyKey: settings.typeHintPropertyKey
                }));
            });
        }
        else if (settings.objectType === Date) {
            // Built-in support for Date with ISO 8601 format.
            // ISO 8601 spec.: https://www.w3.org/TR/NOTE-datetime
            if (typeof json === "string") {
                object = new Date(json);
            }
            else if (json instanceof Date) {
                object = json;
            }
            else {
                throw new TypeError("Expected value to be of type 'string', got '" + typeof json + "'.");
            }
        }
        else {
            // 'json' can only be an object.
            // Check if a type-hint is present.
            typeHint = json[settings.typeHintPropertyKey];
            if (typeHint && settings.enableTypeHints) {
                if (typeof typeHint !== "string") {
                    throw new TypeError("Type-hint (" + settings.typeHintPropertyKey + ") must be a string.");
                }
                // Check if type-hint refers to a known type.
                if (!settings.knownTypes[typeHint]) {
                    throw new Error("'" + typeHint + "' is not a known type.");
                }
                // In strict mode, check if type-hint is a subtype of the expected type.
                if (settings.strictTypeHintMode && !Helpers_1["default"].isSubtypeOf(settings.knownTypes[typeHint], settings.objectType)) {
                    throw new Error("'" + typeHint + "' is not a subtype of '" + Helpers_1["default"].getClassName(settings.objectType) + "'.");
                }
                // Type-hinting was enabled and a valid type-hint has been found.
                ObjectType = settings.knownTypes[typeHint];
                // Also replace object metadata with that of what was referenced in the type-hint.
                objectMetadata = JsonObjectMetadata_1.JsonObjectMetadata.getFromType(ObjectType);
            }
            else {
                if (settings.enableTypeHints && settings.requireTypeHints) {
                    throw new Error("Missing required type-hint.");
                }
                ObjectType = settings.objectType;
                objectMetadata = JsonObjectMetadata_1.JsonObjectMetadata.getFromType(settings.objectType);
            }
            if (objectMetadata) {
                if (typeof objectMetadata.initializer === "function") {
                    // Let the initializer function handle it.
                    object = objectMetadata.initializer(json) || null;
                }
                else {
                    // Deserialize @JsonMembers.
                    objectMetadata.sortMembers();
                    object = new ObjectType();
                    Object.keys(objectMetadata.dataMembers).forEach(function (propertyKey) {
                        var propertyMetadata = objectMetadata.dataMembers[propertyKey];
                        temp = _this.readJsonToInstance(json[propertyMetadata.name], {
                            elements: propertyMetadata.elements,
                            enableTypeHints: settings.enableTypeHints,
                            isRequired: propertyMetadata.isRequired,
                            knownTypes: Helpers_1["default"].merge(settings.knownTypes, objectMetadata.knownTypes || {}),
                            objectType: propertyMetadata.type,
                            requireTypeHints: settings.requireTypeHints,
                            strictTypeHintMode: settings.strictTypeHintMode,
                            typeHintPropertyKey: settings.typeHintPropertyKey
                        });
                        // Do not make undefined/null property assignments.
                        if (Helpers_1["default"].valueIsDefined(temp)) {
                            object[propertyKey] = temp;
                        }
                    });
                }
            }
            else {
                // Deserialize each property of (from) 'json'.
                object = {};
                Object.keys(json).forEach(function (propertyKey) {
                    // Skip type-hint when copying properties.
                    if (json[propertyKey] && propertyKey !== settings.typeHintPropertyKey) {
                        var objectType = void 0;
                        if (Helpers_1["default"].valueIsDefined(json[propertyKey])) {
                            objectType = json[propertyKey].constructor;
                        }
                        object[propertyKey] = _this.readJsonToInstance(json[propertyKey], {
                            enableTypeHints: settings.enableTypeHints,
                            knownTypes: settings.knownTypes,
                            objectType: objectType,
                            requireTypeHints: settings.requireTypeHints,
                            typeHintPropertyKey: settings.typeHintPropertyKey
                        });
                    }
                });
            }
        }
        return object;
    };
    return Deserializer;
}());
exports.Deserializer = Deserializer;
