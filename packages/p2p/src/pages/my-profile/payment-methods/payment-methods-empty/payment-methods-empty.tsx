import React from 'react';
import { Icon, MobileFullPageModal, Text, Button } from '@deriv/components';
import { observer } from '@deriv/stores';
import { useDevice } from '@deriv-com/ui';
import { my_profile_tabs } from 'Constants/my-profile-tabs';
import { Localize, localize } from 'Components/i18next';
import { useStores } from 'Stores';

const PaymentMethodsEmpty = () => {
    const { isDesktop } = useDevice();
    const { my_profile_store } = useStores();

    const payment_method_empty_icon = (
        <React.Fragment>
            <Icon icon='IcPaymentMethodsWallet' className='payment-methods-empty__icon' height={159} width={256} />
            <Text className='payment-methods-empty__text' weight='bold'>
                <Localize i18n_default_text='You haven’t added any payment methods yet' />
            </Text>
            <Text>
                <Localize i18n_default_text='Hit the button below to add payment methods.' />
            </Text>
            <Button
                className='payment-methods-empty__button'
                has_effect
                large
                primary
                onClick={my_profile_store.showAddPaymentMethodForm}
                text={localize('Add payment methods')}
            />
        </React.Fragment>
    );

    if (isDesktop) {
        return <div className='payment-methods-empty'>{payment_method_empty_icon}</div>;
    }

    return (
        <MobileFullPageModal
            body_className='payment-methods-list__modal'
            height_offset='80px'
            is_flex
            is_modal_open
            onClickClose={() => {
                // do nothing
            }}
            page_header_text={localize('Payment methods')}
            pageHeaderReturnFn={() => my_profile_store.setActiveTab(my_profile_tabs.MY_STATS)}
        >
            {payment_method_empty_icon}
        </MobileFullPageModal>
    );
};

export default observer(PaymentMethodsEmpty);
