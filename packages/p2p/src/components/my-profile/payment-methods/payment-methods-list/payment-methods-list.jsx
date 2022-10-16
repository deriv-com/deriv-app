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
import DeletePaymentMethodErrorModal from './delete-payment-method-error-modal.jsx';
import { my_profile_tabs } from 'Constants/my-profile-tabs';
import { useStores } from 'Stores';
import PaymentMethodCard from '../payment-method-card';

const PaymentMethodsList = () => {
    const { general_store, my_profile_store } = useStores();

    const independent_categories = ['bank_transfer', 'other'];

    const sortPaymentMethodsListMethods = payment_methods_list_methods => {
        const order = ['bank_transfer', 'e_wallet', 'other'];
        return payment_methods_list_methods.sort((i, j) => order.indexOf(i.method) - order.indexOf(j.method));
    };

    React.useEffect(() => {
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
                    <div className='payment-methods-list__list-container'>
                        {sortPaymentMethodsListMethods([...my_profile_store.payment_methods_list_methods]).map(
                            (payment_methods_list_method, key) => {
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
                        {sortPaymentMethodsListMethods([...my_profile_store.payment_methods_list_methods]).map(
                            (payment_methods_list_method, key) => {
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
                                            has_horizontal
                                            is_only_horizontal
                                            is_scrollbar_hidden
                                        >
                                            {payment_methods_list.map(
                                                (each_payment_method, each_payment_method_key) => (
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
            <DeletePaymentMethodErrorModal />
            <Modal
                is_open={my_profile_store.is_confirm_delete_modal_open}
                small
                has_close_icon={false}
                onMount={() => general_store.setIsModalOpen(true)}
                onUnmount={() => general_store.setIsModalOpen(false)}
            >
                <Modal.Body className='payment-methods-list__modal-wrapper'>
                    <Text as='p' size='xs' color='prominent'>
                        <Localize
                            i18n_default_text='Delete {{payment_method_name}}?'
                            values={{
                                payment_method_name:
                                    my_profile_store?.payment_method_to_delete?.fields?.bank_name?.value ||
                                    my_profile_store?.payment_method_to_delete?.fields?.name?.value ||
                                    my_profile_store?.payment_method_to_delete?.fields?.account?.value,
                            }}
                        />
                    </Text>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        has_effect
                        text={localize('Yes, remove')}
                        onClick={my_profile_store.onClickDelete}
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
