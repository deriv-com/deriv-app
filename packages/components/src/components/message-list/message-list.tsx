import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AlertMessage from './alert-message';
import './message-list.scss';

type TMessageListProps = { list: (React.ComponentProps<typeof AlertMessage> & { key: string })[] };

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

const MessageList = ({ list }: TMessageListProps) => {
    return (
        <div className='message-list'>
            <AnimatePresence>
                {list.map(item => {
                    return (
                        <motion.div {...animations} layout key={item.key}>
                            <AlertMessage {...item} />
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
};

export default MessageList;
