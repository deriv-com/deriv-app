import classNames    from 'classnames';
import PropTypes     from 'prop-types';
import React         from 'react';
import {
    Icon,
    IconClose }      from 'Assets/Common';

const FullScreenDialog = (props) => {
    const { title, visible, children, wrapperClassName } = props;

    const checkVisibility = () => {
        if (props.visible) {
            document.body.classList.add('no-scroll');
            document.getElementById('binary_app').classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
            document.getElementById('binary_app').classList.remove('no-scroll');
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
            className={classNames('fullscreen-dialog', {
                'fullscreen-dialog--open': visible,
            })}
            onClick={handleClick}
        >
            <div className='fullscreen-dialog__header'>
                <h2 className='fullscreen-dialog__title'>
                    {title}
                </h2>
                <div
                    className='icons btn-close fullscreen-dialog__close-btn'
                    onClick={props.onClose}
                >
                    <Icon icon={IconClose} className='fullscreen-dialog__close-btn-icon' />
                </div>
            </div>
            <div className='fullscreen-dialog__header-shadow-cover' />
            <div className='fullscreen-dialog__header-shadow' />
            <div className='fullscreen-dialog__content'>
                <div className={`fullscreen-dialog__${wrapperClassName || 'contracts-modal-list'}`}>
                    {children}
                </div>
            </div>
        </div>
    );
};

FullScreenDialog.propTypes = {
    children        : PropTypes.any,
    onClose         : PropTypes.func,
    title           : PropTypes.string,
    visible         : PropTypes.bool,
    wrapperClassName: PropTypes.string,
};

export default FullScreenDialog;
