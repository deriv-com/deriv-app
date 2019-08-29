import React       from 'react';
import Icon        from 'Assets/icon.jsx';
import { VerticalTabHeaders } from '../VerticalTabs/vertical-tab-headers.jsx';

class MenuAccordionHeaders extends React.PureComponent {
    state = {
        active_tab        : 0,
        is_active_tab_open: true,
        selected          : this.props.selected,
    }

    static getDerivedStateFromProps(props, state) {
        return {
            selected: props.selected,
        }
    }

    toggleAccordion = (active_tab) => {        
        this.setState(state => ({
            active_tab,
            is_active_tab_open: state.active_tab === active_tab ? !state.is_active_tab_open : true,
            selected          : this.props.onChange(this.props.items[active_tab].sub_tab_list[0]),
        }));
    }

    render() {
        return (
            <div className='vertical-tab__tab'>
                {this.props.items.map((item, idx) => {
                    return (
                        <div key={idx}>
                            <div
                                id={`dt_${item.tab_heading}_link`}
                                onClick={() => this.toggleAccordion(idx)}
                                className='vertical-tab__header'
                            >
                                <Icon icon={item.icon} />
                                <span className='vertical-tab__header__link'>{item.tab_heading}</span>
                            </div>
                            {(this.state.active_tab === idx && this.state.is_active_tab_open) && (
                                <VerticalTabHeaders
                                    items={item.sub_tab_list}
                                    onChange={this.props.onChange}
                                    selected={this.props.selected}
                                />
                            )}
                        </div>
                    )
                })}
            </div>
        );
    }
}

export { MenuAccordionHeaders };
