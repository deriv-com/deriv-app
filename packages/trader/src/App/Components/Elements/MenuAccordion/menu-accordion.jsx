import PropTypes                                          from 'prop-types';
import React                                              from 'react';
import { MenuAccordionHeaders }                           from './menu-accordion-headers.jsx';
import { VerticalTabContentContainer, VerticalTabLayout } from '../VerticalTabs';

const getAllSubTabList = list => list.map(item => item.subroutes).flat();
class MenuAccordion extends React.PureComponent {
    constructor(props) {
        super(props);
        const sub_tabs = getAllSubTabList(this.props.list);
        this.state     = {
            selected_content: sub_tabs[props.selected_index || 0],
        };
    }

    changeSelectedContent = (selected_content) => {
        this.setState({ selected_content }, () => {
            this.props.onChangeHeader(selected_content.label);
        });
    };

    render() {
        const { list, action_bar, action_bar_classname, id, is_full_width, is_routed } = this.props;
        const { selected_content } = this.state;

        const sub_tabs = getAllSubTabList(list);

        return (
            <VerticalTabLayout is_full_width={is_full_width}>
                <MenuAccordionHeaders
                    items={list}
                    onChange={this.changeSelectedContent}
                    selected={selected_content}
                    is_routed={is_routed}
                />
                <VerticalTabContentContainer
                    action_bar={action_bar}
                    action_bar_classname={action_bar_classname}
                    id={id}
                    items={sub_tabs}
                    is_routed={is_routed}
                    selected={selected_content}
                />
            </VerticalTabLayout>
        );
    }
}

MenuAccordion.propTypes = {
    action_bar: PropTypes.arrayOf(
        PropTypes.shape({
            component: PropTypes.func,
            icon     : PropTypes.string,
            onClick  : PropTypes.func,
            title    : PropTypes.string,
        })
    ),
    action_bar_classname: PropTypes.string,
    id                  : PropTypes.string,
    is_full_width       : PropTypes.bool,
    list                : PropTypes.arrayOf(
        PropTypes.shape({
            default: PropTypes.bool,
            icon   : PropTypes.string,
            label  : PropTypes.string,
            path   : PropTypes.string,
            value  : PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
        })
    ).isRequired,
    selected_index: PropTypes.number,
};

export default MenuAccordion;
