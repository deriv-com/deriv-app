const getMaxHeightByAligningBottom = ({ ref_rect, target_height }) => ref_rect.top + ref_rect.height + target_height;

const getMinHeightByAligningTop = ({ ref_rect, target_height }) => ref_rect.top - target_height;

export const getPosition = ({ preferred_alignment = 'bottom', target_el, ref_el }) => {
    const ref_rect = ref_el.getBoundingClientRect();
    const target_height = target_el.clientHeight;
    const body_rect = document.body.getBoundingClientRect();

    const { top, left, width } = ref_rect;
    const max_height = getMaxHeightByAligningBottom({ ref_rect, target_height });

    if (preferred_alignment === 'bottom') {
        if (max_height <= body_rect.height) {
            return {
                top: top + ref_rect.height,
                left,
                width,
                transformOrigin: 'top',
            };
        }
    }

    const min_height = getMinHeightByAligningTop({ ref_rect, target_height });
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
            top: top + ref_rect.height,
            left,
            transformOrigin: 'top',
        };
    }
    return {
        bottom: body_rect.bottom - top,
        left,
        transformOrigin: 'bottom',
    };
};
