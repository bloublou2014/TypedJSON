"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
exports.__esModule = true;
var object_compare_1 = require("./object-compare");
var bootstrap_1 = require("../bootstrap");
var Person = (function () {
    function Person(firstName, lastName) {
        if (firstName && lastName) {
            this.firstName = firstName;
            this.lastName = lastName;
        }
    }
    __decorate([
        bootstrap_1.JsonMember({ name: "first-name" }),
        __metadata("design:type", String)
    ], Person.prototype, "firstName");
    __decorate([
        bootstrap_1.JsonMember({ name: "last-name" }),
        __metadata("design:type", String)
    ], Person.prototype, "lastName");
    Person = __decorate([
        bootstrap_1.JsonObject,
        __metadata("design:paramtypes", [String, String])
    ], Person);
    return Person;
}());
var Employee = (function (_super) {
    __extends(Employee, _super);
    function Employee(firstName, lastName, salary, joined) {
        var _this = _super.call(this, firstName, lastName) || this;
        if (salary && joined) {
            _this.salary = salary;
            _this.joined = joined;
        }
        return _this;
    }
    __decorate([
        bootstrap_1.JsonMember,
        __metadata("design:type", Number)
    ], Employee.prototype, "salary");
    __decorate([
        bootstrap_1.JsonMember,
        __metadata("design:type", Date)
    ], Employee.prototype, "joined");
    Employee = __decorate([
        bootstrap_1.JsonObject,
        __metadata("design:paramtypes", [String, String, Number, Date])
    ], Employee);
    return Employee;
}(Person));
var PartTimeEmployee = (function (_super) {
    __extends(PartTimeEmployee, _super);
    function PartTimeEmployee() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        bootstrap_1.JsonMember({ name: "work-hours" }),
        __metadata("design:type", Number)
    ], PartTimeEmployee.prototype, "workHours");
    PartTimeEmployee = __decorate([
        bootstrap_1.JsonObject({ name: "part-time-employee" })
    ], PartTimeEmployee);
    return PartTimeEmployee;
}(Employee));
var Investor = (function (_super) {
    __extends(Investor, _super);
    function Investor(firstName, lastName, investAmount) {
        var _this = _super.call(this, firstName, lastName) || this;
        _this.investAmount = investAmount || 0;
        return _this;
    }
    __decorate([
        bootstrap_1.JsonMember({ name: "invest-amount" }),
        __metadata("design:type", Number)
    ], Investor.prototype, "investAmount");
    Investor = __decorate([
        bootstrap_1.JsonObject(),
        __metadata("design:paramtypes", [String, String, Number])
    ], Investor);
    return Investor;
}(Person));
var Company = (function () {
    function Company() {
        this.employees = [];
    }
    __decorate([
        bootstrap_1.JsonMember,
        __metadata("design:type", String)
    ], Company.prototype, "name");
    __decorate([
        bootstrap_1.JsonMember({ elements: Employee }),
        __metadata("design:type", Array)
    ], Company.prototype, "employees");
    __decorate([
        bootstrap_1.JsonMember,
        __metadata("design:type", Person)
    ], Company.prototype, "owner");
    Company = __decorate([
        bootstrap_1.JsonObject({ name: "company", knownTypes: [PartTimeEmployee, Investor] }),
        __metadata("design:paramtypes", [])
    ], Company);
    return Company;
}());
function test(log) {
    // Create a Company.
    var company = new Company();
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
            company.owner.workHours = Math.floor(Math.random() * 40);
            break;
        default:
            company.owner = new Person("John", "White");
            break;
    }
    // Add employees.
    for (var j = 0; j < 20; j++) {
        if (Math.random() < 0.2) {
            var newPartTimeEmployee = new PartTimeEmployee("firstname_" + j, "lastname_" + j, Math.floor(Math.random() * 80000), new Date(Date.now() - Math.floor(Math.random() * 80000)));
            newPartTimeEmployee.workHours = Math.floor(Math.random() * 40);
            company.employees.push(newPartTimeEmployee);
        }
        else {
            company.employees.push(new Employee("firstname_" + j, "lastname_" + j, Math.floor(Math.random() * 80000), new Date(Date.now() - Math.floor(Math.random() * 80000))));
        }
    }
    bootstrap_1.TypedJSON.config({
        enableTypeHints: true
    });
    var json = bootstrap_1.TypedJSON.stringify(company);
    var reparsed = bootstrap_1.TypedJSON.parse(json, Company);
    if (log) {
        console.log("Test: polymorphism with custom names...");
        console.log(company);
        console.log(JSON.parse(json));
        console.log(reparsed);
        console.log("Test finished.");
    }
    return object_compare_1.isEqual(company, reparsed);
}
exports.test = test;
