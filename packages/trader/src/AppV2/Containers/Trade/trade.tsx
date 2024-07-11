import React from 'react';
import { Text } from '@deriv-com/quill-ui';
import BottomNav from 'AppV2/Components/BottomNav';
import { observer } from 'mobx-react';
import { useTraderStore } from 'Stores/useTraderStores';
import { Loading } from '@deriv/components';
import Guide from 'AppV2/Components/Guide';

const Trade = observer(() => {
    const { active_symbols, onMount, onUnmount } = useTraderStore();

    React.useEffect(() => {
        onMount();
        return onUnmount;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <BottomNav>
            {active_symbols.length ? (
                <React.Fragment>
                    <Text size='sm'>Trade</Text>
                    <Guide has_label />
                    <Guide />
                </React.Fragment>
            ) : (
                <Loading.DTraderV2 />
            )}
        </BottomNav>
    );
});

export default Trade;
