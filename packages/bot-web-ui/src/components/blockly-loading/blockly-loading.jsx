import React from 'react';
import PropTypes from 'prop-types';
import { Loading } from '@deriv/components';
import { connect } from 'Stores/connect';

const BlocklyLoading = ({ is_loading }) => (
    <>
        {is_loading && (
            <div className='bot__loading'>
                <Loading />
            </div>
        )}
    </>
);

BlocklyLoading.propTypes = {
    is_loading: PropTypes.bool,
};

export default connect(({ blockly_store }) => ({
    is_loading: blockly_store.is_loading,
}))(BlocklyLoading);
