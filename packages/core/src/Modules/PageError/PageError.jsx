import PropTypes    from 'prop-types';
import React        from 'react';
import ButtonLink   from 'App/Components/Routes/button-link.jsx';
import { Localize } from 'deriv-translations';

const PageError = ({
    buttonOnClick,
    error_code,
    messages,
    header,
    redirect_label,
    redirect_url,
}) => (
    <div className='page-error__container'>
        <div className='page-error__box'>
            <h3 className='page-error__header'>
                {header}
            </h3>
            <div className='page-error__message-wrapper'>
                <span className='page-error__message'>
                    { messages.map((message, index) => (
                        message.has_html ?
                            <p key={index} dangerouslySetInnerHTML={{ __html: message.message }} />
                            :
                            <p key={index}>{ message }</p>
                    ))}
                    { error_code &&
                    <React.Fragment>
                        <br />
                        <p className='page-error__code'><Localize i18n_default_text={'Error Code: {{error_code}}'} values={{ error_code }} /></p>
                    </React.Fragment>
                    }
                </span>
            </div>
            { redirect_label &&
            <ButtonLink
                className='page-error__btn'
                to={redirect_url}
                onClick={buttonOnClick}
            >
                <span className='page-error__btn-text btn__text'>
                    {redirect_label}
                </span>
            </ButtonLink>
            }
        </div>
    </div>
);

PageError.propTypes = {
    buttonOnClick : PropTypes.func,
    error_code    : PropTypes.number,
    header        : PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    messages      : PropTypes.array,
    redirect_label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    redirect_url  : PropTypes.string,
};

export default PageError;
