"use strict";
//#region "JsonObject"
Object.defineProperty(exports, "__esModule", { value: true });
var JsonObjectMetadata_1 = require("./JsonObjectMetadata");
var Constants_1 = require("./Constants");
var Helpers_1 = require("./Helpers");
function JsonObject(optionsOrTarget) {
    var options;
    if (typeof optionsOrTarget === "function") {
        // JsonObject is being used as a decorator, directly.
        options = {};
    }
    else {
        // JsonObject is being used as a decorator factory.
        options = optionsOrTarget || {};
    }
    var initializer = options.initializer;
    var decorator = function (target) {
        var objectMetadata;
        var parentMetadata;
        var i;
        if (!target.prototype.hasOwnProperty(Constants_1.Constants.METADATA_FIELD_KEY)) {
            objectMetadata = new JsonObjectMetadata_1.JsonObjectMetadata();
            // If applicable, inherit @JsonMembers and @KnownTypes from parent @JsonObject.
            if (parentMetadata = target.prototype[Constants_1.Constants.METADATA_FIELD_KEY]) {
                // @JsonMembers
                Object.keys(parentMetadata.dataMembers).forEach(function (memberPropertyKey) {
                    objectMetadata.dataMembers[memberPropertyKey] = parentMetadata.dataMembers[memberPropertyKey];
                });
                // @KnownTypes
                Object.keys(parentMetadata.knownTypes).forEach(function (key) {
                    objectMetadata.setKnownType(parentMetadata.knownTypes[key]);
                });
            }
            Object.defineProperty(target.prototype, Constants_1.Constants.METADATA_FIELD_KEY, {
                enumerable: false,
                configurable: false,
                writable: false,
                value: objectMetadata
            });
        }
        else {
            objectMetadata = target.prototype[Constants_1.Constants.METADATA_FIELD_KEY];
        }
        objectMetadata.classType = target;
        objectMetadata.isExplicitlyMarked = true;
        if (options.name) {
            objectMetadata.className = options.name;
        }
        if (options.knownTypes) {
            i = 0;
            try {
                options.knownTypes.forEach(function (knownType) {
                    if (typeof knownType === "undefined") {
                        throw new TypeError("Known type #" + i++ + " is undefined.");
                    }
                    objectMetadata.setKnownType(knownType);
                });
            }
            catch (e) {
                // The missing known type might not cause trouble at all, thus the error is printed, but not thrown.
                Helpers_1.default.error(new TypeError("@JsonObject: " + e.message + " (on '" + Helpers_1.default.getClassName(target) + "')"));
            }
        }
        if (typeof initializer === "function") {
            objectMetadata.initializer = initializer;
        }
    };
    if (typeof optionsOrTarget === "function") {
        // JsonObject is being used as a decorator, directly.
        return decorator(optionsOrTarget);
    }
    else {
        // JsonObject is being used as a decorator factory.
        return decorator;
    }
}
exports.JsonObject = JsonObject;
//#endregion 
