import { Money, Button, Modal, MobileWrapper } from '@deriv/components';
import React, { useState } from 'react';
import { isDesktop } from '@deriv/shared/utils/screen';
import { localize, Localize } from '@deriv/translations';
import { Mt5AccountCopy } from './mt5-account-copy.jsx';
import { getPlatformMt5DownloadLink } from '../Helpers/constants';

const FundTransferUnavailableModal = ({ is_visible, toggleModal }) => (
    <Modal is_open={is_visible} small toggleModal={toggleModal}>
        <Modal.Body>
            {localize('Fund transfers are currently unavailable for mobile. Please log in with your computer.')}
        </Modal.Body>
        <Modal.Footer>
            <Button has_effect text={localize('OK')} onClick={toggleModal} primary />
        </Modal.Footer>
    </Modal>
);

const MT5AccountCard = ({
    commission_message,
    descriptor,
    existing_data,
    icon,
    has_mt5_account,
    specs,
    title,
    type,
    onSelectAccount,
    onClickFund,
    onPasswordManager,
}) => {
    const IconComponent = icon || (() => null);

    const [is_visible, setIsVisible] = useState(false);

    const toggleModal = () => setIsVisible(!is_visible);

    return (
        <div className='mt5-account-card'>
            <div className='mt5-account-card__type'>
                {icon && <IconComponent />}
                <div className='mt5-account-card__type--description'>
                    <h1 className='mt5-account-card--heading'>{title}</h1>
                    {!existing_data && <p className='mt5-account-card--paragraph'>{descriptor}</p>}
                    {existing_data && existing_data.display_balance && (
                        <p className='mt5-account-card--balance'>
                            <Money amount={existing_data.display_balance} currency={existing_data.currency} />
                        </p>
                    )}
                </div>
            </div>

            <div className='mt5-account-card__cta'>
                {existing_data && existing_data.login && (
                    <div className='mt5-account-card__login'>
                        <Localize
                            i18n_default_text='Account login no.&nbsp;<0>{{login}}</0>'
                            values={{
                                login: existing_data.display_login,
                            }}
                            components={[<strong key='0' />]}
                        />
                        <Mt5AccountCopy text={existing_data.display_login} />
                    </div>
                )}
                <div className='mt5-account-card__specs'>
                    <table className='mt5-account-card__specs-table'>
                        <tbody>
                            {Object.keys(specs).map((spec_attribute, idx) => (
                                <tr key={idx} className='mt5-account-card__specs-table-row'>
                                    <td className='mt5-account-card__specs-table-attribute'>
                                        <p className='mt5-account-card--paragraph'>{spec_attribute}</p>
                                    </td>
                                    <td className='mt5-account-card__specs-table-data'>
                                        <p className='mt5-account-card--paragraph'>{specs[spec_attribute]}</p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {!existing_data && commission_message && (
                    <p className='mt5-account-card__commission mt5-account-card--paragraph'>{commission_message}</p>
                )}
                {existing_data && (
                    <div className='mt5-account-card__manage'>
                        <Button
                            onClick={isDesktop() || type.category === 'demo' ? onClickFund : toggleModal}
                            type='button'
                            secondary
                        >
                            {type.category === 'real' && <Localize i18n_default_text='Fund transfer' />}
                            {type.category === 'demo' && <Localize i18n_default_text='Top up' />}
                        </Button>
                        <Button
                            onClick={() => {
                                onPasswordManager(existing_data.login, title);
                            }}
                            type='button'
                            secondary
                        >
                            <Localize i18n_default_text='Password' />
                        </Button>
                    </div>
                )}

                {!existing_data && has_mt5_account && (
                    <Button
                        className='mt5-account-card__account-selection'
                        onClick={() => {
                            onSelectAccount(type);
                        }}
                        type='button'
                    >
                        <Localize i18n_default_text='Select' />
                    </Button>
                )}
                {existing_data && (
                    <a
                        className='btn mt5-account-card__account-selection mt5-account-card__account-selection--primary'
                        type='button'
                        href={getPlatformMt5DownloadLink()}
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        <Localize i18n_default_text='Download' />
                    </a>
                )}
                {!existing_data && !has_mt5_account && (
                    <Button
                        className='mt5-account-card__account-selection mt5-account-card__account-selection--primary'
                        onClick={() => {
                            onSelectAccount(type);
                        }}
                        type='button'
                        primary
                    >
                        <Localize i18n_default_text='Create account' />
                    </Button>
                )}
            </div>
            <MobileWrapper>
                <FundTransferUnavailableModal is_visible={is_visible} toggleModal={toggleModal} />
            </MobileWrapper>
        </div>
    );
};

export { MT5AccountCard };
