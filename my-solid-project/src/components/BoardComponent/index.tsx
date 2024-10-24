import { Component, createSignal, onMount, onCleanup, Accessor, Setter, For } from "solid-js"; // Import createSignal and onCleanup
import styles from "./styles.module.css";
import ButtonsComponent from "./ButtonsComponent";
import NodeComponent from "./NodeComponent";

interface Node {
    id: string;
    numberInputs: number;
    numberOutputs: number;
    prevPosition: { get: Accessor<{ x: number; y: number }>; set: Setter<{ x: number; y: number }> };
    currPosition: { get: Accessor<{ x: number; y: number }>; set: Setter<{ x: number; y: number }> };
    inputEdgeIds: { get: Accessor<string[]>; set: Setter<string[]> };
    outputEdgeIds: { get: Accessor<string[]>; set: Setter<string[]> };
}

const BoardComponent: Component = () => {
    const [grabbingBoard, setGrabbingBoard] = createSignal<boolean>(false);
    const [scale, setScale] = createSignal<number>(1);
    const [clickedPosition, setClickedPosition] = createSignal<{ x: number; y: number }>({ x: -1, y: -1 });
    const [selectedNode, setSelectedNode] = createSignal<string | null>(null);
    const [nodes, setNodes] = createSignal<Node[]>([]);

    onMount(() => {
        const boardElement = document.getElementById("board");

        if (boardElement) {
            const handleWheel = (event: WheelEvent) => {
                event.preventDefault(); // Prevent default scrolling behavior
                const newScale = scale() + event.deltaY * -0.005;

                // Restrict scale
                setScale(Math.min(Math.max(newScale, 1), 2));

                // Apply scale transform
                boardElement.style.transform = `scale(${scale()})`;
                boardElement.style.marginTop = `${(scale() - 1) * 50}vh`;
                boardElement.style.marginLeft = `${(scale() - 1) * 50}vw`;
            };

            boardElement.addEventListener("wheel", handleWheel, { passive: false });

            // Cleanup the event listener on component unmount
            onCleanup(() => {
                boardElement.removeEventListener("wheel", handleWheel);
            });
        }
    });

    function handleOnMouseDownBoard(event: any) {
        // Implement your logic for mouse down
        setGrabbingBoard(true);
        setClickedPosition({ x: event.x, y: event.y });
    }

    function handleOnMouseUpBoard() {
        setClickedPosition({ x: -1, y: -1 });

        // Stop grabbing board
        setGrabbingBoard(false);

        // If a new edge is being set and is not inside input
    }

    function handleOnMouseMove(event: MouseEvent) {
        if (clickedPosition().x >= 0 && clickedPosition().y >= 0) {
            const deltaX = event.x - clickedPosition().x;
            const deltaY = event.y - clickedPosition().y;

            const boardWrapperElement = document.getElementById("boardWrapper");
            if (boardWrapperElement) {
                boardWrapperElement.scrollBy(-deltaX, -deltaY);
                setClickedPosition({ x: event.x, y: event.y });
            }
        }
        // User clicked on node
    }

    function handleOnClickAdd(numberInputs: number, numberOutputs: number) {
        const randomX = Math.random() * window.innerWidth;
        const randomY = Math.random() * window.innerHeight;

        // Create signal
        const [nodePrev, setNodePrev] = createSignal<{ x: number; y: number }>({ x: randomX, y: randomY });
        const [nodeCurr, setNodeCurr] = createSignal<{ x: number; y: number }>({ x: randomX, y: randomY });
        const [inputsEdgesIds, setInputsEdgesIds] = createSignal<string[]>([]);
        const [outputsEdgesIds, setOutputsEdgesIds] = createSignal<string[]>([]);

        // Update global nodes array
        setNodes([
            ...nodes(),
            {
                id: `node_${Math.random().toString(36).substring(2, 8)}`,
                numberInputs,
                numberOutputs,
                prevPosition: { get: nodePrev, set: setNodePrev },
                currPosition: { get: nodeCurr, set: setNodeCurr },
                inputEdgeIds: { get: inputsEdgesIds, set: setInputsEdgesIds },
                outputEdgeIds: { get: outputsEdgesIds, set: setOutputsEdgesIds },
            },
        ]);
    }

    function handleOnClickDelete() {}

    function handleOnMouseDownNode(id: string, event: any) {}

    function handleOnMouseDownOutput(outputPositionX: number, outputPositionY: number, nodeId: string, outputIndex: number) {}

    function handleOnMouseEnterInput(inputPositionX: number, inputPositionY: number, nodeId: string, inputIndex: number) {}

    function handleOnMouseLeaveInput(nodeId: string, inputIndex: number) {} 

    return (
        <div id="boardWrapper" class={styles.wrapper}>
            <ButtonsComponent showDelete={selectedNode() !== null} onClickAdd={handleOnClickAdd} onClickDelete={handleOnClickDelete} />
            <div 
                id="board" 
                class={grabbingBoard() ? styles.boardDragging : styles.board}
                onMouseDown={handleOnMouseDownBoard}
                onMouseUp={handleOnMouseUpBoard}
                onMouseMove={handleOnMouseMove}
            >
                <For each={nodes()}>
                    {(node: Node) => (
                        <NodeComponent
                            id={node.id}
                            x={node.currPosition.get().x}
                            y={node.currPosition.get().y}
                            numberInputs={node.numberInputs}
                            numberOutputs={node.numberOutputs}
                            selected={selectedNode() === node.id}
                            onMouseDownNode={handleOnMouseDownNode}
                            onMouseDownOutput={handleOnMouseDownOutput}
                            onMouseEnterInput={handleOnMouseEnterInput}
                            onMouseLeaveInput={handleOnMouseLeaveInput}
                        />
                    )}
                </For>
            </div>
        </div>
    );
};

// Exporting the component at the top level
export default BoardComponent;
