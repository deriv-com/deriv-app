import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import classNames from 'classnames';
import './animated-list.scss';

type TAnimatedListProps = {
    className?: string;
    children: JSX.Element[];
};

const animations = {
    initial: {
        height: 0,
        opacity: 0,
    },
    animate: {
        height: 'auto',
        opacity: 1,
        transition: {
            height: {
                duration: 0.2,
            },
            opacity: {
                duration: 0.15,
                delay: 0.05,
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
};

const AnimatedList = ({ className, children }: TAnimatedListProps) => {
    return (
        <div className={classNames('animated-list', className)}>
            <AnimatePresence>
                {children.map(child => {
                    return (
                        <motion.div {...animations} layout key={child.key} data-testid='dt_list_item'>
                            {child}
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
};

export default AnimatedList;
