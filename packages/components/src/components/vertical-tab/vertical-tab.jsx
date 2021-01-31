import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import VerticalTabContentContainer from './vertical-tab-content-container.jsx';
import VerticalTabHeader from './vertical-tab-header.jsx';
import VerticalTabHeaderGroup from './vertical-tab-header-group.jsx';
import VerticalTabHeaders from './vertical-tab-headers.jsx';
import VerticalTabHeaderTitle from './vertical-tab-header-title.jsx';
import VerticalTabLayout from './vertical-tab-layout.jsx';
import VerticalTabWrapper from './vertical-tab-wrapper.jsx';

const setSelectedIndex = ({ current_path, list, is_routed, selected_index, setCurrTabIndex, setVerticalTabIndex }) => {
    let index;
    if (typeof selected_index === 'undefined') {
        index = is_routed
            ? Math.max(
                  list.indexOf(list.find(item => item.path === current_path) || list.find(item => item.default)),
                  0
              )
            : 0;
    } else {
        index = typeof selected_index === 'object' ? list.indexOf(selected_index) : selected_index;
    }

    setCurrTabIndex(index);

    if (typeof setVerticalTabIndex === 'function') {
        setVerticalTabIndex(index);
    }
};

const VerticalTab = ({
    action_bar,
    action_bar_classname,
    current_path,
    extra_offset,
    has_mixed_dimensions,
    header_classname,
    header_title,
    is_collapsible,
    is_floating,
    is_full_width,
    is_routed,
    is_sidebar_enabled,
    list,
    list_groups,
    setVerticalTabIndex,
    tab_headers_note,
    vertical_tab_index,
}) => {
    const [curr_tab_index, setCurrTabIndex] = React.useState(vertical_tab_index || 0);

    const changeSelected = e => {
        setSelectedIndex({
            list,
            selected_index: e,
            setCurrTabIndex,
            setVerticalTabIndex,
        });
    };

    React.useEffect(() => {
        setSelectedIndex({
            current_path,
            list,
            is_routed,
            setCurrTabIndex,
            setVerticalTabIndex,
        });
    }, [vertical_tab_index, list]);

    return (
        <div
            className={classNames('dc-vertical-tab', {
                'dc-vertical-tab--floating': is_floating, // This is currently only configured for use in PageOverlay
                'dc-vertical-tab--full-screen': is_full_width,
                'dc-vertical-tab--grouped': Array.isArray(list_groups),
            })}
        >
            {is_sidebar_enabled && (
                <div
                    className={classNames('dc-vertical-tab__tab-meta-wrapper', {
                        'dc-vertical-tab__tab-meta-wrapper--floating': is_floating,
                    })}
                >
                    <VerticalTabHeaders
                        className={header_classname}
                        extra_offset={extra_offset}
                        items={list}
                        item_groups={list_groups}
                        onChange={changeSelected}
                        selected={list[curr_tab_index] || list[0]}
                        has_mixed_dimensions={has_mixed_dimensions}
                        is_collapsible={is_collapsible}
                        is_floating={is_floating}
                        is_routed={is_routed}
                        header_title={header_title}
                        tab_headers_note={tab_headers_note}
                    />
                    {is_floating && tab_headers_note && (
                        <div className='dc-vertical-tab__tab-bottom-note'>{tab_headers_note}</div>
                    )}
                </div>
            )}
            <VerticalTabContentContainer
                action_bar={action_bar}
                action_bar_classname={action_bar_classname}
                is_floating={is_floating}
                items={list}
                selected={list[curr_tab_index] || list[0]}
                is_routed={is_routed}
            />
        </div>
    );
};

VerticalTab.defaultProps = {
    is_sidebar_enabled: true,
};

VerticalTab.propTypes = {
    action_bar: PropTypes.arrayOf(
        PropTypes.shape({
            component: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
            icon: PropTypes.string,
            onClick: PropTypes.func,
            title: PropTypes.string,
        })
    ),
    action_bar_classname: PropTypes.string,
    current_path: PropTypes.string,
    header_classname: PropTypes.string,
    header_title: PropTypes.string,
    is_floating: PropTypes.bool,
    is_full_width: PropTypes.bool,
    is_routed: PropTypes.bool,
    is_sidebar_enabled: PropTypes.bool,
    list: PropTypes.arrayOf(
        PropTypes.shape({
            default: PropTypes.bool,
            icon: PropTypes.string,
            label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
            path: PropTypes.string,
            value: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
        })
    ).isRequired,
    list_groups: PropTypes.arrayOf(
        PropTypes.shape({
            icon: PropTypes.string,
            label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
            subitems: PropTypes.arrayOf(PropTypes.number),
        })
    ),
    tab_headers_note: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    selected_index: PropTypes.number,
    setVerticalTabIndex: PropTypes.func,
    vertical_tab_index: PropTypes.number,
};

VerticalTab.ContentContainer = VerticalTabContentContainer;
VerticalTab.Header = VerticalTabHeader;
VerticalTab.HeaderGroup = VerticalTabHeaderGroup;
VerticalTab.Headers = VerticalTabHeaders;
VerticalTab.HeaderTitle = VerticalTabHeaderTitle;
VerticalTab.Layout = VerticalTabLayout;
VerticalTab.Wrapper = VerticalTabWrapper;

export default VerticalTab;
