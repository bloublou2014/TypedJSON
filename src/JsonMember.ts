
//#region "JsonMember"

import {JsonMemberMetadata} from "./JsonMemberMetadata";
import {JsonMemberOptions} from "./JsonMemberOptions";
import {JsonObjectMetadata} from "./JsonObjectMetadata";
import Helpers from "./Helpers";
import {Reflect} from "./Reflect";
import {Constants} from "./Constants";

function jsonMemberTypeInit<T>(metadata: JsonMemberMetadata<T>, propertyName: string, warnArray = false) {
    if (metadata.elements) {
        // 'elements' type shorthand.
        if (typeof metadata.elements === "function") {
            // Type shorthand was used.
            metadata.elements = {
                type: metadata.elements
            } as any;
        }

        if (!metadata.type) {
            // If the 'elements' option is set, 'type' is automatically assumed to be 'Array' unless specified.
            metadata.type = Array as any;
        }
    }

    if (metadata.type as any === Array) {
        if (!metadata.elements) {
            if (warnArray) {
                // Provide backwards compatibility.
                Helpers.warn(`No valid 'elements' option was specified for '${propertyName}'.`);
            } else {
                throw new Error(`No valid 'elements' option was specified for '${propertyName}'.`);
            }
        } else {
            jsonMemberTypeInit(metadata.elements, propertyName + '[]', true);
        }
    }

    if (typeof metadata.type !== "function") {
        throw new Error(`No valid 'type' option was specified for '${propertyName}'.`);
    }
}

function jsonMemberKnownTypes<T>(metadata: JsonMemberMetadata<T>) {
    let knownTypes = new Array<{ new (): any }>();

    knownTypes.push(metadata.type);

    if (metadata.elements) {
        knownTypes = knownTypes.concat(jsonMemberKnownTypes(metadata.elements));
    }

    return knownTypes;
}

/**
 * Specifies that the property is part of the object when serializing.
 * Parameterless use requires reflect-metadata to determine member type.
 */
export function JsonMember(): PropertyDecorator;

/**
 * Specifies that the property is part of the object when serializing.
 * Parameterless use requires reflect-metadata to determine member type.
 */
export function JsonMember(target: any, propertyKey: string | symbol): void;

/**
 * Specifies that the property is part of the object when serializing.
 * @param options Configuration settings.
 */
export function JsonMember<TFunction extends Function>(options: JsonMemberOptions<TFunction>): PropertyDecorator;

export function JsonMember<TFunction extends Function>(optionsOrTarget?: JsonMemberOptions<TFunction> | any, propertyKey?: string | symbol): PropertyDecorator | void {
    let memberMetadata = new JsonMemberMetadata<TFunction>();
    let options: JsonMemberOptions<TFunction>;
    let decorator: PropertyDecorator;

    if (typeof propertyKey === "string" || typeof propertyKey === "symbol") {
        // JsonMember is being used as a decorator, directly.
        options = {};
    } else {
        // JsonMember is being used as a decorator factory.
        options = optionsOrTarget || {};
    }

    decorator = function (target: any, propertyKey: string | symbol): void {
        let descriptor = Object.getOwnPropertyDescriptor(target, propertyKey.toString());;
        let objectMetadata: JsonObjectMetadata<any>;
        let parentMetadata: JsonObjectMetadata<any>;
        let reflectType: any;
        let propertyName = Helpers.getPropertyDisplayName(target, propertyKey); // For error messages.

        // When a property decorator is applied to a static member, 'target' is a constructor function.
        // See: https://github.com/Microsoft/TypeScript-Handbook/blob/master/pages/Decorators.md#property-decorators
        // And static members are not supported.
        if (typeof target === "function") {
            throw new TypeError(`@JsonMember cannot be used on a static property ('${propertyName}').`);
        }

        // Methods cannot be serialized.
        if (typeof target[propertyKey] === "function") {
            throw new TypeError(`@JsonMember cannot be used on a method property ('${propertyName}').`);
        }

        // 'elementType' is deprecated, but still provide backwards compatibility for now.
        if (options.hasOwnProperty("elementType")) {
            Helpers.warn(`${propertyName}: the 'elementType' option is deprecated, use 'elements' instead.`);
            options.elements = options.elementType;

            if (options.elementType === Array) {
                memberMetadata.forceEnableTypeHinting = true;
            }
        }

        memberMetadata = Helpers.assign(memberMetadata, options);

        memberMetadata.key = propertyKey.toString();
        memberMetadata.name = options.name || propertyKey.toString(); // Property key is used as default member name if not specified.

        // Check for reserved member names.
        if (Helpers.isReservedMemberName(memberMetadata.name)) {
            throw new Error(`@JsonMember: '${memberMetadata.name}' is a reserved name.`);
        }

        // It is a common error for types to exist at compile time, but not at runtime (often caused by improper/misbehaving imports).
        if (options.hasOwnProperty("type") && typeof options.type === "undefined") {
            throw new TypeError(`@JsonMember: 'type' of '${propertyName}' is undefined.`);
        }

        // ReflectDecorators support to auto-infer property types.
        //#region "Reflect Metadata support"
        if (typeof Reflect === "object" && typeof Reflect.getMetadata === "function") {
            reflectType = Reflect.getMetadata("design:type", target, propertyKey);

            if (typeof reflectType === "undefined") {
                // If Reflect.getMetadata exists, functionality for *setting* metadata should also exist, and metadata *should* be set.
                throw new TypeError(`@JsonMember: type detected for '${propertyName}' is undefined.`);
            }

            if (!memberMetadata.type || typeof memberMetadata.type !== "function") {
                // Get type information using reflect metadata.
                memberMetadata.type = reflectType;
            } else if (memberMetadata.type !== reflectType) {
                Helpers.warn(`@JsonMember: 'type' specified for '${propertyName}' does not match detected type.`);
            }
        }
        //#endregion "Reflect Metadata support"

        // Ensure valid types have been specified ('type' at all times, 'elements' for arrays).
        jsonMemberTypeInit(memberMetadata, propertyName);

        // Add JsonObject metadata to 'target' if not yet exists ('target' is the prototype).
        // NOTE: this will not fire up custom serialization, as 'target' must be explicitly marked with '@JsonObject' as well.
        if (!target.hasOwnProperty(Constants.METADATA_FIELD_KEY)) {
            // No *own* metadata, create new.
            objectMetadata = new JsonObjectMetadata();

            // Inherit @JsonMembers from parent @JsonObject, if any.
            if (parentMetadata = target[Constants.METADATA_FIELD_KEY]) {
                Object.keys(parentMetadata.dataMembers).forEach(memberPropertyKey => {
                    objectMetadata.dataMembers[memberPropertyKey] = parentMetadata.dataMembers[memberPropertyKey];
                });
            }

            // ('target' is the prototype of the involved class, metadata information is added to the class prototype).
            Object.defineProperty(target, Constants.METADATA_FIELD_KEY, {
                enumerable: false,
                configurable: false,
                writable: false,
                value: objectMetadata
            });
        } else {
            // JsonObjectMetadata already exists on 'target'.
            objectMetadata = target[Constants.METADATA_FIELD_KEY];
        }

        // Automatically add known types.
        jsonMemberKnownTypes(memberMetadata).forEach(knownType => {
            objectMetadata.setKnownType(knownType);
        });

        // Register @JsonMember with @JsonObject (will override previous member when used multiple times on same property).
        try {
            objectMetadata.addMember(memberMetadata);
        } catch (e) {
            throw new Error(`Member '${memberMetadata.name}' already exists on '${Helpers.getClassName(objectMetadata.classType)}'.`);
        }
    };

    if (typeof propertyKey === "string" || typeof propertyKey === "symbol") {
        // JsonMember is being used as a decorator, call decorator function directly.
        return decorator(optionsOrTarget, propertyKey);
    } else {
        // JsonMember is being used as a decorator factory, return decorator function.
        return decorator;
    }
}
//#endregion