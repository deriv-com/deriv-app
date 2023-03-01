import * as React from 'react';
import { Button, Icon, Modal, Money, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from 'Components/i18next';
import { useStores } from 'Stores';

const MyProfileBalance = () => {
    const { general_store } = useStores();
    const {
        client: { currency },
    } = useStore();
    const [is_balance_tooltip_open, setIsBalanceTooltipOpen] = React.useState(false);

    return (
        <div className='my-profile-balance'>
            <Modal
                className='my-profile-balance__modal'
                has_close_icon={false}
                is_open={is_balance_tooltip_open}
                small
                title={localize('Deriv P2P Balance')}
            >
                <Modal.Body className='my-profile-balance__modal-body'>
                    <Localize i18n_default_text='Deriv P2P balance = deposits that can’t be reversed' />
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        has_effect
                        text={localize('OK')}
                        onClick={() => setIsBalanceTooltipOpen(false)}
                        primary
                        large
                    />
                </Modal.Footer>
            </Modal>
            <div className='my-profile-balance--column'>
                <div className='my-profile-balance--row'>
                    <Text color='less-prominent' line_height='m' size={isMobile() ? 'xxxs' : 'xs'}>
                        <Localize i18n_default_text='Available Deriv P2P balance' />
                    </Text>
                    <Icon
                        className='my-profile-balance--icon'
                        color='disabled'
                        icon='IcInfoOutline'
                        onClick={() => setIsBalanceTooltipOpen(true)}
                        size={isMobile() ? 12 : 16}
                    />
                </div>
                <Text className='my-profile-balance__amount' color='prominent' line_height='m' size='m' weight='bold'>
                    <Money amount={general_store.advertiser_info.balance_available} currency={currency} show_currency />
                </Text>
            </div>
        </div>
    );
};

export default observer(MyProfileBalance);
