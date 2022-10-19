import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import { localize } from 'Components/i18next';
import PageReturn from 'Components/page-return/page-return.jsx';
import Verification from 'Components/verification/verification.jsx';
import RateChangeModal from 'Components/buy-sell/rate-change-modal.jsx';
import { buy_sell } from 'Constants/buy-sell';
import { useStores } from 'Stores';
import BuySellHeader from './buy-sell-header.jsx';
import BuySellModal from './buy-sell-modal.jsx';
import BuySellTable from './buy-sell-table.jsx';
import FilterModal from './filter-modal';
import './buy-sell.scss';

const BuySell = () => {
    const { buy_sell_store } = useStores();
    const previous_scroll_top = React.useRef(0);

    React.useEffect(() => {
        const disposeIsListedReaction = buy_sell_store.registerIsListedReaction();
        const disposeAdvertIntervalReaction = buy_sell_store.registerAdvertIntervalReaction();

        return () => {
            disposeIsListedReaction();
            disposeAdvertIntervalReaction();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onScroll = event => {
        if (!buy_sell_store.show_advertiser_page) {
            previous_scroll_top.current = event.target.scrollTop;
        }
    };

    if (buy_sell_store.should_show_verification) {
        return (
            <React.Fragment>
                <PageReturn onClick={buy_sell_store.hideVerification} page_title={localize('Verification')} />
                <Verification />
            </React.Fragment>
        );
    }

    return (
        <div className='buy-sell'>
            <FilterModal />
            <BuySellHeader table_type={buy_sell_store.table_type} />
            <BuySellTable
                key={buy_sell_store.table_type}
                is_buy={buy_sell_store.table_type === buy_sell.BUY}
                setSelectedAdvert={buy_sell_store.setSelectedAdvert}
                showAdvertiserPage={buy_sell_store.showAdvertiserPage}
                onScroll={onScroll}
            />
            <BuySellModal
                selected_ad={buy_sell_store.selected_ad_state}
                should_show_popup={buy_sell_store.should_show_popup}
                setShouldShowPopup={buy_sell_store.setShouldShowPopup}
                table_type={buy_sell_store.table_type}
            />
            <RateChangeModal onMount={buy_sell_store.setShouldShowPopup} />
        </div>
    );
};

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

export default observer(BuySell);
