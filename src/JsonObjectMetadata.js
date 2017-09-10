"use strict";
exports.__esModule = true;
var Helpers_1 = require("./Helpers");
var Constants_1 = require("./Constants");
var JsonObjectMetadata = (function () {
    function JsonObjectMetadata() {
        this._dataMembers = {};
        this._knownTypes = [];
        this._knownTypeCache = null;
        this.isExplicitlyMarked = false;
    }
    /**
     * Gets the name of a class as it appears in a serialized JSON string.
     * @param type The JsonObject class.
     * @param inherited Whether to use inherited metadata information from base classes (if own metadata does not exist).
     */
    JsonObjectMetadata.getJsonObjectName = function (type, inherited) {
        if (inherited === void 0) { inherited = true; }
        var metadata = this.getFromType(type, inherited);
        if (metadata !== null) {
            return metadata.className;
        }
        else {
            return Helpers_1["default"].getClassName(type);
        }
    };
    JsonObjectMetadata.getFromType = function (target, inherited) {
        if (inherited === void 0) { inherited = true; }
        var targetPrototype;
        var metadata;
        if (typeof target === "function") {
            targetPrototype = target.prototype;
        }
        else {
            targetPrototype = target;
        }
        if (!targetPrototype) {
            return null;
        }
        if (targetPrototype.hasOwnProperty(Constants_1.Constants.METADATA_FIELD_KEY)) {
            // The class prototype contains own JsonObject metadata.
            metadata = targetPrototype[Constants_1.Constants.METADATA_FIELD_KEY];
        }
        else if (inherited && targetPrototype[Constants_1.Constants.METADATA_FIELD_KEY]) {
            // The class prototype inherits JsonObject metadata.
            metadata = targetPrototype[Constants_1.Constants.METADATA_FIELD_KEY];
        }
        if (metadata && metadata.isExplicitlyMarked) {
            // Ignore implicitly added JsonObject.
            return metadata;
        }
        else {
            return null;
        }
    };
    /**
     * Gets JsonObject metadata information from a class instance.
     * @param target The target instance.
     * @param inherited Whether to use inherited metadata information from base classes (if own metadata does not exist).
     * @see https://jsfiddle.net/m6ckc89v/ for demos related to the special inheritance case when 'inherited' is set.
     */
    JsonObjectMetadata.getFromInstance = function (target, inherited) {
        if (inherited === void 0) { inherited = true; }
        return this.getFromType(Object.getPrototypeOf(target), inherited);
    };
    /**
     * Gets the known type name of a JsonObject class for type hint.
     * @param target The target class.
     */
    JsonObjectMetadata.getKnownTypeNameFromType = function (target) {
        var metadata = this.getFromType(target, false);
        if (metadata) {
            return metadata.className;
        }
        else {
            return Helpers_1["default"].getClassName(target);
        }
    };
    /**
     * Gets the known type name of a JsonObject instance for type hint.
     * @param target The target instance.
     */
    JsonObjectMetadata.getKnownTypeNameFromInstance = function (target) {
        var metadata = this.getFromInstance(target, false);
        if (metadata) {
            return metadata.className;
        }
        else {
            return Helpers_1["default"].getClassName(target.constructor);
        }
    };
    Object.defineProperty(JsonObjectMetadata.prototype, "dataMembers", {
        /** Gets the metadata of all JsonMembers of the JsonObject as key-value pairs. */
        get: function () {
            return this._dataMembers;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JsonObjectMetadata.prototype, "className", {
        /** Gets or sets the name of the JsonObject as it appears in the serialized JSON. */
        get: function () {
            if (typeof this._className === "string") {
                return this._className;
            }
            else {
                return Helpers_1["default"].getClassName(this.classType);
            }
        },
        set: function (value) {
            this._className = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JsonObjectMetadata.prototype, "knownTypes", {
        /** Gets a key-value collection of the currently known types for this JsonObject. */
        get: function () {
            var knownTypes;
            var knownTypeName;
            knownTypes = {};
            this._knownTypes.forEach(function (knownType) {
                // KnownType names are not inherited from JsonObject settings, as it would render them useless.
                knownTypeName = JsonObjectMetadata.getKnownTypeNameFromType(knownType);
                knownTypes[knownTypeName] = knownType;
            });
            this._knownTypeCache = knownTypes;
            return knownTypes;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets a known type.
     * @param type The known type.
     */
    JsonObjectMetadata.prototype.setKnownType = function (type) {
        if (this._knownTypes.indexOf(type) === -1) {
            this._knownTypes.push(type);
            this._knownTypeCache = null;
        }
    };
    /**
     * Adds a JsonMember to the JsonObject.
     * @param member The JsonMember metadata.
     * @throws Error if a JsonMember with the same name already exists.
     */
    JsonObjectMetadata.prototype.addMember = function (member) {
        var _this = this;
        Object.keys(this._dataMembers).forEach(function (propertyKey) {
            if (_this._dataMembers[propertyKey].name === member.name) {
                throw new Error("A member with the name '" + member.name + "' already exists.");
            }
        });
        this._dataMembers[member.key] = member;
    };
    /**
     * Sorts data members:
     *  1. Ordered members in defined order
     *  2. Unordered members in alphabetical order
     */
    JsonObjectMetadata.prototype.sortMembers = function () {
        var _this = this;
        var memberArray = [];
        Object.keys(this._dataMembers).forEach(function (propertyKey) {
            memberArray.push(_this._dataMembers[propertyKey]);
        });
        memberArray = memberArray.sort(this.sortMembersCompare);
        this._dataMembers = {};
        memberArray.forEach(function (dataMember) {
            _this._dataMembers[dataMember.key] = dataMember;
        });
    };
    JsonObjectMetadata.prototype.sortMembersCompare = function (a, b) {
        if (typeof a.order !== "number" && typeof b.order !== "number") {
            // a and b both both implicitly ordered, alphabetical order
            if (a.name < b.name) {
                return -1;
            }
            else if (a.name > b.name) {
                return 1;
            }
        }
        else if (typeof a.order !== "number") {
            // a is implicitly ordered, comes after b (compare: a is greater)
            return 1;
        }
        else if (typeof b.order !== "number") {
            // b is implicitly ordered, comes after a (compare: b is greater)
            return -1;
        }
        else {
            // a and b are both explicitly ordered
            if (a.order < b.order) {
                return -1;
            }
            else if (a.order > b.order) {
                return 1;
            }
            else {
                // ordering is the same, use alphabetical order
                if (a.name < b.name) {
                    return -1;
                }
                else if (a.name > b.name) {
                    return 1;
                }
            }
        }
        return 0;
    };
    return JsonObjectMetadata;
}());
exports.JsonObjectMetadata = JsonObjectMetadata;
