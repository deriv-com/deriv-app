import React from 'react';
import BottomNav from 'AppV2/Components/BottomNav';
import MarketSelector from 'AppV2/Components/MarketSelector';
import { observer } from 'mobx-react';
import { useTraderStore } from 'Stores/useTraderStores';
import { Loading } from '@deriv/components';
import Guide from 'AppV2/Components/Guide';
import ClosedMarketMessage from 'AppV2/Components/ClosedMarketMessage';

const Trade = observer(() => {
    const { active_symbols, onMount, onUnmount } = useTraderStore();

    React.useEffect(() => {
        onMount();
        return onUnmount;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <BottomNav>
            <MarketSelector />
            {active_symbols.length ? (
                <React.Fragment>
                    <Guide has_label />
                    <Guide />
                </React.Fragment>
            ) : (
                <Loading.DTraderV2 />
            )}
            <ClosedMarketMessage />
        </BottomNav>
    );
});

export default Trade;
