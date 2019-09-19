import classNames           from 'classnames';
import React                from 'react';
import PropTypes            from 'prop-types';
import FlyoutBlockGroup     from './flyout-block-group.jsx';
import HelpBase             from '../scratch/help-content/flyout-help-base.jsx';
import { config }           from '../scratch/help-content/help-content.config';
import { connect }          from '../stores/connect';
import                           '../assets/sass/scratch/flyout.scss';

const Flyout = ({
    is_help_content,
    is_search_flyout,
    block_nodes,
    flyout_content,
    flyout_width,
    is_visible,
    showHelpContent,
}) => {
    return (
        <div
            className={
                classNames(
                    'flyout',
                    {
                        'hidden'        : !is_visible,
                        'flyout__search': is_search_flyout,
                    },
                    is_help_content ? 'flyout__help' : 'flyout__content'
                )
            }
            style={{ width: `${flyout_width}px` }}
        >
            {
                is_help_content ?
                    <HelpBase block_nodes={block_nodes} /> :
                    Object.keys(flyout_content).map((key, index) => {
                        const nodes = flyout_content[key];
                        const node = nodes[0];
                        const tag_name = node.tagName.toUpperCase();

                        switch (tag_name) {
                            case Blockly.Xml.NODE_BLOCK: {
                                const block_type = node.getAttribute('type');

                                return (
                                    <FlyoutBlockGroup
                                        key={node.getAttribute('type') + Math.random()}
                                        id={`flyout__item-workspace--${index}`}
                                        block_nodes={nodes}
                                        onInfoClick={
                                            config[block_type]
                                            && (() => showHelpContent(nodes))
                                        }
                                    />
                                );
                            }
                            case Blockly.Xml.NODE_LABEL:
                                return (
                                    <div
                                        key={node.getAttribute('text') + index}
                                        className='flyout__item-label'
                                    >
                                        {node.getAttribute('text')}
                                    </div>
                                );
                            case Blockly.Xml.NODE_BUTTON: {
                                const callback_key = node.getAttribute('callbackKey');
                                const callback = Blockly.derivWorkspace.getButtonCallback(callback_key) || (() => { });

                                return (
                                    <button
                                        key={`${callback_key}${index}`}
                                        className={
                                            classNames(
                                                'flyout__button',
                                                'flyout__button-new'
                                            )
                                        }
                                        onClick={(button) => {
                                            const flyout_button = button;

                                            // Workaround for not having a flyout workspace.
                                            // eslint-disable-next-line no-underscore-dangle
                                            flyout_button.targetWorkspace_ = Blockly.derivWorkspace;
                                            // eslint-disable-next-line no-underscore-dangle
                                            flyout_button.getTargetWorkspace = () => flyout_button.targetWorkspace_;

                                            callback(flyout_button);
                                        }}
                                    >
                                        {node.getAttribute('text')}
                                    </button>
                                );
                            }
                            default:
                                return null;
                        }
                    })
            }
        </div>
    );
};

Flyout.propTypes = {
    block_nodes     : PropTypes.array,
    flyout_content  : PropTypes.any,
    flyout_width    : PropTypes.number,
    is_help_content : PropTypes.bool,
    is_search_flyout: PropTypes.bool,
    is_visible      : PropTypes.bool,
    showHelpContent : PropTypes.func,
};

export default connect(({ flyout }) => ({
    is_help_content : flyout.is_help_content,
    block_nodes     : flyout.block_nodes,
    flyout_content  : flyout.flyout_content,
    flyout_width    : flyout.flyout_width,
    is_visible      : flyout.is_visible,
    is_search_flyout: flyout.is_search_flyout,
    showHelpContent : flyout.showHelpContent,
}))(Flyout);

