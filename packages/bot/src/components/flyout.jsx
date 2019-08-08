import React            from 'react';
import PropTypes        from 'prop-types';
import FlyoutBlock      from './flyout-block.jsx';
import { connect }      from '../stores/connect';
import                       '../assets/sass/scratch/flyout.scss';

const Flyout = ({ is_visible, flyout_width, flyout_content }) => {
    return (
        <div
            className={`flyout${!is_visible ? ' hidden' : ''}`}
            style={{ width: `${flyout_width}px` }}
        >
            { flyout_content.map((node, index) => {
                const tag_name = node.tagName.toUpperCase();

                if (tag_name === Blockly.Xml.NODE_BLOCK) {
                    return (
                        <FlyoutBlock
                            key={node.getAttribute('type') + index}
                            id={`flyout__item-workspace--${index}`}
                            block_node={node}
                        />
                    );
                } else if (tag_name === Blockly.Xml.NODE_LABEL) {
                    return (
                        <div
                            key={node.getAttribute('text') + index}
                            className='flyout__item-label'
                        >
                            { node.getAttribute('text') }
                        </div>
                    );
                } else if (tag_name === Blockly.Xml.NODE_BUTTON) {
                    const callback_key = node.getAttribute('callbackKey');
                    const callback = Blockly.derivWorkspace.getButtonCallback(callback_key) || (() => {});

                    return (
                        <button
                            key={callback_key + index}
                            className='flyout__button'
                            onClick={(button) => {
                                const flyout_button = button;
    
                                // Workaround for not having a flyout workspace.
                                flyout_button.targetWorkspace_ = Blockly.derivWorkspace;
                                flyout_button.getTargetWorkspace = () => flyout_button.targetWorkspace_;
    
                                callback(flyout_button);
                            }}
                        >
                            { node.getAttribute('text') }
                        </button>
                    );
                }

                return null;
            }) }
        </div>
    );
};

Flyout.propTypes = {
    flyout_content: PropTypes.array,
    flyout_width  : PropTypes.number,
    is_visible    : PropTypes.bool,
};

export default connect(({ flyout }) => ({
    flyout_content: flyout.flyout_content,
    flyout_width  : flyout.flyout_width,
    is_visible    : flyout.is_visible,
}))(Flyout);

