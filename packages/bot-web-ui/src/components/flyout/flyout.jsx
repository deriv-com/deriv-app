import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { localize } from '@deriv/translations';
import { getPlatformSettings } from '@deriv/shared';
import { Icon, ThemedScrollbars, Input, Text } from '@deriv/components';
import { help_content_config } from 'Utils/help-content/help-content.config';
import { connect } from 'Stores/connect';
import FlyoutBlockGroup from './flyout-block-group.jsx';
import HelpBase from './help-contents';

const SearchResult = ({ search_term, total_result }) => (
    <div className='flyout__search-header'>
        <Text weight='bold' className='flyout__search-header-text'>
            {localize('Results for "{{ search_term }}"', {
                search_term,
                interpolation: { escapeValue: false },
            })}
        </Text>
        <Text weight='bold' color='profit-success' className='flyout__search-header-text'>
            {`${total_result} ${total_result > 1 ? localize('results') : localize('result')}`}
        </Text>
    </div>
);

const FlyoutContent = props => {
    const flyout_ref = React.useRef();
    const {
        flyout_content,
        active_helper,
        setHelpContent,
        initFlyoutHelp,
        is_empty,
        is_search_flyout,
        selected_category,
        first_get_variable_block_index,
    } = props;

    React.useEffect(() => {
        flyout_ref.current.scrollTop = 0;
    }, [selected_category]);

    React.useEffect(() => {
        const view = flyout_ref.current.querySelector('.flyout__item--active');
        if (view) {
            view.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    }, [active_helper]);

    return (
        <div
            ref={flyout_ref}
            className={classNames('flyout__content', { 'flyout__normal-content': !is_search_flyout })}
        >
            <ThemedScrollbars className='flyout__content-scrollbar'>
                {selected_category?.getAttribute('id') === 'indicators' && (
                    <div className='flyout__content-disclaimer'>
                        <span className='flyout__content-disclaimer-icon'>
                            <Icon
                                icon='IcBlackWarning'
                                custom_color='#000000'
                                className='flyout__content-disclaimer__warning-icon'
                            />
                        </span>
                        <span className='flyout__content-disclaimer-text'>
                            {localize(
                                'Indicators on the chart tab are for indicative purposes only and may vary slightly from the ones on the {{platform_name_dbot}} workspace.',
                                { platform_name_dbot: getPlatformSettings('dbot').name }
                            )}
                        </span>
                    </div>
                )}
                {is_empty ? (
                    <div className='flyout__search-empty'>
                        <Text as='h2' weight='bold' line_height='xxs'>
                            {localize('No results found')}
                        </Text>
                    </div>
                ) : (
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
                                        should_hide_display_name={
                                            block_type === 'variables_get'
                                                ? index !== first_get_variable_block_index
                                                : false
                                        }
                                        onInfoClick={
                                            help_content_config(__webpack_public_path__)[block_type] &&
                                            (is_search_flyout
                                                ? () => setHelpContent(node)
                                                : () => initFlyoutHelp(node, block_type))
                                        }
                                        is_active={active_helper === block_type}
                                    />
                                );
                            }
                            case Blockly.Xml.NODE_LABEL: {
                                return (
                                    <div
                                        key={`${node.getAttribute('text')}${index}`}
                                        className='flyout__item-label-bold'
                                    >
                                        {node.getAttribute('text')}
                                    </div>
                                );
                            }
                            case Blockly.Xml.NODE_INPUT: {
                                return (
                                    <Input
                                        key={`${node.getAttribute('name')}${index}`}
                                        className={`${node.getAttribute('className')}`}
                                        type={`${node.getAttribute('type')}`}
                                        name={`${node.getAttribute('name')}`}
                                        placeholder={`${node.getAttribute('placeholder')}`}
                                        autoComplete='off'
                                    />
                                );
                            }
                            case Blockly.Xml.NODE_BUTTON: {
                                const callback_key = node.getAttribute('callbackKey');
                                const callback_id = node.getAttribute('id');

                                return (
                                    <button
                                        id={callback_id}
                                        key={`${callback_key}${index}`}
                                        className={classNames(
                                            'dc-btn',
                                            'dc-btn-effect',
                                            'dc-btn--primary',
                                            `${node.getAttribute('className')}`
                                        )}
                                        onClick={button => {
                                            const workspace = Blockly.derivWorkspace;
                                            const button_cb = workspace.getButtonCallback(callback_key);
                                            const callback = button_cb || (() => {});

                                            // Workaround for not having a flyout workspace.
                                            // eslint-disable-next-line no-underscore-dangle
                                            button.targetWorkspace_ = workspace;
                                            button.getTargetWorkspace = () => {
                                                // eslint-disable-next-line no-underscore-dangle
                                                return button.targetWorkspace_;
                                            };

                                            callback(button);
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
                )}
            </ThemedScrollbars>
        </div>
    );
};

const Flyout = props => {
    const {
        flyout_content,
        flyout_width,
        is_help_content,
        is_search_flyout,
        is_visible,
        onMount,
        onUnmount,
        pushDataLayer,
        search_term,
    } = props;

    React.useEffect(() => {
        onMount();
        return () => onUnmount();
    }, [onMount, onUnmount]);

    if (is_visible && is_search_flyout) {
        pushDataLayer({ event: 'dbot_search_results', value: true });
    }

    const total_result = Object.keys(flyout_content).length;
    const is_empty = total_result === 0;

    return (
        is_visible && (
            <div
                id='gtm-search-results'
                className={classNames('flyout', {
                    flyout__search: is_search_flyout,
                    flyout__help: is_help_content,
                    flyout__normal: !is_help_content && !is_search_flyout,
                })}
                style={{ width: `${flyout_width}px` }}
            >
                {is_search_flyout && !is_help_content && (
                    <SearchResult search_term={search_term} total_result={total_result} />
                )}
                {is_help_content ? <HelpBase /> : <FlyoutContent is_empty={is_empty} {...props} />}
            </div>
        )
    );
};

Flyout.propTypes = {
    active_helper: PropTypes.string,
    flyout_content: PropTypes.any,
    flyout_width: PropTypes.number,
    initFlyoutHelp: PropTypes.func,
    is_help_content: PropTypes.bool,
    is_search_flyout: PropTypes.bool,
    is_visible: PropTypes.bool,
    onMount: PropTypes.func,
    onUnmount: PropTypes.func,
    setActiveHelper: PropTypes.func,
    search_term: PropTypes.string,
    setHelpContent: PropTypes.func,
    selected_category: PropTypes.object,
    first_get_variable_block_index: PropTypes.number,
};

export default connect(({ flyout, flyout_help, gtm }) => ({
    active_helper: flyout_help.active_helper,
    pushDataLayer: gtm.pushDataLayer,
    flyout_content: flyout.flyout_content,
    flyout_width: flyout.flyout_width,
    initFlyoutHelp: flyout_help.initFlyoutHelp,
    is_help_content: flyout.is_help_content,
    is_search_flyout: flyout.is_search_flyout,
    is_visible: flyout.is_visible,
    onMount: flyout.onMount,
    onUnmount: flyout.onUnmount,
    setActiveHelper: flyout_help.setActiveHelper,
    search_term: flyout.search_term,
    setHelpContent: flyout_help.setHelpContent,
    selected_category: flyout.selected_category,
    first_get_variable_block_index: flyout.first_get_variable_block_index,
}))(Flyout);
