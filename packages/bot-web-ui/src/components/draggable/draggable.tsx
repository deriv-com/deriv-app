import React, { PropsWithChildren, useState } from 'react';
import { Rnd } from 'react-rnd';
import { CSSTransition } from 'react-transition-group';
import { Icon } from '@deriv/components';
import { localize } from '@deriv/translations';

type DraggableProps = {
    bounds?: string | Element;
    dragHandleClassName?: string;
    enableResizing?: boolean;
    height?: number | string;
    header_title: string;
    is_visible: boolean;
    minWidth?: number | string;
    onCloseDraggable: () => void;
    width?: number | string;
    xaxis?: number;
    yaxis?: number;
};
const PARENT_CLASS = 'react-rnd-wrapper';

export default function Draggable({
    bounds = 'window',
    children,
    dragHandleClassName,
    enableResizing = false,
    header_title,
    height = 600,
    is_visible,
    minWidth,
    onCloseDraggable,
    width = 'fit-content',
    xaxis = 0,
    yaxis = 0,
}: PropsWithChildren<DraggableProps>) {
    const [first_drag_x, setFirstDragX] = useState(xaxis);
    const [first_drag_y, setFirstDragY] = useState(yaxis);
    const [first_left, setFirstLeft] = useState(0);
    const [first_top, setFirstTop] = useState(0);

    // const handleStyles = {
    //     bottomRight: {
    //         cursor: 'nwse-resize',
    //         resize: 'both',
    //     },
    //     bottom: {
    //         cursor: 'row-resize',
    //     },
    //     right: {
    //         cursor: 'col-resize',
    //     },
    //     left: {
    //         cursor: 'col-resize',
    //         transform: 'scaleX(-1)',
    //     },
    //     // Add styles for other resize handles as needed
    // };

    return is_visible ? (
        <Rnd
            bounds={bounds}
            className='react-rnd-wrapper'
            data-testid='react-rnd-wrapper'
            default={{
                x: xaxis,
                y: yaxis,
                width,
                height,
            }}
            style={{
                left: xaxis,
                top: yaxis,
            }}
            dragHandleClassName={dragHandleClassName}
            // enableResizing={{right:true, bottom:true, bottomRight:true}}
            enableResizing={true}
            minHeight={height}
            minWidth={minWidth}

            // resizeHandleStyles={handleStyles}
        >
            <CSSTransition
                appear
                in={is_visible}
                timeout={50}
                classNames={{
                    appear: 'dc-dialog__wrapper--enter',
                    enter: 'dc-dialog__wrapper--enter',
                    enterDone: 'dc-dialog__wrapper--enter-done',
                    exit: 'dc-dialog__wrapper--exit',
                }}
                unmountOnExit
            >
                <>
                    <div className={`${PARENT_CLASS}-header`}>
                        <div className={`${PARENT_CLASS}-header__title`}>{localize(header_title)}</div>
                        <div
                            role='button'
                            className={`${PARENT_CLASS}-header__close`}
                            data-testid='react-rnd-close-modal'
                            onClick={onCloseDraggable}
                        >
                            <Icon icon='IcCross' />
                        </div>
                    </div>
                    <iframe
                        id='iframe'
                        style={{ width: '100%', height: '100%' }}
                        src='https://tradingview.deriv.com/deriv'
                    />
                </>
            </CSSTransition>
        </Rnd>
    ) : null;
}
