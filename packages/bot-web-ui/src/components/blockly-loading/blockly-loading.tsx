import React from 'react';
import { Loading } from '@deriv/components';
import { connect } from 'Stores/connect';

type BlocklyLoadingProps = {
    is_loading: boolean;
};

const BlocklyLoading = ({ is_loading }: BlocklyLoadingProps) => (
    <>
        {is_loading && (
            <div className='bot__loading'>
                <Loading />
            </div>
        )}
    </>
);

export default connect(({ blockly_store }) => ({
    is_loading: blockly_store.is_loading,
}))(BlocklyLoading);
