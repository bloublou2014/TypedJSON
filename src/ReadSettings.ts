import {JsonMemberMetadata} from "./JsonMemberMetadata";

export interface ReadSettings<T> {
    objectType: { new (): T },
    isRequired?: boolean,
    elements?: JsonMemberMetadata<any>,
    typeHintPropertyKey: string,
    enableTypeHints?: boolean,
    knownTypes?: { [name: string]: { new (): any } },
    requireTypeHints?: boolean;
    strictTypeHintMode?: boolean;
}