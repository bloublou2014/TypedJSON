import {isEqual} from "./object-compare";
import {TypedJSON, JsonObject, JsonMember} from "../bootstrap";
import {Expect, Test, TestFixture} from "alsatian";

abstract class Node {
    @JsonMember({type:String})
    name: string;
}

@JsonObject
class SmallNode extends Node {
    @JsonMember({type:String})
    inputType: string;

    @JsonMember({type:String})
    outputType: string;
}

@JsonObject
class BigNode extends Node {
    @JsonMember({ elements: String })
    inputs: string[];

    @JsonMember({ elements: String })
    outputs: string[];

    constructor() {
        super();
        this.inputs = [];
        this.outputs = [];
    }
}

@JsonObject({
    knownTypes: [BigNode, SmallNode]
})
class Graph {
    @JsonMember({ elements: Node, refersAbstractType: true })
    nodes: Node[];

    @JsonMember({ type:Node, refersAbstractType: true })
    root: Node;

    constructor() {
        this.nodes = [];
    }
}

function randPortType() {
    const types = [
        "string",
        "integer",
        "float",
        "boolean",
        "void"
    ];

    return types[Math.floor(Math.random() * types.length)];
}

@TestFixture()
export class PolymorphismAbstractClassTest{

    protected static getRandomGraph(): Graph {
        const graph = new Graph();

        for (let i = 0; i < 20; i++) {
            let node: Node;

            if (Math.random() < 0.25) {
                let bigNode = new BigNode();

                bigNode.inputs = [
                    randPortType(),
                    randPortType(),
                    randPortType()
                ];
                bigNode.outputs = [
                    randPortType(),
                    randPortType()
                ];

                node = bigNode;
            } else {
                let smallNode = new SmallNode();

                smallNode.inputType = randPortType();
                smallNode.outputType = randPortType();

                node = smallNode;
            }

            node.name = `node_${i}`;

            if (i === 0) {
                graph.root = node;
            } else {
                graph.nodes.push(node);
            }
        }
        return graph;
    }

    @Test()
    public shouldSerialzeAndDeserialize() {
        const graph = PolymorphismAbstractClassTest.getRandomGraph();

        TypedJSON.config({
            enableTypeHints: true
        });

        const json = TypedJSON.stringify(graph);
        const reparsed = TypedJSON.parse(json, Graph);

        Expect(reparsed instanceof Graph);
        Expect(isEqual(graph, reparsed));
    }
}

