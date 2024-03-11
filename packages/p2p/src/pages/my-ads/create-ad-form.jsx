import * as React from 'react';
import { Formik, Form } from 'formik';
import { Button, Checkbox, Div100vhContainer, Modal, Text, ThemedScrollbars } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { reaction } from 'mobx';
import { Localize, localize } from 'Components/i18next';
import { buy_sell } from 'Constants/buy-sell';
import { ad_type } from 'Constants/floating-rate';
import { useStores } from 'Stores';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { api_error_codes } from 'Constants/api-error-codes';
import AdWizard from './ad-wizard';
import './create-ad-form.scss';

const CreateAdFormWrapper = ({ children }) => {
    if (isMobile()) {
        return <Div100vhContainer height_offset='auto'>{children}</Div100vhContainer>;
    }
    return children;
};

const CreateAdForm = () => {
    const { buy_sell_store, floating_rate_store, general_store, my_ads_store, my_profile_store } = useStores();
    const should_not_show_auto_archive_message_again = React.useRef(false);
    const { useRegisterModalProps } = useModalManagerContext();
    const steps = [
        { header: { title: 'Set ad type and amount' } },
        { header: { title: 'Set payment details' } },
        { header: { title: 'Set ad conditions' } },
    ];

    const onCheckboxChange = () =>
        (should_not_show_auto_archive_message_again.current = !should_not_show_auto_archive_message_again.current);

    const onClickOkCreatedAd = () => {
        localStorage.setItem(
            'should_not_show_auto_archive_message',
            JSON.stringify(should_not_show_auto_archive_message_again.current)
        );
        my_ads_store.setIsAdCreatedModalVisible(false);
        if (my_ads_store.advert_details?.visibility_status?.includes(api_error_codes.AD_EXCEEDS_BALANCE)) {
            general_store.showModal({
                key: 'AdVisibilityErrorModal',
                props: { error_code: api_error_codes.AD_EXCEEDS_BALANCE },
            });
        } else if (my_ads_store.advert_details?.visibility_status?.includes(api_error_codes.AD_EXCEEDS_DAILY_LIMIT)) {
            general_store.showModal({
                key: 'AdVisibilityErrorModal',
                props: { error_code: api_error_codes.AD_EXCEEDS_DAILY_LIMIT },
            });
        }

        my_ads_store.setShowAdForm(false);
    };

    // when adding payment methods in creating an ad, once user declines to save their payment method, flow is to close all add payment method modals
    useRegisterModalProps({
        key: 'CancelAddPaymentMethodModal',
        props: {
            should_hide_all_modals_on_cancel: true,
        },
    });

    const onCleanup = () => {
        my_ads_store.setApiErrorMessage('');
        floating_rate_store.setApiErrorMessage('');
        my_ads_store.setShowAdForm(false);
        buy_sell_store.setCreateSellAdFromNoAds(false);
        my_ads_store.payment_method_ids = [];
        my_ads_store.payment_method_names = [];
    };

    React.useEffect(() => {
        my_ads_store.setCurrentMethod({ key: null, is_deleted: false });
        my_profile_store.getPaymentMethodsList();
        my_profile_store.getAdvertiserPaymentMethods();
        const disposeApiErrorReaction = reaction(
            () => my_ads_store.api_error_message,
            () => {
                if (my_ads_store.api_error_message) general_store.showModal({ key: 'AdCreateEditErrorModal' });
            }
        );
        // P2P configuration is not subscribable. Hence need to fetch it on demand
        general_store.setP2PConfig();

        return () => {
            disposeApiErrorReaction();
            onCleanup();
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        const ad_website_status = setInterval(() => {
            if (my_ads_store.is_ad_created_modal_visible) {
                my_ads_store.getWebsiteStatus();
            }
        }, 10000);

        return () => {
            clearInterval(ad_website_status);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [my_ads_store.is_ad_created_modal_visible]);

    return (
        <React.Fragment>
            <Formik
                initialValues={{
                    contact_info: general_store.contact_info,
                    default_advert_description: general_store.default_advert_description,
                    max_transaction: '',
                    min_transaction: '',
                    offer_amount: '',
                    order_completion_time: general_store.order_payment_period,
                    payment_info: my_ads_store.payment_info,
                    rate_type: floating_rate_store.rate_type === ad_type.FLOAT ? '-0.01' : '',
                    type: buy_sell_store.create_sell_ad_from_no_ads ? buy_sell.SELL : buy_sell.BUY,
                }}
                onSubmit={my_ads_store.handleSubmit}
                validate={my_ads_store.validateCreateAdForm}
            >
                {() => {
                    return (
                        <div className='create-ad-form' data-testid='dp2p-create-ad-form_container'>
                            <Form noValidate>
                                <ThemedScrollbars
                                    className='create-ad-form__scrollbar'
                                    is_scrollbar_hidden={isMobile()}
                                >
                                    <CreateAdFormWrapper>
                                        <AdWizard steps={steps} />
                                    </CreateAdFormWrapper>
                                </ThemedScrollbars>
                            </Form>
                        </div>
                    );
                }}
            </Formik>
            <Modal
                className='my-ads__ad-created'
                has_close_icon={false}
                is_open={my_ads_store.is_ad_created_modal_visible}
                small
                title={localize("You've created an ad")}
            >
                <Modal.Body>
                    <Text as='p' size='xs' color='prominent'>
                        <Localize
                            i18n_default_text="If the ad doesn't receive an order for {{adverts_archive_period}} days, it will be deactivated."
                            values={{ adverts_archive_period: my_ads_store.adverts_archive_period }}
                        />
                    </Text>
                    <br />
                    <Checkbox
                        label={localize('Don’t show this message again.')}
                        onChange={onCheckboxChange}
                        value={should_not_show_auto_archive_message_again.current}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button has_effect text={localize('Ok')} onClick={onClickOkCreatedAd} primary large />
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default observer(CreateAdForm);
