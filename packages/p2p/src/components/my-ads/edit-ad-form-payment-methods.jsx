import * as React from 'react';
import { Formik, Field } from 'formik';
import { observer } from 'mobx-react-lite';
import { Autocomplete, Icon, Text } from '@deriv/components';
import { useStores } from 'Stores';
import PaymentMethodCard from '../my-profile/payment-methods/payment-method-card';
import { localize, Localize } from 'Components/i18next';

const EditAdFormPaymentMethods = ({ is_sell_advert }) => {
    const { my_ads_store, my_profile_store } = useStores();

    const [selected_methods, setSelectedMethods] = React.useState([]);
    const style = {
        borderColor: 'var(--brand-secondary)',
        borderWidth: '2px',
    };

    const onClickPaymentMethodCard = payment_method => {
        if (!my_ads_store.payment_method_ids.includes(payment_method.ID)) {
            my_ads_store.payment_method_ids.push(payment_method.ID);
            setSelectedMethods([...selected_methods, payment_method.ID]);
        } else {
            my_ads_store.payment_method_ids = my_ads_store.payment_method_ids.filter(
                payment_method_id => payment_method_id !== payment_method.ID
            );
            setSelectedMethods(selected_methods.filter(i => i !== payment_method.ID));
        }
    };

    if (is_sell_advert) {
        if (my_profile_store.advertiser_has_payment_methods) {
            return (
                <>
                    {my_profile_store.advertiser_payment_methods_list.map((payment_method, key) => (
                        <PaymentMethodCard
                            is_vertical_ellipsis_visible={false}
                            key={key}
                            medium
                            onClick={() => onClickPaymentMethodCard(payment_method)}
                            payment_method={payment_method}
                            style={selected_methods.includes(payment_method.ID) ? style : {}}
                        />
                    ))}
                    <PaymentMethodCard
                        is_add={true}
                        label={localize('Payment method')}
                        medium
                        onClickAdd={() => my_ads_store.setShouldShowAddPaymentMethodModal(true)}
                    />
                </>
            );
        }

        return (
            <PaymentMethodCard
                is_add={true}
                label={localize('Payment method')}
                medium
                onClickAdd={() => my_ads_store.setShouldShowAddPaymentMethodModal(true)}
            />
        );
    }

    return (
        <Formik enableReinitialize initialValues={{ payment_method: '' }}>
            {({ setFieldValue }) => (
                <Field name='payment_method'>
                    {({ field }) => (
                        <div className='p2p-my-ads__form-payment-methods--empty'>
                            <Autocomplete
                                {...field}
                                autoComplete='off' // prevent chrome autocomplete
                                data-lpignore='true'
                                has_updating_list={false}
                                label={
                                    <React.Fragment>
                                        <Icon icon='IcAddCircle' size={14} />
                                        <Text color='less-prominent' size='xs'>
                                            <Localize i18n_default_text='Add' />
                                        </Text>
                                    </React.Fragment>
                                }
                                list_items={my_profile_store.payment_methods_list}
                                onItemSelection={({ text, value }) =>
                                    setFieldValue('payment_method', value ? text : '')
                                }
                                required
                                trailing_icon={<></>}
                                type='text'
                            />
                        </div>
                    )}
                </Field>
            )}
        </Formik>
    );
};

export default observer(EditAdFormPaymentMethods);
