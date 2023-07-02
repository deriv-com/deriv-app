import React from 'react';
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

const MessageList = ({ list }: TMessageListProps) => {
    return (
        <div className='message-list'>
            {list.map(item => {
                return (
                    <TransferInfoMessage
                        key={item.id}
                        message={item.message}
                        type={item.type}
                        button_label={item.button_label}
                        onClickHandler={item.action}
                    />
                );
            })}
        </div>
    );
};

export default MessageList;
