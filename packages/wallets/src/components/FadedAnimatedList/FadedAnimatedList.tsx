import React from 'react';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';

type TProps = {
    children: JSX.Element[];
    className?: string;
};

const animations = {
    animate: {
        height: 'auto',
        opacity: 1,
        transition: {
            height: {
                duration: 0.2,
            },
            opacity: {
                delay: 0.05,
                duration: 0.15,
            },
        },
    },
    exit: {
        height: 0,
        opacity: 0,
        transition: {
            height: {
                duration: 0.2,
            },
            opacity: { duration: 0.1 },
        },
    },
    initial: {
        height: 0,
        opacity: 0,
    },
};

const FadedAnimatedList: React.FC<TProps> = ({ children, className }) => {
    return (
        <div className={classNames('wallets-faded-animated-list', className)}>
            <AnimatePresence>
                {children.map(child => {
                    return (
                        <motion.div {...animations} data-testid='dt_list-item' key={child.key} layout>
                            {child}
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
};

export default FadedAnimatedList;
