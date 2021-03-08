import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Button, LinearProgress, Text } from '@deriv/components';
import { isEmptyObject, PlatformContext } from '@deriv/shared';
import CloseButton from './close-button.jsx';
import NotificationStatusIcons from './notification-status-icons.jsx';
import NotificationBanner from './notification-banner.jsx';
import { default_delay, types } from './constants';
import { BinaryLink } from '../../Routes';

const Notification = ({ data, removeNotificationMessage }) => {
    const { is_dashboard } = React.useContext(PlatformContext);
    const destroy = is_closed_by_user => {
        removeNotificationMessage(data);

        if (data.closeOnClick) {
            data.closeOnClick(data, is_closed_by_user);
        }
    };

    const onClick = () => destroy(true);

    if (data.is_auto_close) {
        setTimeout(destroy, data.delay || default_delay);
    }

    switch (data.type) {
        case 'news':
            return (
                <NotificationBanner
                    header={data.header}
                    message={data.message}
                    button_text={data.button_text}
                    img_src={data.img_src}
                    img_alt={data.img_alt}
                    redirect_link={data.redirect_link}
                    onClick={destroy}
                />
            );
        default:
            return (
                <div
                    className={classNames('notification', types[data.type], {
                        'notification--small': data.size === 'small',
                    })}
                >
                    <div className='notification__icon-background'>
                        <NotificationStatusIcons type={data.type} class_suffix='is-background' />
                    </div>
                    <div className='notification__icon'>
                        <NotificationStatusIcons type={data.type} />
                    </div>
                    <div className='notification__text-container'>
                        <h4 className='notification__header'>{data.header}</h4>
                        {data.timeout && (
                            <LinearProgress
                                className='notification__timeout'
                                timeout={data.timeout}
                                action={data.action.onClick}
                                render={data.timeoutMessage}
                            />
                        )}
                        <p className='notification__text-body'>{data.message}</p>
                        <div className='notification__action'>
                            {!isEmptyObject(data.action) && (
                                <React.Fragment>
                                    {data.action.route ? (
                                        <BinaryLink
                                            className={classNames(
                                                'dc-btn',
                                                'dc-btn--secondary',
                                                'notification__cta-button'
                                            )}
                                            to={data.action.route}
                                        >
                                            <Text size='xxs' weight='bold'>
                                                {data.action.text}
                                            </Text>
                                        </BinaryLink>
                                    ) : (
                                        <Button
                                            className='notification__cta-button'
                                            onClick={() => data.action.onClick({ is_dashboard })}
                                            text={data.action.text}
                                            secondary
                                            renderText={text => (
                                                <Text size='xxs' weight='bold' align='center'>
                                                    {text}
                                                </Text>
                                            )}
                                        />
                                    )}
                                </React.Fragment>
                            )}
                        </div>
                    </div>
                    {!data.should_hide_close_btn && (
                        <CloseButton className='notification__close-button' onClick={onClick} />
                    )}
                </div>
            );
    }
};

Notification.propTypes = {
    data: PropTypes.shape({
        action: PropTypes.shape({
            onClick: PropTypes.func,
            route: PropTypes.string,
            text: PropTypes.string,
        }),
        closeOnClick: PropTypes.func,
        delay: PropTypes.number,
        header: PropTypes.string,
        is_auto_close: PropTypes.bool,
        message: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
        should_hide_close_btn: PropTypes.bool,
        size: PropTypes.oneOf(['small']),
        type: PropTypes.oneOf(['warning', 'info', 'success', 'danger', 'contract_sold', 'news', 'announce']).isRequired,
    }),
    removeNotificationMessage: PropTypes.func,
};

export default Notification;
