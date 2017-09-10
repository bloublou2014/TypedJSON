"use strict";
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
var bootstrap_1 = require("../bootstrap");
var Person = (function () {
    function Person() {
    }
    Person.prototype.getFullname = function () {
        return this.firstName + " " + this.lastName;
    };
    __decorate([
        bootstrap_1.JsonMember,
        __metadata("design:type", String)
    ], Person.prototype, "firstName");
    __decorate([
        bootstrap_1.JsonMember,
        __metadata("design:type", String)
    ], Person.prototype, "lastName");
    Person = __decorate([
        bootstrap_1.JsonObject
    ], Person);
    return Person;
}());
function test(log) {
    var person = bootstrap_1.TypedJSON.parse('{ "firstName": "John", "lastName": "Doe" }', Person);
    person instanceof Person; // true
    person.getFullname(); // "John Doe"
    return person.getFullname() === "John Doe" && person instanceof Person;
}
exports.test = test;
