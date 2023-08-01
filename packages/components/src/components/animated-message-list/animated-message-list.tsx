import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import classNames from 'classnames';
import './animated-message-list.scss';

type TMessageListProps<T> = {
    className?: string;
    list: (T & { id: string })[];
    Element: React.FC<T>;
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

const AnimatedMessageList = <T,>({ className, list, Element }: TMessageListProps<T>) => {
    return (
        <div className={classNames('animated-message-list', className)}>
            <AnimatePresence>
                {list.map(list_item => {
                    return (
                        <motion.div {...animations} layout key={list_item.id} data-testid='dt_list_item'>
                            <Element {...list_item} />
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
};

export default AnimatedMessageList;
