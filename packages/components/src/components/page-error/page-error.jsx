import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ButtonLink from '../button-link/button-link.jsx';
import DesktopWrapper from '../desktop-wrapper/desktop-wrapper.jsx';

const PageError = ({
    buttonOnClick,
    classNameImage,
    header,
    image_url,
    messages,
    redirect_label,
    redirect_url,
    should_clear_error_on_click,
    setError,
}) => {
    const onClickHandler = () => {
        if (should_clear_error_on_click) {
            setError(false, null);
        } else if (typeof buttonOnClick === 'function') {
            buttonOnClick();
        }
    };

    return (
        // if image_url is passed we should split the page to two columns and left-align messages
        <div className={classNames('dc-page-error__container', { 'dc-page-error__container--left': !!image_url })}>
            {!!image_url && (
                <DesktopWrapper>
                    <img
                        className={classNameImage}
                        src={image_url}
                        alt={'404'}
                        loading='lazy'
                        width='771px' // width and height should be specified so it doesn't jump to the right after image loads
                        height='448px'
                    />
                </DesktopWrapper>
            )}
            <div
                className={classNames('dc-page-error__box', {
                    'dc-page-error__box--left': !!image_url,
                })}
            >
                <h3 className='dc-page-error__header'>{header}</h3>
                <div
                    className={classNames('dc-page-error__message-wrapper', {
                        'dc-page-error__message-wrapper--left': !!image_url,
                    })}
                >
                    <span
                        className={classNames('dc-page-error__message', {
                            'dc-page-error__message--left': !!image_url,
                        })}
                    >
                        {messages.map((message, index) =>
                            message.has_html ? (
                                <p
                                    key={index}
                                    className='dc-page-error__message-paragraph'
                                    dangerouslySetInnerHTML={{ __html: message.message }}
                                />
                            ) : (
                                <p key={index} className='dc-page-error__message-paragraph'>
                                    {message}
                                </p>
                            )
                        )}
                    </span>
                </div>
                {redirect_label && (
                    <ButtonLink className='dc-page-error__btn' to={redirect_url} onClick={onClickHandler} size='large'>
                        <span className='dc-page-error__btn-text dc-btn__text'>{redirect_label}</span>
                    </ButtonLink>
                )}
            </div>
        </div>
    );
};

PageError.propTypes = {
    buttonOnClick: PropTypes.func,
    classNameImage: PropTypes.string,
    header: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    image_url: PropTypes.string,
    messages: PropTypes.array,
    redirect_label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    redirect_url: PropTypes.string,
    setError: PropTypes.func,
    should_clear_error_on_click: PropTypes.bool,
};

export default PageError;
