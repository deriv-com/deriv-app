import React from 'react';
import PropTypes from 'prop-types';
import VirtualWalletCardContent from './virtual-wallet-card-content.jsx';
import VirtualWalletCardHeader from './virtual-wallet-card-header.jsx';
import VirtualWalletCardFooter from './virtual-wallet-card-footer.jsx';

const VirtualWalletCard = ({
    amount,
    currency,
    getWalletLabels,
    has_footer = true,
    has_no_funds = false,
    is_actions_footer = false,
    is_topup_footer = false,
    onClickReset,
    onClickTransactions,
    wallet_name,
    width = '280',
}) => {
    const [should_show_footer_actions, setShouldShowFooterActions] = React.useState(false);

    const height = (width / 5) * 3;

    const onMouseEnter = () => {
        setShouldShowFooterActions(true);
    };

    const onMouseLeave = () => {
        setShouldShowFooterActions(false);
    };

    return (
        <div
            className='dc-virtual-wallet-card'
            style={{
                height: `${height}px`,
                width: `${width}px`,
            }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            {/* Creating an overlay to add opacity to background but not to top-up button */}
            {has_no_funds && (
                <div
                    className='dc-virtual-wallet-card--no-funds'
                    style={{
                        height: `${height}px`,
                        width: `${width}px`,
                    }}
                />
            )}
            <VirtualWalletCardHeader />
            <VirtualWalletCardContent
                amount={amount}
                currency={currency}
                has_footer={has_footer}
                wallet_name={wallet_name}
            />
            {has_footer && (
                <VirtualWalletCardFooter
                    getWalletLabels={getWalletLabels}
                    is_actions_footer={is_actions_footer}
                    is_topup_footer={is_topup_footer}
                    onClickReset={onClickReset}
                    onClickTransactions={onClickTransactions}
                    should_show_footer_actions={should_show_footer_actions}
                />
            )}
        </div>
    );
};

VirtualWalletCard.propTypes = {
    amount: PropTypes.number,
    currency: PropTypes.string,
    getWalletLabels: PropTypes.func,
    has_footer: PropTypes.bool,
    has_no_funds: PropTypes.bool,
    is_actions_footer: PropTypes.bool,
    is_topup_footer: PropTypes.bool,
    onClickReset: PropTypes.func,
    onClickTransactions: PropTypes.func,
    wallet_name: PropTypes.string,
    width: PropTypes.string,
};

export default VirtualWalletCard;
