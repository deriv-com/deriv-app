import classNames           from 'classnames';
import React                from 'react';
import PropTypes            from 'prop-types';
import FlyoutBlockGroup     from './flyout-block-group.jsx';
import HelpBase             from '../scratch/help-content/flyout-help-base.jsx';
import { config }           from '../scratch/help-content/help-content.config';
import { connect }          from '../stores/connect';
import { translate }        from '../utils/lang/i18n';
import                           '../assets/sass/scratch/flyout.scss';

<<<<<<< HEAD
class Flyout extends React.PureComponent {
    componentDidMount() {
        this.props.onMount();
    }

    componentWillUnmount() {
        this.props.onUnmount();
    }

    render() {
        const {
            is_help_content,
            is_search_flyout,
            block_nodes,
            flyout_content,
            flyout_width,
            is_visible,
            showHelpContent,
        } = this.props;

        return (
            <div
                className={classNames(
                    'flyout', {
                        'hidden'         : !is_visible,
                        'flyout__search' : is_search_flyout,
                        'flyout__help'   : is_help_content,
                        'flyout__content': !is_help_content,
                    },
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
                                    const cb_key = node.getAttribute('callbackKey');
                                    const callback = Blockly.derivWorkspace.getButtonCallback(cb_key) || (() => {});
    
                                    return (
                                        <button
                                            key={`${cb_key}${index}`}
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
    }
}
=======
const Flyout = ({
    is_help_content,
    is_search_flyout,
    flyout_content,
    flyout_width,
    is_visible,
    search_term,
    setHelpContent,
}) => {
    const total_result = Object.keys(flyout_content).length;
    const is_empty = total_result === 0;

    return (
        <div
            className={classNames(
                'flyout', {
                    'hidden'        : !is_visible,
                    'flyout__search': is_search_flyout,
                    'flyout__help'  : is_help_content,
                    'flyout__normal': !is_help_content && !is_search_flyout,
                },
            )
            }
            style={{ width: `${flyout_width}px` }}
        >
            {
                is_search_flyout && !is_help_content && (
                    <div className='flyout__search-header'>
                        <span className='flyout__search-header-text'>
                            {translate(`Results for "${search_term}"`)}
                        </span>
                        <span className={classNames(
                            'flyout__search-header-text',
                            'flyout__search-header-results',
                        )}
                        >{`${total_result} ${total_result > 1 ? translate('results') : translate('result')}`}
                        </span>
                    </div>
                )
            }
            {
                is_help_content ?
                    <HelpBase /> :
                    <div className={classNames(
                        'flyout__content',
                        { 'flyout__normal-content': !is_search_flyout }
                    )}
                    >
                        {
                            is_empty ?
                                <div className='flyout__search-empty'>
                                    <h2>{translate('No results found')}</h2>
                                </div> :
                                flyout_content.map((node, index) => {
                                    const tag_name = node.tagName.toUpperCase();

                                    switch (tag_name) {
                                        case Blockly.Xml.NODE_BLOCK: {
                                            const block_type = node.getAttribute('type');

                                            return (
                                                <FlyoutBlockGroup
                                                    key={`${node.getAttribute('type')}${Date.now()}`}
                                                    id={`flyout__item-workspace--${index}`}
                                                    block_node={node}
                                                    onInfoClick={
                                                        config[block_type]
                                                    && (() => setHelpContent(node))
                                                    }
                                                />
                                            );
                                        }
                                        case Blockly.Xml.NODE_LABEL: {
                                            return (
                                                <div
                                                    key={`${node.getAttribute('text')}${index}`}
                                                    className='flyout__item-label'
                                                >
                                                    {node.getAttribute('text')}
                                                </div>
                                            );
                                        }
                                        case Blockly.Xml.NODE_BUTTON: {
                                            const callback_key = node.getAttribute('callbackKey');
                                            const callback =
                                        Blockly.derivWorkspace.getButtonCallback(callback_key) || (() => { });

                                            return (
                                                <button
                                                    key={`${callback_key}${index}`}
                                                    className={
                                                        classNames(
                                                            'btn',
                                                            'btn-effect',
                                                            'btn--primary',
                                                            'flyout__button-new'
                                                        )
                                                    }
                                                    onClick={(button) => {
                                                        const flyout_button = button;

                                                        // Workaround for not having a flyout workspace.
                                                        // eslint-disable-next-line no-underscore-dangle
                                                        flyout_button.targetWorkspace_ = Blockly.derivWorkspace;
                                                        // eslint-disable-next-line no-underscore-dangle
                                                        flyout_button.getTargetWorkspace =
                                                    () => flyout_button.targetWorkspace_;

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
            }
        </div>
    );
};
>>>>>>> 4568c9820d850fc4eb7172946c204e7d2d510e5d

Flyout.propTypes = {
    flyout_content  : PropTypes.any,
    flyout_width    : PropTypes.number,
    is_help_content : PropTypes.bool,
    is_search_flyout: PropTypes.bool,
    is_visible      : PropTypes.bool,
<<<<<<< HEAD
    onMount         : PropTypes.func,
    onUnmount       : PropTypes.func,
    showHelpContent : PropTypes.func,
=======
    search_term     : PropTypes.string,
    setHelpContent  : PropTypes.func,
>>>>>>> 4568c9820d850fc4eb7172946c204e7d2d510e5d
};

export default connect(({ flyout, flyout_help }) => ({
    flyout_content  : flyout.flyout_content,
    flyout_width    : flyout.flyout_width,
    is_help_content : flyout.is_help_content,
    is_search_flyout: flyout.is_search_flyout,
<<<<<<< HEAD
    is_visible      : flyout.is_visible,
    onMount         : flyout.onMount,
    onUnmount       : flyout.onUnmount,
    showHelpContent : flyout.showHelpContent,
=======
    search_term     : flyout.search_term,
    setHelpContent  : flyout_help.setHelpContent,
>>>>>>> 4568c9820d850fc4eb7172946c204e7d2d510e5d
}))(Flyout);

