import React from 'react';
import { withRouter } from 'react-router-dom';
import { routes } from '@deriv/shared';
import { Icon, Checklist } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { WS } from 'Services';

const DepositsLocked = ({
    account_status,
    is_tnc_needed,
    is_financial_information_incomplete,
    is_trading_experience_incomplete,
    history,
}) => {
    // handle authentication locked
    const { identity, document, needs_verification } = account_status.authentication;
    const is_poi_needed = needs_verification.includes('identity');
    const is_poa_needed = needs_verification.includes('document');
    const has_poi_submitted = identity.status !== 'none';
    const has_poa_submitted = document.status !== 'none';
    const poi_text = has_poi_submitted
        ? localize('Check proof of identity document verification status')
        : localize('Upload an ID document to verify your identity');
    const poa_text = has_poa_submitted
        ? localize('Check proof of address document verification status')
        : localize('Upload a proof of address to verify your address');

    // handle TnC
    const acceptTnc = async () => {
        await WS.tncApproval();
        await WS.getSettings();
        onMount();
    };

    // handle all deposits lock status
    const items = [
        is_poi_needed && {
            content: poi_text,
            status: 'action',
            onClick: () => history.push(routes.proof_of_identity),
        },
        is_poa_needed && {
            content: poa_text,
            status: 'action',
            onClick: () => history.push(routes.proof_of_address),
        },
        is_tnc_needed && {
            content: (
                <Localize
                    i18n_default_text='Accept our <0>updated Terms and Conditions</0>'
                    components={[
                        <a
                            key={0}
                            className='link'
                            rel='noopener'
                            target='_blank'
                            href={getDerivComLink('terms-and-conditions')}
                        />,
                    ]}
                />
            ),
            status: 'button-action',
            onClick: () => acceptTnc(),
        },
        is_financial_information_incomplete && {
            content: localize('Complete the financial assessment form'),
            status: 'action',
            onClick: () => {
                /* TODO: Add toggle deposit popup */
            },
        },
        is_trading_experience_incomplete && {
            content: localize('Complete the trading experience form'),
            status: 'action',
            onClick: () => {
                /* TODO: Add toggle deposit popup */
            },
        },
    ];
    return (
        <div className='deposit-locked'>
            <Icon icon='IcMoneyTransfer' className='deposit-locked__icon' />
            <h2 className='deposit-locked__title'>{localize('Deposits are locked')}</h2>
            <p className='deposit-locked__desc'>
                {localize('To enable this feature you must complete the following:')}
            </p>
            <Checklist className='deposit-locked__checklist' items={items} />
        </div>
    );
};

export default connect(({ client }) => ({
    account_status: client.account_status,
    is_tnc_needed: client.is_tnc_needed,
    is_financial_information_incomplete: client.is_financial_information_incomplete,
    is_trading_experience_incomplete: client.is_trading_experience_incomplete,
}))(withRouter(DepositsLocked));
