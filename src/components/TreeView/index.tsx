import React, { useState } from 'react';
import {Spinner} from 'react-bootstrap';
import {NodeValue,NodeProps,TreeProps,TreeState, NodeElementState} from './type';
export * from './type';

export const Tree = React.memo((props: TreeProps) => {
    const [state,setState] = React.useState<TreeState>({
        loading: false,
        error: '',
        data: props.data
    });
    function updateTreeWithNewNode(newNode: NodeValue){
        props.data && props.getTreeData && props.getTreeData(props.data);
    }

    React.useEffect(() =>{
        if(props.data){
            setState(o =>({
                ...o,
                data: props.data
            }));
        }
    },[props.data]);

    return <ul>
        {state.data && state.data.map((node) => {
            return (
            <Node key={node.key}
                node={node}
                updateTreeWithNewNode={(newNode) => updateTreeWithNewNode(newNode)}
                customState={(node) => props.hasCustomState && props.customState && props.customState(node)}
                {...props}>
            </Node>
        )})}
    </ul>
})

const Node =(props: NodeProps) => {
    const [state,setState] = useState<NodeElementState>({
        loading: false,
        error: '',
        data: props.node
    });
    React.useEffect(() =>{ 
        setState(o=>({
            ...o,
            data:props.node
        })); 
    },[props.node]);
    function setNewNodeData(newNodeData:NodeValue){
        // Update current tree again
        props.updateTreeWithNewNode(newNodeData);
    }
    function setSubDataList(newDataList: NodeValue[]) {
        setState(o=>({
            ...o,
            loading: false,
            error: '',
            data:{
                ...o.data,
                subNodes: newDataList
            }
        }))
    }
    return (
        <li style={{
                listStyleType: 'none',
                cursor: 'pointer'
            }}>

            {!props.hasCustomState && <div onClick={async () => {
                    state.data.hasOpened = !state.data.hasOpened;
                    if(state.data.childrenAmount > state.data.childrenCurrent){
                        setState(o =>({...o, loading: true, error: ''}));
                        const newDataList = props.setCurrentNode && await props.setCurrentNode(props.node);
                        setSubDataList(newDataList || []);
                    }
                }}>
                <span className="tree-node-icon">
                    {state.data.icon}
                </span>

                <span>
                    {state.data.label}
                </span>
            </div>}

            {props.hasCustomState && props.customState && props.customState(state.data)}

            {state.loading && <Spinner animation='border'></Spinner>}

            {state.data.hasOpened && (<Tree data={state.data.subNodes} setCurrentNode={props.setCurrentNode} getTreeData={props.getTreeData} isLoadMore></Tree>)}
        </li>
    )
}
