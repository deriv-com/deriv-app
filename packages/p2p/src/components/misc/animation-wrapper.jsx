import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import { isMobile } from '@deriv/shared';
import './animation-wrapper.scss';

const AnimationWrapper = ({ children, is_visible, onEntered, onExit }) => {
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

AnimationWrapper.propTypes = {
    children: PropTypes.any,
    is_visible: PropTypes.bool,
    onEntered: PropTypes.func,
    onExit: PropTypes.func,
};

export default AnimationWrapper;
