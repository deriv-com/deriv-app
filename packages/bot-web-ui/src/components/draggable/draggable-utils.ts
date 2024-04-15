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
}
export const SAFETY_MARGIN = 5;
export const EXTRA_BOTTOM_RIGHT_SAFETY_MARGIN = 2;

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
    const leftBoundary = boundaryRect?.left ?? 0;
    const boundaryWidth = boundaryRect?.width ?? 0;
    const leftLimit = leftBoundary + leftOffset + SAFETY_MARGIN;
    const selfLeft = self?.left ?? 0;

    const rightLimit = leftBoundary + boundaryWidth - (SAFETY_MARGIN + EXTRA_BOTTOM_RIGHT_SAFETY_MARGIN);
    const calculatedPreviousWidth = rightLimit - leftLimit - (rightLimit - initialSelfRight);

    if (resize_direction.includes(DRAGGABLE_CONSTANTS.LEFT)) {
        if (newWidth >= minWidth && clientX > leftLimit) return newWidth;
        if (clientX < leftLimit + SAFETY_MARGIN * 2) return calculatedPreviousWidth - SAFETY_MARGIN * 2;
        return prevWidth;
    }
    if (resize_direction.includes(DRAGGABLE_CONSTANTS.RIGHT)) {
        if (newWidth >= minWidth && clientX < rightLimit) return newWidth;
        if (clientX > rightLimit) return rightLimit - selfLeft;
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
    const topBoundary = boundaryRect?.top ?? 0;
    const boundaryHeight = boundaryRect?.height ?? 0;
    const topLimit = topBoundary + topOffset + SAFETY_MARGIN;
    const selfTop = self?.top ?? 0;

    const bottomLimit = topBoundary + boundaryHeight - (SAFETY_MARGIN + EXTRA_BOTTOM_RIGHT_SAFETY_MARGIN);
    const calculatedPreviousHeight = bottomLimit - topLimit - (bottomLimit - initialSelfBottom);

    if (resize_direction.includes(DRAGGABLE_CONSTANTS.TOP)) {
        if (newHeight >= minHeight && clientY > topLimit) return newHeight;
        if (clientY < topLimit + SAFETY_MARGIN * 2) return calculatedPreviousHeight - SAFETY_MARGIN * 2;
        return prevHeight;
    }
    if (resize_direction.includes(DRAGGABLE_CONSTANTS.BOTTOM)) {
        if (newHeight >= minHeight && clientY < bottomLimit) return newHeight;
        if (clientY > bottomLimit) return bottomLimit - selfTop;
        return prevHeight;
    }
    return prevHeight;
};
