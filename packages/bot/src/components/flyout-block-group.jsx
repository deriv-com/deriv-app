import React                from 'react';
import { PropTypes }        from 'prop-types';
import FlyoutBlock          from './flyout-block.jsx';
import { translate }        from '../utils/tools';

const FlyoutBlockGroup = (props) => {
    const {
        onInfoClick,
        block_nodes,
    } = props;

    const block_type = block_nodes[0].getAttribute('type');
    const block_meta = Blockly.Blocks[block_type].meta();
    const { display_name, description } = block_meta;

    return (
        <div className='flyout__item'>
            <div className='flyout__item-header'>
                <div className='flyout__item-label'>{display_name}</div>
            </div>
            <p className='flyout__item-description'>
                {description}
                {onInfoClick && <a className='flyout__item-info' onClick={onInfoClick}>{translate('Learn more.')}</a>}
            </p>
            {
                Object.keys(block_nodes).map(key => {
                    return (
                        <FlyoutBlock
                            key={key}
                            should_center_block={true}
                            block_node={block_nodes[key]}
                        />
                    );
                })
            }
        </div>
    );
};

FlyoutBlockGroup.propTypes = {
    block_nodes: PropTypes.array,
    onInfoClick: PropTypes.func,
};

export default FlyoutBlockGroup;
