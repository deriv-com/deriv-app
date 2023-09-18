import React from 'react';
import { observer } from 'mobx-react-lite';
import {
    Button,
    DesktopWrapper,
    Loading,
    MobileFullPageModal,
    MobileWrapper,
    Text,
    ThemedScrollbars,
} from '@deriv/components';
import { useP2PAdvertiserPaymentMethods } from '@deriv/hooks';
import { Localize, localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { my_profile_tabs } from 'Constants/my-profile-tabs';
import { useStores } from 'Stores';
import PaymentMethodCard from '../payment-method-card';

const PaymentMethodsList = () => {
    const { data: advertiser_payment_methods, isRefetching } = useP2PAdvertiserPaymentMethods();
    const { isCurrentModal } = useModalManagerContext();
    const { my_profile_store } = useStores();

    const should_show_loading_screen =
        !advertiser_payment_methods || (isRefetching && !isCurrentModal('DeletePaymentMethodConfirmationModal'));

    const type_to_title_mapper = {
        bank: localize('Bank Transfers'),
        ewallet: localize('E-wallets'),
        other: localize('Others'),
    };

    React.useEffect(() => {
        my_profile_store.setPaymentMethodToDelete(null);
        my_profile_store.setPaymentMethodToEdit(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (should_show_loading_screen) return <Loading is_fullscreen={false} />;

    return (
        <>
            <DesktopWrapper>
                <div className='payment-methods-list'>
                    <Button
                        className='payment-methods-list__button'
                        large
                        onClick={() => my_profile_store.setShouldShowAddPaymentMethodForm(true)}
                        primary
                    >
                        <Localize i18n_default_text='Add new' />
                    </Button>
                    <div className='payment-methods-list__list-container'>
                        {advertiser_payment_methods &&
                            Object.keys(type_to_title_mapper).map(key => {
                                const current_title = type_to_title_mapper[key];
                                const payment_methods = advertiser_payment_methods.filter(
                                    payment_method => payment_method.type === key
                                );

                                if (!payment_methods.length) return null;

                                return (
                                    <React.Fragment key={key}>
                                        <Text className='payment-methods-list__list-header' size='xs' weight='bold'>
                                            {current_title}
                                        </Text>

                                        <div className='payment-methods-list__list-body'>
                                            {payment_methods.map((each_payment_method, each_payment_method_key) => (
                                                <PaymentMethodCard
                                                    key={each_payment_method_key}
                                                    large
                                                    payment_method={each_payment_method}
                                                    show_payment_method_name={false}
                                                />
                                            ))}
                                        </div>
                                    </React.Fragment>
                                );
                            })}
                    </div>
                </div>
            </DesktopWrapper>
            <MobileWrapper>
                <MobileFullPageModal
                    body_className='payment-methods-list__modal'
                    height_offset='80px'
                    is_flex
                    is_modal_open
                    page_header_text={localize('Payment methods')}
                    pageHeaderReturnFn={() => my_profile_store.setActiveTab(my_profile_tabs.MY_STATS)}
                    page_footer_className='payment-methods-list__modal--footer'
                    renderPageFooterChildren={() => (
                        <Button
                            className='payment-methods-list__button'
                            large
                            onClick={() => my_profile_store.setShouldShowAddPaymentMethodForm(true)}
                            primary
                        >
                            <Localize i18n_default_text='Add new' />
                        </Button>
                    )}
                >
                    <div className='payment-methods-list__list-container'>
                        {advertiser_payment_methods &&
                            Object.keys(type_to_title_mapper).map(key => {
                                const current_title = type_to_title_mapper[key];
                                const payment_methods = advertiser_payment_methods.filter(
                                    payment_method => payment_method.type === key
                                );

                                if (!payment_methods.length) return null;

                                return (
                                    <React.Fragment key={key}>
                                        <Text className='payment-methods-list__list-header' size='xs' weight='bold'>
                                            {current_title}
                                        </Text>

                                        <ThemedScrollbars
                                            className='payment-methods-list__list-horizontal'
                                            has_horizontal
                                            is_only_horizontal
                                            is_scrollbar_hidden
                                        >
                                            {payment_methods.map((each_payment_method, each_payment_method_key) => (
                                                <PaymentMethodCard
                                                    key={each_payment_method_key}
                                                    payment_method={each_payment_method}
                                                    small
                                                    show_payment_method_name={false}
                                                />
                                            ))}
                                        </ThemedScrollbars>
                                    </React.Fragment>
                                );
                            })}
                    </div>
                </MobileFullPageModal>
            </MobileWrapper>
        </>
    );
};

export default observer(PaymentMethodsList);
