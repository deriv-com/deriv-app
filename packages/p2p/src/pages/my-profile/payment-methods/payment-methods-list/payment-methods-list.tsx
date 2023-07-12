import React from 'react';
import { Button, DesktopWrapper, MobileFullPageModal, MobileWrapper, Text, ThemedScrollbars } from '@deriv/components';
import { observer } from '@deriv/stores';
import { my_profile_tabs } from 'Constants/my-profile-tabs';
import { Localize, localize } from 'Components/i18next';
import PaymentMethodCard from 'Components/payment-method-card';
import { useStores } from 'Stores';
import { TPaymentMethod } from 'Types';

type TPaymentMethodsListMethod = {
    display_name: string;
    method: string;
};

const PaymentMethodsList = () => {
    const { my_profile_store } = useStores();

    const independent_categories = ['bank_transfer', 'other'];

    const sortPaymentMethodsListMethods = (payment_methods_list_methods: TPaymentMethodsListMethod[]) => {
        const order = ['bank_transfer', 'e_wallet', 'other'];
        return payment_methods_list_methods.sort(
            (method_a, method_b) => order.indexOf(method_a.method) - order.indexOf(method_b.method)
        );
    };

    React.useEffect(() => {
        my_profile_store.setPaymentMethodToDelete(null);
        my_profile_store.setPaymentMethodToEdit(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const add_new_button = (
        <Button
            className='payment-methods-list__button'
            large
            onClick={() => my_profile_store.setShouldShowAddPaymentMethodForm(true)}
            primary
        >
            <Localize i18n_default_text='Add new' />
        </Button>
    );

    return (
        <>
            <DesktopWrapper>
                <div className='payment-methods-list'>
                    {add_new_button}
                    <div className='payment-methods-list__list-container'>
                        {sortPaymentMethodsListMethods([...my_profile_store.payment_methods_list_methods]).map(
                            (payment_methods_list_method, key) => {
                                const payment_methods_list = my_profile_store.advertiser_payment_methods_list.filter(
                                    (payment_method: TPaymentMethod) =>
                                        payment_method.method === payment_methods_list_method.method ||
                                        (!independent_categories.includes(payment_method.method) &&
                                            payment_methods_list_method.method === 'e_wallet')
                                );

                                return (
                                    <React.Fragment key={key}>
                                        <Text className='payment-methods-list__list-header' size='xs' weight='bold'>
                                            {`${payment_methods_list_method.display_name}s`}
                                        </Text>
                                        <div className='payment-methods-list__list-body'>
                                            {payment_methods_list?.map(
                                                (
                                                    each_payment_method: TPaymentMethod,
                                                    each_payment_method_key: number
                                                ) => (
                                                    <PaymentMethodCard
                                                        key={each_payment_method_key}
                                                        large
                                                        payment_method={each_payment_method}
                                                        show_payment_method_name={false}
                                                    />
                                                )
                                            )}
                                        </div>
                                    </React.Fragment>
                                );
                            }
                        )}
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
                    renderPageFooterChildren={() => add_new_button}
                >
                    <div className='payment-methods-list__list-container'>
                        {sortPaymentMethodsListMethods([...my_profile_store.payment_methods_list_methods]).map(
                            (payment_methods_list_method, key) => {
                                const payment_methods_list = my_profile_store.advertiser_payment_methods_list.filter(
                                    (payment_method: TPaymentMethodsListMethod) =>
                                        payment_method.method === payment_methods_list_method.method ||
                                        (!independent_categories.includes(payment_method.method) &&
                                            payment_methods_list_method.method === 'e_wallet')
                                );

                                return (
                                    <React.Fragment key={key}>
                                        <Text className='payment-methods-list__list-header' size='xs' weight='bold'>
                                            {`${payment_methods_list_method.display_name}s`}
                                        </Text>
                                        <ThemedScrollbars
                                            className='payment-methods-list__list-horizontal'
                                            has_horizontal
                                            is_only_horizontal
                                            is_scrollbar_hidden
                                        >
                                            {payment_methods_list.map(
                                                (
                                                    each_payment_method: TPaymentMethod,
                                                    each_payment_method_key: number
                                                ) => (
                                                    <PaymentMethodCard
                                                        key={each_payment_method_key}
                                                        payment_method={each_payment_method}
                                                        small
                                                        show_payment_method_name={false}
                                                    />
                                                )
                                            )}
                                        </ThemedScrollbars>
                                    </React.Fragment>
                                );
                            }
                        )}
                    </div>
                </MobileFullPageModal>
            </MobileWrapper>
        </>
    );
};

export default observer(PaymentMethodsList);
