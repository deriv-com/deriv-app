import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import { useHistory } from 'react-router';
import { routes } from '@deriv/shared';
import { useStore } from '@deriv/stores';
import { localize } from 'Components/i18next';
import PageReturn from 'Components/page-return';
import Verification from 'Components/verification';
import { buy_sell } from 'Constants/buy-sell';
import { useStores } from 'Stores';
import BuySellHeader from './buy-sell-header.jsx';
import BuySellTable from './buy-sell-table.jsx';
import { checkRoutingHistory, getHistoryState } from 'Utils/helper';

const BuySell = () => {
    const { buy_sell_store, general_store } = useStores();
    const previous_scroll_top = React.useRef(0);
    const { common } = useStore();
    const { app_routing_history } = common;
    const history = useHistory();
    const { scroll_to_index_value } = history.location.state ?? {};
    const [scroll_to_index, setScrollToIndex] = React.useState(
        scroll_to_index_value !== undefined ? scroll_to_index_value + 1 : -1
    );
    const is_from_advertiser_page = checkRoutingHistory(app_routing_history, routes.p2p_advertiser_page);

    React.useEffect(() => {
        if (is_from_advertiser_page && (scroll_to_index_value === undefined || scroll_to_index_value === -1)) {
            setScrollToIndex(getHistoryState(app_routing_history, 1).scroll_to_index + 1);
        }
    }, [is_from_advertiser_page]);

    React.useEffect(() => {
        if (general_store.active_index !== 0) general_store.setActiveIndex(0);
        const disposeAdvertIntervalReaction = buy_sell_store.registerAdvertIntervalReaction();
        buy_sell_store.setLocalCurrency(buy_sell_store.selected_local_currency);

        return () => {
            disposeAdvertIntervalReaction();
            general_store.setShouldShowPopup(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onScroll = event => {
        if (!buy_sell_store.show_advertiser_page) {
            previous_scroll_top.current = event?.target?.scrollTop;
        }
    };

    const clearScroll = () => {
        setScrollToIndex(-1);
    };

    if (buy_sell_store.should_show_verification) {
        return (
            <React.Fragment>
                {!general_store.should_show_popup && (
                    <PageReturn
                        className='buy-sell__page-return'
                        onClick={buy_sell_store.hideVerification}
                        page_title={localize('Verification')}
                    />
                )}
                <Verification />
            </React.Fragment>
        );
    }

    return (
        <div className='buy-sell'>
            <BuySellHeader
                table_type={buy_sell_store.table_type}
                clearScroll={clearScroll}
                scroll_to_index={scroll_to_index}
            />
            <BuySellTable
                key={buy_sell_store.table_type}
                is_buy={buy_sell_store.table_type === buy_sell.BUY}
                setSelectedAdvert={buy_sell_store.setSelectedAdvert}
                showAdvertiserPage={buy_sell_store.showAdvertiserPage}
                clearScroll={clearScroll}
                onScroll={onScroll}
                retain_scroll_position={is_from_advertiser_page}
                scroll_to_index={scroll_to_index}
            />
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
