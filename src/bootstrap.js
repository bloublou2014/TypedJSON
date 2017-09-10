"use strict";
exports.__esModule = true;
var Helpers_1 = require("./Helpers");
var JSON_1 = require("./JSON");
var JsonObjectMetadata_1 = require("./JsonObjectMetadata");
var Deserializer_1 = require("./Deserializer");
var Serializer_1 = require("./Serializer");
var JsonObject_1 = require("./JsonObject");
exports.JsonObject = JsonObject_1.JsonObject;
var JsonMember_1 = require("./JsonMember");
exports.JsonMember = JsonMember_1.JsonMember;
//#region "TypedJSON"
// Default settings.
var configSettings = {
    enableTypeHints: true,
    typeHintPropertyKey: "__type"
};
var TypedJSON = {
    config: function (settings) {
        configSettings = Helpers_1["default"].merge(configSettings, settings);
    },
    stringify: function (value, settings) {
        return Serializer_1.Serializer.writeObject(value, Helpers_1["default"].merge(configSettings, settings || {}));
    },
    parse: function (json, type, settings) {
        if (JsonObjectMetadata_1.JsonObjectMetadata.getFromType(type)) {
            return Deserializer_1.Deserializer.readObject(json, type, Helpers_1["default"].merge(configSettings, settings || {}));
        }
        else {
            return JSON_1["default"].parse.apply(JSON_1["default"], [arguments[0], settings && settings.reviver]);
        }
    }
};
exports.TypedJSON = TypedJSON;
