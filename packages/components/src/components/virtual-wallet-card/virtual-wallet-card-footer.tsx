import React from 'react';
import VirtualWalletCardFooterActions from './virtual-wallet-card-footer-actions.jsx';
import Button from '../button';
import Icon from '../icon';
import Text from '../text';

type VirtualWalletCardFooterProps = {
    getWalletLabels: () => void;
    is_actions_footer: boolean;
    is_topup_footer: boolean;
    onClickReset: () => void;
    onClickTransactions: () => void;
    should_show_footer_actions: boolean;
};

const VirtualWalletCardFooter = ({
    getWalletLabels,
    is_actions_footer,
    is_topup_footer,
    onClickReset,
    onClickTransactions,
    should_show_footer_actions,
}: VirtualWalletCardFooterProps) => {
    if (is_topup_footer) {
        return (
            <Button
                className='dc-real-wallet-card__footer--deposit'
                icon={<Icon icon='IcAddOutline' />}
                onClick={onClickReset}
                rounded
            >
                <Text color='general' line_height='m' size='xxxs' weight='bold'>
                    {getWalletLabels().TOPUP}
                </Text>
            </Button>
        );
    }

    if (is_actions_footer && should_show_footer_actions) {
        return (
            <VirtualWalletCardFooterActions
                getWalletLabels={getWalletLabels}
                onClickReset={onClickReset}
                onClickTransactions={onClickTransactions}
            />
        );
    }

    return null; // For empty footer
};

export default VirtualWalletCardFooter;
