import React from 'react';
import PropTypes from 'prop-types';
import VirtualWalletCardFooterActions from './virtual-wallet-card-footer-actions.jsx';
import Button from '../button';
import Icon from '../icon';
import Text from '../text';

const VirtualWalletCardFooter = ({
    getWalletLabels,
    is_actions_footer,
    is_topup_footer,
    onClickReset,
    onClickTransactions,
    should_show_footer_actions,
}) => {
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

VirtualWalletCardFooter.propTypes = {
    getWalletLabels: PropTypes.func,
    is_actions_footer: PropTypes.bool,
    is_topup_footer: PropTypes.bool,
    onClickReset: PropTypes.func,
    onClickTransactions: PropTypes.func,
    should_show_footer_actions: PropTypes.bool,
};

export default VirtualWalletCardFooter;
