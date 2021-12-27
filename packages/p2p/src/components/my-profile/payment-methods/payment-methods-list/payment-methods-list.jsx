import React from 'react';
import { observer } from 'mobx-react-lite';
import { isDesktop, isMobile } from '@deriv/shared';
import { Button, Modal, Text } from '@deriv/components';
import { Localize, localize } from 'Components/i18next';
import { useStores } from 'Stores';
import PaymentMethodCard from '../payment-method-card';

const PaymentMethodsList = () => {
    const { my_profile_store } = useStores();

    React.useEffect(() => {
        my_profile_store.getAdvertiserPaymentMethods();
        my_profile_store.setPaymentMethodToDelete(null);
        my_profile_store.setPaymentMethodToEdit(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className='payment-methods-list'>
            <Button
                className='payment-methods-list__button'
                large
                onClick={() => my_profile_store.setShouldShowAddPaymentMethodForm(true)}
                primary
            >
                <Localize i18n_default_text='Add new' />
            </Button>
            {my_profile_store.payment_methods_list_methods.map((payment_methods_list_method, key) => {
                const payment_methods_list = my_profile_store.advertiser_payment_methods_list.filter(
                    payment_method => payment_method.method === payment_methods_list_method.method
                );

                return (
                    <React.Fragment key={key}>
                        <Text className='payment-methods-list__list-header' size='xs' weight='bold'>
                            {`${payment_methods_list_method.display_name}s`}
                        </Text>
                        {payment_methods_list.map(each_payment_method => (
                            <PaymentMethodCard
                                key={key}
                                large={isDesktop()}
                                payment_method={each_payment_method}
                                small={isMobile()}
                            />
                        ))}
                    </React.Fragment>
                );
            })}
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
        </div>
    );
};

export default observer(PaymentMethodsList);
