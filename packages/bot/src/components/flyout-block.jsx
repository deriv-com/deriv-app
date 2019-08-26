
import React            from 'react';
import PropTypes        from 'prop-types';
import { connect }      from '../stores/connect';
import { translate }    from '../utils/lang/i18n';

class FlyoutBlock extends React.PureComponent {
    render() {
        const { block_node } = this.props;
        return (
            <div className='flyout__item'>
                <div className='flyout__item-buttons'>
                    <button className='flyout__button flyout__button-add' onClick={() => Blockly.derivWorkspace.addBlockNode(block_node)}>
                        {translate('Add')}
                    </button>
                </div>
                <div ref={el => this.el_block_workspace = el} className='flyout__block-workspace' />
            </div>
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
