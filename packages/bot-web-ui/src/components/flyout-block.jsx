import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from '../stores/connect';

class FlyoutBlock extends React.PureComponent {
    render() {
        const { should_hide_display_name } = this.props;
        return (
            <div
                ref={el => (this.el_block_workspace = el)}
                className={classNames({
                    'flyout__block-workspace--center': should_hide_display_name,
                    'flyout__block-workspace--top': !should_hide_display_name,
                })}
            />
        );
    }

    componentDidMount() {
        const { initBlockWorkspace, block_node, should_center_block } = this.props;
        initBlockWorkspace(this.el_block_workspace, block_node, should_center_block);
    }
}

FlyoutBlock.propTypes = {
    block_node: PropTypes.any,
    initBlockWorkspace: PropTypes.func,
    should_center_block: PropTypes.bool,
};

export default connect(({ flyout }) => ({
    initBlockWorkspace: flyout.initBlockWorkspace,
}))(FlyoutBlock);
