
import { Button }           from 'deriv-components';
import React                from 'react';
import { PropTypes }        from 'prop-types';
import { localize }         from 'deriv-translations';
import FlyoutBlock          from './flyout-block.jsx';

const FlyoutBlockGroup = ({
    onInfoClick,
    block_node,
}) => {
    const block_type = block_node.getAttribute('type');
    const block_meta = Blockly.Blocks[block_type].meta();
    const { display_name, description } = block_meta;

    return (
        <div className='flyout__item'>
            <div className='flyout__item-header'>
                <div className='flyout__item-label'>{display_name}</div>
                <div className='flyout__item-buttons'>
                    <Button
                        className='flyout__button-add flyout__button-add--hide'
                        has_effect
                        onClick={() => Blockly.derivWorkspace.addBlockNode(block_node)}
                        primary
                        text={localize('Add')}
                        type='button'
                    />
                </div>
            </div>
            <div className='flyout__item-description'>
                {description}
                {onInfoClick
                    &&
                    <a
                        className='flyout__item-info'
                        onClick={onInfoClick}
                    >{localize('Learn more')}
                    </a>
                }
            </div>
            <FlyoutBlock
                should_center_block={true}
                block_node={block_node}
            />
        </div>
    );
};

FlyoutBlockGroup.propTypes = {
    block_nodes: PropTypes.array,
    onInfoClick: PropTypes.func,
};

export default FlyoutBlockGroup;
