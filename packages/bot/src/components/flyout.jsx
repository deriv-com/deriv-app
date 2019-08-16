import React from 'react';
import PropTypes from 'prop-types';
import FlyoutBlock from './flyout-block.jsx';
import { connect } from '../stores/connect';
import { translate } from '../utils/lang/i18n';
import '../assets/sass/scratch/flyout.scss';

const Flyout = ({
    flyout_content,
    flyout_width,
    is_visible,
    showHelpContent,
}) => {
    return (
        <div
            className={`flyout${!is_visible ? ' hidden' : ''}`}
            style={{ width: `${flyout_width}px` }}
        >
            {
                React.isValidElement(flyout_content) ?
                    flyout_content :
                    Object.keys(flyout_content).map((key, index) => {
                        const nodes = flyout_content[key];
                        const node = nodes[0];
                        const tag_name = node.tagName.toUpperCase();

                        switch (tag_name) {
                            case Blockly.Xml.NODE_BLOCK: {
                                const block_type = node.getAttribute('type');
                                return (
                                    <FlyoutBlock
                                        key={`${block_type} ${Math.random()}`}
                                        id={`flyout__item-workspace--${index}`}
                                        block_node={nodes}
                                        onInfoClick={
                                            Blockly.Blocks[block_type].helpContent
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
                                        className='flyout__button'
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
                                return <div>{translate('Something went wrong')}</div>;
                        }
                    })
            }
        </div>
    );
};

Flyout.propTypes = {
    flyout_content : PropTypes.array,
    flyout_width   : PropTypes.number,
    is_visible     : PropTypes.bool,
    showHelpContent: PropTypes.func,
};

export default connect(({ flyout }) => ({
    flyout_content : flyout.flyout_content,
    flyout_width   : flyout.flyout_width,
    is_visible     : flyout.is_visible,
    showHelpContent: flyout.showHelpContent,
}))(Flyout);

