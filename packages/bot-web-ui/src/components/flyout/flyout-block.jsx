import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'Stores/connect';

const FlyoutBlock = ({ initBlockWorkspace, block_node, should_center_block, should_hide_display_name }) => {
    let el_block_workspace = React.useRef();

    React.useEffect(() => {
        initBlockWorkspace(el_block_workspace, block_node, should_center_block);
    }, []);

    return (
        <div
            ref={el => (el_block_workspace = el)}
            className={classNames({
                'flyout__block-workspace--center': should_hide_display_name,
                'flyout__block-workspace--top': !should_hide_display_name,
            })}
        />
    );
};

FlyoutBlock.propTypes = {
    block_node: PropTypes.any,
    initBlockWorkspace: PropTypes.func,
    should_center_block: PropTypes.bool,
    should_hide_display_name: PropTypes.bool,
};

export default connect(({ flyout }) => ({
    initBlockWorkspace: flyout.initBlockWorkspace,
}))(FlyoutBlock);
