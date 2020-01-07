import React        from 'react';
import PropTypes    from 'prop-types';
import AgentContext from 'Components/context/agent-context';
import { localize } from 'Components/i18next';

const OrderDetailsResultMessage = ({ order_details }) => {
    const { is_agent } = React.useContext(AgentContext);
    const {
        is_completed,
        is_buyer,
        offer_currency,
        display_offer_amount,
    } = order_details;

    if (is_agent && is_completed && is_buyer) {
        return (
            <p className='order-details__wrapper-message order-details__wrapper-message--success'>
                { localize('You sold {{offered_currency}} {{offered_amount}}',
                    {
                        offered_currency: offer_currency,
                        offered_amount  : display_offer_amount,
                    })
                }
            </p>
        );
    }

    if (is_agent && is_completed && !is_buyer) {
        return (
            <p className='order-details__wrapper-message order-details__wrapper-message--success'>
                { localize('{{offered_currency}} {{offered_amount}} was deposited on your account',
                    {
                        offered_currency: offer_currency,
                        offered_amount  : display_offer_amount,
                    })
                }
            </p>
        );
    }

    if (!is_agent && is_completed && is_buyer) {
        return (
            <p className='order-details__wrapper-message order-details__wrapper-message--success'>
                { localize('{{offered_currency}} {{offered_amount}} was deposited on your account',
                    {
                        offered_currency: offer_currency,
                        offered_amount  : display_offer_amount,
                    })
                }
            </p>
        );
    }

    if (!is_agent && is_completed && !is_buyer) {
        return (
            <p className='order-details__wrapper-message order-details__wrapper-message--success'>
                { localize('You sold {{offered_currency}} {{offered_amount}}',
                    {
                        offered_currency: offer_currency,
                        offered_amount  : display_offer_amount,
                    })
                }
            </p>
        );
    }
    // TODO: [p2p-timeout-status-check] - Check if order has timed out and add timeout message
    return null;
};

OrderDetailsResultMessage.propTypes = {
    order_details: PropTypes.object,
};

export default OrderDetailsResultMessage;
