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

  onClickTabItem = (tab) => {
      this.setState({ activeTab: tab });
  }

  render() {
      const {
          children,
      } = this.props;

      return (
          <div className='dc-tabs'>
              <ol className='dc-tabs__list'>
                  {children.map((child) => {
                      const { label } = child.props;

                      return (
                          <Tab
                              activeTab={this.state.activeTab}
                              key={label}
                              label={label}
                              onClick={this.onClickTabItem}
                          />
                      );
                  })}
              </ol>
              <div className='dc-tabs__content'>
                  {children.map((child) => {
                      if (child.props.label !== this.state.activeTab) return undefined;
                      return child.props.children;
                  })}
              </div>
          </div>
      );
  }
}

Tabs.PropTypes = {
    children: PropTypes.instanceOf(Array),
};

export default Tabs;
