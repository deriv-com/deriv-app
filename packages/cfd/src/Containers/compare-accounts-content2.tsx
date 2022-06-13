import React from 'react';
import { Modal, Button } from '@deriv/components';

const ModalConent2 = () => {
    const [verification_status] = React.useState('pending');
    const [verification_status2] = React.useState('verified');
    const [verification_status3] = React.useState('not_submitted');

    return (
        <div className='cfd-jurisdiction-card__wrapper'>
            <div className='cfd-jurisdiction-card'>
                <div className='cfd-jurisdiction-card__over-header'>
                    <p>Better leverage and spreads</p>
                </div>
                <h1>British Virgin Islands</h1>
                <div className='cfd-jurisdiction-card__bullet-wrapper'>
                    <span className='cfd-jurisdiction-card__bullet--checkmark'>
                        <div className='cfd-jurisdiction-card__bullet--checkmark_stem' />
                        <div className='cfd-jurisdiction-card__bullet--checkmark_kick' />
                    </span>
                    <span>
                        Regulated by the British Virgin Islands Financial Services Commission (License no.
                        SIBA/L/18/1114)
                    </span>
                </div>

                <div className='cfd-jurisdiction-card__bullet-wrapper'>
                    <span className='cfd-jurisdiction-card__bullet--checkmark'>
                        <div className='cfd-jurisdiction-card__bullet--checkmark_stem' />
                        <div className='cfd-jurisdiction-card__bullet--checkmark_kick' />
                    </span>
                    <span>Registered with the Financial Commission</span>
                </div>

                <div className='cfd-jurisdiction-card__bullet-wrapper'>
                    <span className='cfd-jurisdiction-card__bullet--checkmark'>
                        <div className='cfd-jurisdiction-card__bullet--checkmark_stem' />
                        <div className='cfd-jurisdiction-card__bullet--checkmark_kick' />
                    </span>
                    <span>
                        170+ assets: forex (standard/micro), stocks, stock indices, commodities, basket indices, and
                        cryptocurrencies
                    </span>
                </div>

                <div className='cfd-jurisdiction-card__bullet-wrapper'>
                    <span className='cfd-jurisdiction-card__bullet--checkmark'>
                        <div className='cfd-jurisdiction-card__bullet--checkmark_stem' />
                        <div className='cfd-jurisdiction-card__bullet--checkmark_kick' />
                    </span>
                    <span>Leverage up to 1:1000</span>
                </div>
                {verification_status === 'not_submitted' && (
                    <div className='cfd-jurisdiction-card__footer'>
                        <p>You will need to submit proof of identity and address</p>
                    </div>
                )}
                {verification_status === 'pending' && (
                    <div className='cfd-jurisdiction-card__verification-status'>
                        <p className='cfd-jurisdiction-card__verification-status--pending'>Pending verification</p>
                    </div>
                )}
                {verification_status === 'verified' && (
                    <div className='cfd-jurisdiction-card__verification-status'>
                        <p className='cfd-jurisdiction-card__verification-status--verified'>Verified</p>
                    </div>
                )}
            </div>
            <div className='cfd-jurisdiction-card'>
                <div className='cfd-jurisdiction-card__over-header'>
                    <p>Better leverage and spreads</p>
                </div>
                <h1>Vanuatu</h1>
                <div className='cfd-jurisdiction-card__bullet-wrapper'>
                    <span className='cfd-jurisdiction-card__bullet--checkmark'>
                        <div className='cfd-jurisdiction-card__bullet--checkmark_stem' />
                        <div className='cfd-jurisdiction-card__bullet--checkmark_kick' />
                    </span>
                    <span>Regulated by the Vanuatu Financial Services Commission</span>
                </div>

                <div className='cfd-jurisdiction-card__bullet-wrapper'>
                    <span className='cfd-jurisdiction-card__bullet--checkmark'>
                        <div className='cfd-jurisdiction-card__bullet--checkmark_stem' />
                        <div className='cfd-jurisdiction-card__bullet--checkmark_kick' />
                    </span>
                    <span>Registered with the Financial Commission</span>
                </div>

                <div className='cfd-jurisdiction-card__bullet-wrapper'>
                    <span className='cfd-jurisdiction-card__bullet--checkmark'>
                        <div className='cfd-jurisdiction-card__bullet--checkmark_stem' />
                        <div className='cfd-jurisdiction-card__bullet--checkmark_kick' />
                    </span>
                    <span>30+ assets: forex and commodities</span>
                </div>

                <div className='cfd-jurisdiction-card__bullet-wrapper'>
                    <span className='cfd-jurisdiction-card__bullet--checkmark'>
                        <div className='cfd-jurisdiction-card__bullet--checkmark_stem' />
                        <div className='cfd-jurisdiction-card__bullet--checkmark_kick' />
                    </span>
                    <span>Leverage up to 1:1000</span>
                </div>
                {verification_status2 === 'not_submitted' && (
                    <div className='cfd-jurisdiction-card__footer'>
                        <p>You will need to submit proof of identity and address</p>
                    </div>
                )}
                {verification_status2 === 'pending' && (
                    <div className='cfd-jurisdiction-card__verification-status'>
                        <p className='cfd-jurisdiction-card__verification-status--pending'>Pending verification</p>
                    </div>
                )}
                {verification_status2 === 'verified' && (
                    <div className='cfd-jurisdiction-card__verification-status'>
                        <p className='cfd-jurisdiction-card__verification-status--verified'>Verified</p>
                    </div>
                )}
            </div>
            <div className='cfd-jurisdiction-card'>
                <div className='cfd-jurisdiction-card__over-header'>
                    <p>Straight through processing</p>
                </div>
                <h1>Labuan</h1>
                <div className='cfd-jurisdiction-card__bullet-wrapper'>
                    <span className='cfd-jurisdiction-card__bullet--checkmark'>
                        <div className='cfd-jurisdiction-card__bullet--checkmark_stem' />
                        <div className='cfd-jurisdiction-card__bullet--checkmark_kick' />
                    </span>
                    <span>Regulated by the Labuan Financial Services Authority (licence no. MB/18/0024)</span>
                </div>

                <div className='cfd-jurisdiction-card__bullet-wrapper'>
                    <span className='cfd-jurisdiction-card__bullet--checkmark'>
                        <div className='cfd-jurisdiction-card__bullet--checkmark_stem' />
                        <div className='cfd-jurisdiction-card__bullet--checkmark_kick' />
                    </span>
                    <span>Registered with the Financial Commission</span>
                </div>

                <div className='cfd-jurisdiction-card__bullet-wrapper'>
                    <span className='cfd-jurisdiction-card__bullet--checkmark'>
                        <div className='cfd-jurisdiction-card__bullet--checkmark_stem' />
                        <div className='cfd-jurisdiction-card__bullet--checkmark_kick' />
                    </span>
                    <span>80+ assets: forex and cryptocurrencies</span>
                </div>

                <div className='cfd-jurisdiction-card__bullet-wrapper'>
                    <span className='cfd-jurisdiction-card__bullet--checkmark'>
                        <div className='cfd-jurisdiction-card__bullet--checkmark_stem' />
                        <div className='cfd-jurisdiction-card__bullet--checkmark_kick' />
                    </span>
                    <span>Leverage up to 1:100</span>
                </div>

                <div className='cfd-jurisdiction-card__bullet-wrapper'>
                    <span className='cfd-jurisdiction-card__bullet--checkmark'>
                        <div className='cfd-jurisdiction-card__bullet--checkmark_stem' />
                        <div className='cfd-jurisdiction-card__bullet--checkmark_kick' />
                    </span>
                    <span>Straight through processing</span>
                </div>
                {verification_status3 === 'not_submitted' && (
                    <div className='cfd-jurisdiction-card__footer'>
                        <p>You will need to submit proof of identity and address</p>
                    </div>
                )}
                {verification_status3 === 'pending' && (
                    <div className='cfd-jurisdiction-card__verification-status'>
                        <p className='cfd-jurisdiction-card__verification-status--pending'>Pending verification</p>
                    </div>
                )}
                {verification_status3 === 'verified' && (
                    <div className='cfd-jurisdiction-card__verification-status'>
                        <p className='cfd-jurisdiction-card__verification-status--verified'>Verified</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ModalConent2;
