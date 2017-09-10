*v0.1.4*

 - [TypedJSON](#typedjson)
   - [TypedJSON.config](#typedjsonconfig)
   - [TypedJSON.parse](#typedjsonparse)
   - [TypedJSON.stringify](#typedjsonparse)
 - [@JsonObject](#jsonobject)
 - [@JsonMember](#jsonmember)

## TypedJSON

An augmented version of the built-in `JSON` object to handle serialization and deserialization of objects marked with [@JsonObject](#jsonobject). Functionally a superset, the newly introduced methods and overloads are:

### TypedJSON.config

Configures TypedJSON, provided values are assigned to already existing values. Syntax:

```typescript
TypedJSON.config(options);
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| enableTypeHints | boolean | true | when set, enable emitting and recognizing type-hints |
| maxObjects | number | - | maximum number of objects allowed when deserializing JSON |
| replacer | function | - | a function that transforms the JSON after serializing; called recursively for every object |
| reviver | function | - | a function that transforms the JSON before deserializing; called recursively for every object |
| typeHintPropertyKey | string | __type | property key to recognize as type-hints |

-----

### TypedJSON.parse

Converts a JavaScript Object Notation (JSON) string into an instance of the provided class. The provided class must contain a parameterless constructor. Syntax:

```typescript
TypedJSON.parse(json, Type, [options]);
```

| Parameter | Type | Description |
|-----------|------|-------------|
| json | string | a valid JSON string |
| Type | newable | a class passed as value, from which an instance is created; must contain a parameterless constructor |
| options | object | an options object, see [TypedJSON.config](#typedjsonconfig) |

Returns an instance of the provided class.

-----

### TypedJSON.stringify

Converts a JavaScript value to a JavaScript Object Notation (JSON) string, with an optional 'options' argument. Syntax:

```typescript
TypedJSON.stringify(value, [options]);
```

| Parameter | Type | Description |
|-----------|------|-------------|
| value | any | a JavaScript value, usually an object or array, to be converted |
| options | object | an options object, see [TypedJSON.config](#typedjsonconfig) |

Returns the JSON string.


&nbsp;

## @JsonObject

Class decorator that can be used on a class to make it serializable to and deserializable from JSON using TypedJSON, into the correct type. When an instance of a class with this decorator is serialized with TypedJSON, only properties marked with [@JsonMember](#jsonmember) will be considered.

 > **Note:** using @JsonObject on a derived class will inherit every [@JsonMember](#jsonmember) and known type from the base class.

JsonObject has 2 overloads when used as a decorator:

```typescript
@JsonObject
@JsonObject([options])
```

| Option | Type | Description |
|--------|------|-------------|
| initializer | function | custom deserializer function transforming a JSON-like object to an instance of the decorated class |
| knownTypes | Array | array of known types to recognize when encountering type-hints |
| name | string | name of the object as it appears in the serialized JSON |
| serializer | function | custom serializer function transforming an instance of the decorated class to a JSON-like object |

 > **Note:** 'knownTypes' already includes types of properties marked with [@JsonMember](#jsonmember).

&nbsp;

## @JsonMember

Property decorator which can be used on properties of a class decorated with [@JsonObject](#jsonobject), to mark which properties should be serialized and deserialized.

@JsonMember has 2 overloads when used as a decorator:

```typescript
@JsonMember
@JsonMember([options])
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| *type | Function | - | constructor function reference of the property |
| **elementType | Function | - | when the property is an array, sets the type of array elements |
| emitDefaultValue | boolean | false | when set, a default value is emitted when an unitialized member is serialized |
| isRequired | boolean | false | when set, the member must be present when deserializing |
| name | string | - | custom member name as it appears in the JSON (default is the property key) |
| order | number | - | sets serialization and deserialization order |
| refersAbstractType | boolean | false | when set, type-hint is mandatory when deserializing |

 - \*required unless [ReflectDecorators](https://github.com/rbuckton/ReflectDecorators) is used
 - \*\*required for arrays
