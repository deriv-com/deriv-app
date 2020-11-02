import React from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonToggle, Modal, ThemedScrollbars } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import { localize } from 'Components/i18next';
import BuySellForm from './buy-sell-form.jsx';
import BuySellTableContent from './buy-sell-table-content.jsx';
import NicknameForm from '../nickname/nickname-form.jsx';
import PageReturn from '../page-return/page-return.jsx';
import Verification from '../verification/verification.jsx';
import FormError from '../form/error.jsx';
import AdvertiserPage from '../advertiser-page/advertiser-page.jsx';
import { buy_sell } from '../../constants/buy-sell';
import './buy-sell.scss';

const buy_sell_filters = () => [
    {
        text: localize('Buy'),
        value: buy_sell.BUY,
    },
    {
        text: localize('Sell'),
        value: buy_sell.SELL,
    },
];

const BuySell = observer(() => {
    const { buy_sell_store, general_store } = useStores();
    const Form = general_store.nickname ? BuySellForm : NicknameForm;

    React.useEffect(() => {
        if (!buy_sell_store.should_show_popup) buy_sell_store.setErrorMessage(null);
    }, [buy_sell_store.should_show_popup]);

    if (buy_sell_store.should_show_verification) {
        return (
            <React.Fragment>
                <PageReturn onClick={buy_sell_store.hideVerification} page_title={localize('Verification')} />
                <Verification />
            </React.Fragment>
        );
    }

    if (buy_sell_store.show_advertiser_page && !buy_sell_store.should_show_verification) {
        return (
            <>
                <PageReturn onClick={buy_sell_store.hideAdvertiserPage} page_title={localize("Advertiser's page")} />
                <AdvertiserPage />
            </>
        );
    }

    return (
        <div className='buy-sell'>
            <div className='buy-sell__header'>
                <ButtonToggle
                    buttons_arr={buy_sell_filters()}
                    className='buy-sell__header__filters'
                    is_animated
                    name='filter'
                    onChange={buy_sell_store.onChangeTableType}
                    value={buy_sell_store.table_type}
                    has_rounded_button
                />
            </div>
            <BuySellTableContent
                key={buy_sell_store.table_type}
                is_buy={buy_sell_store.table_type === buy_sell.BUY}
                setSelectedAdvert={buy_sell_store.setSelectedAdvert}
                showAdvertiserPage={buy_sell_store.showAdvertiserPage}
            />
            <Modal
                className='buy-sell__popup'
                height={buy_sell_store.table_type === buy_sell.BUY ? '400px' : '649px'}
                width='456px'
                is_open={buy_sell_store.should_show_popup}
                title={buy_sell_store.modal_title}
                portalId={general_store.props.modal_root_id}
                toggleModal={buy_sell_store.onCancelClick}
            >
                {/* Parent height - Modal.Header height - Modal.Footer height */}
                <ThemedScrollbars height='calc(100% - 5.8rem - 7.4rem)'>
                    <Modal.Body>
                        <Form
                            advert={buy_sell_store.selected_ad_state}
                            handleClose={buy_sell_store.onCancelClick}
                            handleConfirm={buy_sell_store.onConfirmClick}
                            setIsSubmitDisabled={buy_sell_store.setIsSubmitDisabled}
                            setErrorMessage={buy_sell_store.setErrorMessage}
                            setSubmitForm={buy_sell_store.setSubmitFormFn}
                        />
                    </Modal.Body>
                </ThemedScrollbars>
                <Modal.Footer has_separator>
                    {buy_sell_store.error_message && <FormError message={buy_sell_store.error_message} />}
                    <Button.Group>
                        <Button secondary type='button' onClick={buy_sell_store.onCancelClick} large>
                            {localize('Cancel')}
                        </Button>
                        <Button
                            is_disabled={buy_sell_store.is_submit_disabled}
                            primary
                            large
                            onClick={buy_sell_store.submitForm}
                        >
                            {localize('Confirm')}
                        </Button>
                    </Button.Group>
                </Modal.Footer>
            </Modal>
        </div>
    );
});

BuySell.propTypes = {
    error_message: PropTypes.string,
    hideAdvertiserPage: PropTypes.func,
    hideVerification: PropTypes.func,
    is_submit_disabled: PropTypes.bool,
    navigate: PropTypes.func,
    onCancelClick: PropTypes.func,
    onChangeTableType: PropTypes.func,
    onConfirmClick: PropTypes.func,
    params: PropTypes.object,
    selected_ad_state: PropTypes.object,
    setErrorMessage: PropTypes.func,
    setIsSubmitDisabled: PropTypes.func,
    setSelectedAdvert: PropTypes.func,
    should_show_popup: PropTypes.bool,
    should_show_verification: PropTypes.bool,
    show_advertiser_page: PropTypes.bool,
    showAdvertiserPage: PropTypes.func,
    submitForm: PropTypes.func,
    table_type: PropTypes.string,
};

export default BuySell;
