import {isEqual} from "./object-compare";
import {TypedJSON, JsonObject, JsonMember} from "../bootstrap";
import {Expect, Test, TestFixture} from "alsatian";

abstract class Node {
    @JsonMember({type: String})
    name: string;
}

@JsonObject
class SmallNode extends Node {
    @JsonMember({type: String})
    test: string;
}

@JsonObject()
class Graph {
    @JsonMember({type: Object})
    root: Node;

    /**
     * Get typed configuration
     */
    public getRoot(type?: any) {
        // load from File
        return TypedJSON.parse(JSON.stringify(this.root), type);
    }
}


@TestFixture("Runtime type providing deserialization")
export class PolymorphismAbstractClassGenericTest {

    protected static getGraph(): Graph {
        const graph = new Graph();
        let node: Node;
        let smallNode = new SmallNode();
        smallNode.test = "test";
        smallNode.name = `node_test`;
        graph.root = smallNode;
        return graph;
    }

    @Test()
    public shouldDeserializeGenericTypeAtRuntime() {
        const graph = PolymorphismAbstractClassGenericTest.getGraph();

        TypedJSON.config({
            enableTypeHints: true
        });

        const json = JSON.stringify(graph);
        console.log(json);
        const reparsed = TypedJSON.parse(json, Graph);
        const smallNode : SmallNode = reparsed.getRoot(SmallNode);

        Expect(smallNode instanceof SmallNode);
        Expect(smallNode.test === "test");
        Expect(smallNode.name === "node_test");
    }
}

