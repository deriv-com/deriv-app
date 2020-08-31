import PropTypes from 'prop-types';

export const getDisplayText = (list, value) => {
    const findInArray = arr_list => (arr_list.find(item => item.value === value) || {}).text;
    let text = '';
    if (Array.isArray(list)) {
        text = findInArray(list);
    } else {
        Object.keys(list).some(key => {
            text = findInArray(list[key]);
            return text;
        });
    }
    return text;
};

export const findNextFocusableNode = active_node => {
    if (!active_node) return null;
    if (active_node.attributes.tabIndex) return active_node;
    return findNextFocusableNode(active_node.nextSibling);
};

export const findPreviousFocusableNode = active_node => {
    if (!active_node) return null;
    if (active_node.attributes.tabIndex) return active_node;
    return findPreviousFocusableNode(active_node.previousSibling);
};

export const listPropType = () =>
    PropTypes.oneOfType([
        PropTypes.arrayOf(
            PropTypes.shape({
                disabled: PropTypes.bool,
                has_tooltip: PropTypes.bool,
                text: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
                tooltip: PropTypes.string,
                value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            })
        ),
        PropTypes.object,
    ]);
