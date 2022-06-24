import classNames from 'classnames';
import * as React from 'react';
import { Button, Icon, MobileFullPageModal, Modal, Text, ThemedScrollbars } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { localize, Localize } from 'Components/i18next';
import { buy_sell } from 'Constants/buy-sell';
import { useStores } from 'Stores';
import PaymentMethodCard from '../my-profile/payment-methods/payment-method-card';
import AddPaymentMethod from '../my-profile/payment-methods/add-payment-method/add-payment-method.jsx';
import './quick-add-modal.scss';
import BuyAdPaymentMethodsList from './buy-ad-payment-methods-list';

const QuickAddModal = ({ advert }) => {
    const { my_ads_store, my_profile_store } = useStores();

    const type = advert ? advert.type : null;

    const [selected_methods, setSelectedMethods] = React.useState([]);

    const is_buy_advert = type === buy_sell.BUY;

    const style = {
        borderColor: 'var(--brand-secondary)',
        borderWidth: '2px',
    };

    const formik_ref = React.useRef();

    const onCancel = () => {
        if ((formik_ref.current && formik_ref.current.dirty) || my_profile_store.selected_payment_method.length > 0) {
            my_profile_store.setIsCancelAddPaymentMethodModalOpen(true);
        } else {
            my_ads_store.payment_method_ids = [];
            my_ads_store.payment_method_names = [];
            setSelectedMethods([]);
            my_ads_store.hideQuickAddModal();
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
        setSelectedMethods([]);
        my_ads_store.setShouldShowAddPaymentMethod(!my_profile_store?.advertiser_has_payment_methods);

        return () => {
            my_ads_store.payment_method_ids = [];
            my_ads_store.payment_method_names = [];
            setSelectedMethods([]);
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
                    pageHeaderReturnFn={() => {
                        setSelectedMethods([]);
                        my_ads_store.hideQuickAddModal();
                    }}
                    secondary
                    text={localize('Cancel')}
                    renderPageFooterChildren={() => (
                        <>
                            <Button
                                has_effect
                                large
                                onClick={() => {
                                    setSelectedMethods([]);
                                    my_ads_store.payment_method_ids = [];
                                    my_ads_store.payment_method_names = [];
                                    my_ads_store.hideQuickAddModal();
                                }}
                                secondary
                                text={localize('Cancel')}
                            />
                            <Button
                                className='quick-add-modal--button'
                                has_effect
                                large
                                onClick={() => my_ads_store.onClickUpdatePaymentMethods(advert?.id, is_buy_advert)}
                                primary
                                text={localize('Add')}
                            />
                        </>
                    )}
                >
                    <div className='quick-add-modal--info'>
                        <Text color='prominent' size='xs'>
                            <Localize i18n_default_text='You may choose up to 3 payment methods for this ad.' />
                        </Text>
                    </div>
                    <BuyAdPaymentMethodsList
                        should_show_hint
                        selected_methods={selected_methods}
                        setSelectedMethods={setSelectedMethods}
                    />
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
                pageHeaderReturnFn={() => {
                    setSelectedMethods([]);
                    my_ads_store.hideQuickAddModal();
                }}
                secondary
                text={localize('Cancel')}
                renderPageFooterChildren={() =>
                    !my_ads_store.should_show_add_payment_method && (
                        <>
                            <Button
                                has_effect
                                large
                                onClick={() => {
                                    setSelectedMethods([]);
                                    my_ads_store.hideQuickAddModal();
                                }}
                                secondary
                                text={localize('Cancel')}
                            />
                            <Button
                                className='quick-add-modal--button'
                                has_effect
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
                    <AddPaymentMethod
                        formik_ref={formik_ref}
                        should_show_page_return={false}
                        should_show_separated_footer={true}
                    />
                ) : (
                    <>
                        <Text color='prominent' size='xxs'>
                            <Localize i18n_default_text='You may choose up to 3 payment methods for this ad.' />
                        </Text>
                        {my_profile_store.advertiser_payment_methods_list.map((payment_method, key) => (
                            <div key={key}>
                                <PaymentMethodCard
                                    is_vertical_ellipsis_visible={false}
                                    key={key}
                                    small
                                    onClick={() => onClickPaymentMethodCard(payment_method)}
                                    payment_method={payment_method}
                                    style={selected_methods.includes(payment_method.ID) ? style : {}}
                                />
                            </div>
                        ))}
                        <PaymentMethodCard
                            is_add
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
                height='452px'
                is_open={my_ads_store.is_quick_add_modal_open}
                title={localize('Add payment methods')}
                toggleModal={e => {
                    // checks if the user is clicking on a dropdown item not clicking outside the modal
                    // TODO: Check with setShouldCloseAllModals() later
                    if (!e.target || e.target.className !== 'dc-dropdown-list__item') onCancel();
                }}
            >
                <Modal.Body>
                    <div className='quick-add-modal--info'>
                        <Text color='prominent' size='xs'>
                            <Localize i18n_default_text='You may choose up to 3 payment methods for this ad.' />
                        </Text>
                    </div>
                    <BuyAdPaymentMethodsList
                        selected_methods={selected_methods}
                        setSelectedMethods={setSelectedMethods}
                        should_show_hint
                    />
                </Modal.Body>
                <Modal.Footer has_separator>
                    {/* TODO: Check with setShouldCloseAllModals() */}
                    <Button has_effect large onClick={onCancel} secondary text={localize('Cancel')} />

                    <Button
                        has_effect
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
            has_close_icon={false}
            height='660px'
            is_open={my_ads_store.is_quick_add_modal_open}
            title={
                <React.Fragment>
                    <Icon
                        className='p2p-my-ads__modal-icon'
                        icon='icArrowLeftBold'
                        onClick={() => {
                            // TODO: Refactor and compare with setShouldCloseAllModals() later
                            if (
                                my_profile_store.selected_payment_method.length > 0 ||
                                (formik_ref.current && formik_ref.current.dirty)
                            ) {
                                my_profile_store.setIsCancelAddPaymentMethodModalOpen(true);
                            } else {
                                // compulsory to set payment_method_ids and payment_method_names to [] to avoid bug when:
                                // +Add -> Select any PM -> Click Cancel -> +Add -> Try to Add Pm
                                my_ads_store.payment_method_ids = [];
                                my_ads_store.payment_method_names = [];
                                onCancel();
                            }
                        }}
                    />
                    {localize('Add payment method')}
                </React.Fragment>
            }
        >
            {my_ads_store.should_show_add_payment_method ? (
                <Modal.Body
                    className={classNames({
                        'p2p-my-ads__modal-body--scroll': my_profile_store.selected_payment_method,
                    })}
                >
                    <AddPaymentMethod
                        formik_ref={formik_ref}
                        should_show_page_return={false}
                        should_show_separated_footer
                    />
                </Modal.Body>
            ) : (
                <ThemedScrollbars height='calc(100% - 5.8rem - 7.4rem)'>
                    <Modal.Body>
                        <Text color='prominent' size='xxxs'>
                            <Localize i18n_default_text='You may choose up to 3 payment methods for this ad.' />
                        </Text>
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
                            is_add
                            label={localize('Payment method')}
                            medium
                            onClickAdd={() => my_ads_store.setShouldShowAddPaymentMethod(true)}
                        />
                    </Modal.Body>
                </ThemedScrollbars>
            )}
            {!my_ads_store.should_show_add_payment_method && (
                <Modal.Footer has_separator>
                    <Button
                        has_effect
                        large
                        onClick={() => {
                            setSelectedMethods([]);
                            my_ads_store.hideQuickAddModal();
                        }}
                        secondary
                        text={localize('Cancel')}
                    />

                    <Button
                        has_effect
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
                        onClick={() => {
                            setSelectedMethods([]);
                            my_ads_store.hideQuickAddModal();
                        }}
                        secondary
                        text={localize('Cancel')}
                    />
                </Modal.Footer>
            )}
        </Modal>
    );
};

export default observer(QuickAddModal);
