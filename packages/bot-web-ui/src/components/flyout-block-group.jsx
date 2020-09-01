import { Button } from '@deriv/components';
import React from 'react';
import { PropTypes } from 'prop-types';
import { localize } from '@deriv/translations';
import classNames from 'classnames';
import FlyoutBlock from './flyout-block.jsx';

const FlyoutBlockGroup = ({ onInfoClick, block_node, is_active }) => {
    const block_type = block_node.getAttribute('type');
    const block_meta = Blockly.Blocks[block_type].meta();
    const { display_name, description } = block_meta;

    return (
        <div className={classNames('flyout__item', { 'flyout__item--active': is_active })}>
            <div className='flyout__item-header'>
                <div className='flyout__item-label'>{display_name}</div>
                <div className='flyout__item-buttons'>
                    <Button
                        id={`db-flyout__add--${block_type}`}
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
                {onInfoClick && (
                    <a id={display_name.replace(/\s/gi, '-')} className='flyout__item-info' onClick={onInfoClick}>
                        {localize('Learn more')}
                    </a>
                )}
            </div>
            <FlyoutBlock should_center_block={true} block_node={block_node} />
        </div>
    );
};

FlyoutBlockGroup.propTypes = {
    block_nodes: PropTypes.array,
    onInfoClick: PropTypes.func,
};

export default FlyoutBlockGroup;
