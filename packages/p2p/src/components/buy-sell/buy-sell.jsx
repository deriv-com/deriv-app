import React from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonToggle, Modal, ThemedScrollbars } from '@deriv/components';
import { useIsMounted } from '@deriv/shared';
import Dp2pContext from 'Components/context/dp2p-context';
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

const BuySell = ({ navigate }) => {
    const { is_advertiser, modal_root_id, nickname, setOrderId } = React.useContext(Dp2pContext);

    const submitForm = React.useRef(() => {});
    const [error_message, setErrorMessage] = React.useState(null);
    const [is_submit_disabled, setIsSubmitDisabled] = React.useState(true);
    const [selected_ad_state, setSelectedAdState] = React.useState({});
    const [should_show_popup, setShouldShowPopup] = React.useState(false);
    const [should_show_verification, setShouldShowVerification] = React.useState(false);
    const [show_advertiser_page, setShowAdvertiserPage] = React.useState(false);
    const [table_type, setTableType] = React.useState(buy_sell.BUY);
    const isMounted = useIsMounted();

    React.useEffect(() => {
        if (isMounted()) {
            if (!should_show_popup) setErrorMessage(null);
        }
    }, [should_show_popup]);

    const hideAdvertiserPage = () => setShowAdvertiserPage(false);
    const hideVerification = () => setShouldShowVerification(false);

    const onCancelClick = () => setShouldShowPopup(false);
    const onChangeTableType = event => setTableType(event.target.value);
    const onConfirmClick = order_info => {
        setOrderId(order_info.id);
        navigate('orders', { nav: { location: 'buy_sell' } });
    };

    const setSelectedAdvert = selected_advert => {
        if (!is_advertiser) {
            setShouldShowVerification(true);
        } else {
            setSelectedAdState(selected_advert);
            setShouldShowPopup(true);
        }
    };

    const setSubmitForm = submitFormFn => (submitForm.current = submitFormFn);

    const showAdvertiserPage = selected_advert => {
        setSelectedAdState(selected_advert);
        setShowAdvertiserPage(true);
    };

    const showVerification = () => setShouldShowVerification(true);

    // Some state is managed externally, ensure our host component is mounted
    // when those external components try to update it.
    const stateUpdateWrapper = updateFn => (...args) => {
        if (isMounted()) {
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

    if (show_advertiser_page && !should_show_verification) {
        return (
            <>
                <PageReturn onClick={hideAdvertiserPage} page_title={localize("Advertiser's page")} />
                <AdvertiserPage
                    navigate={navigate}
                    selected_advert={selected_ad_state}
                    showVerification={showVerification}
                />
            </>
        );
    }

    const Form = nickname ? BuySellForm : NicknameForm;
    const modal_title =
        table_type === buy_sell.BUY
            ? localize('Buy {{ currency }}', { currency: selected_ad_state.account_currency })
            : localize('Sell {{ currency }}', { currency: selected_ad_state.account_currency });

    return (
        <div className='buy-sell'>
            <div className='buy-sell__header'>
                <ButtonToggle
                    buttons_arr={buy_sell_filters()}
                    className='buy-sell__header__filters'
                    is_animated
                    name='filter'
                    onChange={onChangeTableType}
                    value={table_type}
                    has_rounded_button
                />
            </div>
            <BuySellTableContent
                key={table_type}
                is_buy={table_type === buy_sell.BUY}
                setSelectedAdvert={setSelectedAdvert}
                showAdvertiserPage={showAdvertiserPage}
            />
            <Modal
                className='buy-sell__popup'
                height={table_type === buy_sell.BUY ? '400px' : '649px'}
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
