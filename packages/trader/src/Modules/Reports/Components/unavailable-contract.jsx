import PropTypes from 'prop-types';
import React from 'react';
import { Localize } from '@deriv/translations';
import { urlFor } from '@deriv/shared';
import { website_name } from 'App/Constants/app-config';

const UnavailableContract = ({ binary_contract_url, is_eu }) =>
    is_eu ? (
        <Localize
            i18n_default_text='This trade type is no longer available. For more details on this transaction, please <0>chat with us</0>.'
            components={[<a key={0} className='link link--orange' onClick={() => window.LC_API.open_chat_window()} />]}
        />
    ) : (
        <Localize
            i18n_default_text='This trade type is currently not supported on {{website_name}}. Please go to <0>Binary.com</0> for details.'
            values={{
                website_name,
            }}
            components={[
                <a
                    key={0}
                    className='link link--orange'
                    rel='noopener noreferrer'
                    target='_blank'
                    href={urlFor(binary_contract_url, { legacy: true })}
                />,
            ]}
        />
    );

UnavailableContract.propTypes = {
    binary_contract_url: PropTypes.string,
    is_eu: PropTypes.bool,
};

export default UnavailableContract;
