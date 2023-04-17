import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { help_content_config, help_content_types } from 'Utils/help-content/help-content.config';
import { connect } from 'Stores/connect';
import FlyoutBlock from '../flyout-block.jsx';
import FlyoutImage from './flyout-img.jsx';
import FlyoutText from './flyout-text.jsx';
import FlyoutVideo from './flyout-video.jsx';

const HelpBase = ({
    block_node,
    block_type,
    examples,
    help_string,
    is_search_flyout,
    onBackClick,
    onSequenceClick,
    should_next_disable,
    should_previous_disable,
    title,
}) => {
    const block_help_component = help_string && help_content_config(__webpack_public_path__)[block_type];
    let text_count = 0;

    return (
        <React.Fragment>
            <div className='flyout__help-header'>
                <button className='dc-btn flyout__button-back' onClick={onBackClick}>
                    <Icon icon='IcArrowLeft' />
                </button>
                <Text weight='bold' className='flyout__help-title'>
                    {title}
                </Text>
                <div className='flyout__item-buttons'>
                    <Button
                        className='flyout__button-add'
                        has_effect
                        id={`db-flyout-help__add--${block_type}`}
                        onClick={() => Blockly.derivWorkspace.addBlockNode(block_node)}
                        primary
                        text={localize('Add')}
                        type='button'
                    />
                </div>
            </div>
            <div className='flyout__help-content'>
                {block_help_component &&
                    block_help_component.map((component, index) => {
                        const { type, width, url, example_id } = component;
                        const { text } = help_string;
                        const example_node = examples.find(example => example.id === example_id);
                        switch (type) {
                            case help_content_types.TEXT:
                                if (text_count < text.length) {
                                    return <FlyoutText key={`${block_type}_${index}`} text={text[text_count++]} />;
                                }
                                return null;
                            case help_content_types.VIDEO:
                                return <FlyoutVideo key={`${block_type}_${index}`} url={url} />;
                            case help_content_types.IMAGE:
                                return <FlyoutImage key={`${block_type}_${index}`} width={width} url={url} />;
                            case help_content_types.BLOCK: {
                                return (
                                    <FlyoutBlock
                                        key={`${block_type}_${index}`}
                                        should_center_block={true}
                                        block_node={block_node}
                                    />
                                );
                            }
                            case help_content_types.EXAMPLE:
                                if (example_node) {
                                    return (
                                        <FlyoutBlock
                                            key={`${block_type}_${index}`}
                                            should_center_block={true}
                                            block_node={example_node.childNodes[0]}
                                        />
                                    );
                                }
                                return null;
                            default:
                                return null;
                        }
                    })}
            </div>
            {!is_search_flyout && !(should_previous_disable && should_next_disable) && (
                <div className='flyout__help-footer'>
                    <Button
                        className='flyout__button-previous'
                        secondary
                        onClick={() => onSequenceClick(false)}
                        text={localize('Previous')}
                        type='button'
                        is_disabled={should_previous_disable}
                        renderText={text =>
                            should_previous_disable && (
                                <Text size='xs' weight='bold' align='center' color='disabled'>
                                    {text}
                                </Text>
                            )
                        }
                    />
                    <Button
                        className='flyout__button-next'
                        secondary
                        onClick={() => onSequenceClick(true)}
                        text={localize('Next')}
                        type='button'
                        is_disabled={should_next_disable}
                        renderText={text =>
                            should_next_disable && (
                                <Text size='xs' weight='bold' align='center' color='disabled'>
                                    {text}
                                </Text>
                            )
                        }
                    />
                </div>
            )}
        </React.Fragment>
    );
};

HelpBase.propTypes = {
    block_node: PropTypes.object,
    block_type: PropTypes.string,
    examples: PropTypes.array,
    help_string: PropTypes.object,
    is_search_flyout: PropTypes.bool,
    onBackClick: PropTypes.func,
    onSequenceClick: PropTypes.func,
    should_next_disable: PropTypes.bool,
    should_previous_disable: PropTypes.bool,
    title: PropTypes.string,
};

export default connect(({ flyout, flyout_help }) => ({
    block_node: flyout_help.block_node,
    block_type: flyout_help.block_type,
    examples: flyout_help.examples,
    help_string: flyout_help.help_string,
    is_search_flyout: flyout.is_search_flyout,
    onBackClick: flyout_help.onBackClick,
    onSequenceClick: flyout_help.onSequenceClick,
    should_next_disable: flyout_help.should_next_disable,
    should_previous_disable: flyout_help.should_previous_disable,
    title: flyout_help.title,
}))(HelpBase);
