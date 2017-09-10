//#region "JsonObject"

import {JsonObjectOptions} from "./JsonObjectOptions";
import {Constructor} from "./Constructor";
import {JsonObjectMetadata} from "./JsonObjectMetadata";
import {Constants} from "./Constants";
import Helpers from "./Helpers";

/**
 * Specifies that the type is serializable to and deserializable from a JSON string.
 * @param options Configuration settings.
 */
export function JsonObject<T>(options?: JsonObjectOptions<T>): (target: { new (): T }) => void;

/**
 * Specifies that the type is serializable to and deserializable from a JSON string.
 */
export function JsonObject<T>(target: { new (): T }): void;

export function JsonObject<T>(optionsOrTarget?: JsonObjectOptions<T> | { new (): T }): (target: Constructor<T>) => void | void {
    let options: JsonObjectOptions<T>;

    if (typeof optionsOrTarget === "function") {
        // JsonObject is being used as a decorator, directly.
        options = {};
    } else {
        // JsonObject is being used as a decorator factory.
        options = optionsOrTarget || {};
    }

    let initializer = options.initializer;
    let decorator = function (target: Constructor<T>): void {
        let objectMetadata: JsonObjectMetadata<T>;
        let parentMetadata: JsonObjectMetadata<T>;
        let i;

        if (!target.prototype.hasOwnProperty(Constants.METADATA_FIELD_KEY)) {
            objectMetadata = new JsonObjectMetadata<T>();

            // If applicable, inherit @JsonMembers and @KnownTypes from parent @JsonObject.
            if (parentMetadata = target.prototype[Constants.METADATA_FIELD_KEY]) {
                // @JsonMembers
                Object.keys(parentMetadata.dataMembers).forEach(memberPropertyKey => {
                    objectMetadata.dataMembers[memberPropertyKey] = parentMetadata.dataMembers[memberPropertyKey];
                });

                // @KnownTypes
                Object.keys(parentMetadata.knownTypes).forEach(key => {
                    objectMetadata.setKnownType(parentMetadata.knownTypes[key]);
                });
            }

            Object.defineProperty(target.prototype, Constants.METADATA_FIELD_KEY, {
                enumerable: false,
                configurable: false,
                writable: false,
                value: objectMetadata
            });
        } else {
            objectMetadata = target.prototype[Constants.METADATA_FIELD_KEY];
        }

        objectMetadata.classType = target;
        objectMetadata.isExplicitlyMarked = true;

        if (options.name) {
            objectMetadata.className = options.name;
        }

        if (options.knownTypes) {
            i = 0;

            try {
                options.knownTypes.forEach(knownType => {
                    if (typeof knownType === "undefined") {
                        throw new TypeError(`Known type #${i++} is undefined.`);
                    }

                    objectMetadata.setKnownType(knownType);
                });
            } catch (e) {
                // The missing known type might not cause trouble at all, thus the error is printed, but not thrown.
                Helpers.error(new TypeError(`@JsonObject: ${e.message} (on '${Helpers.getClassName(target)}')`));
            }
        }

        if (typeof initializer === "function") {
            objectMetadata.initializer = initializer;
        }
    };

    if (typeof optionsOrTarget === "function") {
        // JsonObject is being used as a decorator, directly.
        return decorator(optionsOrTarget as Constructor<T>) as any;
    } else {
        // JsonObject is being used as a decorator factory.
        return decorator;
    }
}

//#endregion