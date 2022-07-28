import * as React from 'react';
import { Formik, Field } from 'formik';
import { observer } from 'mobx-react-lite';
import { Autocomplete, Icon } from '@deriv/components';
import { useStores } from 'Stores';
import { localize } from 'Components/i18next';
import PropTypes from 'prop-types';
import './buy-ad-payment-methods-list.scss';

const BuyAdPaymentMethodsList = ({ selected_methods, setSelectedMethods, touched }) => {
    const { my_ads_store, my_profile_store } = useStores();
    const [selected_edit_method, setSelectedEditMethod] = React.useState();
    const [payment_methods_list, setPaymentMethodsList] = React.useState([]);

    const MAX_PAYMENT_METHOD_SELECTION = 3;

    React.useEffect(() => {
        setPaymentMethodsList(
            my_profile_store.payment_methods_list.filter(({ value }) => !selected_methods.includes(value))
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected_methods]);

    const onClickDeletePaymentMethodItem = value => {
        if (value) {
            my_ads_store.payment_method_names = my_ads_store.payment_method_names.filter(
                payment_method_id => payment_method_id !== value
            );
            setSelectedMethods(selected_methods.filter(i => i !== value));
            setPaymentMethodsList([
                ...payment_methods_list,
                {
                    value,
                    text: my_profile_store.getPaymentMethodDisplayName(value),
                },
            ]);
            if (typeof touched === 'function') touched(true);
        }
    };

    const onEditPaymentMethodItem = (value, index) => {
        if (value && !my_ads_store.payment_method_names.includes(value)) {
            const edited_methods = [...selected_methods];
            edited_methods[index] = value;
            my_ads_store.payment_method_names[index] = value;
            setSelectedMethods(edited_methods);
            setPaymentMethodsList([
                ...payment_methods_list.filter(payment_method => payment_method.value !== value),
                selected_edit_method,
            ]);
            if (typeof touched === 'function') touched(true);
        }
    };

    const onClickPaymentMethodItem = value => {
        if (value && !my_ads_store.payment_method_names.includes(value)) {
            if (my_ads_store.payment_method_names.length < MAX_PAYMENT_METHOD_SELECTION) {
                my_ads_store.payment_method_names.push(value);
                setSelectedMethods([...selected_methods, value]);
                setPaymentMethodsList(payment_methods_list.filter(payment_method => payment_method.value !== value));
            }
            if (typeof touched === 'function') touched(true);
        }
    };

    const checkValidPaymentMethod = payment_method_text => {
        return (
            my_profile_store.payment_methods_list.find(payment_method => payment_method.text === payment_method_text)
                ?.value ?? false
        );
    };

    if (selected_methods?.length > 0) {
        return (
            <div className='buy-ad-payment-methods-list__container'>
                {selected_methods.map((payment_method, key) => {
                    const method = my_profile_store.getPaymentMethodDisplayName(payment_method);
                    const payment_method_icon = method.replace(' ', '');

                    return (
                        <Formik key={key} enableReinitialize initialValues={{ payment_method: method }}>
                            {({ setFieldValue }) => (
                                <Field name='payment_method'>
                                    {({ field }) => (
                                        <Autocomplete
                                            {...field}
                                            autoComplete='off' // prevent chrome autocomplete
                                            className='quick-add-modal--input'
                                            data-lpignore='true'
                                            is_alignment_top
                                            leading_icon={
                                                <Icon
                                                    icon={
                                                        payment_method_icon === 'BankTransfer' ||
                                                        payment_method_icon === 'Other'
                                                            ? `IcCashier${payment_method_icon}`
                                                            : 'IcCashierEwallet'
                                                    }
                                                />
                                            }
                                            list_items={payment_methods_list}
                                            list_portal_id='deriv_app'
                                            onBlur={e => {
                                                e.preventDefault();
                                                const value = checkValidPaymentMethod(e.target.value);
                                                if (e.target.value === '') {
                                                    setFieldValue('payment_method', method);
                                                } else if (!value) {
                                                    onClickDeletePaymentMethodItem(payment_method);
                                                } else {
                                                    onEditPaymentMethodItem(value, key);
                                                }
                                            }}
                                            onItemSelection={({ value }) => onEditPaymentMethodItem(value, key)}
                                            onFocus={() => {
                                                setSelectedEditMethod({ value: payment_method, text: method });
                                                setFieldValue('payment_method', '');
                                            }}
                                            required
                                            trailing_icon={
                                                <Icon
                                                    icon='IcDelete'
                                                    onClick={() => onClickDeletePaymentMethodItem(payment_method)}
                                                />
                                            }
                                            type='text'
                                        />
                                    )}
                                </Field>
                            )}
                        </Formik>
                    );
                })}
                {my_ads_store.payment_method_names.length < MAX_PAYMENT_METHOD_SELECTION &&
                    payment_methods_list.length > 0 && (
                        <Formik enableReinitialize initialValues={{ payment_method: '' }}>
                            {({ setFieldValue }) => (
                                <Field name='payment_method'>
                                    {({ field }) => (
                                        <div className='p2p-my-ads--border'>
                                            <Autocomplete
                                                {...field}
                                                autoComplete='off' // prevent chrome autocomplete
                                                className='quick-add-modal--input'
                                                data-lpignore='true'
                                                is_alignment_top
                                                leading_icon={<Icon icon='IcAddOutline' size={14} />}
                                                list_items={payment_methods_list}
                                                list_portal_id='deriv_app'
                                                onItemSelection={({ value }) => onClickPaymentMethodItem(value)}
                                                onBlur={e => {
                                                    e.preventDefault();
                                                    setFieldValue('payment_method', '');
                                                }}
                                                placeholder={localize('Add')}
                                                required
                                                trailing_icon={<></>}
                                                type='text'
                                            />
                                        </div>
                                    )}
                                </Field>
                            )}
                        </Formik>
                    )}
            </div>
        );
    }

    return (
        <div className='buy-ad-payment-methods-list__container'>
            <Formik enableReinitialize initialValues={{ payment_method: '' }}>
                {({ setFieldValue }) => (
                    <Field name='payment_method'>
                        {({ field }) => (
                            <div className='p2p-my-ads--border'>
                                <Autocomplete
                                    {...field}
                                    autoComplete='off' // prevent chrome autocomplete
                                    className='quick-add-modal--input'
                                    data-lpignore='true'
                                    is_alignment_top
                                    leading_icon={<Icon icon='IcAddOutline' size={14} />}
                                    list_items={payment_methods_list}
                                    list_portal_id='deriv_app'
                                    onItemSelection={({ text, value }) => {
                                        setFieldValue('payment_method', value ? text : '');
                                        onClickPaymentMethodItem(value);
                                    }}
                                    placeholder={localize('Add')}
                                    required
                                    trailing_icon={<></>}
                                    type='text'
                                />
                            </div>
                        )}
                    </Field>
                )}
            </Formik>
        </div>
    );
};

BuyAdPaymentMethodsList.propTypes = {
    selected_methods: PropTypes.array,
    setSelectedMethods: PropTypes.func,
    touched: PropTypes.func,
};

export default observer(BuyAdPaymentMethodsList);
