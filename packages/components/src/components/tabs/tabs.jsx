import classNames from 'classnames';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tab from './tab.jsx';

class Tabs extends Component {
    constructor(props) {
        super(props);

        this.state = { active_index: props.active_index || 0 };
    }

    onTabItemClick = index => {
        this.setState({ active_index: index });

        if (typeof this.props.onTabItemClick === 'function') {
            this.props.onTabItemClick(index);
        }
    };

    componentDidUpdate(prev_props, prev_state) {
        if (this.props.active_index && prev_state.active_index !== this.props.active_index) {
            this.setState({ active_index: this.props.active_index || 0 });
        }
    }

    setActiveLineStyle = () => {
        if (this.props.header_fit_content && this.active_tab_ref && this.tabs_wrapper_ref) {
            const tabs_wrapper_bounds = this.tabs_wrapper_ref.getBoundingClientRect();
            const active_tab_bounds = this.active_tab_ref.getBoundingClientRect();
            this.setState({
                active_line_style: {
                    left: active_tab_bounds.left - tabs_wrapper_bounds.left,
                    width: active_tab_bounds.width,
                },
            });
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
        const { children, className, top, bottom, fit_content, header_fit_content } = this.props;
        const { active_index } = this.state;
        const tab_width = (100 / children.length).toFixed(2);

        return (
            <div
                className={classNames('dc-tabs', {
                    [`dc-tabs dc-tabs--${className}`]: className,
                })}
                style={{ '--tab-width': `${tab_width}%` }}
            >
                <ul
                    className={classNames('dc-tabs__list', {
                        'dc-tabs__list--top': top,
                        'dc-tabs__list--bottom': bottom,
                        'dc-tabs__list--fit-content': fit_content,
                        'dc-tabs__list--header-fit-content': header_fit_content,
                    })}
                    ref={this.setTabsWrapperRef}
                >
                    {children.map((child, index) => {
                        const { count, label } = child.props;

                        return (
                            <Tab
                                count={count}
                                is_active={index === active_index}
                                key={label}
                                label={label}
                                top={top}
                                bottom={bottom}
                                header_fit_content={header_fit_content}
                                active_tab_ref={index === active_index ? this.setActiveTabRef : null}
                                onClick={() => this.onTabItemClick(index)}
                            />
                        );
                    })}
                    <span
                        className={classNames('dc-tabs__active-line', {
                            'dc-tabs__active-line--top': top,
                            'dc-tabs__active-line--bottom': bottom,
                            'dc-tabs__active-line--fit-content': fit_content,
                            'dc-tabs__active-line--header-fit-content': header_fit_content,
                        })}
                        style={this.state.active_line_style}
                    />
                </ul>
                <div className='dc-tabs__content'>
                    {children.map((child, index) => {
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
    children: PropTypes.instanceOf(Array),
};

export default Tabs;
