import { Component, For } from "solid-js"; 

interface NodeProps {
    id: string;
    x: number;
    y: number;
    numberInputs: number;
    numberOutputs: number;
    selected: boolean;
    onMouseDownNode: (id: string, event: MouseEvent) => void;
    onMouseDownOutput: (outputPositionX: number, outputPositionY: number, nodeId: string, outputIndex: number) => void;
    onMouseEnterInput: (inputPositionX: number, inputPositionY: number, nodeId: string, inputIndex: number) => void;
    onMouseLeaveInput: (nodeId: string, inputIndex: number) => void;
}

import styles from "./styles.module.css";

const NodeComponent: Component<NodeProps> = (props) => {
    function handleMouseDownOutput(ref: any, event: any, outputIndex: number) {
        // Disable drag node
        event.stopPropagation();

        const centerX =
            ref.getBoundingClientRect().left + Math.abs(ref.getBoundingClientRect().right - ref.getBoundingClientRect().left) / 2;
        const centerY =
            ref.getBoundingClientRect().top + Math.abs(ref.getBoundingClientRect().bottom - ref.getBoundingClientRect().top) / 2;

        props.onMouseDownOutput(centerX, centerY, props.id, outputIndex);
    }

    
    function handleMouseEnterInput(ref: any, inputIndex: number) {
        // Disable drag node
       
        const centerX =
            ref.getBoundingClientRect().left + Math.abs(ref.getBoundingClientRect().right - ref.getBoundingClientRect().left) / 2;
        const centerY =
            ref.getBoundingClientRect().top + Math.abs(ref.getBoundingClientRect().bottom - ref.getBoundingClientRect().top) / 2;



            props.onMouseEnterInput(centerX, centerY, props.id, inputIndex);

        }

        function handleMouseLeaveInput(inputIndex: number) {
            props.onMouseLeaveInput(props.id, inputIndex);
        }
    


    return (
        <div
            class={props.selected ? styles.nodeSelected : styles.node}
            style={{
                transform: `translate(${props.x}px, ${props.y}px)`,
            }}
            onMouseDown={(event: any) => {
                // Prevent Click On Board
                event.stopPropagation();
                props.onMouseDownNode(props.id, event);
            }}
        >
            <div class={styles.inputsWrapper}>
                <For each={[...Array(props.numberInputs).keys()]}>
                    {(value, index) => {
                        return (
                            <div
                                ref={(el) => {
                                    if (el) {
                                        el.addEventListener("mouseenter", () => handleMouseEnterInput(el, index()));
                                        el.addEventListener("mouseleave", () => handleMouseLeaveInput(index()));
                                    }
                                }}
                                class={styles.input}
                            ></div>
                        );
                    }}
                </For>
            </div>
        </div>
    );
};

export default NodeComponent;
