import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { isMobile } from '@deriv/shared';
import './animation-wrapper.scss';

type AnimationWrapperProps = {
    children: React.ReactNode,
    is_visible: boolean
};

const AnimationWrapper = (
    {
        children,
        is_visible,
        onEntered,
        onExit
    }: AnimationWrapperProps
) => {
    if (isMobile()) {
        return (
            <CSSTransition
                in={is_visible}
                timeout={250}
                classNames='animation-wrapper'
                onExit={onExit}
                onEntered={onEntered}
            >
                {children}
            </CSSTransition>
        );
    }

    return children;
};

export default AnimationWrapper;
