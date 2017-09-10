import {SerializerSettings} from "./SerializerSettings";

export interface TypedJSON {
    config (settings: SerializerSettings): void;

    stringify(value: any, settings?: SerializerSettings): string ;

    parse (json: string, type?: any, settings?: SerializerSettings): any;
}

export interface TypedJSON2 {
    /**
     * Converts a JavaScript Object Notation (JSON) string into an object.
     * @param text A valid JSON string.
     * @param reviver A function that transforms the results. This function is called for each member of the object.
     * If a member contains nested objects, the nested objects are transformed before the parent object is.
     */
    parse(text: string, reviver?: (key: any, value: any) => any): any;

    /**
     * Converts a JavaScript Object Notation (JSON) string into an instance of the provided class.
     * @param text A valid JSON string.
     * @param type A class from which an instance is created using the provided JSON string.
     * @param settings Per-use serializer settings. Unspecified keys are assigned from global config.
     */
    parse<T>(text: string, type: { new (): T }, settings?: SerializerSettings): T;

    /**
     * Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
     * @param value A JavaScript value, usually an object or array, to be converted.
     */
    stringify(value: any): string;

    /**
     * Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
     * @param value A JavaScript value, usually an object or array, to be converted.
     * @param replacer A function that transforms the results.
     */
    stringify(value: any, replacer: (key: string, value: any) => any): string;

    /**
     * Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
     * @param value A JavaScript value, usually an object or array, to be converted.
     * @param replacer Array that transforms the results.
     */
    stringify(value: any, replacer: any[]): string;

    /**
     * Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
     * @param value A JavaScript value, usually an object or array, to be converted.
     * @param replacer A function that transforms the results.
     * @param space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
     */
    stringify(value: any, replacer: (key: string, value: any) => any, space: string | number): string;

    /**
     * Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
     * @param value A JavaScript value, usually an object or array, to be converted.
     * @param replacer Array that transforms the results.
     * @param space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
     */
    stringify(value: any, replacer: any[], space: string | number): string;

    /**
     * Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
     * @param value A JavaScript value, usually an object or array, to be converted.
     * @param settings Per-use serializer settings. Unspecified keys are assigned from global config.
     */
    stringify(value: any, settings?: SerializerSettings): string;

    /**
     * Configures TypedJSON with custom settings. New settings will be assigned to existing settings.
     * @param settings The settings object.
     */
    config(settings: SerializerSettings): void;
}