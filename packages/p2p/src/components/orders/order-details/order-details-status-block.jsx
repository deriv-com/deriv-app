import React        from 'react';
import PropTypes    from 'prop-types';
import Dp2pContext  from 'Components/context/dp2p-context';
import { localize } from 'Components/i18next';

const OrderDetailsStatusBlock = ({ order_details }) => {
    const { is_agent } = React.useContext(Dp2pContext);
    const {
        is_buyer,
        is_buyer_cancelled,
        is_buyer_confirmed,
        is_completed,
        is_expired,
        is_pending,
        is_refunded,
    } = order_details;

    return (
        <h2 className='order-details__header-status'>
            {/* Agent view */}
            { is_agent && is_pending && is_buyer &&
                localize('Wait for payment')
            }
            { is_agent && is_pending && !is_buyer &&
                localize('Please pay')
            }
            { is_agent && is_buyer_cancelled && is_buyer &&
                localize('Buyer has cancelled this order')
            }
            { is_agent && is_buyer_cancelled && !is_buyer &&
                localize('You have cancelled this order')
            }
            { is_agent && is_refunded && is_buyer &&
                localize('Buyer has been refunded')
            }
            { is_agent && is_refunded && !is_buyer &&
                localize('You have been refunded')
            }
            { is_agent && is_buyer_confirmed && is_buyer &&
                localize('Confirm payment')
            }
            { is_agent && is_buyer_confirmed && !is_buyer &&
                localize('Wait for release')
            }
            {/* Client view */}
            { !is_agent && is_pending && is_buyer &&
                localize('Please pay')
            }
            { !is_agent && is_pending && !is_buyer &&
                localize('Wait for payment')
            }
            { !is_agent && is_buyer_cancelled && is_buyer &&
                localize('You have cancelled this order')
            }
            { !is_agent && is_buyer_cancelled && !is_buyer &&
                localize('Buyer has cancelled this order')
            }
            { !is_agent && is_refunded && is_buyer &&
                localize('You have been refunded')
            }
            { !is_agent && is_refunded && !is_buyer &&
                localize('Buyer has been refunded')
            }
            { !is_agent && is_buyer_confirmed && is_buyer &&
                localize('Wait for release')
            }
            { !is_agent && is_buyer_confirmed && !is_buyer &&
                localize('Confirm payment')
            }
            {/* Common view */}
            { is_expired &&
                localize('Cancelled due to timeout')
            }
            { is_completed &&
                localize('Order complete')
            }
        </h2>
    );
};

OrderDetailsStatusBlock.propTypes = {
    order_details: PropTypes.object,
};

export default OrderDetailsStatusBlock;
