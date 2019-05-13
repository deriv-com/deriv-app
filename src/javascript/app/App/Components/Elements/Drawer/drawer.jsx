import classNames       from 'classnames';
import PropTypes        from 'prop-types';
import React            from 'react';
import { CSSTransition }   from 'react-transition-group';
import { connect }      from 'Stores/connect';
import { DrawerHeader } from './drawer-header.jsx';

class Drawer extends React.Component {
    state = {
        is_this_drawer_on: false,
    };

    setRef = (node) => {
        this.ref = node;
    };

    scrollToggle(state) {
        this.is_open = state;
        document.body.classList.toggle('no-scroll', this.is_open);
    }

    static getDerivedStateFromProps(props, state) {
        if (props.alignment === 'left') {
            state.is_this_drawer_on = props.is_main_drawer_on;
        } else if (props.alignment === 'right'){
            state.is_this_drawer_on = props.is_notifications_drawer_on;
        }

        return state;
    }

    hide = () => {
        this.scrollToggle(false);
        this.props.hideDrawers();
    };

    handleClickOutside = (event) => {
        if (this.state.is_this_drawer_on) {
            if (this.ref && !this.ref.contains(event.target)) {
                this.hide();
            }
        }
    };

    render() {
        const { is_this_drawer_on } = this.state;
        const { alignment, closeBtn, children } = this.props;

        const drawer_bg_class = classNames('drawer__bg', {
            'drawer--show': is_this_drawer_on,
        });
        const drawer_class = classNames('drawer', { [`drawer--${alignment}`]: alignment });

        return (
            <CSSTransition
                in={is_this_drawer_on}
                timeout={150}
                classNames={{
                    enter    : 'drawer__container--enter',
                    enterDone: 'drawer__container--enter-done',
                    exit     : 'drawer__container--exit',
                }}
                unmountOnExit
            >
                <aside className='drawer-container'>
                    <div
                        className={drawer_bg_class}
                        onClick={this.handleClickOutside}
                    >
                        <div
                            ref={this.setRef}
                            className={drawer_class}
                        >
                            <DrawerHeader
                                alignment={alignment}
                                closeBtn={closeBtn}
                            />
                            {children}
                        </div>
                    </div>
                </aside>
            </CSSTransition>
        );
    }
}

Drawer.propTypes = {
    alignment: PropTypes.string,
    children : PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]),
    closeBtn                  : PropTypes.func,
    footer                    : PropTypes.func,
    hideDrawers               : PropTypes.func,
    icon_class                : PropTypes.string,
    icon_link                 : PropTypes.string,
    is_main_drawer_on         : PropTypes.bool,
    is_notifications_drawer_on: PropTypes.bool,
};

const drawer_component = connect(
    ({ ui }) => ({
        is_main_drawer_on         : ui.is_main_drawer_on,
        is_notifications_drawer_on: ui.is_notifications_drawer_on,
        hideDrawers               : ui.hideDrawers,
    })
)(Drawer);

export { drawer_component as Drawer };
