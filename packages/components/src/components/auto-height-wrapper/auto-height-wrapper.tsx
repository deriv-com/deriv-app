import React from 'react';
import { usePrevious } from '../../hooks';

export type TAutoHeightWrapperChildProps = {
    height: number;
    setRef: (ref: HTMLFormElement | null) => void;
};

type TAutoHeightWrapperProps = {
    default_height: number;
    children: (props: TAutoHeightWrapperChildProps) => React.ReactElement;
    height_offset?: number | null;
};

const AutoHeightWrapper = (props: TAutoHeightWrapperProps) => {
    const [height, setHeight] = React.useState(props.default_height);
    const child_client_height_ref = React.useRef(0);

    const prev_child_client_height = usePrevious(child_client_height_ref.current);

    React.useEffect(() => {
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateHeight = () =>
        setHeight(
            child_client_height_ref.current > props.default_height
                ? child_client_height_ref.current - (props.height_offset || 0)
                : props.default_height
        );

    const setRef = (ref: HTMLFormElement | null) => {
        if (Number.isInteger(ref?.clientHeight) && ref?.clientHeight !== prev_child_client_height) {
            child_client_height_ref.current = Number(ref?.clientHeight);
            setTimeout(updateHeight, 0);
        }
    };

    return props.children({
        ...props,
        height,
        setRef,
    });
};

export default AutoHeightWrapper;
