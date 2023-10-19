import React, { FC, PropsWithChildren, useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';

type TTransitionModalProps = {
    className?: string;
};

export const TransitionModal: FC<PropsWithChildren<TTransitionModalProps>> = ({ children, className }) => {
    const [isMounted, setIsMounted] = useState(false);

    console.log('Transition Modal', isMounted);

    useEffect(() => {
        console.log('Transition Modal mounted');
        setIsMounted(true);

        return () => {
            setIsMounted(false);
            console.log('Transition Modal unMounted');
        };
    }, [className]);

    return (
        <CSSTransition
            classNames={className}
            in={isMounted}
            onEnter={() => {
                console.log('onEnter');
            }}
            onEntered={() => {
                console.log('onEntered');
            }}
            onEntering={() => {
                console.log('Entering');
            }}
            timeout={600}
            unmountOnExit
        >
            {children}
        </CSSTransition>
    );
};
