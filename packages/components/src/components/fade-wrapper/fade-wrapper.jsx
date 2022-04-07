import PropTypes from 'prop-types';
import React from 'react';
import { motion } from 'framer-motion';

const FadeInFromTopDiv = {
    onViewportEnter: {
        y: 0,
        opacity: 1,
        delay: 300,
        transition: {
            default: { duration: 250 },
        },
    },
    exit: {
        y: -50,
        opacity: 0,
        transition: { duration: 250 },
    },
};

const FadeInFromBottomDiv = {
    onViewportEnter: {
        y: 0,
        opacity: 1,
        delay: 300,
        transition: {
            default: { duration: 250 },
        },
    },
    exit: {
        y: 50,
        opacity: 0,
        transition: { duration: 250 },
    },
};

const FadeInOnlyDiv = {
    onViewportEnter: {
        opacity: 1,
        transition: { duration: 300 },
    },
    exit: {
        opacity: 0,
        transition: { duration: 300 },
    },
};

// `flipMove={false}` is necessary to fix react-pose bug: https://github.com/Popmotion/popmotion/issues/805
const FadeWrapper = ({ children, className, is_visible, keyname, type }) => {
    if (type === 'top') {
        return (
            <>
                {is_visible && (
                    <motion.div
                        onViewportEnter={FadeInFromTopDiv.onViewportEnter}
                        exit={FadeInFromTopDiv.exit}
                        className={className}
                        key={keyname}
                    >
                        {children}
                    </motion.div>
                )}
            </>
        );
    }
    if (type === 'bottom') {
        return (
            <>
                {is_visible && (
                    <motion.div
                        onViewportEnter={FadeInFromBottomDiv.onViewportEnter}
                        exit={FadeInFromBottomDiv.exit}
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
                    onViewportEnter={FadeInOnlyDiv.onViewportEnter}
                    exit={FadeInOnlyDiv.exit}
                    className={className}
                    key={keyname}
                >
                    {children}
                </motion.div>
            )}
        </>
    );
};

FadeWrapper.propTypes = {
    children: PropTypes.node,
    is_visible: PropTypes.bool,
    keyname: PropTypes.string,
    type: PropTypes.string,
};

export default FadeWrapper;
