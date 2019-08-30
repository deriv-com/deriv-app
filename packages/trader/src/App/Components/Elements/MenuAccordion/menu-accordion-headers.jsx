import React            from 'react';
import {
    VerticalTabHeaders,
    VerticalTabWrapper,
    VerticalTabHeader } from '../VerticalTabs';

class MenuAccordionHeaders extends React.PureComponent {
    state = {
        is_active_tab_open: true,
        selected_main_header: this.props.items[0].label
    }

    handleAccordion = (selected) => {
        const is_same_header   = this.state.selected_main_header === selected.label
        let is_active_tab_open = true;

        if (is_same_header) {
            is_active_tab_open = !this.state.is_active_tab_open;
        } else {
            this.props.onChange(selected.sub_tab_list[0])
        }
        this.setState({ selected_main_header: selected.label, is_active_tab_open })
    }

    render() {
        const { selected_main_header, is_active_tab_open } = this.state;
        const { onChange, selected }                       = this.props;

        return (
            <VerticalTabWrapper>
                {this.props.items.map((item, idx) => (
                        <div key={idx}>
                            <VerticalTabHeader item={item} onChange={this.handleAccordion}/>
                            {(selected_main_header === item.label && is_active_tab_open) && (
                                <VerticalTabHeaders
                                    items={item.sub_tab_list}
                                    onChange={onChange}
                                    selected={selected}
                                />
                            )}
                        </div>
                    )
                )}
            </VerticalTabWrapper>
        );
    }
}

export { MenuAccordionHeaders };
