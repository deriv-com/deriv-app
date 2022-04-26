import React from 'react';
import { observer } from 'mobx-react-lite';
import {
    Button,
    DesktopWrapper,
    MobileFullPageModal,
    MobileWrapper,
    Modal,
    Text,
    ThemedScrollbars,
} from '@deriv/components';
import { Localize, localize } from 'Components/i18next';
import { my_profile_tabs } from 'Constants/my-profile-tabs';
import { useStores } from 'Stores';
import PaymentMethodCard from '../payment-method-card';

const PaymentMethodsList = () => {
    const { my_profile_store } = useStores();

    const independent_categories = ['bank_transfer', 'other'];

    React.useEffect(() => {
        my_profile_store.getAdvertiserPaymentMethods();
        my_profile_store.setPaymentMethodToDelete(null);
        my_profile_store.setPaymentMethodToEdit(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                    <ThemedScrollbars className='payment-methods-list__list' height={'60vh'}>
                        <div className='payment-methods-list__list-container'>
                            {my_profile_store.payment_methods_list_methods.map((payment_methods_list_method, key) => {
                                const payment_methods_list = my_profile_store.advertiser_payment_methods_list.filter(
                                    payment_method =>
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
                                            {payment_methods_list.map(
                                                (each_payment_method, each_payment_method_key) => (
                                                    <PaymentMethodCard
                                                        key={each_payment_method_key}
                                                        large={true}
                                                        payment_method={each_payment_method}
                                                    />
                                                )
                                            )}
                                        </div>
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </ThemedScrollbars>
                </div>
            </DesktopWrapper>
            <MobileWrapper>
                <MobileFullPageModal
                    body_className='payment-methods-list__modal'
                    height_offset='80px'
                    is_modal_open={true}
                    page_header_text={localize('Payment methods')}
                    pageHeaderReturnFn={() => my_profile_store.setActiveTab(my_profile_tabs.MY_STATS)}
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
                        {my_profile_store.payment_methods_list_methods.map((payment_methods_list_method, key) => {
                            const payment_methods_list = my_profile_store.advertiser_payment_methods_list.filter(
                                payment_method =>
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
                                        has_horizontal={true}
                                        is_only_horizontal={true}
                                        is_scrollbar_hidden={true}
                                    >
                                        {payment_methods_list.map((each_payment_method, each_payment_method_key) => (
                                            <PaymentMethodCard
                                                key={each_payment_method_key}
                                                payment_method={each_payment_method}
                                                small={true}
                                            />
                                        ))}
                                    </ThemedScrollbars>
                                </React.Fragment>
                            );
                        })}
                    </div>
                </MobileFullPageModal>
            </MobileWrapper>
            <Modal
                is_open={my_profile_store.is_delete_error_modal_open}
                small
                has_close_icon={false}
                title={localize("Something's not right")}
            >
                <Modal.Body>
                    <Text as='p' size='xs' color='prominent'>
                        {my_profile_store.delete_error_message}
                    </Text>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        has_effect
                        text={localize('Ok')}
                        onClick={() => my_profile_store.setIsDeleteErrorModalOpen(false)}
                        primary
                        large
                    />
                </Modal.Footer>
            </Modal>
            <Modal
                is_open={my_profile_store.is_confirm_delete_modal_open}
                small
                has_close_icon={false}
                title={localize('Delete {{payment_method_name}}?', {
                    payment_method_name: my_profile_store?.payment_method_to_delete?.fields?.bank_name?.value,
                })}
            >
                <Modal.Body>
                    <Text as='p' size='xs' color='prominent'>
                        <Localize i18n_default_text='Are you sure you want to remove this payment method?' />
                    </Text>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        has_effect
                        text={localize('Yes, remove')}
                        onClick={() => my_profile_store.onClickDelete()}
                        secondary
                        large
                    />
                    <Button
                        has_effect
                        text={localize('No')}
                        onClick={() => my_profile_store.setIsConfirmDeleteModalOpen(false)}
                        primary
                        large
                    />
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default observer(PaymentMethodsList);
