import React from 'react';
import { motion } from 'framer-motion';

type TSlideIn = React.PropsWithChildren<{
    className: string;
    is_visible?: boolean;
    keyname: string;
    type?: string;
}>;

const SlideInFromTop = {
    initial: {
        y: -20,
        opacity: 0,
    },
    animate: {
        y: 0,
        opacity: 1,
    },
    transition: {
        duration: 0.2,
    },
};

const SlideInFromBottom = {
    initial: {
        y: 20,
        opacity: 0,
    },
    animate: {
        y: 0,
        opacity: 1,
    },
    transition: {
        duration: 0.2,
    },
};

const SlideIn = ({ children, className, keyname, is_visible, type }: TSlideIn) => {
    if (type === 'bottom') {
        return (
            <>
                {is_visible && (
                    <motion.div
                        initial={SlideInFromBottom.initial}
                        animate={SlideInFromBottom.animate}
                        transition={SlideInFromBottom.transition}
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
                    initial={SlideInFromTop.initial}
                    animate={SlideInFromTop.animate}
                    transition={SlideInFromTop.transition}
                    className={className}
                    key={keyname}
                >
                    {children}
                </motion.div>
            )}
        </>
    );
};

export { SlideIn };
