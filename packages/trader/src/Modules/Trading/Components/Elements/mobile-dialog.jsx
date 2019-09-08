import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';
import Icon       from 'Assets/icon.jsx';

const MobileDialog = (props) => {
    const { title, visible, children, wrapperClassName } = props;

    const checkVisibility = () => {
        if (props.visible) {
            document.body.classList.add('no-scroll');
            document.getElementById('deriv_app').classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
            document.getElementById('deriv_app').classList.remove('no-scroll');
        }
    };

    const scrollToElement = (parent, el) => {
        const viewport_offset = el.getBoundingClientRect();
        const hidden = viewport_offset.top + el.clientHeight + 20 > window.innerHeight;
        if (hidden) {
            const new_el_top = (window.innerHeight - el.clientHeight) / 2;
            parent.scrollTop += viewport_offset.top - new_el_top;
        }
    };

    // sometimes input is covered by virtual keyboard on mobile chrome, uc browser
    const handleClick = (e) => {
        if (e.target.tagName === 'INPUT' && e.target.type === 'number') {
            const scrollToTarget = scrollToElement(e.currentTarget, e.target);
            window.addEventListener('resize', scrollToTarget, false);

            // remove listener, resize is not fired on iOS safari
            window.setTimeout(() => {
                window.removeEventListener('resize', scrollToTarget, false);
            }, 2000);
        }
    };

    checkVisibility();

    return (
        <div
            className={classNames('mobile-dialog', {
                'mobile-dialog--open': visible,
            })}
            onClick={handleClick}
        >
            <div className='mobile-dialog__header'>
                <h2 className='mobile-dialog__title'>
                    {title}
                </h2>
                <div
                    className='icons btn-close mobile-dialog__close-btn'
                    onClick={props.onClose}
                >
                    <Icon icon='IconClose' className='mobile-dialog__close-btn-icon' />
                </div>
            </div>
            <div className='mobile-dialog__header-shadow-cover' />
            <div className='mobile-dialog__header-shadow' />
            <div className='mobile-dialog__content'>
                <div className={`mobile-dialog__${wrapperClassName || 'contracts-modal-list'}`}>
                    {children}
                </div>
            </div>
        </div>
    );
};

MobileDialog.propTypes = {
    children        : PropTypes.any,
    onClose         : PropTypes.func,
    title           : PropTypes.string,
    visible         : PropTypes.bool,
    wrapperClassName: PropTypes.string,
};

export default MobileDialog;
