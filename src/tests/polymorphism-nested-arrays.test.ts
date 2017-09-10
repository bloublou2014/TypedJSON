import {isEqual} from "./object-compare";
import {JsonObject, JsonMember, TypedJSON} from "../bootstrap";
import {Expect, Test, TestFixture} from "alsatian";

abstract class Node {
    @JsonMember({type: String})
    name: string;
}

@JsonObject
class SmallNode extends Node {
    @JsonMember({type: String})
    inputType: string;

    @JsonMember({type: String})
    outputType: string;
}

@JsonObject
class BigNode extends Node {
    @JsonMember({elements: String})
    inputs: string[];

    @JsonMember({elements: String})
    outputs: string[];

    constructor() {
        super();
        this.inputs = [];
        this.outputs = [];
    }
}

@JsonObject({knownTypes: [BigNode, SmallNode]})
class Graph {
    @JsonMember({elements: {elements: Node}})
    items: Array<Array<Node>>;

    @JsonMember({elements: {elements: SmallNode}})
    smallItems: Array<Array<SmallNode>>;

    constructor() {
        this.items = [];
        this.smallItems = [];
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
export class PolymorphismNestedArraysTest {

    protected static getRandomGraph(): Graph {
        const graph = new Graph();

        for (let i = 0; i < 20; i++) {
            graph.smallItems.push([]);

            for (let j = 0; j < 8; j++) {
                let node = new SmallNode();

                node.name = `smallnode_${i}_${j}`;
                node.inputType = randPortType();
                node.outputType = randPortType();

                graph.smallItems[i].push(node);
            }
        }

        for (let i = 0; i < 20; i++) {
            graph.items.push([]);

            for (let j = 0; j < 8; j++) {
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

                node.name = `node_${i}_${j}`;

                graph.items[i].push(node);
            }
        }
        return graph;
    }

    @Test()
    public shouldSerialzeAndDeserialize() {
        const graph = PolymorphismNestedArraysTest.getRandomGraph();

        TypedJSON.config({
            enableTypeHints: true
        });

        const json = TypedJSON.stringify(graph);
        const reparsed = TypedJSON.parse(json, Graph);

        Expect(isEqual(graph, reparsed));
    }
}
