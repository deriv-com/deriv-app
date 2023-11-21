import React from 'react';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { useSwipeable } from 'react-swipeable';
import { getCardLabels, getContractPath } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import { Money, Text } from '@deriv/components';

export const TradeNotification = React.memo(({ classname, notification }) => {
    const [is_swipe_right, setSwipeRight] = React.useState(false);
    const { buy_price, contract_id, currency, contract_type, profit, status, symbol, timestamp } = notification;
    const seconds = Math.floor(Math.abs(Date.now() - timestamp) / 1000);
    const onSwipeLeft = () => setSwipeRight(false);
    const onSwipeRight = () => setSwipeRight(true);

    const swipe_handlers = useSwipeable({
        onSwipedLeft: onSwipeLeft,
        onSwipedRight: onSwipeRight,
    });

    return (
        <CSSTransition
            in={seconds < 20}
            timeout={300}
            classNames={{
                enter: `${classname}-enter`,
                enterActive: `${classname}-enter-active`,
                enterDone: `${classname}-enter-done`,
                exit: `${classname}-exit`,
                exitActive: `${classname}-exit-active-${is_swipe_right ? 'right' : 'left'}`,
            }}
            unmountOnExit
        >
            <NavLink
                className={classNames(classname, {
                    [`${classname}--lost`]: status !== 'open' && profit < 0,
                    [`${classname}--won`]: status !== 'open' && profit >= 0,
                })}
                to={getContractPath(contract_id)}
                {...swipe_handlers}
            >
                <div className={`${classname}-content`}>
                    <Text as='p' size='xxxs' line_height='s'>
                        <Localize
                            i18n_default_text='<0>Trade {{status}}:</0> {{trade_type_name}} on {{symbol}}'
                            components={[<strong key={0} />]}
                            values={{
                                status: status === 'open' ? localize('opened') : localize('closed'),
                                symbol,
                                trade_type_name: contract_type,
                            }}
                            shouldUnescape
                        />
                    </Text>
                    <Text as='p' size='xxxs' line_height='s'>
                        {status === 'open' ? getCardLabels().STAKE : getCardLabels().TOTAL_PROFIT_LOSS}{' '}
                        <Text size='xxxs' line_height='s' weight='bold'>
                            <Money
                                amount={status === 'open' ? buy_price : profit}
                                currency={currency}
                                has_sign
                                should_format
                                show_currency
                            />
                        </Text>
                    </Text>
                </div>
                <Text as='p' size='xxxs' line_height='s' className={`${classname}-timestamp`}>
                    {seconds < 10 ? (
                        <Localize i18n_default_text='now' />
                    ) : (
                        <Localize i18n_default_text='{{seconds}}s ago' values={{ seconds }} />
                    )}
                </Text>
            </NavLink>
        </CSSTransition>
    );
});

TradeNotification.displayName = 'TradeNotification';
