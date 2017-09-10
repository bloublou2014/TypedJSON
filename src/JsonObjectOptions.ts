interface JsonObjectOptions<T> {
    /** Name of the object as it appears in the serialized JSON. */
    name?: string;

    /** An array of known types to recognize when encountering type-hints. */
    knownTypes?: Array<{ new (): any }>;

    /** A custom serializer function transforming an instace to a JSON object. */
    serializer?: (object: T) => any;

    /** A custom deserializer function transforming a JSON object to an instace. */
    initializer?: (json: any) => T;
}

export {JsonObjectOptions};