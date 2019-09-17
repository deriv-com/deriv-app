import classNames                      from 'classnames';
import PropTypes                       from 'prop-types';
import React                           from 'react';
import { VerticalTabContentContainer } from './vertical-tab-content-container.jsx';
import { VerticalTabHeaders }          from './vertical-tab-headers.jsx';

class VerticalTab extends React.PureComponent {
    constructor(props) {
        super(props);
        if (props.is_routed) {
            const applicable_routes = props.list.filter(item => (
                item.path === props.current_path || item.default
            ));
            const selected = applicable_routes.length > 1
                ? applicable_routes[applicable_routes.length - 1]
                : applicable_routes[0];

            this.state = {
                selected,
            };
        } else {
            this.state = {
                selected: props.list[props.selected_index || 0],
            };
        }
    }

    changeSelected = (e) => {
        this.setState({
            selected: e,
        });
    };

    render() {
        return (
            <div
                className={classNames('vertical-tab', {
                    'vertical-tab--full-screen': this.props.is_full_width,
                })}
            >
                <VerticalTabHeaders
                    items={this.props.list}
                    onChange={this.changeSelected}
                    selected={this.state.selected}
                    is_routed={this.props.is_routed}
                    header_title={this.props.header_title}
                    visible_items={this.props.visible_items}
                />
                <VerticalTabContentContainer
                    action_bar={this.props.action_bar}
                    action_bar_classname={this.props.action_bar_classname}
                    id={this.props.id}
                    items={this.props.list}
                    selected={this.state.selected}
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
    selected_index: PropTypes.number,
    visible_items : PropTypes.array,
};

export default VerticalTab;
