export type TListItem = {
    tooltip?: string;
    disabled?: boolean;
    has_tooltip?: boolean;
    text: string;
    value: string;
};

export type TList = TListItem[];

type TActiveNode = HTMLElement & {
    attributes: {
        tabIndex: number;
    };
    nextSibling: TActiveNode;
    previousSibling: TActiveNode;
};

type TFocusableNode = (active_node: TActiveNode) => TActiveNode | null;

export const getDisplayText = (list: TList, value: string | number) => {
    const findInArray = (arr_list: TList) => (arr_list.find(item => item.value === value) || {}).text;
    let text = '';
    if (Array.isArray(list)) {
        text = findInArray(list) || '';
    } else {
        Object.keys(list).some(key => {
            text = findInArray(list[key]) || '';
            return text;
        });
    }
    return text;
};

export const findNextFocusableNode: TFocusableNode = active_node => {
    if (!active_node) return null;
    if (active_node.attributes.tabIndex) return active_node;
    return findNextFocusableNode(active_node.nextSibling);
};

export const findPreviousFocusableNode: TFocusableNode = active_node => {
    if (!active_node) return null;
    if (active_node.attributes.tabIndex) return active_node;
    return findPreviousFocusableNode(active_node.previousSibling);
};
