import React                from 'react';
import { PropTypes }        from 'prop-types';
import { BlueInfoIcon }     from './Icons.jsx';
import FlyoutBlockWorkspace from '../scratch/help-components/flyout-block-workspace.jsx';
import FlyoutStore          from '../stores/flyout-store';
import { translate }        from '../utils/lang/i18n';

const FlyoutBlock = (props) => {
    const {
        onInfoClick,
        block_node,
        should_hide_label,
        should_center_block,
    } = props;

    return (
        <div className='flyout__item'>
            <div className='flyout__item-header'>
                { !should_hide_label &&
                    <div className='flyout__item-label'>{block_node.getAttribute('type')}</div>
                }
                <div className='flyout__item-buttons'>
                    { onInfoClick &&
                        <div className='flyout__item-info' onClick={onInfoClick}>
                            <BlueInfoIcon className={'info'} />
                        </div>
                    }
                    <button className='flyout__item-add' onClick={() => FlyoutStore.onAddClick(block_node)}>
                        { translate('Add') }
                    </button>
                </div>
            </div>
            <FlyoutBlockWorkspace
                should_center_block={ should_center_block }
                block_node={ block_node }
            />
        </div>
    );
};

FlyoutBlock.propTypes = {
    block_node: PropTypes.any,
};

export default FlyoutBlock;
