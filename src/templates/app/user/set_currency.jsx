import React             from 'react';
import Loading           from '../../_common/components/loading.jsx';
import { SeparatorLine } from '../../_common/components/separator_line.jsx';

const Currencies = ({ text, id }) => (
    <React.Fragment>
        <div className='section-divider gr-padding-20 gr-row invisible' id={`${id}_currencies`}>
            <div className='align-self-center border-bottom-light-gray' />
            <div className='faded'>{text}</div>
            <div className='align-self-center border-bottom-light-gray' />
        </div>
        <div className='gr-8 gr-10-p gr-12-m gr-centered'>
            <div className='gr-row gr-row-align-center gr-padding-20 gr-parent currency_list' id={`${id}_currency_list`} />
        </div>
    </React.Fragment>
);

const SetCurrency = () => (
    <React.Fragment>
        <div id='set_currency_loading'>
            <Loading />
        </div>

        <div className='invisible' id='set_currency'>
            <div className='center-text'>
                <div className='invisible' id='hide_new_account'>
                    <h1>{it.L('Select currency')}</h1>
                </div>
                <div className='invisible' id='show_new_account'>
                    <img src={it.url_for('images/pages/set_currency/account-created.svg')} />
                    <div className='gr-padding-10' />
                    <h1>{it.L('Congratulations!')}</h1>
                    <p id='congratulations_message'>{it.L('You have successfully created your real money [_1]account.', `<span data-show="iom">${it.L('gaming')}&nbsp;</span>`)}</p>
                </div>

                <SeparatorLine show_mobile className='gr-parent gr-padding-10' invisible />

                <div id='deposit_btn' className='invisible'>
                    <div>
                        <a className='button' href={it.url_for('cashier/forwardws?action=deposit')}><span>{it.L('Make a deposit')}</span></a>
                    </div>
                </div>

                <div className='invisible select_currency'>
                    <p id='set_currency_text'>{it.L('Please select the currency for this account:')}</p>
                </div>
            </div>

            <div className='center-text invisible select_currency'>
                <form id='frm_set_currency'>
                    <Currencies id='fiat' text={it.L('Fiat Currency')} />
                    <Currencies id='crypto' text={it.L('Cryptocurrency')} />
                </form>
            </div>
            <p className='invisible error-msg center-text' />
        </div>
    </React.Fragment>
);

export default SetCurrency;
