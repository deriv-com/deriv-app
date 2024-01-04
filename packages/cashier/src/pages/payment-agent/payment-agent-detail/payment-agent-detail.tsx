import React from 'react';
import classNames from 'classnames';
import { Icon, Text } from '@deriv/components';
import './payment-agent-detail.scss';

type TPaymentAgentDetail = {
    action?: string;
    children?: React.ReactNode;
    className?: string;
    has_red_color?: boolean;
    icon?: string;
    is_link?: boolean;
    title?: string | React.ReactNode;
    rel?: string;
    target?: string;
};

const PaymentAgentDetail = ({
    action,
    children,
    className,
    has_red_color,
    icon,
    is_link,
    title,
    ...rest
}: TPaymentAgentDetail) => {
    const detail = Array.isArray(children) ? children : [children];
    return (
        <div className={classNames('payment-agent-detail', className && { [className]: !!className })}>
            {icon && (
                <div className='payment-agent-detail__icon-wrapper'>
                    <Icon icon={icon} data_testid='dt_payment_agent_detail_icon' />
                </div>
            )}
            <div className='payment-agent-detail__desc-wrapper'>
                {title && (
                    <Text as='p' line_height='s' size='xs'>
                        {title}
                    </Text>
                )}
                {detail.map((child, id) => (
                    <React.Fragment key={id}>
                        {action || is_link ? (
                            <Text
                                as='a'
                                color={has_red_color ? 'red' : 'prominent'}
                                data-testid='dt_payment_agent_detail_link'
                                href={(action ? `${action}:` : '') + child}
                                line_height='s'
                                size={!title ? 'xxs' : 'xs'}
                                weight='bold'
                                className='payment-agent-detail__link'
                                {...rest}
                            >
                                {child}
                                {id === detail.length - 1 ? '' : ', '}
                            </Text>
                        ) : (
                            <Text
                                as='p'
                                className='payment-agent-detail__paragraph'
                                data-testid='dt_payment_agent_detail_paragraph'
                                line_height='s'
                                size={!title ? 'xxs' : 'xs'}
                                weight='bold'
                            >
                                {child}
                            </Text>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default PaymentAgentDetail;
