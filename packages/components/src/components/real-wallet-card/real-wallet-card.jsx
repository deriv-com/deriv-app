import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import RealWalletCardContent from './real-wallet-card-content.jsx';
import RealWalletCardHeader from './real-wallet-card-header.jsx';
import RealWalletCardFooter from './real-wallet-card-footer.jsx';

const RealWalletCard = ({
    amount,
    currency,
    getWalletLabels,
    has_footer = true,
    has_no_funds = false,
    is_actions_footer = false,
    is_deposit_footer = false,
    is_linked = false,
    is_selected = false,
    is_temporarily_unavailable = false,
    onClickDeposit,
    onClickSettings,
    onClickTransactions,
    onClickTransfer,
    onClickWithdrawal,
    wallet_name,
    width = '280',
}) => {
    const [should_show_footer_actions, setShouldShowFooterActions] = React.useState(false);
    const height = (width / 5) * 3;

    // Get wallet type (first word) before space or forward slash for background and icon
    const wallet_type = wallet_name.match(/(^[^\/ || ^\s]+)/)[0];

    const onMouseEnter = () => {
        setShouldShowFooterActions(true);
    };

    const onMouseLeave = () => {
        setShouldShowFooterActions(false);
    };

    return (
        <div
            className={classNames('dc-real-wallet-card', {
                'dc-real-wallet-card--linked': is_linked || is_selected,
            })}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            style={{
                background: `var(--wallet-${wallet_type.toLowerCase()})`, // TODO: Update after #2476 is merged
                height: `${height}px`,
                width: `${width}px`,
            }}
        >
            {/* Creating an overlay to add opacity to background but not to deposit button */}
            {has_no_funds && (
                <div
                    className='dc-real-wallet-card--no-funds'
                    style={{
                        height: `${height}px`,
                        width: `${width}px`,
                    }}
                />
            )}
            <RealWalletCardHeader
                amount={amount}
                currency={currency}
                is_selected={is_selected}
                is_temporarily_unavailable={is_temporarily_unavailable}
                wallet_name={wallet_name}
                wallet_type={wallet_type}
            />
            {!is_temporarily_unavailable && (
                <RealWalletCardContent
                    amount={amount}
                    currency={currency}
                    has_footer={has_footer}
                    wallet_name={wallet_name}
                />
            )}
            {has_footer && (
                <RealWalletCardFooter
                    getWalletLabels={getWalletLabels}
                    is_actions_footer={is_actions_footer}
                    is_deposit_footer={is_deposit_footer}
                    is_temporarily_unavailable={is_temporarily_unavailable}
                    onClickDeposit={onClickDeposit}
                    onClickSettings={onClickSettings}
                    onClickTransactions={onClickTransactions}
                    onClickTransfer={onClickTransfer}
                    onClickWithdrawal={onClickWithdrawal}
                    should_show_footer_actions={should_show_footer_actions}
                />
            )}
        </div>
    );
};

RealWalletCard.propTypes = {
    amount: PropTypes.number,
    currency: PropTypes.string,
    getWalletLabels: PropTypes.func,
    has_footer: PropTypes.bool,
    has_no_funds: PropTypes.bool,
    is_actions_footer: PropTypes.bool,
    is_deposit_footer: PropTypes.bool,
    is_linked: PropTypes.bool,
    is_selected: PropTypes.bool,
    is_temporarily_unavailable: PropTypes.bool,
    onClickDeposit: PropTypes.func,
    onClickSettings: PropTypes.func,
    onClickTransactions: PropTypes.func,
    onClickTransfer: PropTypes.func,
    onClickWithdrawal: PropTypes.func,
    wallet_name: PropTypes.string,
    width: PropTypes.string,
};

export default RealWalletCard;
