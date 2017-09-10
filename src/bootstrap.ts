/*!
TypedJSON v0.2.0 - https://github.com/JohnWhiteTB/TypedJSON

Typed JSON parsing and serializing that preserves type information. Parse JSON into actual class instances. Recommended (but not required)
to be used with reflect-metadata (global installation): https://github.com/rbuckton/ReflectDecorators.


The MIT License (MIT)
Copyright (c) 2016 John White

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import {SerializerSettings} from "./SerializerSettings";
import Helpers from "./Helpers";
import JSON from "./JSON";
import {TypedJSON as TypedJSONInterface} from "./TypedJSON" ;
import {JsonObjectMetadata} from "./JsonObjectMetadata";
import {Deserializer} from "./Deserializer";
import {Serializer} from "./Serializer";
import {JsonObject} from "./JsonObject";
import {JsonMember} from "./JsonMember";

//#region "TypedJSON"
// Default settings.
let configSettings: SerializerSettings = {
    enableTypeHints: true,
    typeHintPropertyKey: "__type"
};

let TypedJSON: TypedJSONInterface = {
    config: function (settings: SerializerSettings) {
        configSettings = Helpers.merge(configSettings, settings);
    },
    stringify: function (value: any, settings?: SerializerSettings): string {
        return Serializer.writeObject(value, Helpers.merge(configSettings, settings || {}));
    },
    parse: function (json: string, type?: any, settings?: SerializerSettings): any {
        if (JsonObjectMetadata.getFromType(type)) {
            return Deserializer.readObject(json, type, Helpers.merge(configSettings, settings || {}));
        } else {
            return JSON.parse.apply(JSON, [arguments[0], settings && settings.reviver]);
        }
    }
};
//#endregion

export {TypedJSON, JsonObject, JsonMember};
