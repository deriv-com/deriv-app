import classNames  from 'classnames';
import PropTypes   from 'prop-types';
import React       from 'react';
import { connect } from 'Stores/connect';
import { Drawer }  from './drawer.jsx';

class ToggleDrawer extends React.Component {
    showDrawer = () => {
        const { alignment } = this.props;
        if (alignment === 'left') {
            this.props.showMainDrawer();
        } else if (alignment === 'right') {
            this.props.showNotificationsDrawer();
        }
    };

    closeDrawer = () => {
        this.props.hideDrawers();
    };

    render() {
        const { icon_class, icon, alignment, children } = this.props;

        const toggle_class = classNames('header__navbar-icons', `header__navbar-icons--${icon_class}`);

        return (
            <React.Fragment>
                <div className={toggle_class} onClick={this.showDrawer}>
                    {icon}
                </div>
                <Drawer
                    alignment={alignment}
                    closeBtn={this.closeDrawer}
                >
                    {children}
                </Drawer>
            </React.Fragment>
        );
    }
}

ToggleDrawer.propTypes = {
    alignment: PropTypes.string,
    children : PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]),
    footer     : PropTypes.func,
    hideDrawers: PropTypes.func,
    icon       : PropTypes.shape({
        className: PropTypes.string,
    }),
    icon_class             : PropTypes.string,
    showMainDrawer         : PropTypes.func,
    showNotificationsDrawer: PropTypes.func,
};

const drawer_component = connect(
    ({ ui }) => ({
        showMainDrawer         : ui.showMainDrawer,
        showNotificationsDrawer: ui.showNotificationsDrawer,
        hideDrawers            : ui.hideDrawers,
    })
)(ToggleDrawer);

export { drawer_component as ToggleDrawer };
