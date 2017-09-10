export interface SerializerSettings {
    /** Property key to recognize as type-hints. Default is "__type". */
    typeHintPropertyKey?: string;

    /** When set, enable emitting and recognizing type-hints. Default is true */
    enableTypeHints?: boolean;

    /** Maximum number of objects allowed when deserializing from JSON. Default is no limit. */
    maxObjects?: number;

    /** A function that transforms the JSON after serializing. Called recursively for every object. */
    replacer?: (key: string, value: any) => any;

    /** A function that transforms the JSON before deserializing. Called recursively for every object. */
    reviver?: (key: any, value: any) => any;
}
