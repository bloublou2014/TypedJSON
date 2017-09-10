import {isEqual} from "./object-compare";
import {JsonObject, JsonMember, TypedJSON} from "../bootstrap";
import {Expect, Test, TestFixture} from "alsatian";


interface Point {
    x: number;
    y: number;
}

@JsonObject
class SmallNode implements Point {
    @JsonMember({type: Number})
    x: number;

    @JsonMember({type: Number})
    y: number;

    @JsonMember({type: String})
    inputType: string;

    @JsonMember({type: String})
    outputType: string;
}

@JsonObject
class BigNode implements Point {
    @JsonMember({type: Number})
    x: number;

    @JsonMember({type: Number})
    y: number;

    @JsonMember({elements: String})
    inputs: string[];

    @JsonMember({elements: String})
    outputs: string[];

    constructor() {
        this.inputs = [];
        this.outputs = [];
    }
}

@JsonObject({
    knownTypes: [BigNode, SmallNode]
})
class GraphGrid {
    @JsonMember({elements: Object, refersAbstractType: true})
    points: Point[];

    @JsonMember({type: Object, refersAbstractType: true})
    root: Point;

    constructor() {
        this.points = [];
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
export class PolymorphismInterfaceTest {

    protected static getRandomGraphGrid(): GraphGrid {
        const graph = new GraphGrid();

        for (let i = 0; i < 20; i++) {
            let point: Point;

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

                point = bigNode;
            } else {
                let smallNode = new SmallNode();

                smallNode.inputType = randPortType();
                smallNode.outputType = randPortType();

                point = smallNode;
            }

            point.x = Math.random();
            point.y = Math.random();

            if (i === 0) {
                graph.root = point;
            } else {
                graph.points.push(point);
            }
        }
        return graph;
    }

    @Test()
    public shouldSerialzeAndDeserialize() {
        const graphGrid = PolymorphismInterfaceTest.getRandomGraphGrid();

        TypedJSON.config({
            enableTypeHints: true
        });

        const json = TypedJSON.stringify(graphGrid);
        const reparsed = TypedJSON.parse(json, GraphGrid);

        Expect(isEqual(graphGrid, reparsed));
    }
}