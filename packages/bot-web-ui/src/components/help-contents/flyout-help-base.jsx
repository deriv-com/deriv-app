import { Button , Icon } from '@deriv/components';
import React             from 'react';
import PropTypes         from 'prop-types';
import { localize }      from '@deriv/translations';
import { help_content_types,
    help_content_config }    from '@deriv/bot-engine';

import FlyoutVideo       from './flyout-video.jsx';
import FlyoutText        from './flyout-text.jsx';
import FlyoutImage       from './flyout-img.jsx';
import FlyoutBlock       from '../flyout-block.jsx';
import { connect }       from '../../stores/connect';

const HelpBase = ({
    block_node,
    block_type,
    help_string,
    is_search_flyout,
    onBackClick,
    onSequenceClick,
    title,
}) => {
    const { display_name } = Blockly.Blocks[block_type].meta();
    const block_help_component = help_string && help_content_config[block_type];
    let text_count = 0;

    return (
        <React.Fragment>
            <div className='flyout__help-header'>
                <button className='btn flyout__button-back' onClick={onBackClick}>
                    <Icon icon='IcArrowLeft' />
                </button>
                <span className='flyout__help-title'>{title}</span>
                <div className='flyout__item-buttons'>
                    <Button
                        className='flyout__button-add'
                        has_effect
                        id={`gtm-${  display_name.replace(/\s/ig, '-')}`}
                        onClick={() => Blockly.derivWorkspace.addBlockNode(block_node)}
                        primary
                        text={localize('Add')}
                        type='button'
                    />
                </div>
            </div>
            <div className='flyout__help-content'>
                {
                    block_help_component &&
                        block_help_component.map((component, index) => {
                            const { type, width, url } = component;
                            const { text } = help_string;
                            switch (type) {
                                case help_content_types.TEXT:
                                    return (
                                        <FlyoutText key={`${block_type}_${index}`} text={text[text_count++]} />
                                    );
                                case help_content_types.VIDEO:
                                    return (
                                        <FlyoutVideo key={`${block_type}_${index}`} url={url} />
                                    );
                                case help_content_types.IMAGE:
                                    return (
                                        <FlyoutImage key={`${block_type}_${index}`} width={width} url={url} />
                                    );
                                case help_content_types.BLOCK:
                                {
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
                        })
                }
            </div>
            {
                !is_search_flyout &&
                    <div className='flyout__help-footer'>
                        <Button
                            className='flyout__button-previous'
                            has_effect
                            onClick={() => onSequenceClick(false)}
                            text={localize('Previous')}
                            type='button'
                        />
                        <Button
                            className='flyout__button-next'
                            has_effect
                            onClick={() => onSequenceClick(false)}
                            text={localize('Next')}
                            type='button'
                        />
                    </div>
            }
        </React.Fragment >
    );
};

HelpBase.propTypes = {
    block_node      : PropTypes.object,
    block_type      : PropTypes.string,
    help_string     : PropTypes.object,
    is_search_flyout: PropTypes.bool,
    onBackClick     : PropTypes.func,
    onSequenceClick : PropTypes.func,
    title           : PropTypes.string,
};

export default connect(({ flyout, flyout_help }) => ({
    block_node      : flyout_help.block_node,
    block_type      : flyout_help.block_type,
    help_string     : flyout_help.help_string,
    is_search_flyout: flyout.is_search_flyout,
    onBackClick     : flyout_help.onBackClick,
    onSequenceClick : flyout_help.onSequenceClick,
    title           : flyout_help.title,
}))(HelpBase);
