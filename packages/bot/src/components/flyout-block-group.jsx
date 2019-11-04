import React         from 'react';
import { PropTypes } from 'prop-types';
import { localize }  from 'deriv-translations/lib/translate';
import FlyoutBlock   from './flyout-block.jsx';

const FlyoutBlockGroup = (props) => {
    const {
        onInfoClick,
        block_nodes,
    } = props;

    const block_type = block_nodes[0].getAttribute('type');
    const block_meta = Blockly.Blocks[block_type].meta();
    const { display_name, description } = block_meta;

    return (
        Object.keys(block_nodes).map(key => {
            return (
                <div className='flyout__item' key={key}>
                    <div className='flyout__item-header'>
                        <div className='flyout__item-label'>{display_name}</div>
                        <div className='flyout__item-buttons'>
                            <button className='flyout__button flyout__button-add flyout__button-add-hide' onClick={() => Blockly.derivWorkspace.addBlockNode(block_nodes[key])}>
                                {localize('Add')}
                            </button>
                        </div>
                    </div>
                    <div className='flyout__item-description'>
                        {description}
                        {onInfoClick && <a className='flyout__item-info' onClick={onInfoClick}>{localize('Learn more')}</a>}
                    </div>
                    <FlyoutBlock
                        should_center_block={true}
                        block_node={block_nodes[key]}
                    />
                </div>
            );
        })
    );
};

FlyoutBlockGroup.propTypes = {
    block_nodes: PropTypes.array,
    onInfoClick: PropTypes.func,
};

export default FlyoutBlockGroup;
