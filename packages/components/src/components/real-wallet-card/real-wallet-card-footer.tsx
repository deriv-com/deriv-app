import React from 'react';
import RealWalletCardFooterActions from './real-wallet-card-footer-actions.jsx';
import Button from '../button';
import Icon from '../icon';
import Text from '../text';

type RealWalletCardFooterProps = {
    getWalletLabels: () => void;
    is_actions_footer: boolean;
    is_deposit_footer: boolean;
    is_temporarily_unavailable: boolean;
    onClickDeposit: () => void;
    onClickSettings: () => void;
    onClickTransactions: () => void;
    onClickTransfer: () => void;
    onClickWithdrawal: () => void;
    should_show_footer_actions: boolean;
};

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
}: RealWalletCardFooterProps) => {
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

export default RealWalletCardFooter;
