import React from 'react';
import Icon from '../icon/icon';
import Text from '../text';
import './inline-message.scss';

const type_to_icon_mapper = {
    warning: 'IcAlertWarning',
    information: 'IcAlertInfo',
    announcement: 'IcAlertAnnounce',
    error: 'IcAlertDanger',
};

type TProps = {
    type?: 'warning' | 'information' | 'announcement' | 'error';
    title?: string;
    message?: string;
};

const InlineMessage: React.FC<React.PropsWithChildren<TProps>> = ({ type = 'warning', title, message, children }) => (
    <div className={`inline-message inline-message__${type}`}>
        <Icon size={16} icon={type_to_icon_mapper[type]} className={'inline-message__icon'} />
        {(title || message || children) && (
            <div className='inline-message__messages-container'>
                {title && (
                    <Text size={'xxxs'} weight='bold'>
                        {title}
                    </Text>
                )}
                {message && <Text size={'xxxs'}>{message}</Text>}
                {children}
            </div>
        )}
    </div>
);

export default InlineMessage;
