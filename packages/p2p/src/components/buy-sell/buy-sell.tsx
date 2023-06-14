import React from 'react';
import { observer } from '@deriv/stores';
import { localize } from 'Components/i18next';
import BuySellHeader from 'Components/buy-sell/buy-sell-header';
import BuySellTable from 'Components/buy-sell/buy-sell-table';
import PageReturn from 'Components/page-return/page-return.jsx';
import Verification from 'Components/verification/verification.jsx';
import { buy_sell } from 'Constants/buy-sell';
import { useStores } from 'Stores';

const BuySell = () => {
    const { buy_sell_store } = useStores();
    const {
        hideVerification,
        registerAdvertIntervalReaction,
        registerIsListedReaction,
        selected_local_currency,
        setLocalCurrency,
        setSelectedAdvert,
        showAdvertiserPage,
        show_advertiser_page,
        should_show_verification,
        table_type,
    } = buy_sell_store;
    const previous_scroll_top = React.useRef(0);

    React.useEffect(() => {
        const disposeIsListedReaction = registerIsListedReaction();
        const disposeAdvertIntervalReaction = registerAdvertIntervalReaction();
        setLocalCurrency(selected_local_currency);

        return () => {
            disposeIsListedReaction();
            disposeAdvertIntervalReaction();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onScroll = event => {
        if (!show_advertiser_page) {
            previous_scroll_top.current = event.target.scrollTop;
        }
    };

    if (should_show_verification) {
        return (
            <React.Fragment>
                <PageReturn
                    className='buy-sell__page-return'
                    onClick={hideVerification}
                    page_title={localize('Verification')}
                />
                <Verification />
            </React.Fragment>
        );
    }

    return (
        <div className='buy-sell'>
            <BuySellHeader table_type={table_type} />
            <BuySellTable
                key={table_type}
                is_buy={table_type === buy_sell.BUY}
                setSelectedAdvert={setSelectedAdvert}
                showAdvertiserPage={showAdvertiserPage}
                onScroll={onScroll}
            />
        </div>
    );
};

export default observer(BuySell);
