import React, { FC, PropsWithChildren, useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';

type TModalTransitionProps = {
    className?: string;
};

const ModalTransition: FC<PropsWithChildren<TModalTransitionProps>> = ({ children, className }) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <CSSTransition classNames={className} in={isMounted} timeout={600} unmountOnExit>
            {children}
        </CSSTransition>
    );
};

export default ModalTransition;
