import {JsonMemberMetadata} from "./JsonMemberMetadata";

export interface WriteSettings {
    objectType: { new (): any },
    elements?: JsonMemberMetadata<any>,
    emitDefault?: boolean,
    typeHintPropertyKey: string,
    enableTypeHints?: boolean,
    requireTypeHints?: boolean,
    name?: string
}
