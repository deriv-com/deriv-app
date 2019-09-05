import classNames       from 'classnames';
import React            from 'react';
import Icon             from 'Assets/icon.jsx';
import {
    VerticalTabHeaders,
    VerticalTabWrapper,
    VerticalTabHeader } from '../VerticalTabs';

class MenuAccordionHeaders extends React.PureComponent {
    state = {
        [this.props.items[0].label]: true,
    }

    handleAccordion = (selected) => {
        this.setState({
            [selected.label]: !this.state[selected.label],
        });
    }

    render() {
        const { onChange, selected, items } = this.props;

        return (
            <VerticalTabWrapper>
                {items.map((item, idx) => {
                    const show_sub_tab_list = this.state[item.label] ;

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
                                    items={item.sub_tab_list}
                                    onChange={onChange}
                                    selected={selected}
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
