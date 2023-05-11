import React from 'react';
import { Loading } from '@deriv/components';
import { observer } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';

const BlocklyLoading = observer(() => {
    const {
        blockly_store: { is_loading },
    } = useDBotStore();
    return (
        <>
            {is_loading && (
                <div className='bot__loading'>
                    <Loading />
                </div>
            )}
        </>
    );
});

export default BlocklyLoading;
