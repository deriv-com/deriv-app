import classNames               from 'classnames';
import PropTypes                from 'prop-types';
import React                    from 'react';
import { MenuAccordionContent } from './menu-accordion-content.jsx';
import { MenuAccordionHeaders } from './menu-accordion-headers.jsx';

class MenuAccordion extends React.PureComponent {
    constructor(props) {
        super(props);
        const flat_list = props.list.map(item => item.sub_tab_list).flat();
        this.state = {
            selected: flat_list[props.selected_index || 0],
        };
    }

    changeSelected = (e) => {
        this.setState({
            selected: e,
        });
    };

    render() {
        const flat_list = this.props.list.map(item => item.sub_tab_list).flat();
        return (
            <div
                className={classNames('vertical-tab', {
                    'vertical-tab--full-screen': this.props.is_full_width,
                })}
            >
                <MenuAccordionHeaders 
                    items={this.props.list}
                    onChange={this.changeSelected}
                    selected={this.state.selected}
                    is_routed={this.props.is_routed}
                />
                <MenuAccordionContent
                    action_bar={this.props.action_bar}
                    action_bar_classname={this.props.action_bar_classname}
                    id={this.props.id}
                    items={flat_list}
                    selected={this.state.selected}
                />
            </div>
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
    current_path        : PropTypes.string,
    header_title        : PropTypes.string,
    id                  : PropTypes.string,
    is_full_width       : PropTypes.bool,
    is_routed           : PropTypes.bool,
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
