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

class VerticalTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = { vertical_tab_index: props.vertical_tab_index || 0 };
    }

    setSelectedIndex = ({ list, selected_index, is_routed, current_path }) => {
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

        this.setState({ vertical_tab_index: index });

        if (typeof this.props.setVerticalTabIndex === 'function') {
            this.props.setVerticalTabIndex(index);
        }
    };

    changeSelected = e => {
        this.setSelectedIndex({
            list: this.props.list,
            selected_index: e,
        });
    };

    componentDidMount() {
        this.setSelectedIndex(this.props);
    }

    componentDidUpdate(prevProps) {
        if (
            this.props.list.length !== prevProps.list.length ||
            this.props.vertical_tab_index !== prevProps.vertical_tab_index
        ) {
            this.setSelectedIndex({
                current_path: this.props.current_path,
                list: this.props.list,
                is_routed: this.props.is_routed,
            });
        }
    }

    render() {
        const selected = this.props.list[this.state.vertical_tab_index] || this.props.list[0];

        return (
            <div
                className={classNames('dc-vertical-tab', {
                    'dc-vertical-tab--floating': this.props.is_floating, // This is currently only configured for use in PageOverlay
                    'dc-vertical-tab--full-screen': this.props.is_full_width,
                    'dc-vertical-tab--grouped': Array.isArray(this.props.list_groups),
                })}
            >
                {this.props.is_sidebar_enabled && (
                    <div
                        className={classNames('dc-vertical-tab__tab-meta-wrapper', {
                            'dc-vertical-tab__tab-meta-wrapper--floating': this.props.is_floating,
                        })}
                    >
                        <VerticalTabHeaders
                            className={this.props.header_classname}
                            items={this.props.list}
                            item_groups={this.props.list_groups}
                            onChange={this.changeSelected}
                            selected={selected}
                            is_floating={this.props.is_floating}
                            is_routed={this.props.is_routed}
                            header_title={this.props.header_title}
                            tab_headers_note={this.props.tab_headers_note}
                        />
                        {this.props.is_floating && this.props.tab_headers_note && (
                            <div className='dc-vertical-tab__tab-bottom-note'>{this.props.tab_headers_note}</div>
                        )}
                    </div>
                )}
                <VerticalTabContentContainer
                    action_bar={this.props.action_bar}
                    action_bar_classname={this.props.action_bar_classname}
                    is_floating={this.props.is_floating}
                    items={this.props.list}
                    selected={selected}
                    is_routed={this.props.is_routed}
                />
            </div>
        );
    }
}

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
