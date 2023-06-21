import React from 'react';
import { Loading } from '@deriv/components';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';

type TBlocklyLoadingProps = {
    is_loading: boolean;
};

const BlocklyLoading = ({ is_loading }: TBlocklyLoadingProps) => (
    <>
        {is_loading && (
            <div className='bot__loading'>
                <Loading />
            </div>
        )}
    </>
);

export default connect(({ blockly_store }: RootStore) => ({
    is_loading: blockly_store.is_loading,
}))(BlocklyLoading);
