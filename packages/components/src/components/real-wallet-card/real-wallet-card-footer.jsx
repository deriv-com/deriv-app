import React from 'react';
import PropTypes from 'prop-types';
import RealWalletCardFooterActions from './real-wallet-card-footer-actions.jsx';
import Button from '../button';
import Icon from '../icon';
import Text from '../text';

const RealWalletCardFooter = ({
    getWalletLabels,
    is_actions_footer,
    is_deposit_footer,
    is_temporarily_unavailable,
    onClickDeposit,
    onClickSettings,
    onClickTransactions,
    onClickTransfer,
    onClickWithdrawal,
    should_show_footer_actions,
}) => {
    if (is_actions_footer || is_temporarily_unavailable) {
        return (
            <React.Fragment>
                {should_show_footer_actions && (
                    <RealWalletCardFooterActions
                        getWalletLabels={getWalletLabels}
                        is_temporarily_unavailable={is_temporarily_unavailable}
                        onClickDeposit={onClickDeposit}
                        onClickSettings={onClickSettings}
                        onClickTransactions={onClickTransactions}
                        onClickTransfer={onClickTransfer}
                        onClickWithdrawal={onClickWithdrawal}
                    />
                )}

                {is_temporarily_unavailable && (
                    <div className='dc-real-wallet-card__footer--temporarily-unavailable'>
                        {getWalletLabels().TEMPORARILY_UNAVAILABLE}
                    </div>
                )}
            </React.Fragment>
        );
    }

    if (is_deposit_footer) {
        return (
            <Button
                className='dc-real-wallet-card__footer--deposit'
                icon={<Icon icon='IcAddOutline' />}
                onClick={onClickDeposit}
                rounded
            >
                <Text color='general' line_height='m' size='xxxs' weight='bold'>
                    {getWalletLabels().DEPOSIT}
                </Text>
            </Button>
        );
    }

    return null; // For empty footer
};

RealWalletCardFooter.propTypes = {
    getWalletLabels: PropTypes.func,
    is_actions_footer: PropTypes.bool,
    is_deposit_footer: PropTypes.bool,
    is_temporarily_unavailable: PropTypes.bool,
    onClickDeposit: PropTypes.func,
    onClickSettings: PropTypes.func,
    onClickTransactions: PropTypes.func,
    onClickTransfer: PropTypes.func,
    onClickWithdrawal: PropTypes.func,
    should_show_footer_actions: PropTypes.bool,
};

export default RealWalletCardFooter;
