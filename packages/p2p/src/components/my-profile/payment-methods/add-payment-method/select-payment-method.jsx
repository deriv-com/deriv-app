import React from 'react';
import { observer } from 'mobx-react-lite';
import { Formik, Field } from 'formik';
import { Autocomplete, Icon, Loading, Text } from '@deriv/components';
import { useStores } from 'Stores';
import { localize, Localize } from 'Components/i18next';

const SelectPaymentMethod = () => {
    const { my_profile_store } = useStores();

    React.useEffect(() => {
        my_profile_store.getPaymentMethodsList();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!my_profile_store.payment_methods_list_items) {
        return <Loading is_fullscreen={false} />;
    }

    return (
        <Formik enableReinitialize initialValues={{}}>
            {() => (
                <div className='add-payment-method-select'>
                    <Field name='payment_method'>
                        {({ field }) => (
                            <Autocomplete
                                {...field}
                                autoComplete='off' // prevent chrome autocomplete
                                className='add-payment-method-select__input'
                                data-lpignore='true'
                                label={localize('Payment method')}
                                list_items={my_profile_store.payment_methods_list_items}
                                onItemSelection={({ value }) => {
                                    setTimeout(() => my_profile_store.setSelectedPaymentMethod(value), 0);
                                }}
                                required
                                trailing_icon={<Icon icon='IcSearch' />}
                                type='text'
                            />
                        )}
                    </Field>
                    <div className='add-payment-method-hint'>
                        <Localize
                            i18n_default_text='<0>Don’t see your payment method?</0> <1>Add new.</1>'
                            components={[
                                <Text key={0} color='less-prominent' size='xxs' />,
                                <Text
                                    key={1}
                                    className='link'
                                    size='xxs'
                                    onClick={() => my_profile_store.setSelectedPaymentMethod('other')}
                                />,
                            ]}
                        />
                    </div>
                </div>
            )}
        </Formik>
    );
};

export default observer(SelectPaymentMethod);
