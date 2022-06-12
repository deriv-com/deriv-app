import React from 'react';
import { Loading } from '@deriv/components';
import RootStore from 'Stores/index';
import { connect } from 'Stores/connect';

const BlocklyLoading: React.FC<TBlocklyLoadingProps> = ({ is_loading }) => (
    <>
        {is_loading && (
            <div className='bot__loading'>
                <Loading />
            </div>
        )}
    </>
);

type TBlocklyLoadingProps = {
    is_loading: boolean;
};

export default connect(({ blockly_store }: RootStore) => ({
    is_loading: blockly_store.is_loading,
}))(BlocklyLoading);
