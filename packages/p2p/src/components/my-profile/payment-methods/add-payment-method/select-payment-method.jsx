import React from 'react';
import { observer } from 'mobx-react-lite';
import { Formik, Field, Form } from 'formik';
import { Autocomplete, Icon, Loading } from '@deriv/components';
import { useStores } from 'Stores';
import { localize } from 'Components/i18next';

const SelectPaymentMethod = () => {
    const { my_profile_store } = useStores();

    React.useEffect(() => {
        my_profile_store.getPaymentMethodsList();
        // my_profile_store.setIsLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!my_profile_store.payment_methods_list_items) {
        return <Loading is_fullscreen={false} />;
    }

    return (
        <Formik>
            {() => {
                return (
                    <Field name='payment_method'>
                        {({ field }) => (
                            <Autocomplete
                                {...field}
                                autoComplete='off'
                                data-lpignore='true'
                                label={localize('Payment method')}
                                list_items={my_profile_store.payment_methods_list_items}
                                onItemSelection={({ value }) => {
                                    my_profile_store.setSelectedPaymentMethod(value);
                                }}
                                trailing_icon={<Icon icon='IcSearch' />}
                                type='text'
                                required
                            />
                        )}
                    </Field>
                );
            }}
        </Formik>
    );
};

export default observer(SelectPaymentMethod);
