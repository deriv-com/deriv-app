import classNames                      from 'classnames';
import PropTypes                       from 'prop-types';
import React                           from 'react';
import { connect }                     from 'Stores/connect';
import { VerticalTabContentContainer } from './vertical-tab-content-container.jsx';
import { VerticalTabHeaders }          from './vertical-tab-headers.jsx';

class VerticalTab extends React.Component {
    constructor(props) {
        super(props);
        this.setSelectedIndex(props);
    }

    setSelectedIndex = ({ is_routed, list, selected_index, current_path }) => {
        let index;
        if (is_routed) {
            const applicable_routes = list.filter(item => (
                item.path === current_path || item.default
            ));
            const selected = applicable_routes.length > 1
                ? applicable_routes.length - 1
                : 0;

            index = typeof selected_index === 'object' ? applicable_routes.indexOf(selected) : selected;
        } else {
            index = typeof selected_index === 'object' ? list.indexOf(selected_index) : selected_index;
        }
        this.props.setModalIndex(index);
    };

    changeSelected = (e) => {
        this.setSelectedIndex({
            current_path  : this.props.current_path,
            is_routed     : this.props.is_routed,
            list          : this.props.list,
            selected_index: e,
        });
    };

    render() {
        const selected = this.props.list[this.props.modal_index];
        return (
            <div
                className={classNames('vertical-tab', {
                    'vertical-tab--full-screen': this.props.is_full_width,
                })}
            >
                <VerticalTabHeaders
                    items={this.props.list}
                    onChange={this.changeSelected}
                    selected={selected}
                    is_routed={this.props.is_routed}
                    header_title={this.props.header_title}
                    visible_items={this.props.visible_items}
                />
                <VerticalTabContentContainer
                    action_bar={this.props.action_bar}
                    action_bar_classname={this.props.action_bar_classname}
                    id={this.props.id}
                    items={this.props.list}
                    selected={selected}
                    is_routed={this.props.is_routed}
                />
            </div>
        );
    }
}

VerticalTab.propTypes = {
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
    modal_index   : PropTypes.number,
    selected_index: PropTypes.number,
    setModalIndex : PropTypes.func,
    visible_items : PropTypes.array,
};

export default connect(
    ({ ui }) => ({
        setModalIndex: ui.setModalIndex,
        modal_index  : ui.modal_index,
    })
)(VerticalTab);
