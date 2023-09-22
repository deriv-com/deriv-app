import React from 'react';
import { Formik, Field, FieldProps } from 'formik';
import { reaction } from 'mobx';
import { Autocomplete, Icon, Text, useOnClickOutside } from '@deriv/components';
import { isDesktop, isMobile } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { localize, Localize } from 'Components/i18next';
import PaymentMethodIcon from 'Components/payment-method-icon';
import { useStores } from 'Stores';
import './buy-ad-payment-methods-list.scss';

type TPaymentMethod = {
    value?: string;
    text?: string;
};

export type TBuyAdPaymentMethodsListProps = {
    is_alignment_top?: boolean;
    list_portal_id?: string;
    selected_methods: string[];
    setSelectedMethods: (selected_methods: string[]) => void;
    should_show_hint?: boolean;
    touched?: (value: boolean) => void;
};

const BuyAdPaymentMethodsList = ({
    is_alignment_top = false,
    list_portal_id = 'deriv_app',
    selected_methods,
    setSelectedMethods,
    should_show_hint = false,
    touched = () => {
        // do nothing
    },
}: TBuyAdPaymentMethodsListProps) => {
    const { my_ads_store, my_profile_store } = useStores();
    const [selected_edit_method, setSelectedEditMethod] = React.useState<TPaymentMethod>({});
    const [payment_methods_list, setPaymentMethodsList] = React.useState<TPaymentMethod[]>([]);
    const [close_icon, setCloseIcon] = React.useState(false);
    const [show_list, setShowList] = React.useState(false);
    const [hide_list, setHideList] = React.useState(false);
    const deleted_autocomplete_ref = React.useRef<HTMLDivElement>(null);
    const MAX_PAYMENT_METHOD_SELECTION = 3;

    const { current_method, payment_method_names, setCurrentMethod, show_ad_form } = my_ads_store;

    const { getPaymentMethodDisplayName, payment_methods_list: payment_methods_list_store } = my_profile_store;

    useOnClickOutside(
        deleted_autocomplete_ref,
        () => {
            setShowList(false);
            setHideList(true);
            setCurrentMethod({ key: null, is_deleted: false });
        },
        () => !hide_list
    );

    React.useEffect(() => {
        const disposeAddPaymentMethodsList = reaction(
            () => payment_methods_list_store,
            () =>
                setPaymentMethodsList(
                    payment_methods_list_store.filter(
                        ({ value }: { value: string }) => !selected_methods.includes(value)
                    )
                )
        );
        return disposeAddPaymentMethodsList;
    }, []);

    React.useEffect(() => {
        setPaymentMethodsList(
            payment_methods_list_store.filter(({ value }: { value: string }) => !selected_methods.includes(value))
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hide_list, show_list, selected_methods]);

    const onClickDeletePaymentMethodItem = (value: string) => {
        if (value) {
            my_ads_store.payment_method_names = payment_method_names.filter(
                (payment_method_id: string) => payment_method_id !== value
            );
            setSelectedMethods(selected_methods.filter(i => i !== value));
            setPaymentMethodsList([
                ...payment_methods_list,
                {
                    value,
                    text: getPaymentMethodDisplayName(value),
                },
            ]);
            if (typeof touched === 'function') touched(true);
        }
    };

    const onEditPaymentMethodItem = (value: string, index: number) => {
        if (value) {
            if (close_icon && selected_methods.length > 1) {
                setCloseIcon(false);
                setCurrentMethod({ ...current_method, is_deleted: true });
            } else if (close_icon && selected_methods.length === 1) {
                onClickDeletePaymentMethodItem(selected_methods[0]);
                setCurrentMethod({ ...current_method, key: null, is_deleted: false });
                setCloseIcon(false);
            } else {
                const edited_methods = [...selected_methods];
                edited_methods[index] = value;
                payment_method_names[index] = value;
                setSelectedMethods(edited_methods);
                setPaymentMethodsList([
                    ...payment_methods_list.filter(payment_method => payment_method.value !== value),
                    selected_edit_method,
                ]);
                if (typeof touched === 'function') touched(true);
            }
        }
    };

    const onClickPaymentMethodItem = (value: string) => {
        if (value && !payment_method_names.includes(value)) {
            if (current_method.is_deleted) {
                onEditPaymentMethodItem(value, current_method.key);
                setCurrentMethod({ ...current_method, key: null, is_deleted: false });
                setShowList(false);
                setHideList(true);
            } else if (payment_method_names.length < MAX_PAYMENT_METHOD_SELECTION) {
                payment_method_names.push(value);
                setSelectedMethods([...selected_methods, value]);
                setPaymentMethodsList(payment_methods_list.filter(payment_method => payment_method.value !== value));
            }
            if (typeof touched === 'function') touched(true);
        }
    };

    const onClickIcon = (
        payment_method: string,
        key: number,
        setFieldValue: (value: string, method: string) => void
    ) => {
        if (close_icon) {
            onEditPaymentMethodItem(payment_method, key);
            setShowList(true);
            setFieldValue('payment_method', '');
        } else if (!close_icon && !current_method.is_deleted) {
            onClickDeletePaymentMethodItem(payment_method);
        }
    };

    const getPaymentHint = () => (
        <Localize
            i18n_default_text='<0>Don’t see your payment method?</0> <1>Add new.</1>'
            components={[
                <Text key={0} color='less-prominent' size='xxs' />,
                <Text key={1} className='link' size='xxs' onClick={() => onClickPaymentMethodItem('other')} />,
            ]}
        />
    );

    if (selected_methods?.length > 0) {
        return (
            <div className='buy-ad-payment-methods-list__container'>
                {selected_methods.map((payment_method, key) => {
                    const method = getPaymentMethodDisplayName(payment_method);
                    return (
                        <Formik
                            key={key}
                            enableReinitialize
                            initialValues={{ payment_method: method }}
                            onSubmit={() => {
                                // do nothing
                            }}
                        >
                            {({ setFieldValue }) => (
                                <Field name='payment_method'>
                                    {({ field }: FieldProps) =>
                                        current_method.key === key && current_method.is_deleted ? (
                                            <div className='my-ads--border' ref={deleted_autocomplete_ref}>
                                                <Autocomplete
                                                    {...field}
                                                    autoComplete='off' // prevent chrome autocomplete
                                                    className='buy-ad-payment-methods-list__input'
                                                    data-lpignore='true'
                                                    data-testid='dt_buy_ad_payment_methods_list_input'
                                                    hide_list={hide_list}
                                                    is_alignment_top={is_alignment_top}
                                                    leading_icon={<Icon icon='IcAddOutline' size={14} />}
                                                    list_items={payment_methods_list}
                                                    list_portal_id={list_portal_id}
                                                    onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                                        e.preventDefault();
                                                        setFieldValue('payment_method', '');
                                                    }}
                                                    onItemSelection={({ value }: { value: string }) => {
                                                        setTimeout(() => onClickPaymentMethodItem(value), 0);
                                                    }}
                                                    placeholder={localize('Add')}
                                                    required
                                                    show_list={show_list}
                                                    trailing_icon={
                                                        field.value ? (
                                                            <Icon
                                                                className='buy-ad-payment-methods-list__icon'
                                                                data_testid='dt_buy_ad_payment_methods_list_icon'
                                                                color='secondary'
                                                                icon='IcCloseCircle'
                                                                onClick={() => {
                                                                    setFieldValue('payment_method', '');
                                                                }}
                                                            />
                                                        ) : (
                                                            <></>
                                                        )
                                                    }
                                                    type='text'
                                                />
                                            </div>
                                        ) : (
                                            <div>
                                                <Autocomplete
                                                    {...field}
                                                    autoComplete='off' // prevent chrome autocomplete
                                                    className='buy-ad-payment-methods-list__input'
                                                    data-lpignore='true'
                                                    data-testid='dt_buy_ad_payment_methods_list_input'
                                                    hide_list={hide_list}
                                                    is_alignment_top={is_alignment_top}
                                                    leading_icon={<PaymentMethodIcon display_name={method} />}
                                                    list_items={[method]}
                                                    list_portal_id={list_portal_id}
                                                    onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                                        e.preventDefault();
                                                        setFieldValue('payment_method', method);
                                                        setCloseIcon(false);
                                                    }}
                                                    onHideDropdownList={() => {
                                                        setFieldValue('payment_method', method);
                                                        setCloseIcon(false);
                                                    }}
                                                    onItemSelection={({ value }: { value: string }) => {
                                                        onEditPaymentMethodItem(value, key);
                                                    }}
                                                    onFocus={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                        e.preventDefault();
                                                        setCloseIcon(true);
                                                        setHideList(false);
                                                        setFieldValue('payment_method', method);
                                                        if (!current_method.is_deleted) {
                                                            setSelectedEditMethod({
                                                                value: payment_method,
                                                                text: method,
                                                            });
                                                            setCurrentMethod({
                                                                ...current_method,
                                                                key,
                                                            });
                                                        }
                                                    }}
                                                    onShowDropdownList={() => {
                                                        setCloseIcon(true);
                                                    }}
                                                    required
                                                    trailing_icon={
                                                        <Icon
                                                            className='buy-ad-payment-methods-list__icon'
                                                            data_testid='dt_buy_ad_payment_methods_list_icon'
                                                            color={
                                                                close_icon && current_method.key === key
                                                                    ? 'secondary'
                                                                    : 'black'
                                                            }
                                                            icon={
                                                                close_icon && current_method.key === key
                                                                    ? 'IcCloseCircle'
                                                                    : 'IcDelete'
                                                            }
                                                            onTouchStart={() => {
                                                                if (isMobile())
                                                                    onClickIcon(payment_method, key, setFieldValue);
                                                            }}
                                                            onMouseDown={() => {
                                                                if (isDesktop() && show_ad_form)
                                                                    onClickIcon(payment_method, key, setFieldValue);
                                                            }}
                                                            onClick={() => {
                                                                if (isDesktop() && !show_ad_form) {
                                                                    onClickIcon(payment_method, key, setFieldValue);
                                                                }
                                                            }}
                                                        />
                                                    }
                                                    type='text'
                                                />
                                            </div>
                                        )
                                    }
                                </Field>
                            )}
                        </Formik>
                    );
                })}
                {payment_method_names.length < MAX_PAYMENT_METHOD_SELECTION &&
                    payment_methods_list.length > 0 &&
                    !current_method.is_deleted && (
                        <Formik
                            enableReinitialize
                            initialValues={{ payment_method: '' }}
                            onSubmit={() => {
                                // do nothing
                            }}
                        >
                            {({ setFieldValue }) => (
                                <Field name='payment_method'>
                                    {({ field }: FieldProps) => (
                                        <div className='my-ads--border'>
                                            <Autocomplete
                                                {...field}
                                                autoComplete='off' // prevent chrome autocomplete
                                                className='buy-ad-payment-methods-list__input'
                                                data-lpignore='true'
                                                data-testid='dt_buy_ad_payment_methods_list_input'
                                                is_alignment_top={is_alignment_top}
                                                leading_icon={<Icon icon='IcAddOutline' size={14} />}
                                                list_items={payment_methods_list}
                                                list_portal_id={list_portal_id}
                                                onItemSelection={({ value }: { value: string }) =>
                                                    setTimeout(() => onClickPaymentMethodItem(value), 0)
                                                }
                                                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
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
                {should_show_hint &&
                    !selected_methods.includes('other') &&
                    selected_methods.length < MAX_PAYMENT_METHOD_SELECTION &&
                    getPaymentHint()}
            </div>
        );
    }

    return (
        <div className='buy-ad-payment-methods-list__container'>
            <Formik
                enableReinitialize
                initialValues={{ payment_method: '' }}
                onSubmit={() => {
                    // do nothing
                }}
            >
                {({ setFieldValue }) => (
                    <Field name='payment_method'>
                        {({ field }: FieldProps) => (
                            <div className='my-ads--border'>
                                <Autocomplete
                                    {...field}
                                    autoComplete='off' // prevent chrome autocomplete
                                    className='buy-ad-payment-methods-list__input'
                                    data-lpignore='true'
                                    data-testid='dt_buy_ad_payment_methods_list_input'
                                    is_alignment_top={is_alignment_top}
                                    leading_icon={<Icon icon='IcAddOutline' size={14} />}
                                    list_items={payment_methods_list}
                                    list_portal_id={list_portal_id}
                                    onItemSelection={({ text, value }: { text: string; value: string }) => {
                                        setFieldValue('payment_method', value ? text : '');
                                        setTimeout(() => onClickPaymentMethodItem(value), 0);
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
            {should_show_hint && getPaymentHint()}
        </div>
    );
};

export default observer(BuyAdPaymentMethodsList);
