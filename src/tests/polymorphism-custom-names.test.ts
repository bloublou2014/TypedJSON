import {isEqual} from "./object-compare";
import {JsonObject, JsonMember, TypedJSON} from "../bootstrap";
import {Expect, Test, TestFixture} from "alsatian";


@JsonObject
class Person {
    @JsonMember({type: String, name: "first-name"})
    public firstName: string;

    @JsonMember({type: String, name: "last-name"})
    public lastName: string;

    constructor(firstName?: string, lastName?: string) {
        if (firstName && lastName) {
            this.firstName = firstName;
            this.lastName = lastName;
        }
    }
}

@JsonObject
class Employee extends Person {
    @JsonMember({type: Number})
    public salary: number;

    @JsonMember({type: Date})
    public joined: Date;

    constructor(firstName?: string, lastName?: string, salary?: number, joined?: Date) {
        super(firstName, lastName);

        if (salary && joined) {
            this.salary = salary;
            this.joined = joined;
        }
    }
}

@JsonObject({name: "part-time-employee"})
class PartTimeEmployee extends Employee {
    @JsonMember({type: Number, name: "work-hours"})
    public workHours: number;
}

@JsonObject()
class Investor extends Person {
    @JsonMember({type: Number, name: "invest-amount"})
    public investAmount: number;

    constructor(firstName?: string, lastName?: string, investAmount?: number) {
        super(firstName, lastName);

        this.investAmount = investAmount || 0;
    }
}

@JsonObject({name: "company", knownTypes: [PartTimeEmployee, Investor]})
class Company {
    @JsonMember({type: String})
    public name: string;

    @JsonMember({elements: Employee})
    public employees: Array<Employee>;

    @JsonMember({type: Person})
    public owner: Person;

    constructor() {
        this.employees = [];
    }
}

@TestFixture()
export class PolymorphismCustomNamesTest {

    protected static getRandomCompany(): Company {
        const company = new Company();
        company.name = "Json Types";

        switch (Math.floor(Math.random() * 4)) {
            case 0:
                company.owner = new Employee("John", "White", 240000, new Date(1992, 5, 27));
                break;

            case 1:
                company.owner = new Investor("John", "White", 1700000);
                break;

            case 2:
                company.owner = new PartTimeEmployee("John", "White", 160000, new Date(1992, 5, 27));
                (company.owner as PartTimeEmployee).workHours = Math.floor(Math.random() * 40);
                break;

            default:
                company.owner = new Person("John", "White");
                break;
        }

        // Add employees.
        for (let j = 0; j < 20; j++) {
            if (Math.random() < 0.2) {
                const newPartTimeEmployee = new PartTimeEmployee(
                    `firstname_${j}`,
                    `lastname_${j}`,
                    Math.floor(Math.random() * 80000),
                    new Date(Date.now() - Math.floor(Math.random() * 80000))
                );

                newPartTimeEmployee.workHours = Math.floor(Math.random() * 40);

                company.employees.push(newPartTimeEmployee);
            } else {
                company.employees.push(new Employee(
                    `firstname_${j}`,
                    `lastname_${j}`,
                    Math.floor(Math.random() * 80000),
                    new Date(Date.now() - Math.floor(Math.random() * 80000))
                ));
            }
        }
        return company;
    }

    @Test()
    public shouldSerialzeAndDeserialize() {
        const company = PolymorphismCustomNamesTest.getRandomCompany();

        TypedJSON.config({
            enableTypeHints: true
        });

        const json = TypedJSON.stringify(company);
        const reparsed = TypedJSON.parse(json, Company);

        Expect(isEqual(company, reparsed));
    }
}
