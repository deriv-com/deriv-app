import classNames from 'classnames';
import * as React from 'react';
import { Button, Icon, MobileFullPageModal, Modal, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { localize, Localize } from 'Components/i18next';
import { buy_sell } from 'Constants/buy-sell';
import { useStores } from 'Stores';
import AddPaymentMethod from 'Components/my-profile/payment-methods/add-payment-method/add-payment-method.jsx';
import SellAdPaymentMethodsList from 'Components/my-ads/sell-ad-payment-methods-list.jsx';
import BuyAdPaymentMethodsList from 'Components/my-ads/buy-ad-payment-methods-list.jsx';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';

const QuickAddModal = ({ advert }) => {
    const { my_ads_store, my_profile_store } = useStores();
    const { is_modal_open, showModal } = useModalManagerContext();

    const type = advert ? advert.type : null;

    const [selected_methods, setSelectedMethods] = React.useState([]);

    const is_buy_advert = type === buy_sell.BUY;
    const is_sell_ad_add_payment_methods_selected =
        !is_buy_advert && my_profile_store.selected_payment_method.length > 0;
    const is_buy_ad_add_payment_methods_selected = is_buy_advert && selected_methods.length > 0;
    const is_payment_methods_selected =
        is_sell_ad_add_payment_methods_selected || is_buy_ad_add_payment_methods_selected;

    React.useEffect(() => {
        const saved_selected_methods = localStorage.getItem('selected_methods');
        if (saved_selected_methods) {
            setSelectedMethods(JSON.parse(saved_selected_methods));
            localStorage.removeItem('selected_methods');
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
        if (is_payment_methods_selected) {
            localStorage.setItem('selected_methods', JSON.stringify(selected_methods));
            showModal({
                key: 'CancelAddPaymentMethodModal',
                props: {
                    should_hide_all_modals_on_cancel: is_buy_advert,
                    onCancel: () => {
                        my_ads_store.payment_method_ids = [];
                        my_ads_store.payment_method_names = [];
                        localStorage.removeItem('selected_methods');
                    },
                },
            });
        } else {
            my_ads_store.payment_method_ids = [];
            my_ads_store.payment_method_names = [];
            setSelectedMethods([]);
            if (should_close_all_modals) {
                my_ads_store.setShouldShowAddPaymentMethod(false);
                my_ads_store.hideQuickAddModal();
            } else {
                if (!my_ads_store.should_show_add_payment_method) {
                    my_ads_store.hideQuickAddModal();
                }
                my_ads_store.setShouldShowAddPaymentMethod(false);
            }
        }
    };

    if (isMobile()) {
        if (is_buy_advert) {
            return (
                <MobileFullPageModal
                    body_className='quick-add-modal--body'
                    height_offset='80px'
                    is_flex
                    is_modal_open={is_modal_open}
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
                    <div className='quick-add-modal--info'>
                        <Text color='prominent' size='xxs'>
                            <Localize i18n_default_text='You may choose up to 3 payment methods for this ad.' />
                        </Text>
                    </div>
                    <BuyAdPaymentMethodsList
                        is_alignment_top={false}
                        list_portal_id='popup_root'
                        should_show_hint
                        selected_methods={selected_methods}
                        setSelectedMethods={setSelectedMethods}
                        should_clear_payment_method_selections={!is_payment_methods_selected}
                    />
                </MobileFullPageModal>
            );
        }

        return (
            <MobileFullPageModal
                body_className='quick-add-modal--body'
                height_offset='80px'
                is_flex
                is_modal_open={is_modal_open}
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
                is_open={is_modal_open}
                title={localize('Add payment method')}
                toggleModal={() => setShouldCloseAllModals(true)}
            >
                <Modal.Body>
                    <div className='quick-add-modal--info'>
                        <Text color='prominent' size='xxs'>
                            <Localize i18n_default_text='You may choose up to 3 payment methods for this ad.' />
                        </Text>
                    </div>
                    <BuyAdPaymentMethodsList
                        is_alignment_top={false}
                        list_portal_id='modal_root'
                        should_show_hint
                        selected_methods={selected_methods}
                        setSelectedMethods={setSelectedMethods}
                        should_clear_payment_method_selections={!is_payment_methods_selected}
                    />
                </Modal.Body>
                <Modal.Footer has_separator>
                    <Button
                        has_effect
                        large
                        onClick={() => setShouldCloseAllModals(true)}
                        secondary
                        text={localize('Cancel')}
                    />

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
            is_open={is_modal_open}
            title={
                <React.Fragment>
                    {my_ads_store.should_show_add_payment_method && (
                        <Icon
                            className='p2p-my-ads__modal-icon'
                            icon='icArrowLeftBold'
                            onClick={() => {
                                setShouldCloseAllModals(false);
                            }}
                        />
                    )}
                    {my_ads_store.should_show_add_payment_method
                        ? localize('Add payment method')
                        : localize('Add payment methods')}
                </React.Fragment>
            }
            width='440px'
            toggleModal={() => setShouldCloseAllModals(true)}
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
