"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Constants_1 = require("./Constants");
var Helpers;
(function (Helpers) {
    /**
     * Polyfill for Object.assign.
     * @param target The target object.
     * @param sources The source object(s).
     */
    function assign(target) {
        var sources = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            sources[_i - 1] = arguments[_i];
        }
        var output;
        var source;
        if (target === undefined || target === null) {
            throw new TypeError("Cannot convert undefined or null to object");
        }
        output = Object(target);
        for (var i = 1; i < arguments.length; i++) {
            source = arguments[i];
            if (source !== undefined && source !== null) {
                for (var nextKey in source) {
                    if (source.hasOwnProperty(nextKey)) {
                        output[nextKey] = source[nextKey];
                    }
                }
            }
        }
        return output;
    }
    Helpers.assign = assign;
    function error(message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        if (typeof console === "object" && typeof console.error === "function") {
            console.error.apply(console, [message].concat(optionalParams));
        }
        else if (typeof console === "object" && typeof console.log === "function") {
            console.log.apply(console, ["ERROR: " + message].concat(optionalParams));
        }
    }
    Helpers.error = error;
    function getClassName(target) {
        var targetType;
        if (typeof target === "function") {
            // target is constructor function.
            targetType = target;
        }
        else if (typeof target === "object") {
            // target is class prototype.
            targetType = target.constructor;
        }
        if (!targetType) {
            return "undefined";
        }
        if ("name" in targetType && typeof targetType.name === "string") {
            // ES6 constructor.name // Awesome!
            return targetType.name;
        }
        else {
            // Extract class name from string representation of constructor function. // Meh...
            return targetType.toString().match(/function (\w*)/)[1];
        }
    }
    Helpers.getClassName = getClassName;
    function getDefaultValue(type) {
        switch (type) {
            case Number:
                return 0;
            case String:
                return "";
            case Boolean:
                return false;
            case Array:
                return [];
            default:
                return null;
        }
    }
    Helpers.getDefaultValue = getDefaultValue;
    function getPropertyDisplayName(target, propertyKey) {
        return getClassName(target) + "." + propertyKey.toString();
    }
    Helpers.getPropertyDisplayName = getPropertyDisplayName;
    function isArray(object) {
        if (typeof Array.isArray === "function") {
            return Array.isArray(object);
        }
        else {
            return object instanceof Array;
        }
    }
    Helpers.isArray = isArray;
    function isPrimitive(obj) {
        switch (typeof obj) {
            case "string":
            case "number":
            case "boolean":
                return true;
        }
        return obj instanceof String || obj === String ||
            obj instanceof Number || obj === Number ||
            obj instanceof Boolean || obj === Boolean;
    }
    Helpers.isPrimitive = isPrimitive;
    function isReservedMemberName(name) {
        return (name === Constants_1.Constants.METADATA_FIELD_KEY);
    }
    Helpers.isReservedMemberName = isReservedMemberName;
    function isSubtypeOf(A, B) {
        return A === B || A.prototype instanceof B;
    }
    Helpers.isSubtypeOf = isSubtypeOf;
    function log(message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        if (typeof console === "object" && typeof console.log === "function") {
            console.log.apply(console, [message].concat(optionalParams));
        }
    }
    Helpers.log = log;
    /**
     * Copy the values of all enumerable own properties from one or more source objects to a shallow copy of the target object.
     * It will return the new object.
     * @param target The target object.
     * @param sources The source object(s).
     */
    function merge(target) {
        var sources = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            sources[_i - 1] = arguments[_i];
        }
        var output;
        var source;
        if (target === undefined || target === null) {
            throw new TypeError("Cannot convert undefined or null to object");
        }
        output = {};
        Object.keys(target).forEach(function (nextKey) {
            output[nextKey] = target[nextKey];
        });
        for (var i = 1; i < arguments.length; i++) {
            source = arguments[i];
            if (source !== undefined && source !== null) {
                for (var nextKey in source) {
                    if (source.hasOwnProperty(nextKey)) {
                        output[nextKey] = source[nextKey];
                    }
                }
            }
        }
        return output;
    }
    Helpers.merge = merge;
    function valueIsDefined(value) {
        return !(typeof value === "undefined" || value === null);
    }
    Helpers.valueIsDefined = valueIsDefined;
    function warn(message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        if (typeof console === "object" && typeof console.warn === "function") {
            console.warn.apply(console, [message].concat(optionalParams));
        }
        else if (typeof console === "object" && typeof console.log === "function") {
            console.log.apply(console, ["WARNING: " + message].concat(optionalParams));
        }
    }
    Helpers.warn = warn;
})(Helpers || (Helpers = {}));
exports.default = Helpers;
//#endregion 
