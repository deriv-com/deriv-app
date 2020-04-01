import PropTypes from 'prop-types';
import React from 'react';
import ButtonLink from 'App/Components/Routes/button-link.jsx';

const PageError = ({ buttonOnClick, error_code_message, messages, header, redirect_label, redirect_url }) => (
    <div className='dc-page-error__container'>
        <div className='dc-page-error__box'>
            <h3 className='dc-page-error__header'>{header}</h3>
            <div className='dc-page-error__message-wrapper'>
                <span className='dc-page-error__message'>
                    {messages.map((message, index) =>
                        message.has_html ? (
                            <p key={index} dangerouslySetInnerHTML={{ __html: message.message }} />
                        ) : (
                            <p key={index}>{message}</p>
                        )
                    )}
                    {error_code_message && (
                        <React.Fragment>
                            <br />
                            <p className='dc-page-error__code'>{error_code_message}</p>
                        </React.Fragment>
                    )}
                </span>
            </div>
            {redirect_label && (
                <ButtonLink className='dc-page-error__btn' to={redirect_url} onClick={buttonOnClick}>
                    <span className='dc-page-error__btn-text dc-btn__text'>{redirect_label}</span>
                </ButtonLink>
            )}
        </div>
    </div>
);

PageError.propTypes = {
    buttonOnClick: PropTypes.func,
    error_code_message: PropTypes.oneOf([PropTypes.number, PropTypes.string, PropTypes.node]),
    header: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    messages: PropTypes.array,
    redirect_label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    redirect_url: PropTypes.string,
};

export default PageError;
