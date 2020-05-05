import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ButtonLink from 'Components/button-link/button-link.jsx';
import DesktopWrapper from 'Components/desktop-wrapper/desktop-wrapper.jsx';

// if classNameImage is passed we should split the page to two columns and left-align messages
const PageError = ({ buttonOnClick, messages, header, redirect_label, redirect_url, classNameImage }) => (
    <div className={classNames('dc-page-error__container', { 'dc-page-error__container--left': classNameImage })}>
        {classNameImage && (
            <DesktopWrapper>
                <div className={classNames('dc-page-error__image', classNameImage)} />
            </DesktopWrapper>
        )}
        <div className='dc-page-error__box'>
            <h3 className='dc-page-error__header'>{header}</h3>
            <div
                className={classNames('dc-page-error__message-wrapper', {
                    'dc-page-error__message-wrapper--left': classNameImage,
                })}
            >
                <span
                    className={classNames('dc-page-error__message', { 'dc-page-error__message--left': classNameImage })}
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
                <ButtonLink className='dc-page-error__btn' to={redirect_url} onClick={buttonOnClick} size='large'>
                    <span className='dc-page-error__btn-text dc-btn__text'>{redirect_label}</span>
                </ButtonLink>
            )}
        </div>
    </div>
);

PageError.propTypes = {
    buttonOnClick: PropTypes.func,
    classNameImage: PropTypes.string,
    header: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    messages: PropTypes.array,
    redirect_label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    redirect_url: PropTypes.string,
};

export default PageError;
