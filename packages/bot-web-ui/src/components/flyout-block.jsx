import React from 'react';
import PropTypes from 'prop-types';
import { connect } from '../stores/connect';

const FlyoutBlock = ({ initBlockWorkspace, block_node, should_center_block }) => {
    let el_block_workspace = React.useRef();

    React.useEffect(() => {
        initBlockWorkspace(el_block_workspace, block_node, should_center_block);
    }, []);

    return <div ref={el => (el_block_workspace = el)} className='flyout__block-workspace' />;
};

FlyoutBlock.propTypes = {
    block_node: PropTypes.any,
    initBlockWorkspace: PropTypes.func,
    should_center_block: PropTypes.bool,
};

export default connect(({ flyout }) => ({
    initBlockWorkspace: flyout.initBlockWorkspace,
}))(FlyoutBlock);
