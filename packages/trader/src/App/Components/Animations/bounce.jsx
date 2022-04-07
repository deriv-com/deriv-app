import PropTypes from 'prop-types';
import React from 'react';
import { motion } from 'framer-motion';

const BounceUp = {
    onViewportEnter: {
        y: 0,
        opacity: 1,
        transition: {
            y: {
                type: 'spring',
                stiffness: 500,
                damping: 15,
            },
            default: {
                duration: 300,
            },
        },
    },
    exit: {
        y: 35,
        opacity: 0,
        transition: {
            duration: 0,
        },
    },
};

const Bounce = ({ children, className, is_visible, keyname }) =>
    is_visible ? (
        <motion.div exit={BounceUp.exit} onViewportEnter={BounceUp.onViewportEnter} className={className} key={keyname}>
            {children}
        </motion.div>
    ) : null;

Bounce.propTypes = {
    children: PropTypes.node,
    is_visible: PropTypes.bool,
    keyname: PropTypes.string,
};

export { Bounce };
