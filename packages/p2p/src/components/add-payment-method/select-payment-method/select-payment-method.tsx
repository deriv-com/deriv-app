import React from 'react';
import { Formik, Field, FormikValues } from 'formik';
import { Autocomplete, Icon, Loading, Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { useStores } from 'Stores';
import { localize, Localize } from 'Components/i18next';
import './select-payment-method.scss';

const SelectPaymentMethod = () => {
    const { my_profile_store } = useStores();

    React.useEffect(() => {
        my_profile_store.getPaymentMethodsList();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!my_profile_store.payment_methods_list_items.length) {
        return <Loading is_fullscreen={false} />;
    }

    return (
        <Formik
            enableReinitialize
            initialValues={{}}
            onSubmit={() => {
                // do nothing
            }}
        >
            {() => (
                <div className='select-payment-method'>
                    <Field name='payment_method'>
                        {({ field }: FormikValues) => (
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
                    <div className='select-payment-method__hint'>
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
