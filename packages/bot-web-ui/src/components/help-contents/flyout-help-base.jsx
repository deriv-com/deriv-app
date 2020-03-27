import { Button, Icon } from '@deriv/components';
import React from 'react';
import PropTypes from 'prop-types';
import { localize } from '@deriv/translations';
import { help_content_types, help_content_config } from '@deriv/bot-skeleton';

import FlyoutVideo from './flyout-video.jsx';
import FlyoutText from './flyout-text.jsx';
import FlyoutImage from './flyout-img.jsx';
import FlyoutBlock from '../flyout-block.jsx';
import { connect } from '../../stores/connect';

const HelpBase = ({
    block_node,
    block_type,
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
                <span className='flyout__help-title'>{title}</span>
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
                        const { type, width, url } = component;
                        const { text } = help_string;
                        switch (type) {
                            case help_content_types.TEXT:
                                return <FlyoutText key={`${block_type}_${index}`} text={text[text_count++]} />;
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
                            default:
                                return null;
                        }
                    })}
            </div>
            {!is_search_flyout && (
                <div className='flyout__help-footer'>
                    <Button
                        className='flyout__button-previous'
                        secondary
                        onClick={() => onSequenceClick(false)}
                        text={localize('Previous')}
                        type='button'
                        is_disabled={should_previous_disable}
                    />
                    <Button
                        className='flyout__button-next'
                        secondary
                        onClick={() => onSequenceClick(true)}
                        text={localize('Next')}
                        type='button'
                        is_disabled={should_next_disable}
                    />
                </div>
            )}
        </React.Fragment>
    );
};

HelpBase.propTypes = {
    block_node: PropTypes.object,
    block_type: PropTypes.string,
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
    help_string: flyout_help.help_string,
    is_search_flyout: flyout.is_search_flyout,
    onBackClick: flyout_help.onBackClick,
    onSequenceClick: flyout_help.onSequenceClick,
    should_next_disable: flyout_help.should_next_disable,
    should_previous_disable: flyout_help.should_previous_disable,
    title: flyout_help.title,
}))(HelpBase);
