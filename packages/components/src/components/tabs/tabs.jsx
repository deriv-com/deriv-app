import classNames from 'classnames';
import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Tab from './tab.jsx';

class Tabs extends React.Component {
    constructor(props) {
        super(props);

        // if hash is in url, find which tab index correlates to it
        const hash = this.props.location.hash.slice(1);
        const hash_index = props.children.findIndex(child => child.props && child.props['data-hash'] === hash);
        const has_hash = hash_index > -1;

        // set active index to:
        // 1. hash, if present
        // 2. active_index prop, if present
        // 3. default to first tab
        const index_to_show = has_hash ? hash_index : props.active_index || 0;

        // if no hash is in url but component has passed data-hash prop, set hash of the tab shown
        if (!has_hash) {
            const child_props = props.children[index_to_show].props;
            const current_id = child_props && child_props['data-hash'];
            if (current_id) {
                this.updateUrl(current_id);
            }
        }

        this.state = { active_index: index_to_show };
    }

    // Change url hash
    updateUrl = hash => {
        this.props.history.push({ hash });
    };

    onTabItemClick = (index, id) => {
        this.setState({ active_index: index });
        if (id && this.props.location.hash.slice(1) !== id) {
            this.updateUrl(id);
        }
    };

    componentDidUpdate(prev_props, prev_state) {
        if (this.props.active_index !== -1 && prev_state.active_index !== this.state.active_index) {
            this.setState({ active_index: this.state.active_index || 0 });

            if (typeof this.props.onTabItemClick === 'function') {
                this.props.onTabItemClick(this.state.active_index);
            }
        }
        if (this.props.active_index !== prev_props.active_index) {
            this.setState({ active_index: this.props.active_index });
        }
        if (this.props.should_delay_render !== prev_props.should_delay_render && this.props.should_delay_render) {
            this.setActiveLineStyle();
        }
    }

    setActiveLineStyle = () => {
        if (this.props.header_fit_content && this.active_tab_ref && this.tabs_wrapper_ref) {
            const tabs_wrapper_bounds = this.tabs_wrapper_ref.getBoundingClientRect();
            const active_tab_bounds = this.active_tab_ref.getBoundingClientRect();
            if (active_tab_bounds.width === 0) {
                setTimeout(() => {
                    this.setActiveLineStyle();
                }, 500);
            } else {
                this.setState({
                    active_line_style: {
                        left: active_tab_bounds.left - tabs_wrapper_bounds.left,
                        width: active_tab_bounds.width,
                    },
                });
            }
        }
    };

    setActiveTabRef = ref => {
        this.active_tab_ref = ref;
        this.setActiveLineStyle();
    };

    setTabsWrapperRef = ref => {
        this.tabs_wrapper_ref = ref;
        this.setActiveLineStyle();
    };

    render() {
        const {
            children,
            className,
            top,
            bottom,
            center,
            fit_content,
            header_fit_content,
            single_tab_has_no_label,
        } = this.props;
        const { active_index } = this.state;
        const tab_width = fit_content ? '150px' : `${(100 / children.length).toFixed(2)}%`;

        return (
            <div
                className={classNames('dc-tabs', {
                    [`dc-tabs dc-tabs--${className}`]: className,
                })}
                style={{ '--tab-width': `${tab_width}` }}
            >
                <ul
                    className={classNames('dc-tabs__list', {
                        'dc-tabs__list--top': top,
                        'dc-tabs__list--bottom': bottom,
                        'dc-tabs__list--center': center,
                        'dc-tabs__list--header-fit-content': header_fit_content,
                    })}
                    ref={this.setTabsWrapperRef}
                >
                    {React.Children.map(children, (child, index) => {
                        if (!child) return null;
                        const { count, header_content, label } = child.props;
                        const data_hash = child.props && child.props['data-hash'];

                        return (
                            <Tab
                                count={count}
                                is_active={index === active_index}
                                key={label}
                                is_label_hidden={children.length === 1 && single_tab_has_no_label}
                                label={label}
                                top={top}
                                bottom={bottom}
                                header_fit_content={header_fit_content}
                                active_tab_ref={index === active_index ? this.setActiveTabRef : null}
                                header_content={header_content}
                                onClick={() => this.onTabItemClick(index, data_hash)}
                                setActiveLineStyle={this.setActiveLineStyle}
                            />
                        );
                    })}
                    <span
                        className={classNames('dc-tabs__active-line', {
                            'dc-tabs__active-line--top': top,
                            'dc-tabs__active-line--bottom': bottom,
                            'dc-tabs__active-line--fit-content': fit_content,
                            'dc-tabs__active-line--header-fit-content': header_fit_content,
                            'dc-tabs__active-line--is-hidden': children.length === 1 && single_tab_has_no_label,
                        })}
                        style={this.state.active_line_style}
                    />
                </ul>
                <div className='dc-tabs__content'>
                    {React.Children.map(children, (child, index) => {
                        if (index !== active_index) {
                            return undefined;
                        }
                        return child.props.children;
                    })}
                </div>
            </div>
        );
    }
}

Tabs.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

export default withRouter(Tabs);
