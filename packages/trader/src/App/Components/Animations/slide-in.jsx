import PropTypes from 'prop-types';
import React from 'react';
import { motion } from 'framer-motion';

const SlideInFromTop = {
    OnViewportEnter: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 200,
        },
    },
    exit: {
        y: -20,
        opacity: 0,
        transition: {
            duration: 100,
        },
    },
};

const SlideInFromBottom = {
    onViewportEnter: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 200,
        },
    },
    exit: {
        y: 20,
        opacity: 0,
        transition: {
            duration: 100,
        },
    },
};

const SlideIn = ({ children, className, keyname, is_visible, type }) => {
    if (type === 'bottom') {
        return (
            <>
                {is_visible && (
                    <motion.div
                        onViewportEnter={SlideInFromBottom.onViewportEnter}
                        exit={SlideInFromBottom.exit}
                        className={className}
                        key={keyname}
                    >
                        {children}
                    </motion.div>
                )}
            </>
        );
    }
    return (
        <>
            {is_visible && (
                <motion.div
                    onViewportEnter={SlideInFromTop.onViewportEnter}
                    exit={SlideInFromTop.exit}
                    className={className}
                    key={keyname}
                >
                    {children}
                </motion.div>
            )}
        </>
    );
};

SlideIn.propTypes = {
    children: PropTypes.node,
    is_visible: PropTypes.bool,
    keyname: PropTypes.string,
    type: PropTypes.string,
};

export { SlideIn };
