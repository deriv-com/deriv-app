const getMaxHeightByAligningBottom = ({ parent_rect, child_height }) =>
    parent_rect.top + parent_rect.height + child_height;

const getMinHeightByAligningTop = ({ parent_rect, child_height }) => parent_rect.top - child_height;

export const getPosition = ({ preferred_alignment = 'bottom', child_el, parent_el }) => {
    const parent_rect = parent_el.getBoundingClientRect();
    const child_height = child_el.clientHeight;
    const body_rect = document.body.getBoundingClientRect();

    const { top, left, width } = parent_rect;
    const max_height = getMaxHeightByAligningBottom({ parent_rect, child_height });

    if (preferred_alignment === 'bottom') {
        if (max_height <= body_rect.height) {
            return {
                top: top + parent_rect.height,
                left,
                width,
                transformOrigin: 'top',
            };
        }
    }

    const min_height = getMinHeightByAligningTop({ parent_rect, child_height });
    if (preferred_alignment === 'top') {
        if (min_height >= 0) {
            return {
                bottom: body_rect.bottom - top,
                left,
                width,
                transformOrigin: 'bottom',
            };
        }
    }

    if (max_height - body_rect.height < 0 - min_height) {
        return {
            top: top + parent_rect.height,
            left,
            width,
            transformOrigin: 'top',
        };
    }
    return {
        bottom: body_rect.bottom - top,
        left,
        width,
        transformOrigin: 'bottom',
    };
};
