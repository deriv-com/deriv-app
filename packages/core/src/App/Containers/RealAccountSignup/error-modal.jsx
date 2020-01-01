import PropTypes              from 'prop-types';
import React                  from 'react';
import { Button, Icon }       from 'deriv-components';
import { localize, Localize } from 'deriv-translations';

const ErrorModal = ({ message, code, onClick }) => {
    return (
        <div className='account-wizard--error'>
            <Icon
                icon='IcAccountError'
                size={115}
            />
            <h1><Localize i18n_default_text='Whoops!' /></h1>
            <p>
                {localize(message)}
            </p>
            {code !== 'InvalidPhone' &&
            <a
                href='https://www.deriv.com/help-centre/'
                type='button'
                className='btn btn--primary btn__medium'
                target='_blank'
                rel='noopener noreferrer'
            >

                <span className='btn__text'>
                    <Localize
                        i18n_default_text='Go To Help Centre'
                    />
                </span>
            </a>
            }
            {code === 'InvalidPhone' &&
            <Button
                primary
                onClick={onClick}
            >
                <Localize
                    i18n_default_text='Try again using a different number'
                />
            </Button>
            }
        </div>
    );
};

ErrorModal.propTypes = {
    code               : PropTypes.string,
    message            : PropTypes.string,
    onClick: PropTypes.func,
};
export default ErrorModal;
