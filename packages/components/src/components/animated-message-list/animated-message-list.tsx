import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import classNames from 'classnames';
import './animated-message-list.scss';

type TMessageListProps = {
    className?: string;
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

const AnimatedMessageList = ({ className, children }: React.PropsWithChildren<TMessageListProps>) => {
    return (
        <div className={classNames('animated-message-list', className)}>
            <AnimatePresence>
                {React.Children.toArray(children).map((child, index) => {
                    return (
                        <motion.div {...animations} layout key={index} data-testid='dt_list_item'>
                            {child}
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
};

export default AnimatedMessageList;
