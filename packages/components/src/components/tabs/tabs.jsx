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
    }

    render() {
        const { children, className, top, bottom, fit_content } = this.props;
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
                    {children.map((child, index) => {
                        const { count, label, id } = child.props;

                        return (
                            <Tab
                                id={id}
                                count={count}
                                is_active={index === active_index}
                                key={label}
                                label={label}
                                top={top}
                                bottom={bottom}
                                onClick={() => this.onTabItemClick(index)}
                            />
                        );
                    })}
                    <span
                        className={classNames('dc-tabs__active-line', {
                            'dc-tabs__active-line--top': top,
                            'dc-tabs__active-line--bottom': bottom,
                            'dc-tabs__active-line--fit-content': fit_content,
                        })}
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
