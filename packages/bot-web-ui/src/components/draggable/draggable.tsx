import React, { PropsWithChildren } from 'react';
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
    height = 'fit-content',
    is_visible,
    minWidth,
    onCloseDraggable,
    width = 'fit-content',
    xaxis = 0,
    yaxis = 0,
}: PropsWithChildren<DraggableProps>) {
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
            dragHandleClassName={dragHandleClassName}
            enableResizing={enableResizing}
            minHeight={height}
            minWidth={minWidth}
            onDragStart={e => {
                // on responsive devices touch event is not triggering the close button action
                // need to handle it manually
                const parentElement = (e?.target as HTMLDivElement)?.parentElement;
                if (parentElement?.role === 'button' || parentElement?.tagName === 'svg') {
                    onCloseDraggable();
                }
            }}
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
                    {children}
                </>
            </CSSTransition>
        </Rnd>
    ) : null;
}
