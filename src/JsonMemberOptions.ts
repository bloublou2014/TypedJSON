interface JsonMemberOptions<TFunction extends Function> {
    /** Sets the member name as it appears in the serialized JSON. Default value is determined from property key. */
    name?: string;

    /** Sets the json member type. Optional if reflect metadata is available. */
    type?: TFunction;

    /** Deprecated. When the json member is an array, sets the type of array elements. Required for arrays. */
    elementType?: Function;

    /** When the json member is an array, sets the type of array elements. Required for arrays. */
    elements?: JsonMemberOptions<any> | Function;

    /** When set, indicates that the member must be present when deserializing a JSON string. */
    isRequired?: boolean;

    /** Sets the serialization and deserialization order of the json member. */
    order?: number;

    /** When set, a default value is emitted when an uninitialized member is serialized. */
    emitDefaultValue?: boolean;

    /** When set, type-hint is mandatory when deserializing. Set for properties with interface or abstract types/element-types. */
    refersAbstractType?: boolean;
}

export {JsonMemberOptions};