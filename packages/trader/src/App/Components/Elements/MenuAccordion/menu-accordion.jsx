import PropTypes                 from 'prop-types';
import React                     from 'react';
import { MenuAccordionHeaders }  from './menu-accordion-headers.jsx';
import {
    VerticalTabContentContainer,
    VerticalTabLayout }          from '../VerticalTabs';

const MenuAccordionTitle = ({ title }) => (<h1 className='menu-accordion__title'>{title}</h1>);

class MenuAccordion extends React.PureComponent {
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
            selected_content,
            tab_container_classname,
        } = this.props;

        const Component = () => <MenuAccordionTitle title={selected_content.title} />;
        const action_bar_items = [
            ...action_bar,
            {
                component: Component,
            },
        ];

        return (
            <VerticalTabLayout is_full_width={is_full_width}>
                <MenuAccordionHeaders
                    header_title={header_title}
                    items={list}
                    selected={selected_content}
                    is_routed={is_routed}
                    onChange={()=>{}}
                />
                <VerticalTabContentContainer
                    action_bar={action_bar_items}
                    action_bar_classname={action_bar_classname}
                    id={id}
                    items={sub_list}
                    is_routed={is_routed}
                    selected={selected_content}
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
