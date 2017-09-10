## Examples

### refersAbstractType

```typescript
import {JsonObject, JsonMember} from "typedjson-npm";

abstract class Configuration {
    
}


@JsonObject
class Person {
    @JsonMember
    name: string;

    @JsonMember({refersAbstractType:true})
    lastName: string;
}


```