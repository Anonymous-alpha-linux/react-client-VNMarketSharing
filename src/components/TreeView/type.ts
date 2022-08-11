export interface NodeValue {
    key: string;
    label: string;
    icon: React.ReactNode;
    level: number;
    childrenAmount: number;
    childrenCurrent: number;
    hasOpened: boolean;
    subNodes?: NodeValue[];
}
export interface TreeProps {
    children?: React.ReactNode;
    data?: NodeValue[];
    isLoadMore?: boolean;
    hasCustomState?: boolean;
    getTreeData?: (treeData: NodeValue[]) => void;
    setCurrentNode: (
        currentNode: NodeValue
    ) => NodeValue[] | Promise<NodeValue[]>;
    customState?: (nodeState: NodeValue) => React.ReactNode;
}
export interface NodeProps extends TreeProps {
    node: NodeValue;
    updateTreeWithNewNode: (newNode: NodeValue) => void;
}
export interface TreeState {
    loading: boolean;
    error: string;
    data?: NodeValue[];
}
export interface NodeElementState {
    loading: boolean;
    error: string;
    data: NodeValue;
}
