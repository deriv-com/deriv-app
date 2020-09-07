import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, ButtonToggle } from '@deriv/components';
import Dp2pContext from 'Components/context/dp2p-context';
import { localize } from 'Components/i18next';
import Popup from './popup.jsx';
import BuySellTableContent from './buy-sell-table-content.jsx';
import PageReturn from '../page-return/page-return.jsx';
import Verification from '../verification/verification.jsx';
import AdvertiserPage from '../advertiser-page/advertiser-page.jsx';
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
    const { is_advertiser } = React.useContext(Dp2pContext);
    const [table_type, setTableType] = React.useState('buy');
    const [selected_ad, setSelectedAd] = React.useState({});
    const [show_advertiser_page, setShowAdvertiserPage] = React.useState(false);
    const [show_popup, setShowPopup] = React.useState(false);
    const [show_verification, setShowVerification] = React.useState(false);

    const hideAdvertiserPage = () => setShowAdvertiserPage(false);

    const hideVerification = () => setShowVerification(false);

    const onCancelClick = () => {
        setShowPopup(false);
    };

    const onChangeTableType = event => {
        setTableType(event.target.value);
    };

    const onConfirmClick = order_info => {
        const nav = { location: 'buy_sell' };
        navigate('orders', { order_info, nav });
    };

    const setSelectedAdvert = selected_advert => {
        if (!is_advertiser) {
            setShowVerification(true);
        } else {
            setSelectedAd(selected_advert);
            setShowPopup(true);
        }
    };

    const showAdvertiserPage = selected_advert => {
        setSelectedAd(selected_advert);
        setShowAdvertiserPage(true);
    };

    const showVerification = () => {
        hideAdvertiserPage();
        setShowVerification(true);
    };

    if (show_verification) {
        return (
            <>
                <PageReturn onClick={hideVerification} page_title={localize('Verification')} />
                <Verification />
            </>
        );
    }

    if (show_advertiser_page) {
        return (
            <>
                <PageReturn onClick={hideAdvertiserPage} page_title={localize("Advertiser's page")} />
                <AdvertiserPage navigate={navigate} selected_ad={selected_ad} showVerification={showVerification} />
            </>
        );
    }

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

            <BuySellTableContent
                key={table_type}
                is_buy={table_type === 'buy'}
                setSelectedAd={setSelectedAdvert}
                showAdvertiserPage={showAdvertiserPage}
            />

            {show_popup && (
                <div className='buy-sell__dialog'>
                    <Dialog is_visible={show_popup}>
                        <Popup ad={selected_ad} handleClose={onCancelClick} handleConfirm={onConfirmClick} />
                    </Dialog>
                </div>
            )}
        </div>
    );
};

BuySell.propTypes = {
    navigate: PropTypes.func,
    params: PropTypes.object,
};

export default BuySell;
