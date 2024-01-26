import React from 'react';
import { motion } from 'framer-motion';

type TBounce = React.PropsWithChildren<{
    className: string;
    is_visible: boolean;
    keyname: string;
}>;

const BounceUp = {
    animate: {
        y: 0,
        opacity: 1,
    },
    initial: {
        y: 35,
        opacity: 0,
    },
    transition: {
        type: 'spring',
        stiffness: 500,
        damping: 15,
        duration: 0.3,
    },
};

const Bounce = ({ children, className, is_visible, keyname }: TBounce) =>
    is_visible ? (
        <motion.div
            initial={BounceUp.initial}
            animate={BounceUp.animate}
            transition={BounceUp.transition}
            className={className}
            key={keyname}
        >
            {children}
        </motion.div>
    ) : null;

export { Bounce };
