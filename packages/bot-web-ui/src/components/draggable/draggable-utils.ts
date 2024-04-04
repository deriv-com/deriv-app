export enum DRAGGABLE_CONSTANTS {
    MOVE = 'move',
    TOP = 'top',
    RIGHT = 'right',
    BOTTOM = 'bottom',
    LEFT = 'left',
    TOP_RIGHT = 'top-right',
    BOTTOM_RIGHT = 'bottom-right',
    BOTTOM_LEFT = 'bottom-left',
    TOP_LEFT = 'top-left',
    BODY_REF = 'body',
    SAFETY_MARGIN = 5,
    EXTRA_BOTTOM_RIGHT_SAFETY_MARGIN = 2,
}

export type TCalculateWidth = {
    prevWidth: number;
    leftOffset: number;
    boundaryRect: DOMRect | undefined;
    initialSelfRight: number;
    resize_direction: string;
    newWidth: number;
    minWidth: number;
    clientX: number;
    self: DOMRect | undefined;
};

export type TCalculateHeight = {
    prevHeight: number;
    topOffset: number;
    boundaryRect: DOMRect | undefined;
    initialSelfBottom: number;
    resize_direction: string;
    newHeight: number;
    minHeight: number;
    clientY: number;
    self: DOMRect | undefined;
};

export type TCalculateZindex = {
    setZIndex: (zIndex: number) => void;
};

export type TDraggableProps = {
    children: React.ReactNode;
    boundary?: string;
    initialValues?: {
        width: number;
        height: number;
        xAxis: number;
        yAxis: number;
    };
    minWidth?: number;
    minHeight?: number;
    enableResizing?: boolean;
    enableDragging?: boolean;
    header?: string;
    onClose?: () => void;
};

export const calculateZindex = ({ setZIndex }: TCalculateZindex) => {
    const draggableModals = document.getElementsByClassName('draggable');
    if (!draggableModals.length) return;
    const maxZIndex = Array.from(draggableModals).reduce(
        (maxZ, modal) => Math.max(maxZ, parseInt(window.getComputedStyle(modal).zIndex) || 0),
        0
    );
    const newZIndex = maxZIndex + 3;
    setZIndex(newZIndex);
};

export const calculateWidth = ({
    prevWidth,
    leftOffset,
    boundaryRect,
    initialSelfRight,
    resize_direction,
    newWidth,
    minWidth,
    clientX,
    self,
}: TCalculateWidth) => {
    const leftLimit = boundaryRect?.left ?? 0 + leftOffset + DRAGGABLE_CONSTANTS.SAFETY_MARGIN;
    const rightLimit =
        (boundaryRect?.left ?? 0) +
        (boundaryRect?.width ?? 0) -
        (DRAGGABLE_CONSTANTS.SAFETY_MARGIN + DRAGGABLE_CONSTANTS.EXTRA_BOTTOM_RIGHT_SAFETY_MARGIN);
    const calculatedPreviousWidth = rightLimit - leftLimit - (rightLimit - initialSelfRight);
    if (resize_direction.includes(DRAGGABLE_CONSTANTS.LEFT)) {
        if (newWidth >= minWidth && clientX > leftLimit) return newWidth;
        if (clientX < leftLimit + DRAGGABLE_CONSTANTS.SAFETY_MARGIN * 2)
            return calculatedPreviousWidth - DRAGGABLE_CONSTANTS.SAFETY_MARGIN * 2;
        return prevWidth;
    }
    if (resize_direction.includes(DRAGGABLE_CONSTANTS.RIGHT)) {
        if (newWidth >= minWidth && clientX < rightLimit) return newWidth;
        if (clientX > rightLimit) return rightLimit - (self?.left ?? 0);
        return prevWidth;
    }
    return prevWidth;
};

export const calculateHeight = ({
    prevHeight,
    topOffset,
    boundaryRect,
    initialSelfBottom,
    resize_direction,
    newHeight,
    minHeight,
    clientY,
    self,
}: TCalculateHeight) => {
    const topLimit = boundaryRect?.top ?? 0 + topOffset + DRAGGABLE_CONSTANTS.SAFETY_MARGIN;
    const bottomLimit =
        (boundaryRect?.top ?? 0) +
        (boundaryRect?.height ?? 0) -
        (DRAGGABLE_CONSTANTS.SAFETY_MARGIN + DRAGGABLE_CONSTANTS.EXTRA_BOTTOM_RIGHT_SAFETY_MARGIN);
    const calculatedPreviousHeight = bottomLimit - topLimit - (bottomLimit - initialSelfBottom);
    if (resize_direction.includes(DRAGGABLE_CONSTANTS.TOP)) {
        if (newHeight >= minHeight && clientY > topLimit) return newHeight;
        if (clientY < topLimit + DRAGGABLE_CONSTANTS.SAFETY_MARGIN * 2)
            return calculatedPreviousHeight - DRAGGABLE_CONSTANTS.SAFETY_MARGIN * 2;
        return prevHeight;
    }
    if (resize_direction.includes(DRAGGABLE_CONSTANTS.BOTTOM)) {
        if (newHeight >= minHeight && clientY < bottomLimit) return newHeight;
        if (clientY > bottomLimit) return bottomLimit - (self?.top ?? 0);
        return prevHeight;
    }
    return prevHeight;
};
