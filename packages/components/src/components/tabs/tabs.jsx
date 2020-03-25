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
    }

    render() {
        const { children, className, top, bottom, fit_content, single_tab_has_no_label } = this.props;
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
                    })}
                >
                    {React.Children.map(children, (child, index) => {
                        const { count, header_content, label } = child.props;

                        return (
                            <Tab
                                count={count}
                                is_active={index === active_index}
                                key={label}
                                is_label_hidden={children.length === 1 && single_tab_has_no_label}
                                label={label}
                                top={top}
                                bottom={bottom}
                                header_content={header_content}
                                onClick={() => this.onTabItemClick(index)}
                            />
                        );
                    })}
                    <span
                        className={classNames('dc-tabs__active-line', {
                            'dc-tabs__active-line--top': top,
                            'dc-tabs__active-line--bottom': bottom,
                            'dc-tabs__active-line--fit-content': fit_content,
                            'dc-tabs__active-line--is-hidden': children.length === 1 && single_tab_has_no_label,
                        })}
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

export default Tabs;
