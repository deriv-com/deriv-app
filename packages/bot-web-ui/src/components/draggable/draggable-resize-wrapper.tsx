import React, { useState } from 'react';
import debounce from 'lodash.debounce';
import Draggable from './draggable';

type DraggableResizeWrapperProps = {
    boundary: string;
    children: React.ReactNode;
    onClose: () => void;
    enableResizing?: boolean;
    enableDragging?: boolean;
    header: string;
    minHeight?: number;
    minWidth?: number;
    modalHeight?: number;
    modalWidth?: number;
};

const DraggableResizeWrapper: React.FC<DraggableResizeWrapperProps> = ({
    boundary,
    children,
    onClose,
    enableResizing = false,
    enableDragging = true,
    header = '',
    minHeight = 100,
    minWidth = 100,
    modalHeight = 400,
    modalWidth = 400,
}) => {
    const [show, setShow] = useState(false);
    const xAxisValue = (window.innerWidth - modalWidth) / 2;
    const yAxisValue = (window.innerHeight - modalHeight) / 2;

    const [initialValues, setInitialValues] = React.useState({
        width: modalWidth,
        height: modalHeight,
        xAxis: xAxisValue >= 0 ? xAxisValue : 0,
        yAxis: yAxisValue >= 0 ? yAxisValue : 0,
    });

    const handleResize = debounce(() => {
        const newWidth = window.innerWidth > modalWidth ? modalWidth : window.innerWidth - 50;
        const newHeight = window.innerHeight > modalHeight ? modalHeight : window.innerHeight - 50;
        const newx = (window.innerWidth - newWidth) / 2;
        const newy = (window.innerHeight - newHeight) / 2;

        setInitialValues({
            width: newWidth,
            height: newHeight,
            xAxis: newx >= 0 ? newx : 0,
            yAxis: newy >= 0 ? newy : 0,
        });
        setShow(true);
    }, 0);

    React.useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [handleResize]);

    return (
        <div id='draggable_resize_container'>
            {show && (
                <Draggable
                    boundary={boundary}
                    initialValues={initialValues}
                    minWidth={minWidth}
                    minHeight={minHeight}
                    enableResizing={enableResizing}
                    enableDragging={enableDragging}
                    header={header}
                    onClose={onClose}
                >
                    {children}
                </Draggable>
            )}
        </div>
    );
};

export default DraggableResizeWrapper;
