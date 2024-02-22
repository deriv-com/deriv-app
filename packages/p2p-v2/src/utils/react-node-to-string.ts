import { isValidElement, ReactNode } from 'react';

/**
 * The below function is used to convert a ReactNode to a string.
 * @param {ReactNode} reactNode - The element to be converted to a string
 * @returns {String} The string representation of the element
 */
export const reactNodeToString = function (reactNode: ReactNode): string {
    let string = '';
    if (typeof reactNode === 'string') {
        string = reactNode;
    } else if (typeof reactNode === 'number') {
        string = reactNode.toString();
    } else if (reactNode instanceof Array) {
        reactNode.forEach(function (child) {
            string += reactNodeToString(child);
        });
    } else if (isValidElement(reactNode)) {
        string += reactNodeToString(reactNode.props.children);
    }
    return string;
};
