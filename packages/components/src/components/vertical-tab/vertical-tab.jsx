import classNames                  from 'classnames';
import PropTypes                   from 'prop-types';
import React                       from 'react';
import VerticalTabContentContainer from 'Components/vertical-tab/vertical-tab-content-container.jsx';
import VerticalTabHeader           from 'Components/vertical-tab/vertical-tab-header.jsx';
import VerticalTabHeaders          from 'Components/vertical-tab/vertical-tab-headers.jsx';
import VerticalTabHeaderTitle      from 'Components/vertical-tab/vertical-tab-header-title.jsx';
import VerticalTabLayout           from 'Components/vertical-tab/vertical-tab-layout.jsx';
import VerticalTabWrapper          from 'Components/vertical-tab/vertical-tab-wrapper.jsx';

class VerticalTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = { modal_index: props.modal_index || 0 };
    }

    setSelectedIndex = ({ list, selected_index, is_routed, current_path }) => {
        let index;
        if (typeof selected_index === 'undefined') {
            index = is_routed ?
                list.indexOf(list.find(item => (item.path === (current_path || item.default)))) || 0 : 0;
        } else {
            index = (typeof selected_index === 'object' ? list.indexOf(selected_index) : selected_index);
        }

        this.setState({ modal_index: index });
        
        if (typeof this.props.setModalIndex === 'function') {
            this.props.setModalIndex(index);
        }
    };

    changeSelected = (e) => {
        this.setSelectedIndex({
            list          : this.props.list,
            selected_index: e,
        });
    };

    componentDidMount() {
        this.setSelectedIndex(this.props);
    }

    componentDidUpdate(prevProps) {
        if (this.props.list.length !== prevProps.list.length) {
            this.setSelectedIndex({
                current_path: this.props.current_path,
                list        : this.props.list,
                is_routed   : this.props.is_routed,
            });
        }
    }

    render() {
        const selected = this.props.list[this.state.modal_index] || this.props.list[0];
        return (
            <div
                className={classNames('vertical-tab', {
                    'vertical-tab--full-screen': this.props.is_full_width,
                })}
            >
                {this.props.is_sidebar_enabled &&
                <VerticalTabHeaders
                    className={this.props.header_classname}
                    items={this.props.list}
                    onChange={this.changeSelected}
                    selected={selected}
                    is_routed={this.props.is_routed}
                    header_title={this.props.header_title}
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
    current_path        : PropTypes.string,
    header_classname    : PropTypes.string,
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
};

VerticalTab.ContentContainer = VerticalTabContentContainer;
VerticalTab.Header           = VerticalTabHeader;
VerticalTab.Headers          = VerticalTabHeaders;
VerticalTab.HeaderTitle      = VerticalTabHeaderTitle;
VerticalTab.Layout           = VerticalTabLayout;
VerticalTab.Wrapper          = VerticalTabWrapper;

export default VerticalTab;
