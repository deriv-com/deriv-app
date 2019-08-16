import React            from 'react';
import { PropTypes }    from 'prop-types';
import { BlueInfoIcon } from './Icons.jsx';
import { connect }      from '../stores/connect';
import { translate }    from '../utils/lang/i18n';

class FlyoutBlock extends React.PureComponent {
    render() {
        const { onInfoClick, block_node } = this.props;
        
        return (
            <div className='flyout__item'>
                <div className='flyout__item-header'>
                    <div className='flyout__item-label'>{block_node.getAttribute('type')}</div>
                    <div className='flyout__item-buttons'>
                        { onInfoClick &&
                            <div className='flyout__item-info' onClick={ onInfoClick }>
                                <BlueInfoIcon className={'info'} />
                            </div>
                        }
                        <button
                            className='flyout__item-add'
                            onClick={() => Blockly.derivWorkspace.addBlockNode(block_node) }
                        >
                            { translate('Add') }
                        </button>
                    </div>
                </div>
                <div ref={el => this.el_block_workspace = el} className='flyout__block-workspace' />
            </div>
        );
    }

    componentDidMount() {
        const { initBlockWorkspace, block_node } = this.props;

        initBlockWorkspace(this.el_block_workspace, block_node);
    }
}

FlyoutBlock.propTypes = {
    block_node        : PropTypes.any,
    initBlockWorkspace: PropTypes.func,
    onInfoClick       : PropTypes.func,
};

export default connect(({ flyout }) => ({
    initBlockWorkspace: flyout.initBlockWorkspace,
}))(FlyoutBlock);

