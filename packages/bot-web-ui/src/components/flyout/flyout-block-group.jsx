import React from 'react';
import classNames from 'classnames';
import { PropTypes } from 'prop-types';
import { Button, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import FlyoutBlock from './flyout-block.jsx';

const FlyoutBlockGroup = ({ onInfoClick, block_node, is_active, should_hide_display_name }) => {
    const block_type = block_node.getAttribute('type');
    const block_meta = Blockly.Blocks[block_type].meta();
    const is_variables_get = block_type === 'variables_get';
    const is_variables_set = block_type === 'variables_set';
    const { display_name, description } = block_meta;

    const AddButton = () => (
        <div className='flyout__item-buttons'>
            <Button
                id={`db-flyout__add--${block_type}`}
                className='flyout__button-add flyout__button-add--hide'
                has_effect
                is_plus
                onClick={() => Blockly.derivWorkspace.addBlockNode(block_node)}
                type='button'
            />
        </div>
    );

    return (
        <>
            {is_variables_set && <div className='flyout__hr' />}
            <div className={classNames('flyout__item', { 'flyout__item--active': is_active })}>
                {!should_hide_display_name && (
                    <>
                        <div className='flyout__item-header'>
                            <Text
                                size={is_variables_get ? 'xs' : 'xsm'}
                                line_height={is_variables_get ? undefined : 'xl'}
                                weight={is_variables_get ? undefined : 'bold'}
                            >
                                {display_name}
                            </Text>
                            {!is_variables_get && <AddButton />}
                        </div>
                        <div className='flyout__item-description'>
                            {description}
                            {onInfoClick && (
                                <a
                                    id={display_name.replace(/\s/gi, '-')}
                                    className='flyout__item-info'
                                    onClick={onInfoClick}
                                >
                                    <Localize i18n_default_text='Learn more' />
                                </a>
                            )}
                        </div>
                    </>
                )}
                <div className='flyout__block-workspace__header'>
                    <FlyoutBlock should_center_block block_node={block_node} should_hide_display_name />
                    {is_variables_get && <AddButton />}
                </div>
            </div>
        </>
    );
};

FlyoutBlockGroup.propTypes = {
    block_nodes: PropTypes.array,
    onInfoClick: PropTypes.func,
};

export default FlyoutBlockGroup;
