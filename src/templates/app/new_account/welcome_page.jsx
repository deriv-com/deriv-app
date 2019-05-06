import React             from 'react';
import { SeparatorLine } from '../../_common/components/separator_line.jsx';

const WelcomePage = () => (
    <div id='welcome_container' className='center-text static_full invisible'>
        <span className='account-created' />

        <SeparatorLine className='gr-padding-5' invisible />

        <h1>{it.L('Congratulations!')}</h1>
        <p>{it.L('You have successfully created your Virtual Account.')}</p>

        <SeparatorLine className='gr-padding-10' invisible />

        <div className='gr-8 gr-10-p gr-12-m gr-centered'>
            <div className='container gr-row box-grid'>
                <div className='gr-6 gr-12-p gr-12-m gr-parent'>
                    <div className='box border-gray gr-padding-10'>
                        <div>
                            <strong id='upgrade_title' />
                            <p id='upgrade_text' className='font-s'>{it.L('Upgrade your account and start trading using real money.')}</p>
                        </div>
                        <div className='box-item-end'>
                            <p><a id='upgrade_btn' href='javascript:;' className='button button-disabled' /></p>
                        </div>
                    </div>
                </div>
                <div className='gr-6 gr-12-p gr-12-m gr-parent'>
                    <div className='box border-gray gr-padding-10'>
                        <div>
                            <strong>{it.L('Virtual Account')}</strong>
                            <p className='font-s'>{it.L('Practice your trading strategies in a risk-free environment by using virtual funds.')}</p>
                        </div>
                        <div className='box-item-end'>
                            <p><a className='button-secondary' href={it.url_for('trading')}><span>{it.L('Start trading')}</span></a></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <SeparatorLine className='gr-padding-10' invisible />
    </div>
);

export default WelcomePage;
