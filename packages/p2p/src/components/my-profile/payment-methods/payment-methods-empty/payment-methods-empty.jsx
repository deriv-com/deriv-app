import React from 'react';
import { observer } from 'mobx-react-lite';
import { DesktopWrapper, Icon, MobileFullPageModal, MobileWrapper, Text, Button } from '@deriv/components';
import { my_profile_tabs } from 'Constants/my-profile-tabs';
import { Localize, localize } from 'Components/i18next';
import { useStores } from 'Stores';

const PaymentMethodsEmpty = () => {
    const { my_profile_store } = useStores();

    return (
        <React.Fragment>
            <DesktopWrapper>
                <div className='payment-methods-empty'>
                    <Icon icon='IcPaymentMethodsWallet' height={159} width={256} />
                    <Text className='payment-methods-empty--text' line_height='m' size='s' weight='bold'>
                        <Localize i18n_default_text='You haven’t added any payment methods yet' />
                    </Text>
                    <Text line_height='m' size='s'>
                        <Localize i18n_default_text='Hit the button below to add payment methods.' />
                    </Text>
                    <Button
                        className='payment-methods-empty--button'
                        has_effect
                        large
                        primary
                        onClick={my_profile_store.showAddPaymentMethodForm}
                        text={localize('Add payment methods')}
                    />
                </div>
            </DesktopWrapper>
            <MobileWrapper>
                <MobileFullPageModal
                    body_className='payment-methods-list__modal'
                    height_offset='80px'
                    is_flex
                    is_modal_open={true}
                    page_header_text={localize('Payment methods')}
                    pageHeaderReturnFn={() => my_profile_store.setActiveTab(my_profile_tabs.MY_STATS)}
                >
                    <Icon
                        icon='IcPaymentMethodsWallet'
                        className='payment-methods-empty--icon'
                        height={159}
                        width={256}
                    />
                    <Text className='payment-methods-empty--text' line_height='m' size='s' weight='bold'>
                        <Localize i18n_default_text='You haven’t added any payment methods yet' />
                    </Text>
                    <Text line_height='m' size='s'>
                        <Localize i18n_default_text='Hit the button below to add payment methods.' />
                    </Text>
                    <Button
                        className='payment-methods-empty--button'
                        has_effect
                        large
                        primary
                        onClick={my_profile_store.showAddPaymentMethodForm}
                        text={localize('Add payment methods')}
                    />
                </MobileFullPageModal>
            </MobileWrapper>
        </React.Fragment>
    );
};

export default observer(PaymentMethodsEmpty);
