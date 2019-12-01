import { Button }       from 'deriv-components';
import React            from 'react';
import PropTypes        from 'prop-types';
import { localize }     from 'deriv-translations';
import FlyoutVideo      from './help-components/flyout-video.jsx';
import FlyoutText       from './help-components/flyout-text.jsx';
import FlyoutImage      from './help-components/flyout-img.jsx';
import { config }       from './help-content.config';
import FlyoutBlock      from '../../components/flyout-block.jsx';
import constant         from '../../constants';
import { Arrow2Icon }   from '../../components/Icons.jsx';
import { connect }      from '../../stores/connect';

const HelpBase = ({
    block_node,
    block_type,
    help_string,
    is_search_flyout,
    onBackClick,
    onSequenceClick,
    title,
}) => {
    const block_help_component = help_string && config[block_type];
    let text_count = 0;

    return (
        <React.Fragment>
            <div className='flyout__help-header'>
                <button className='btn flyout__button-back' onClick={onBackClick}>
                    <Arrow2Icon />
                </button>
                <span className='flyout__help-title'>{title}</span>
                <div className='flyout__item-buttons'>
                    <Button
                        className='flyout__button-add'
                        has_effect
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
                                case constant.help.TEXT:
                                    return (
                                        <FlyoutText key={`${block_type}_${index}`} text={text[text_count++]} />
                                    );
                                case constant.help.VIDEO:
                                    return (
                                        <FlyoutVideo key={`${block_type}_${index}`} url={url} />
                                    );
                                case constant.help.IMAGE:
                                    return (
                                        <FlyoutImage key={`${block_type}_${index}`} width={width} url={url} />
                                    );
                                case constant.help.BLOCK:
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
