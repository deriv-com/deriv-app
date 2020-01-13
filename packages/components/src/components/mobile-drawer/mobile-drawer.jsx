import classNames        from 'classnames';
import PropTypes         from 'prop-types';
import React             from 'react';
import ReactDOM          from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import Body              from './mobile-drawer-body.jsx';
import Footer            from './mobile-drawer-footer.jsx';
import SubHeader         from './mobile-drawer-subheader.jsx';
import Item              from './mobile-drawer-item.jsx';
import SubMenu           from './mobile-drawer-submenu.jsx';
import Icon              from '../icon';

class DrawerElement extends React.PureComponent {
    constructor(props) {
        super(props);
        this.el    = document.createElement('div');
        this.state = {
            modal_root: document.getElementById('modal_root'),
        };
    }

    componentDidMount = () => {
        document.addEventListener('mousedown', this.handleClickOutside);
        this.el.classList.add('dc-mobile-drawer');
        this.state.modal_root.appendChild(this.el);
    };

    componentWillUnmount = () => {
        document.removeEventListener('mousedown', this.handleClickOutside);
        this.state.modal_root.removeChild(this.el);
    };

    handleClickOutside = (event) => {
        if (this.wrapper_ref &&
            !this.wrapper_ref.contains(event.target) && this.props.is_open) {
            this.props.toggle();
        }
    };

    render() {
        const { id, title, className, children, height, toggle, width } = this.props;

        return ReactDOM.createPortal(
            <div
                ref={this.setWrapperRef}
                id={id}
                className={classNames(
                    'dc-mobile-drawer__container', {
                        [`dc-mobile-drawer__container_${className}`]: className,
                    }
                )}
                style={{
                    height: height || 'auto',
                    width : width || 'auto',
                }}
            >
                <div className={classNames('dc-mobile-drawer__header', {
                    [`dc-mobile-drawer-header--${className}`]: className,
                }
                )}
                >
                    <div
                        onClick={toggle}
                        className='dc-mobile-drawer__header-close'
                    >
                        <Icon icon='IcCross' />
                    </div>
                    { title &&
                    <h3 className={classNames('dc-mobile-drawer__header-title', {
                        [`dc-mobile-drawer-header__title--${className}`]: className,
                    }
                    )}
                    >
                        {title}
                    </h3>
                    }
                </div>
                {children}
            </div>,
            this.el,
        );
    }

    setWrapperRef = (node) => {
        this.wrapper_ref = node;
    };
}

DrawerElement.propTypes = {
    children : PropTypes.node,
    className: PropTypes.string,
    id       : PropTypes.string,
    is_open  : PropTypes.bool,
    title    : PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
    ]),
    toggle: PropTypes.func,
};

const MobileDrawer = ({
    children,
    className,
    id,
    is_open,
    height,
    title,
    toggle,
    width,
}) => (
    <CSSTransition
        appear
        in={is_open}
        timeout={250}
        classNames={{
            appear   : 'dc-mobile-drawer__container--enter',
            enter    : 'dc-mobile-drawer__container--enter',
            enterDone: 'dc-mobile-drawer__container--enter-done',
            exit     : 'dc-mobile-drawer__container--exit',
        }}
        unmountOnExit
    >
        <DrawerElement
            className={className}
            id={id}
            is_open={is_open}
            title={title}
            toggle={toggle}
            height={height}
            width={width}
        >
            {children}
        </DrawerElement>
    </CSSTransition>
);

MobileDrawer.Body      = Body;
MobileDrawer.Footer    = Footer;
MobileDrawer.Item      = Item;
MobileDrawer.SubHeader = SubHeader;
MobileDrawer.SubMenu   = SubMenu;

MobileDrawer.propTypes = {
    children : PropTypes.node,
    className: PropTypes.string,
    height   : PropTypes.string,
    id       : PropTypes.string,
    is_open  : PropTypes.bool,
    title    : PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
    ]),
    toggle: PropTypes.func,
    width : PropTypes.string,
};

export default MobileDrawer;
