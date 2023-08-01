import React from 'react';
import { Loading } from '@deriv/components';
import { observer } from '@deriv/stores';
import { useDBotStore } from '../../stores/useDBotStore';

const BlocklyLoading = observer(() => {
    const { blockly_store } = useDBotStore();
    const { is_loading } = blockly_store;
    return (
        <>
            {is_loading && (
                <div className='bot__loading' data-testid='blockly-loader'>
                    <Loading />
                </div>
            )}
        </>
    );
});

export default BlocklyLoading;
