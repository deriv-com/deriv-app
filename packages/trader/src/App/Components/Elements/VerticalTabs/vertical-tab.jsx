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

    setSelectedIndex = ({ list, selected_index, is_routed, current_path }) => {
        const index = typeof selected_index === 'undefined'
            ? (is_routed ? list.indexOf(list.find(item => (item.path === (current_path || item.default)))) || 0 : 0)
            : selected_index;
        this.props.setModalIndex(typeof index === 'object' ? list.indexOf(index) : index);
    };

    changeSelected = (e) => {
        this.setSelectedIndex({
            list          : this.props.list,
            selected_index: e,
        });
    };

    render() {
        const selected = this.props.list[this.props.modal_index] || this.props.list[0];
        return (
            <div
                className={classNames('vertical-tab', {
                    'vertical-tab--full-screen': this.props.is_full_width,
                })}
            >
                {this.props.is_sidebar_enabled &&
                <VerticalTabHeaders
                    className={this.props.classNameHeader}
                    items={this.props.list}
                    onChange={this.changeSelected}
                    selected={selected}
                    is_routed={this.props.is_routed}
                    header_title={this.props.header_title}
                    visible_items={this.props.visible_items}
                />
                }
                <VerticalTabContentContainer
                    action_bar={this.props.action_bar}
                    action_bar_classname={this.props.action_bar_classname}
                    items={this.props.list}
                    selected={selected}
                    is_routed={this.props.is_routed}
                />
            </div>
        );
    }
}

VerticalTab.defaultProps = {
    is_sidebar_enabled: true,
};

VerticalTab.propTypes = {
    action_bar: PropTypes.arrayOf(
        PropTypes.shape({
            component: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
            icon     : PropTypes.string,
            onClick  : PropTypes.func,
            title    : PropTypes.string,
        }),
    ),
    action_bar_classname: PropTypes.string,
    classNameHeader     : PropTypes.string,
    current_path        : PropTypes.string,
    header_title        : PropTypes.string,
    is_full_width       : PropTypes.bool,
    is_routed           : PropTypes.bool,
    is_sidebar_enabled  : PropTypes.bool,
    list                : PropTypes.arrayOf(
        PropTypes.shape({
            default: PropTypes.bool,
            icon   : PropTypes.string,
            label  : PropTypes.string,
            path   : PropTypes.string,
            value  : PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
        }),
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
