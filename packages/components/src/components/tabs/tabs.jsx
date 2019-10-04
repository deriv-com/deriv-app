import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import Tab                  from './tab.jsx';

class Tabs extends Component {
    constructor(props) {
        super(props);

        this.state = { active_index: props.active_index || 0 };
    }

    onClickTabItem = index => {
        this.setState({ active_index: index });

        if (typeof this.props.onClickTabItem === 'function') {
            this.props.onClickTabItem(index);
        }
    };

    componentDidUpdate(prev_props, prev_state) {
        if (this.props.active_index && prev_state.active_index !== this.props.active_index) {
            this.setState({ active_index: this.props.active_index || 0 });
        }
    }

    render() {
        const { children }     = this.props;
        const { active_index } = this.state;
        const tab_width        = (100 / children.length).toFixed(2);

        return (
            <div className='dc-tabs' style={{ '--tab-width': `${tab_width}%` }}>
                <ul className='dc-tabs__list'>
                    {children.map((child, index) => {
                        const { label } = child.props;

                        return (
                            <Tab
                                is_active={index === active_index}
                                key={label}
                                label={label}
                                onClick={() => this.onClickTabItem(index)}
                            />
                        );
                    })}
                    <span className='dc-tabs__active-line' />
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
