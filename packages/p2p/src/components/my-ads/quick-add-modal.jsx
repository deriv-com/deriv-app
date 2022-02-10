import * as React from 'react';
import { Formik, Field } from 'formik';
import { Autocomplete, Button, Icon, MobileFullPageModal, Modal, Text, ThemedScrollbars } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { localize, Localize } from 'Components/i18next';
import { buy_sell } from 'Constants/buy-sell';
import { useStores } from 'Stores';
import PaymentMethodCard from '../my-profile/payment-methods/payment-method-card';
import AddPaymentMethod from '../my-profile/payment-methods/add-payment-method/add-payment-method.jsx';
import PageReturn from 'Components/page-return/page-return.jsx';

const QuickAddModal = ({ advert }) => {
    const { my_ads_store, my_profile_store } = useStores();

    const type = advert ? advert.type : null;

    const [selected_methods, setSelectedMethods] = React.useState([]);

    const is_buy_advert = type === buy_sell.BUY;
    const modal_title = my_ads_store.should_show_add_payment_method ? (
        <PageReturn
            onClick={() => my_ads_store.setShouldShowAddPaymentMethod(false)}
            page_title={localize('Add payment methods')}
        />
    ) : (
        localize('Add payment methods')
    );
    const style = {
        borderColor: 'var(--brand-secondary)',
        borderWidth: '2px',
    };

    const onClickPaymentMethodItem = value => {
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

    React.useEffect(() => {
        my_ads_store.setSelectedAdId(advert.id);
        my_ads_store.setShouldShowAddPaymentMethod(!my_profile_store?.advertiser_has_payment_methods);

        return () => {
            my_ads_store.setSelectedAdId('');
            my_ads_store.payment_method_ids = [];
            my_ads_store.payment_method_names = [];
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isMobile()) {
        if (is_buy_advert) {
            return (
                <MobileFullPageModal
                    body_className='buy-sell__modal-body'
                    className='buy-sell__modal'
                    height_offset='80px'
                    is_flex
                    is_modal_open={my_ads_store.is_quick_add_modal_open}
                    page_header_className='buy-sell__modal-header'
                    page_header_text={localize('Add payment methods')}
                    pageHeaderReturnFn={() => my_ads_store.hideQuickAddModal()}
                    secondary
                    text={localize('Cancel')}
                    renderPageFooterChildren={() => (
                        <>
                            <Button
                                has_effect
                                large
                                onClick={() => my_ads_store.hideQuickAddModal()}
                                secondary
                                text={localize('Cancel')}
                            />
                            <Button
                                has_effect
                                large
                                onClick={() => my_ads_store.onClickUpdatePaymentMethods(is_buy_advert)}
                                primary
                                text={localize('Add')}
                            />
                        </>
                    )}
                    page_footer_className='buy-sell__modal-footer'
                >
                    <Localize i18n_default_text='You may choose up to 3 payment methods for this ad.' />
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
                                            onItemSelection={({ text, value }) => {
                                                setFieldValue('payment_method', value ? text : '');
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
                    <Localize
                        i18n_default_text='<0>Don’t see your payment method?</0> <1>Add new.</1>'
                        components={[
                            <Text key={0} color='less-prominent' size='xxs' />,
                            <Text
                                key={1}
                                color='loss-danger'
                                size='xxs'
                                onClick={() => my_profile_store.setSelectedPaymentMethod('other')}
                            />,
                        ]}
                    />
                </MobileFullPageModal>
            );
        }

        return (
            <MobileFullPageModal
                body_className='buy-sell__modal-body'
                className='buy-sell__modal'
                height_offset='80px'
                is_flex
                is_modal_open={my_ads_store.is_quick_add_modal_open}
                page_header_className='buy-sell__modal-header'
                page_header_text={modal_title}
                pageHeaderReturnFn={() => my_ads_store.hideQuickAddModal()}
                secondary
                text={localize('Cancel')}
                renderPageFooterChildren={() =>
                    !my_ads_store.should_show_add_payment_method && (
                        <>
                            <Button
                                has_effect
                                large
                                onClick={() => my_ads_store.hideQuickAddModal()}
                                secondary
                                text={localize('Cancel')}
                            />
                            <Button
                                has_effect
                                large
                                onClick={() => my_ads_store.onClickUpdatePaymentMethods(is_buy_advert)}
                                primary
                                text={localize('Add')}
                            />
                        </>
                    )
                }
                page_footer_className='buy-sell__modal-footer'
            >
                {my_ads_store.should_show_add_payment_method ? (
                    <AddPaymentMethod should_show_page_return={false} should_show_separated_footer={true} />
                ) : (
                    <>
                        <Localize i18n_default_text='You may choose up to 3 payment methods for this ad.' />
                        {my_profile_store.advertiser_payment_methods_list.map((payment_method, key) => (
                            <PaymentMethodCard
                                is_vertical_ellipsis_visible={false}
                                key={key}
                                small
                                onClick={() => onClickPaymentMethodCard(payment_method)}
                                payment_method={payment_method}
                                style={selected_methods.includes(payment_method.ID) ? style : {}}
                            />
                        ))}
                        <PaymentMethodCard
                            is_add={true}
                            label={localize('Payment method')}
                            small
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
                height='660px'
                is_open={my_ads_store.is_quick_add_modal_open}
                title={localize('Add payment methods')}
                toggleModal={my_ads_store.hideQuickAddModal}
            >
                <Modal.Body>
                    <Localize i18n_default_text='You may choose up to 3 payment methods for this ad.' />
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
                                            onItemSelection={({ text, value }) => {
                                                setFieldValue('payment_method', value ? text : '');
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
                    <Localize
                        i18n_default_text='<0>Don’t see your payment method?</0> <1>Add new.</1>'
                        components={[
                            <Text key={0} color='less-prominent' size='xxs' />,
                            <Text
                                key={1}
                                color='loss-danger'
                                size='xxs'
                                onClick={() => my_profile_store.setSelectedPaymentMethod('other')}
                            />,
                        ]}
                    />
                </Modal.Body>
                <Modal.Footer has_separator>
                    <Button
                        has_effect
                        large
                        onClick={() => my_ads_store.hideQuickAddModal()}
                        secondary
                        text={localize('Cancel')}
                    />

                    <Button
                        has_effect
                        large
                        onClick={() => my_ads_store.onClickUpdatePaymentMethods(is_buy_advert)}
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
            has_close_icon={false}
            height='660px'
            is_open={my_ads_store.is_quick_add_modal_open}
            title={modal_title}
        >
            {my_ads_store.should_show_add_payment_method ? (
                <Modal.Body>
                    <AddPaymentMethod should_show_page_return={false} should_show_separated_footer={true} />
                </Modal.Body>
            ) : (
                <ThemedScrollbars height='calc(100% - 5.8rem - 7.4rem)'>
                    <Modal.Body>
                        <Localize i18n_default_text='You may choose up to 3 payment methods for this ad.' />
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
                            onClickAdd={() => my_ads_store.setShouldShowAddPaymentMethod(true)}
                        />
                    </Modal.Body>
                </ThemedScrollbars>
            )}
            {!my_profile_store.selected_payment_method && (
                <Modal.Footer has_separator>
                    <Button
                        has_effect
                        large
                        onClick={my_ads_store.hideQuickAddModal}
                        secondary
                        text={localize('Cancel')}
                    />
                    {!my_ads_store.should_show_add_payment_method && (
                        <Button
                            has_effect
                            large
                            onClick={() => my_ads_store.onClickUpdatePaymentMethods(is_buy_advert)}
                            primary
                            text={localize('Add')}
                        />
                    )}
                </Modal.Footer>
            )}
        </Modal>
    );
};

export default observer(QuickAddModal);
