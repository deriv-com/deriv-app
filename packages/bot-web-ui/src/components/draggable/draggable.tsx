import React, { useEffect, useRef, useState } from 'react';
import { Icon } from '@deriv/components';
import {
    calculateHeight,
    calculateWidth,
    calculateZindex,
    DRAGGABLE_CONSTANTS,
    EXTRA_BOTTOM_RIGHT_SAFETY_MARGIN,
    SAFETY_MARGIN,
    TDraggableProps,
} from './draggable-utils';
import './draggable.scss';

const Draggable: React.FC<TDraggableProps> = ({
    children,
    boundary,
    initialValues = {
        width: 400,
        height: 400,
        xAxis: 0,
        yAxis: 0,
    },
    minWidth = 100,
    minHeight = 100,
    enableResizing = false,
    enableDragging = true,
    header = '',
    onClose,
}) => {
    const [position, setPosition] = useState({ x: initialValues.xAxis, y: initialValues.yAxis });
    const [size, setSize] = useState({ width: initialValues.width, height: initialValues.height });
    const [zIndex, setZIndex] = useState(100);

    const isResizing = useRef(false);
    const [isDragging, setIsDragging] = useState(false);
    const draggableRef = useRef<HTMLDivElement>(null);
    const [boundaryRef, setBoundaryRef] = useState(
        document.querySelector(boundary ?? DRAGGABLE_CONSTANTS.BODY_REF) as HTMLElement | null
    );

    useEffect(() => {
        setSize({ width: initialValues.width, height: initialValues.height });
        setPosition({ x: initialValues.xAxis, y: initialValues.yAxis });
    }, [initialValues.height, initialValues.width, initialValues.xAxis, initialValues.yAxis]);

    useEffect(() => {
        const boundaryEl = document.querySelector(boundary ?? DRAGGABLE_CONSTANTS.BODY_REF) as HTMLElement | null;
        setBoundaryRef(boundaryEl);
        calculateZindex({ setZIndex });
    }, [boundary]);

    const handleMouseDown = (event: React.MouseEvent<HTMLElement, MouseEvent> | null, action: string) => {
        event?.stopPropagation();
        calculateZindex({ setZIndex });
        if (!action) return;
        const resize_direction = action;
        isResizing.current = action !== DRAGGABLE_CONSTANTS.MOVE && enableResizing;
        setIsDragging(action === DRAGGABLE_CONSTANTS.MOVE && enableDragging);

        const boundaryRect = boundaryRef?.getBoundingClientRect();
        const topOffset = boundaryRef?.offsetTop ?? 0;
        const leftOffset = boundaryRef?.offsetLeft ?? 0;
        const initialMouseX = event?.clientX ?? 0;
        const initialMouseY = event?.clientY ?? 0;
        const initialWidth = size?.width ?? initialValues.width;
        const initialHeight = size?.height ?? initialValues.height;
        const initialX = position?.x ?? 0;
        const initialY = position?.y ?? 0;
        const initialSelfRight = draggableRef.current?.getBoundingClientRect()?.right ?? size.width;
        const initialSelfBottom = draggableRef.current?.getBoundingClientRect()?.bottom ?? size.height;

        let previousStyle = {};
        let previousPointerEvent = 'unset';
        const draggableContentBody = draggableRef.current?.querySelector(
            '#draggable-content-body'
        ) as HTMLElement | null;

        if (draggableContentBody) {
            const { style } = draggableContentBody;
            if (style && style.pointerEvents !== 'none') {
                previousStyle = { ...style };
                previousPointerEvent = style.pointerEvents;
                style.pointerEvents = 'none';
            }
        }

        const handleMouseMove = (e: { clientX: number; clientY: number }) => {
            if (!e) return;
            const { clientX, clientY } = e;
            const deltaX = clientX - initialMouseX;
            const deltaY = clientY - initialMouseY;
            try {
                if (isResizing.current) {
                    handleResize(deltaX, deltaY, clientX, clientY);
                } else {
                    handleDrag(deltaX, deltaY);
                }
            } catch (error) {
                handleMouseUp();
            }
        };

        const handleResize = (deltaX: number, deltaY: number, clientX: number, clientY: number) => {
            let newX = position?.x ?? 0;
            let newY = position?.y ?? 0;
            let newWidth = initialWidth;
            let newHeight = initialHeight;

            if (resize_direction.includes(DRAGGABLE_CONSTANTS.RIGHT)) {
                newWidth += deltaX;
            } else if (resize_direction.includes(DRAGGABLE_CONSTANTS.LEFT)) {
                newX = deltaX + initialX;
                newWidth -= deltaX;
            }

            if (resize_direction.includes(DRAGGABLE_CONSTANTS.BOTTOM)) {
                newHeight += deltaY;
            } else if (resize_direction.includes(DRAGGABLE_CONSTANTS.TOP)) {
                newY = deltaY + initialY;
                newHeight -= deltaY;
            }

            setPosition(prev => {
                const maxY = Math.max(newY, topOffset + SAFETY_MARGIN);
                const maxX = Math.max(newX, leftOffset + SAFETY_MARGIN);
                return { x: newWidth <= minWidth ? prev.x : maxX, y: newHeight <= minHeight ? prev.y : maxY };
            });

            const self = draggableRef.current?.getBoundingClientRect();

            setSize(prev => ({
                width: calculateWidth({
                    prevWidth: prev.width,
                    leftOffset,
                    boundaryRect,
                    initialSelfRight,
                    resize_direction,
                    newWidth,
                    minWidth,
                    clientX,
                    self,
                }),
                height: calculateHeight({
                    prevHeight: prev.height,
                    topOffset,
                    boundaryRect,
                    initialSelfBottom,
                    resize_direction,
                    newHeight,
                    minHeight,
                    clientY,
                    self,
                }),
            }));
        };

        const handleDrag = (deltaX: number, deltaY: number) => {
            const newX = deltaX + initialX;
            const newY = deltaY + initialY;
            const boundedX = Math.min(
                Math.max(newX, leftOffset + SAFETY_MARGIN),
                leftOffset +
                    (boundaryRect?.width ?? 0) -
                    size.width -
                    (SAFETY_MARGIN + EXTRA_BOTTOM_RIGHT_SAFETY_MARGIN * 2)
            );
            const boundedY = Math.min(
                Math.max(newY, topOffset + SAFETY_MARGIN),
                topOffset +
                    (boundaryRect?.height ?? 0) -
                    size.height -
                    (SAFETY_MARGIN + EXTRA_BOTTOM_RIGHT_SAFETY_MARGIN * 2)
            );
            setPosition({ x: boundedX, y: boundedY });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            isResizing.current = false;
            if (draggableContentBody?.style) {
                Object.assign(draggableContentBody.style, previousStyle);
                draggableContentBody.style.pointerEvents = previousPointerEvent ?? 'unset';
            }
            if (boundaryRef) {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            }
        };

        if (boundaryRef) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
    };

    return (
        <div
            className={`draggable ${isDragging ? 'dragging' : ''}`}
            style={{ position: 'absolute', top: position.y, left: position.x, zIndex }}
            onMouseDown={() => calculateZindex({ setZIndex })}
            onKeyDown={() => calculateZindex({ setZIndex })}
            data-testid='dt_react_draggable'
            tabIndex={0}
        >
            <div
                ref={draggableRef}
                className='draggable-content'
                data-testid='dt_react_draggable_content'
                style={{ width: size.width, height: size.height }}
            >
                <div
                    id='draggable-content__header'
                    data-testid='dt_react_draggable_handler'
                    className='draggable-content__header'
                    onMouseDown={e => handleMouseDown(e, DRAGGABLE_CONSTANTS.MOVE)}
                    onKeyDown={(e: React.KeyboardEvent<HTMLElement>) =>
                        e.key === 'Enter' && handleMouseDown(null, DRAGGABLE_CONSTANTS.MOVE)
                    }
                    tabIndex={0}
                >
                    <div className={`draggable-content__header__title`}>{header}</div>
                    <div
                        className={`draggable-content__header__close`}
                        data-testid='dt_react_draggable-close-modal'
                        onClick={onClose}
                    >
                        <Icon icon='IcCross' />
                    </div>
                </div>
                <span className='draggable-content__body' id='draggable-content-body'>
                    {children}
                </span>
                {enableResizing && (
                    <>
                        <div
                            className='resizable-handle__top'
                            data-testid='dt_resizable-handle__top'
                            onKeyDown={(e: React.KeyboardEvent<HTMLElement>) =>
                                e.key === 'Enter' && handleMouseDown(null, DRAGGABLE_CONSTANTS.MOVE)
                            }
                            onMouseDown={e => handleMouseDown(e, DRAGGABLE_CONSTANTS.TOP)}
                            tabIndex={0}
                        />
                        <div
                            className='resizable-handle__right'
                            data-testid='dt_resizable-handle__right'
                            onKeyDown={(e: React.KeyboardEvent<HTMLElement>) =>
                                e.key === 'Enter' && handleMouseDown(null, DRAGGABLE_CONSTANTS.MOVE)
                            }
                            onMouseDown={e => handleMouseDown(e, DRAGGABLE_CONSTANTS.RIGHT)}
                            tabIndex={0}
                        />
                        <div
                            className='resizable-handle__bottom'
                            data-testid='dt_resizable-handle__bottom'
                            onKeyDown={(e: React.KeyboardEvent<HTMLElement>) =>
                                e.key === 'Enter' && handleMouseDown(null, DRAGGABLE_CONSTANTS.MOVE)
                            }
                            onMouseDown={e => handleMouseDown(e, DRAGGABLE_CONSTANTS.BOTTOM)}
                            tabIndex={0}
                        />
                        <div
                            className='resizable-handle__left'
                            data-testid='dt_resizable-handle__left'
                            onKeyDown={(e: React.KeyboardEvent<HTMLElement>) =>
                                e.key === 'Enter' && handleMouseDown(null, DRAGGABLE_CONSTANTS.MOVE)
                            }
                            onMouseDown={e => handleMouseDown(e, DRAGGABLE_CONSTANTS.LEFT)}
                            tabIndex={0}
                        />
                        <div
                            className='resizable-handle__top-right'
                            data-testid='dt_resizable-handle__top-right'
                            onKeyDown={(e: React.KeyboardEvent<HTMLElement>) =>
                                e.key === 'Enter' && handleMouseDown(null, DRAGGABLE_CONSTANTS.MOVE)
                            }
                            onMouseDown={e => handleMouseDown(e, DRAGGABLE_CONSTANTS.TOP_RIGHT)}
                            tabIndex={0}
                        />
                        <div
                            className='resizable-handle__bottom-right'
                            data-testid='dt_resizable-handle__bottom-right'
                            onKeyDown={(e: React.KeyboardEvent<HTMLElement>) =>
                                e.key === 'Enter' && handleMouseDown(null, DRAGGABLE_CONSTANTS.MOVE)
                            }
                            onMouseDown={e => handleMouseDown(e, DRAGGABLE_CONSTANTS.BOTTOM_RIGHT)}
                            tabIndex={0}
                        />
                        <div
                            className='resizable-handle__bottom-left'
                            data-testid='dt_resizable-handle__bottom-left'
                            onKeyDown={(e: React.KeyboardEvent<HTMLElement>) =>
                                e.key === 'Enter' && handleMouseDown(null, DRAGGABLE_CONSTANTS.MOVE)
                            }
                            onMouseDown={e => handleMouseDown(e, DRAGGABLE_CONSTANTS.BOTTOM_LEFT)}
                            tabIndex={0}
                        />
                        <div
                            className='resizable-handle__top-left'
                            data-testid='dt_resizable-handle__top-left'
                            onKeyDown={(e: React.KeyboardEvent<HTMLElement>) =>
                                e.key === 'Enter' && handleMouseDown(null, DRAGGABLE_CONSTANTS.MOVE)
                            }
                            onMouseDown={e => handleMouseDown(e, DRAGGABLE_CONSTANTS.TOP_LEFT)}
                            tabIndex={0}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default Draggable;
