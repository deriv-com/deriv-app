import PropTypes                 from 'prop-types';
import React                     from 'react';
import { MenuAccordionHeaders }  from './menu-accordion-headers.jsx';
import {
    VerticalTabContentContainer,
    VerticalTabLayout }          from '../VerticalTabs';

const MenuAccordionTitle = ({ title }) => (<h1 className='menu-accordion-title'>{title}</h1>);

class MenuAccordion extends React.PureComponent {
    constructor(props) {
        super(props);
        const selected = this.props.selected_content;
        this.state     = {
            action_bar_component: () => <MenuAccordionTitle title={selected ? selected.title : ''} />,
            selected,
        };
    }

    changeSelectedContent = (selected) => {
        this.setState({ selected }, () => {
            const Component = () => <MenuAccordionTitle title={this.state.selected.title} />;
            this.setState({ action_bar_component: Component });
        });
    };


    render() {
        const {
            action_bar,
            action_bar_classname,
            header_title,
            id,
            is_full_width,
            is_routed,
            list,
            sub_list,
            tab_container_classname,
        } = this.props;

        const action_bar_items = [
            ...action_bar,
            {
                component: this.state.action_bar_component,
            },
        ];

        const selected = this.state.selected || this.props.sub_list ? this.props.sub_list[0] : this.props.list[0];
        return (
            <VerticalTabLayout is_full_width={is_full_width}>
                <MenuAccordionHeaders
                    header_title={header_title}
                    items={list}
                    onChange={this.changeSelectedContent}
                    selected={selected}
                    is_routed={is_routed}
                />
                <VerticalTabContentContainer
                    action_bar={action_bar_items}
                    action_bar_classname={action_bar_classname}
                    id={id}
                    items={sub_list}
                    is_routed={is_routed}
                    selected={selected}
                    tab_container_classname={tab_container_classname}
                />
            </VerticalTabLayout>
        );
    }
}

MenuAccordion.propTypes = {
    action_bar: PropTypes.arrayOf(
        PropTypes.shape({
            component: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
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
    selected_content: PropTypes.object,
};

export default MenuAccordion;
