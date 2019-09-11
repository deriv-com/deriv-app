import classNames       from 'classnames';
import React            from 'react';
import Icon             from 'Assets/icon.jsx';
import {
    VerticalTabHeaders,
    VerticalTabWrapper,
    VerticalTabHeader } from '../VerticalTabs';

class MenuAccordionHeaders extends React.PureComponent {
    state = {
        [this.props.items[0].title]: true,
    }

    handleAccordion = (selected) => {
        this.setState({
            [selected.title]: !this.state[selected.title],
        });
    }

    render() {
        const { onChange, selected, items } = this.props;

        return (
            <VerticalTabWrapper>
                {items.map((item, idx) => {
                    const show_sub_tab_list = this.state[item.title];

                    return (
                        <div key={idx} className='menu-accordion'>
                            <VerticalTabHeader
                                item={item}
                                className='menu-accordion__header'
                                onChange={this.handleAccordion}
                            >
                                <Icon
                                    icon='IconChevronRight'
                                    className={classNames('menu-accordion__icon', {
                                        'menu-accordion__icon--show': show_sub_tab_list,
                                    })}
                                />
                            </VerticalTabHeader>
                            <div className={classNames('menu-accordion__subtab', {
                                'menu-accordion__subtab--show': show_sub_tab_list,
                            })}
                            >
                                <VerticalTabHeaders
                                    items={item.subroutes}
                                    onChange={onChange}
                                    selected={selected}
                                    is_routed={this.props.is_routed}
                                />
                            </div>
                        </div>
                    );
                }
                )}
            </VerticalTabWrapper>
        );
    }
}

export { MenuAccordionHeaders };
