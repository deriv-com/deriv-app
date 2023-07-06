import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TransferInfoMessage from './alert-message';
import './message-list.scss';

type TMessageListProps = {
    list: {
        action?: VoidFunction;
        button_label?: string;
        id: string;
        message: string | JSX.Element;
        type: 'info' | 'error' | 'success';
    }[];
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

const MessageList = ({ list }: TMessageListProps) => {
    return (
        <div className='message-list'>
            <AnimatePresence>
                {list.map(item => {
                    return (
                        <motion.div {...animations} layout key={item.id}>
                            <TransferInfoMessage
                                key={item.id}
                                message={item.message}
                                type={item.type}
                                button_label={item.button_label}
                                onClickHandler={item.action}
                            />
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
};

export default MessageList;
