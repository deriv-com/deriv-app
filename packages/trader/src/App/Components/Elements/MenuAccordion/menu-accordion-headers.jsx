import React            from 'react';
import Icon             from 'Assets/icon.jsx';
import {
    VerticalTabHeaders,
    VerticalTabWrapper,
    VerticalTabHeader } from '../VerticalTabs';

class MenuAccordionHeaders extends React.PureComponent {
    state = {
        is_active_tab_open: true,
        selected_tab      : this.props.items[0].label
    }

    handleAccordion = (selected) => {
        const is_same_header   = this.state.selected_tab === selected.label;
        let is_active_tab_open = true;

        if (is_same_header) {
            is_active_tab_open = !this.state.is_active_tab_open;
        } else {
            this.props.onChange(selected.sub_tab_list[0]);
        }
        this.setState({ selected_tab: selected.label, is_active_tab_open });
    }

    render() {
        const { selected_tab, is_active_tab_open } = this.state;
        const { onChange, selected, items }        = this.props;

        return (
            <VerticalTabWrapper>
                {items.map((item, idx) => {
                    const show_sub_tab_list = (selected_tab === item.label && is_active_tab_open);

                    return (
                        <div key={idx}>
                            <div className='dt_accordion'>
                                <VerticalTabHeader item={item} onChange={this.handleAccordion}/>
                                <Icon icon='IconChevronRight' className='dt_accordion__chevron' />
                            </div>
                            {show_sub_tab_list && (
                                <VerticalTabHeaders
                                    items={item.sub_tab_list}
                                    onChange={onChange}
                                    selected={selected}
                                />
                            )}
                        </div>
                    )}
                )}
            </VerticalTabWrapper>
        );
    }
}

export { MenuAccordionHeaders };
