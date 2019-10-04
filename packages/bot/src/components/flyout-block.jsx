
import React            from 'react';
import PropTypes        from 'prop-types';
import { connect }      from '../stores/connect';

class FlyoutBlock extends React.PureComponent {
    render() {
        return (
            <div ref={el => this.el_block_workspace = el} className='flyout__block-workspace' />
        );
    }

    componentDidMount() {
        const { initBlockWorkspace, block_node, should_center_block } = this.props;
        initBlockWorkspace(this.el_block_workspace, block_node, should_center_block);
    }
}

FlyoutBlock.propTypes = {
    block_node         : PropTypes.any,
    initBlockWorkspace : PropTypes.func,
    should_center_block: PropTypes.bool,
};

export default connect(({ flyout }) => ({
    initBlockWorkspace: flyout.initBlockWorkspace,
}))(FlyoutBlock);
