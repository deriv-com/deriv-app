import React       from 'react';
import { connect } from '../../stores/connect';

class FlyoutBlockWorkspace extends React.PureComponent {
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

export default connect(({ flyout }) => ({
    initBlockWorkspace: flyout.initBlockWorkspace,
}))(FlyoutBlockWorkspace);
