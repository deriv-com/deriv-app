import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AlertMessage from './alert-message';
import './message-list.scss';

type TMessageListProps = {
    list:
        | {
              variant: 'base';
              id: string;
              type: 'info' | 'error' | 'success';
              message: string | JSX.Element;
          }[]
        | {
              variant: 'with-action-button';
              action: VoidFunction;
              button_label: string;
              id: string;
              type: 'info' | 'error' | 'success';
              message: string | JSX.Element;
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
                            {item.variant === 'base' && (
                                <AlertMessage variant='base' message={item.message} type={item.type} />
                            )}
                            {item.variant === 'with-action-button' && (
                                <AlertMessage
                                    variant='with-action-button'
                                    button_label={item.button_label}
                                    message={item.message}
                                    onClickHandler={item.action}
                                    type={item.type}
                                />
                            )}
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
};

export default MessageList;
