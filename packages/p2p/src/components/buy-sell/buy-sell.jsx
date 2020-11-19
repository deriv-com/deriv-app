import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import { localize } from 'Components/i18next';
import { useStores } from 'Stores';
import BuySellHeader from './buy-sell-header.jsx';
import BuySellModal from './buy-sell-modal.jsx';
import BuySellTable from './buy-sell-table.jsx';
import PageReturn from '../page-return/page-return.jsx';
import Verification from '../verification/verification.jsx';
import AdvertiserPage from '../advertiser-page/advertiser-page.jsx';
import { buy_sell } from '../../constants/buy-sell';
import './buy-sell.scss';

const BuySell = observer(() => {
    const { general_store } = useStores();
    const [is_toggle_visible, setIsToggleVisible] = React.useState(true);
    const [selected_ad, setSelectedAdState] = React.useState({});
    const [should_show_popup, setShouldShowPopup] = React.useState(false);
    const [should_show_verification, setShouldShowVerification] = React.useState(false);
    const [should_show_advertiser_page, setShouldShowAdvertiserPage] = React.useState(false);
    const [table_type, setTableType] = React.useState(buy_sell.BUY);
    const previous_scroll_top = React.useRef(0);

    const hideAdvertiserPage = () => setShouldShowAdvertiserPage(false);
    const hideVerification = () => setShouldShowVerification(false);

    const setSelectedAdvert = selected_advert => {
        if (!general_store.is_advertiser) {
            setShouldShowVerification(true);
        } else {
            setSelectedAdState(selected_advert);
            setShouldShowPopup(true);
        }
    };

    const showAdvertiserPage = selected_advert => {
        setSelectedAdState(selected_advert);
        setShouldShowAdvertiserPage(true);
    };

    const showVerification = () => setShouldShowVerification(true);

    const onScroll = event => {
        if (event.target.scrollTop !== previous_scroll_top.current) {
            const is_scrolling_down = event.target.scrollTop > previous_scroll_top.current;
            setIsToggleVisible(!is_scrolling_down);
        }

        previous_scroll_top.current = event.target.scrollTop;
    };

    if (should_show_verification) {
        return (
            <React.Fragment>
                <PageReturn onClick={hideVerification} page_title={localize('Verification')} />
                <Verification />
            </React.Fragment>
        );
    }

    if (should_show_advertiser_page) {
        return (
            <React.Fragment>
                <PageReturn onClick={hideAdvertiserPage} page_title={localize("Advertiser's page")} />
                <AdvertiserPage
                    navigate={general_store.redirectTo}
                    selected_advert={selected_ad}
                    showVerification={showVerification}
                />
            </React.Fragment>
        );
    }

    return (
        <div className='buy-sell'>
            <BuySellHeader is_visible={is_toggle_visible} table_type={table_type} setTableType={setTableType} />
            <BuySellTable
                key={table_type}
                is_buy={table_type === buy_sell.BUY}
                setSelectedAdvert={setSelectedAdvert}
                showAdvertiserPage={showAdvertiserPage}
                onScroll={onScroll}
            />
            <BuySellModal
                selected_ad={selected_ad}
                should_show_popup={should_show_popup}
                setShouldShowPopup={setShouldShowPopup}
                table_type={table_type}
            />
        </div>
    );
});

BuySell.propTypes = {
    navigate: PropTypes.func,
    params: PropTypes.object,
};

export default BuySell;
