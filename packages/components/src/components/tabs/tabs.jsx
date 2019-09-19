import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import Tab                  from './tab.jsx';

class Tabs extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: this.props.children[0].props.label,
        };
    }

    onClickTabItem = tab => {
        this.setState({ activeTab: tab });
    };

    render() {
        const {
            onClickTabItem,
            props: { children },
            state: { activeTab },
        } = this;
  
        const tab_width = (100 / children.length).toFixed(2);

        return (
            <div className='dc-tabs' style={{ '--tab-width': `${tab_width}%` }}>
                <ul className='dc-tabs__list'>
                    {children.map((child) => {
                        const { label } = child.props;

                        return (
                            <Tab
                                activeTab={activeTab}
                                key={label}
                                label={label}
                                onClick={onClickTabItem}
                            />
                        );
                    })}
                    <span className='dc-tabs__active-line' />
                </ul>
                <div className='dc-tabs__content'>
                    {children.map((child) => {
                        if (child.props.label !== activeTab) return undefined;
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
