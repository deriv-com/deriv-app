import classNames      from 'classnames';
import React           from 'react';
import PropTypes       from 'prop-types';
import { TabsWrapper } from './tabs-wrapper.jsx';

class Tabs extends React.PureComponent {
    state = {
        active_tab_index: '1',
    };

    setActiveTab = (index) => {
        this.setState({ active_tab_index: index });
    };

    render() {
        const TabContents = this.props.list[this.state.active_tab_index].content;
        const tab_container_class = classNames('tab-container', `tab-container--${this.props.alignment}`);
        const tab_header_class = (icon_name) => classNames(
            this.props.classNameHeader,
            'tab__header',
            { 'tab__icon': icon_name },
            icon_name,
        );

        return (
            <div className={tab_container_class}>
                <TabsWrapper
                    active={this.state.active_tab_index}
                    onChange={active => this.setActiveTab(active)}
                >
                    {
                        Object.keys(this.props.list).map(key => (
                            <React.Fragment key={key}>
                                <span
                                    className={tab_header_class(this.props.list[key].icon)}
                                    title={this.props.list[key].header}
                                >
                                    {this.props.list[key].header}
                                </span>
                            </React.Fragment>
                        ))
                    }
                </TabsWrapper>
                <TabContents />
            </div>
        );
    }
}

Tabs.propTypes = {
    alignment      : PropTypes.string,
    classNameHeader: PropTypes.string,
    list           : PropTypes.shape({
        header: PropTypes.string,
        icon  : PropTypes.string,
    }),
};

export { Tabs };
