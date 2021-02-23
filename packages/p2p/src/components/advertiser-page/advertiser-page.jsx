import React from 'react';
import { Button, Icon, Loading, Modal, Text, ThemedScrollbars } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { reaction } from 'mobx';
import { observer } from 'mobx-react-lite';
import PropTypes from 'prop-types';
import { buy_sell } from 'Constants/buy-sell';
import BuySellForm from 'Components/buy-sell/buy-sell-form.jsx';
import FormError from 'Components/form/error.jsx';
import { localize } from 'Components/i18next';
import NicknameForm from 'Components/nickname/nickname-form.jsx';
import UserAvatar from 'Components/user/user-avatar/user-avatar.jsx';
import { useStores } from 'Stores';
import AdvertiserPageStats from './advertiser-page-stats.jsx';
import AdvertiserPageAdverts from './advertiser-page-adverts.jsx';
import './advertiser-page.scss';

const AdvertiserPage = () => {
    const { advertiser_page_store, general_store } = useStores();

    const { basic_verification, first_name, full_verification, last_name } = advertiser_page_store.advertiser_info;

    React.useEffect(() => {
        advertiser_page_store.onMount();

        return reaction(
            () => advertiser_page_store.active_index,
            () => advertiser_page_store.onTabChange(),
            { fireImmediately: true }
        );

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const Form = general_store.nickname ? BuySellForm : NicknameForm;

    if (advertiser_page_store.is_loading) {
        return <Loading is_fullscreen={false} />;
    }

    if (advertiser_page_store.error_message) {
        return <div className='advertiser-page__error'>{advertiser_page_store.error_message}</div>;
    }

    return (
        <div className='advertiser-page'>
            {advertiser_page_store.show_ad_popup && (
                <Modal
                    className='buy-sell__modal'
                    height={advertiser_page_store.counterparty_type === buy_sell.BUY ? '400px' : '649px'}
                    width='456px'
                    is_open={advertiser_page_store.show_ad_popup}
                    title={advertiser_page_store.modal_title}
                    toggleModal={advertiser_page_store.onCancelClick}
                >
                    {/* Parent height - Modal.Header height - Modal.Footer height */}
                    <ThemedScrollbars height='calc(100% - 5.8rem - 7.4rem)'>
                        <Modal.Body>
                            <Form
                                advert={advertiser_page_store.advert}
                                handleClose={advertiser_page_store.onCancelClick}
                                handleConfirm={advertiser_page_store.onConfirmClick}
                                setIsSubmitDisabled={advertiser_page_store.setIsSubmitDisabled}
                                setErrorMessage={advertiser_page_store.setFormErrorMessage}
                                setSubmitForm={advertiser_page_store.setSubmitForm}
                            />
                        </Modal.Body>
                    </ThemedScrollbars>
                    <Modal.Footer has_separator>
                        <FormError message={advertiser_page_store.form_error_message} />
                        <Button.Group>
                            <Button secondary type='button' onClick={advertiser_page_store.onCancelClick} large>
                                {localize('Cancel')}
                            </Button>
                            <Button
                                is_disabled={advertiser_page_store.is_submit_disabled}
                                primary
                                large
                                onClick={advertiser_page_store.submitForm}
                            >
                                {localize('Confirm')}
                            </Button>
                        </Button.Group>
                    </Modal.Footer>
                </Modal>
            )}
            <div className='advertiser-page__header'>
                <div className='advertiser-page__header-details'>
                    <UserAvatar nickname={advertiser_page_store.advertiser_details_name} size={32} text_size='xxs' />
                    <div className='advertiser-page__header-name'>
                        <Text color='prominent' line-height='m' size='s' weight='bold'>
                            {advertiser_page_store.advertiser_details_name}
                        </Text>
                        {first_name && last_name && (
                            <div className='advertiser-page__header-real-name'>
                                <Text color='less-prominent' line_height='xs' size='xs'>
                                    {`${first_name} ${last_name}`}
                                </Text>
                            </div>
                        )}
                    </div>
                </div>
                <div className='advertiser-page__header-verification'>
                    {basic_verification ? (
                        <div>
                            <Text color='less-prominent' size={isMobile() ? 'xxs' : 'xs'} line_height='m'>
                                {localize('ID verified')}{' '}
                            </Text>
                            <Icon
                                className='advertiser-page__header-verification-icon'
                                icon='IcCashierVerificationBadge'
                                size={isMobile() ? 12 : 16}
                            />
                        </div>
                    ) : null}
                    {full_verification ? (
                        <div className='advertiser-page__header-verification-status'>
                            <Text color='less-prominent' size={isMobile() ? 'xxs' : 'xs'} line_height='m'>
                                {localize('Address verified')}{' '}
                            </Text>
                            <Icon
                                className='advertiser-page__header-verification-icon'
                                icon='IcCashierVerificationBadge'
                                size={isMobile() ? 12 : 16}
                            />
                        </div>
                    ) : null}
                </div>
            </div>
            <AdvertiserPageStats />
            <AdvertiserPageAdverts />
        </div>
    );
};

AdvertiserPage.propTypes = {
    active_index: PropTypes.number,
    advert: PropTypes.object,
    advertiser_info: PropTypes.object,
    adverts: PropTypes.array,
    api_error_message: PropTypes.string,
    counterparty_type: PropTypes.string,
    error_message: PropTypes.string,
    form_error_message: PropTypes.string,
    handleTabItemClick: PropTypes.func,
    height_values: PropTypes.array,
    is_loading: PropTypes.bool,
    is_submit_disabled: PropTypes.bool,
    item_height: PropTypes.number,
    modal_title: PropTypes.string,
    onCancelClick: PropTypes.func,
    onConfirmClick: PropTypes.func,
    onMount: PropTypes.func,
    onTabChange: PropTypes.func,
    setFormErrorMessage: PropTypes.func,
    setIsSubmitDisabled: PropTypes.func,
    setSubmitForm: PropTypes.func,
    show_ad_popup: PropTypes.bool,
    showAdPopup: PropTypes.func,
    submitForm: PropTypes.func,
};

export default observer(AdvertiserPage);
