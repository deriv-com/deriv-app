import React from 'react';
import { Text } from '@deriv-com/quill-ui';
import BottomNav from 'AppV2/Components/BottomNav';
import { observer } from 'mobx-react';
import { useTraderStore } from 'Stores/useTraderStores';
import TradeLoader from './trade-loader';

const Trade = observer(() => {
    const { active_symbols, onMount, onUnmount } = useTraderStore();

    React.useEffect(() => {
        onMount();
        return onUnmount;
    }, []);

    return <BottomNav>{active_symbols.length ? <Text size='sm'>Trade</Text> : <TradeLoader />}</BottomNav>;
});

export default Trade;
