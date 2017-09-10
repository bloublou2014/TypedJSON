import {JsonMember, JsonObject, TypedJSON} from "../bootstrap";
import {Expect, Test, TestFixture} from "alsatian";

@JsonObject
class Person {
    @JsonMember({type: String})
    firstName: string;

    @JsonMember({type: String})
    lastName: string;

    public getFullname(): string {
        return this.firstName + " " + this.lastName;
    }
}

@TestFixture()
export class SingleClassTest {
    @Test()
    public shouldDeserializeSingleClass() {
        const person = TypedJSON.parse('{ "firstName": "John", "lastName": "Doe" }', Person);

        Expect(person instanceof Person);
        Expect(person.getFullname() as string).toBe("John Doe");
    }
}
