import classNames           from 'classnames';
import React                from 'react';
import PropTypes            from 'prop-types';
import { localize }         from 'deriv-translations';
import FlyoutBlockGroup     from './flyout-block-group.jsx';
import HelpBase             from '../scratch/help-content/flyout-help-base.jsx';
import { config }           from '../scratch/help-content/help-content.config';
import { connect }          from '../stores/connect';
import                           '../assets/sass/scratch/flyout.scss';

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
            flyout_content,
            flyout_width,
            is_visible,
            search_term,
            setHelpContent } = this.props;
        const total_result   = Object.keys(flyout_content).length;
        const is_empty       = total_result === 0;

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
                                {localize(`Results for "${search_term}"`)}
                            </span>
                            <span className={classNames(
                                'flyout__search-header-text',
                                'flyout__search-header-results',
                            )}
                            >{`${total_result} ${total_result > 1 ? localize('results') : localize('result')}`}
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
                                        <h2>{localize('No results found')}</h2>
                                    </div> :
                                    flyout_content.map((node, index) => {
                                        const tag_name = node.tagName.toUpperCase();

                                        switch (tag_name) {
                                            case Blockly.Xml.NODE_BLOCK: {
                                                const block_type = node.getAttribute('type');

                                                return (
                                                    <FlyoutBlockGroup
                                                        key={`${node.getAttribute('type')}${Blockly.utils.genUid()}`}
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
                                                const cb_key    = node.getAttribute('callbackKey');
                                                const button_cb = Blockly.derivWorkspace.getButtonCallback(cb_key);
                                                const callback  = button_cb || (() => {});

                                                return (
                                                    <button
                                                        key={`${cb_key}${index}`}
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
                                                            flyout_button.getTargetWorkspace = () => {
                                                                // eslint-disable-next-line no-underscore-dangle
                                                                return flyout_button.targetWorkspace_;
                                                            };

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
    }
}

Flyout.propTypes = {
    flyout_content  : PropTypes.any,
    flyout_width    : PropTypes.number,
    is_help_content : PropTypes.bool,
    is_search_flyout: PropTypes.bool,
    is_visible      : PropTypes.bool,
    onMount         : PropTypes.func,
    onUnmount       : PropTypes.func,
    search_term     : PropTypes.string,
    setHelpContent  : PropTypes.func,
};

export default connect(({ flyout, flyout_help }) => ({
    flyout_content  : flyout.flyout_content,
    flyout_width    : flyout.flyout_width,
    is_help_content : flyout.is_help_content,
    is_search_flyout: flyout.is_search_flyout,
    is_visible      : flyout.is_visible,
    onMount         : flyout.onMount,
    onUnmount       : flyout.onUnmount,
    search_term     : flyout.search_term,
    setHelpContent  : flyout_help.setHelpContent,
}))(Flyout);
