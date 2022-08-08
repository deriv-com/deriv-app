import classNames from 'classnames';
import * as React from 'react';
import { Formik, Field } from 'formik';
import { Autocomplete, Button, Icon, Input, MobileFullPageModal, Modal, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { localize, Localize } from 'Components/i18next';
import { buy_sell } from 'Constants/buy-sell';
import { useStores } from 'Stores';
import AddPaymentMethod from '../my-profile/payment-methods/add-payment-method/add-payment-method.jsx';
import SellAdPaymentMethodsList from './sell-ad-payment-methods-list.jsx';
import './quick-add-modal.scss';

const QuickAddModal = ({ advert }) => {
    const { my_ads_store, my_profile_store } = useStores();

    const type = advert ? advert.type : null;

    const [selected_methods, setSelectedMethods] = React.useState([]);

    const is_buy_advert = type === buy_sell.BUY;

    const formik_ref = React.useRef();

    const onClickDeletePaymentMethodItem = value => {
        if (value) {
            my_ads_store.payment_method_names = my_ads_store.payment_method_names.filter(
                payment_method_id => payment_method_id !== value
            );
            setSelectedMethods(selected_methods.filter(i => i !== value));
        }
    };

    const onClickPaymentMethodItem = value => {
        if (value) {
            if (!my_ads_store.payment_method_names.includes(value)) {
                if (my_ads_store.payment_method_names.length < 3) {
                    my_ads_store.payment_method_names.push(value);
                    setSelectedMethods([...selected_methods, value]);
                }
            } else {
                my_ads_store.payment_method_names = my_ads_store.payment_method_names.filter(
                    payment_method_id => payment_method_id !== value
                );
                setSelectedMethods(selected_methods.filter(i => i !== value));
            }
        }
    };

    const onClickPaymentMethodCard = payment_method => {
        if (!my_ads_store.payment_method_ids.includes(payment_method.ID)) {
            if (my_ads_store.payment_method_ids.length < 3) {
                my_ads_store.payment_method_ids.push(payment_method.ID);
                setSelectedMethods([...selected_methods, payment_method.ID]);
            }
        } else {
            my_ads_store.payment_method_ids = my_ads_store.payment_method_ids.filter(
                payment_method_id => payment_method_id !== payment_method.ID
            );
            setSelectedMethods(selected_methods.filter(i => i !== payment_method.ID));
        }
    };

    const setShouldCloseAllModals = should_close_all_modals => {
        setSelectedMethods([]);
        if (!should_close_all_modals) {
            if (my_ads_store.should_show_add_payment_method) {
                my_ads_store.setShouldShowAddPaymentMethod(false);
            } else {
                my_ads_store.hideQuickAddModal();
            }
        } else {
            my_ads_store.setShouldShowAddPaymentMethod(false);
            my_ads_store.hideQuickAddModal();
        }
    };

    React.useEffect(() => {
        setSelectedMethods([]);
        my_ads_store.setShouldShowAddPaymentMethod(false);

        return () => {
            my_ads_store.payment_method_ids = [];
            my_ads_store.payment_method_names = [];
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isMobile()) {
        if (is_buy_advert) {
            return (
                <MobileFullPageModal
                    body_className='quick-add-modal--body'
                    height_offset='80px'
                    is_flex
                    is_modal_open={my_ads_store.is_quick_add_modal_open}
                    page_header_text={localize('Add payment method')}
                    pageHeaderReturnFn={() => setShouldCloseAllModals(false)}
                    secondary
                    text={localize('Cancel')}
                    renderPageFooterChildren={() => (
                        <>
                            <Button
                                has_effect
                                large
                                onClick={setShouldCloseAllModals}
                                secondary
                                text={localize('Cancel')}
                            />
                            <Button
                                className='quick-add-modal--button'
                                has_effect
                                is_disabled={
                                    selected_methods.length === 0 || my_ads_store.payment_method_names.length === 0
                                }
                                large
                                onClick={() => my_ads_store.onClickUpdatePaymentMethods(advert?.id, is_buy_advert)}
                                primary
                                text={localize('Add')}
                            />
                        </>
                    )}
                >
                    <div className='p2p-my-ads__info'>
                        <Text color='prominent' size='xxs'>
                            <Localize i18n_default_text='You may choose up to 3 payment methods for this ad.' />
                        </Text>
                    </div>
                    {selected_methods.length > 0 ? (
                        <React.Fragment>
                            {selected_methods.map((payment_method, key) => {
                                const method = my_profile_store.getPaymentMethodDisplayName(payment_method);
                                const payment_method_icon = method.replace(' ', '');

                                return (
                                    <Formik key={key} enableReinitialize initialValues={{}}>
                                        <Field name='payment_method'>
                                            {({ field }) => (
                                                <Input
                                                    {...field}
                                                    className='quick-add-modal--input'
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
                                                    trailing_icon={
                                                        <Icon
                                                            icon='IcDelete'
                                                            onClick={() => {
                                                                onClickDeletePaymentMethodItem(payment_method);
                                                            }}
                                                        />
                                                    }
                                                    type='text'
                                                    value={method}
                                                />
                                            )}
                                        </Field>
                                    </Formik>
                                );
                            })}
                            {selected_methods.length < 3 && (
                                <Formik enableReinitialize initialValues={{ payment_method: '' }}>
                                    {() => (
                                        <Field name='payment_method'>
                                            {({ field }) => (
                                                <div className='p2p-my-ads--border'>
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
                                                        onItemSelection={({ value }) => {
                                                            onClickPaymentMethodItem(value);
                                                        }}
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
                        </React.Fragment>
                    ) : (
                        <Formik enableReinitialize initialValues={{ payment_method: '' }}>
                            {() => (
                                <Field name='payment_method'>
                                    {({ field }) => (
                                        <div className='p2p-my-ads--border'>
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
                                                onItemSelection={({ value }) => {
                                                    onClickPaymentMethodItem(value);
                                                }}
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
                    {selected_methods.length < 3 && (
                        <div className='quick-add-modal--message'>
                            <Localize
                                i18n_default_text='<0>Don’t see your payment method?</0> <1>Add new.</1>'
                                components={[
                                    <Text key={0} color='less-prominent' size='xxs' />,
                                    <Text
                                        key={1}
                                        className='link'
                                        size='xxs'
                                        onClick={() => onClickPaymentMethodItem('other')}
                                    />,
                                ]}
                            />
                        </div>
                    )}
                </MobileFullPageModal>
            );
        }

        return (
            <MobileFullPageModal
                body_className='quick-add-modal--body'
                height_offset='80px'
                is_flex
                is_modal_open={my_ads_store.is_quick_add_modal_open}
                page_header_text={localize('Add payment method')}
                pageHeaderReturnFn={() => setShouldCloseAllModals(false)}
                secondary
                text={localize('Cancel')}
                renderPageFooterChildren={() =>
                    !my_ads_store.should_show_add_payment_method && (
                        <>
                            <Button
                                has_effect
                                large
                                onClick={setShouldCloseAllModals}
                                secondary
                                text={localize('Cancel')}
                            />
                            <Button
                                className='quick-add-modal--button'
                                has_effect
                                is_disabled={
                                    selected_methods.length === 0 || my_ads_store.payment_method_ids.length === 0
                                }
                                large
                                onClick={() => my_ads_store.onClickUpdatePaymentMethods(advert?.id, is_buy_advert)}
                                primary
                                text={localize('Add')}
                            />
                        </>
                    )
                }
            >
                {my_ads_store.should_show_add_payment_method ? (
                    <AddPaymentMethod should_show_page_return={false} should_show_separated_footer={true} />
                ) : (
                    <>
                        <Text color='prominent' size='xxs'>
                            <Localize i18n_default_text='You may choose up to 3 payment methods for this ad.' />
                        </Text>
                        <SellAdPaymentMethodsList
                            onClickPaymentMethodCard={onClickPaymentMethodCard}
                            selected_methods={selected_methods}
                            onClickAdd={() => my_ads_store.setShouldShowAddPaymentMethod(true)}
                        />
                    </>
                )}
            </MobileFullPageModal>
        );
    }

    if (is_buy_advert) {
        return (
            <Modal
                className='p2p-my-ads__modal-error'
                has_close_icon
                height='452px'
                is_open={my_ads_store.is_quick_add_modal_open}
                title={localize('Add payment method')}
                toggleModal={e => {
                    if (!e.target || e.target.className !== 'dc-dropdown-list__item') setShouldCloseAllModals(true);
                }}
            >
                <Modal.Body>
                    <div className='p2p-my-ads__info'>
                        <Text color='prominent' size='xxs'>
                            <Localize i18n_default_text='You may choose up to 3 payment methods for this ad.' />
                        </Text>
                    </div>
                    {selected_methods.length > 0 ? (
                        <React.Fragment>
                            {selected_methods.map((payment_method, key) => {
                                const method = my_profile_store.getPaymentMethodDisplayName(payment_method);
                                const payment_method_icon = method.replace(' ', '');

                                return (
                                    <Formik innerRef={formik_ref} key={key} enableReinitialize initialValues={{}}>
                                        <Field name='payment_method'>
                                            {({ field }) => (
                                                <Input
                                                    {...field}
                                                    className='quick-add-modal--input'
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
                                                    trailing_icon={
                                                        <Icon
                                                            icon='IcDelete'
                                                            onClick={() => {
                                                                onClickDeletePaymentMethodItem(payment_method);
                                                            }}
                                                        />
                                                    }
                                                    type='text'
                                                    value={method}
                                                />
                                            )}
                                        </Field>
                                    </Formik>
                                );
                            })}
                            {selected_methods.length < 3 && (
                                <Formik enableReinitialize initialValues={{ payment_method: '' }}>
                                    {() => (
                                        <Field name='payment_method'>
                                            {({ field }) => (
                                                <div className='p2p-my-ads--border'>
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
                                                        onItemSelection={({ value }) => {
                                                            onClickPaymentMethodItem(value);
                                                        }}
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
                        </React.Fragment>
                    ) : (
                        <Formik enableReinitialize innerRef={formik_ref} initialValues={{ payment_method: '' }}>
                            {() => (
                                <Field name='payment_method'>
                                    {({ field }) => (
                                        <div className='p2p-my-ads--border'>
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
                                                onItemSelection={({ value }) => {
                                                    onClickPaymentMethodItem(value);
                                                }}
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
                    {selected_methods.length < 3 && (
                        <div className='quick-add-modal--message'>
                            <Localize
                                i18n_default_text='<0>Don’t see your payment method?</0> <1>Add new.</1>'
                                components={[
                                    <Text key={0} color='less-prominent' size='xxs' />,
                                    <Text
                                        key={1}
                                        className='link'
                                        size='xxs'
                                        onClick={() => onClickPaymentMethodItem('other')}
                                    />,
                                ]}
                            />
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer has_separator>
                    <Button has_effect large onClick={setShouldCloseAllModals} secondary text={localize('Cancel')} />

                    <Button
                        has_effect
                        is_disabled={selected_methods.length === 0 || my_ads_store.payment_method_names.length === 0}
                        large
                        onClick={() => my_ads_store.onClickUpdatePaymentMethods(advert?.id, is_buy_advert)}
                        primary
                        text={localize('Add')}
                    />
                </Modal.Footer>
            </Modal>
        );
    }

    return (
        <Modal
            className='p2p-my-ads__modal-error'
            has_close_icon
            height={my_ads_store.should_show_add_payment_method ? '660px' : 'auto'}
            is_open={my_ads_store.is_quick_add_modal_open}
            title={localize('Add payment method')}
            width='440px'
            toggleModal={e => {
                if (!e.target || e.target.className !== 'dc-dropdown-list__item') setShouldCloseAllModals(true);
            }}
        >
            {my_ads_store.should_show_add_payment_method ? (
                <Modal.Body
                    className={classNames({
                        'p2p-my-ads__modal-body--scroll': my_profile_store.selected_payment_method,
                    })}
                >
                    <AddPaymentMethod should_show_page_return={false} should_show_separated_footer={true} />
                </Modal.Body>
            ) : (
                <Modal.Body className='p2p-my-ads__modal-body--horizontal'>
                    <Text color='prominent' size='xs'>
                        <Localize i18n_default_text='You may choose up to 3 payment methods for this ad.' />
                    </Text>
                    <SellAdPaymentMethodsList
                        is_only_horizontal
                        is_scrollable
                        onClickPaymentMethodCard={onClickPaymentMethodCard}
                        selected_methods={selected_methods}
                        onClickAdd={() => my_ads_store.setShouldShowAddPaymentMethod(true)}
                    />
                </Modal.Body>
            )}
            {!my_ads_store.should_show_add_payment_method && (
                <Modal.Footer has_separator>
                    <Button has_effect large onClick={setShouldCloseAllModals} secondary text={localize('Cancel')} />

                    <Button
                        has_effect
                        is_disabled={selected_methods.length === 0 || my_ads_store.payment_method_ids.length === 0}
                        large
                        onClick={() => my_ads_store.onClickUpdatePaymentMethods(advert?.id, is_buy_advert)}
                        primary
                        text={localize('Add')}
                    />
                </Modal.Footer>
            )}
            {!my_profile_store.selected_payment_method && my_ads_store.should_show_add_payment_method && (
                <Modal.Footer>
                    <Button
                        has_effect
                        large
                        onClick={() => setShouldCloseAllModals(false)}
                        secondary
                        text={localize('Cancel')}
                    />
                </Modal.Footer>
            )}
        </Modal>
    );
};

export default observer(QuickAddModal);
