import React from 'react';
import { PropTypes } from 'prop-types';
import FlyoutBlockWorkspace from './flyout-block-workspace.jsx';
import { translate } from '../utils/tools';

const FlyoutBlock = (props) => {
    const {
        onInfoClick,
        block_node,
        should_hide_label,
        should_center_block,
    } = props;

    const block_type = block_node[0].getAttribute('type');
    const block_meta = Blockly.Blocks[block_type].meta();
    const display_name = block_meta.display_name;
    const description = block_meta.description;

    return (
        <div className='flyout__item'>
            <div className='flyout__item-header'>
                {!should_hide_label &&
                    <div className='flyout__item-label'>{display_name}</div>
                }
            </div>
            <p className='flyout__item-desc'>
                {description}
                &nbsp;
                {onInfoClick && <a className='flyout__item-info' onClick={onInfoClick}>{translate('Learn more.')}</a>}
            </p>
            {
                Object.keys(block_node).map(key => {
                    return (
                        <FlyoutBlockWorkspace
                            key={key}
                            should_center_block={should_center_block}
                            block_node={block_node[key]}
                        />
                    );
                })
            }
        </div>
    );
};

FlyoutBlock.propTypes = {
    block_node: PropTypes.any,
};

export default FlyoutBlock;
