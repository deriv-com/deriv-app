import React from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonToggle, Modal, ThemedScrollbars } from '@deriv/components';
import Dp2pContext from 'Components/context/dp2p-context';
import { localize } from 'Components/i18next';
import BuySellForm from './buy-sell-form.jsx';
import BuySellTableContent from './buy-sell-table-content.jsx';
import FormError from '../form/error.jsx';
import NicknameForm from '../nickname/nickname-form.jsx';
import PageReturn from '../page-return/page-return.jsx';
import Verification from '../verification/verification.jsx';
import './buy-sell.scss';

const buy_sell_filters = [
    {
        text: localize('Buy'),
        value: 'buy',
    },
    {
        text: localize('Sell'),
        value: 'sell',
    },
];

const BuySell = ({ navigate }) => {
    const is_mounted = React.useRef(false);
    const submitForm = React.useRef(() => {});

    React.useEffect(() => {
        is_mounted.current = true;
        return () => (is_mounted.current = false);
    }, [is_mounted]);

    React.useEffect(() => {
        if (!should_show_popup) setErrorMessage(null);
    }, [should_show_popup]);

    const [table_type, setTableType] = React.useState('buy');
    const [selected_ad_state, setSelectedAdState] = React.useState({});
    const [should_show_popup, setShouldShowPopup] = React.useState(false);
    const [should_show_verification, setShouldShowVerification] = React.useState(false);
    const { is_advertiser, modal_root_id, nickname, setOrderId } = React.useContext(Dp2pContext);
    const [is_submit_disabled, setIsSubmitDisabled] = React.useState(true);
    const [error_message, setErrorMessage] = React.useState(null);

    const setSubmitForm = submitFormFn => (submitForm.current = submitFormFn);
    const hideVerification = () => setShouldShowVerification(false);
    const onCancelClick = () => setShouldShowPopup(false);
    const onChangeTableType = event => setTableType(event.target.value);
    const onConfirmClick = order_info => {
        setOrderId(order_info.id);
        navigate('orders', { nav: { location: 'buy_sell' } });
    };
    const setSelectedAdvert = selected_ad => {
        if (!is_advertiser) {
            setShouldShowVerification(true);
        } else {
            setSelectedAdState(selected_ad);
            setShouldShowPopup(true);
        }
    };

    // Some state is managed externally, ensure our host component is mounted
    // when those external components try to update it.
    const stateUpdateWrapper = updateFn => (...args) => {
        if (is_mounted.current) {
            updateFn(...args);
        }
    };

    if (should_show_verification) {
        return (
            <React.Fragment>
                <PageReturn onClick={hideVerification} page_title={localize('Verification')} />
                <Verification />
            </React.Fragment>
        );
    }

    const Form = nickname ? BuySellForm : NicknameForm;
    const modal_title =
        table_type === 'buy'
            ? localize('Buy {{ currency }}', { currency: selected_ad_state.offer_currency })
            : localize('Sell {{ currency }}', { currency: selected_ad_state.offer_currency });

    return (
        <div className='buy-sell'>
            <div className='buy-sell__header'>
                <ButtonToggle
                    buttons_arr={buy_sell_filters}
                    className='buy-sell__header__filters'
                    is_animated
                    name='filter'
                    onChange={onChangeTableType}
                    value={table_type}
                    has_rounded_button
                />
            </div>
            <BuySellTableContent key={table_type} is_buy={table_type === 'buy'} setSelectedAdvert={setSelectedAdvert} />
            <Modal
                className='buy-sell__popup'
                height={table_type === 'buy' ? '400px' : '649px'}
                width='456px'
                is_open={should_show_popup}
                title={modal_title}
                portalId={modal_root_id}
                toggleModal={onCancelClick}
            >
                {/* Parent height - Modal.Header height - Modal.Footer height */}
                <ThemedScrollbars height='calc(100% - 5.8rem - 7.4rem)'>
                    <Modal.Body>
                        <Form
                            advert={selected_ad_state}
                            handleClose={stateUpdateWrapper(onCancelClick)}
                            handleConfirm={onConfirmClick}
                            setIsSubmitDisabled={stateUpdateWrapper(setIsSubmitDisabled)}
                            setErrorMessage={stateUpdateWrapper(setErrorMessage)}
                            setSubmitForm={setSubmitForm}
                        />
                    </Modal.Body>
                </ThemedScrollbars>
                <Modal.Footer has_separator>
                    {error_message && <FormError message={error_message} />}
                    <Button.Group>
                        <Button secondary type='button' onClick={onCancelClick} large>
                            {localize('Cancel')}
                        </Button>
                        <Button is_disabled={is_submit_disabled} primary large onClick={submitForm.current}>
                            {localize('Confirm')}
                        </Button>
                    </Button.Group>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

BuySell.propTypes = {
    navigate: PropTypes.func,
    params: PropTypes.object,
};

export default BuySell;
