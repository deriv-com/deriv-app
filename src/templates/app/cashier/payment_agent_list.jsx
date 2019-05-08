import React from 'react';
import Loading from '../../_common/components/loading.jsx';

const Table = ({ trs }) => (
    <table>
        { trs.map((tr,inx) => (
            <tr key={inx}>
                <td colSpan='1'>{tr.text}</td>
                <td colSpan='3'>
                    { (tr.href || tr.mailto) ?
                        <a href={`${tr.mailto ? 'mailto:' : ''}${tr.placeholder}`} target='_blank' rel='noopener noreferrer'>
                            {tr.placeholder}
                        </a>
                        : tr.placeholder
                    }
                </td>
            </tr>
        ))}
    </table>
);

const PaymentAgentList = () => (
    <div id='paymentagent_deposit'>
        <h1>{it.L('How to use a payment agent?')}</h1>
        <p>{it.L('You can use an authorized payment agent to process deposits and withdrawals for payment methods or local currencies not supported by [_1]. It\'s easy to do.', it.website_name)}</p>
        <ol>
            <li>{it.L('Check out the payment methods accepted by the payment agents in the list below.')}</li>
            <li>{it.L('Choose the payment method you\'d like to use.')}</li>
            <li>{it.L('Contact the payment agent directly for more information on how to transfer money to them.')}</li>
            <li>{it.L('Send your funds to the payment agent. The deposited funds, less the agent\'s commission, will show up in your account.')}</li>
        </ol>

        <div className='loading'>
            <Loading />
        </div>

        <div id='pa_list'>
            <div id='accordion' className='invisible'>
                <h3>%name</h3>
                <div>
                    <p />
                    <Table
                        trs={[
                            { text: it.L('Name')                     , placeholder: '%name' },
                            { text: it.L('Currency')                 , placeholder: '%currency' },
                            { text: it.L('Min / Max withdrawal')     , placeholder: '%minmax' },
                            { text: it.L('Summary')                  , placeholder: '%summary' },
                            { text: it.L('Commission on deposits')   , placeholder: '%deposit_commission%' },
                            { text: it.L('Commission on withdrawals'), placeholder: '%withdrawal_commission%' },
                            { text: it.L('Website')                  , placeholder: '%url', href: true },
                            { text: it.L('Email')                    , placeholder: '%email', mailto: true },
                            { text: it.L('Tel')                      , placeholder: '%telephone' },
                            { text: it.L('Further information')      , placeholder: '%further_information' },
                        ]}
                    />
                    <div className='supported_banks'>%supported_banks</div>
                </div>
            </div>
        </div>

        <p id='no_paymentagent' className='notice-msg center-text invisible'>{it.L('Payment Agent services are not available in your country or in your preferred currency.')}</p>

        <p>{it.L('Apply to become a [_1] [_2]payment agent[_3].', it.website_name, `<a href="${it.url_for('payment-agent')}">`, '</a>')}</p>
        <p className='comment'>
            <strong>{it.L('IMPORTANT DISCLAIMER')}</strong> - {it.L('[_1] is not affiliated with any of the payment agents listed above. Each payment agent operates as an independent service provider and is not endorsed, guaranteed or otherwise approved by [_1]. CUSTOMERS DEAL WITH PAYMENT AGENTS AT THEIR SOLE RISK AND PERIL. Customers are advised to check the credentials of payment agents before sending them any money. [_1] shall not in any circumstance be held responsible for transactions made between customers and payment agents.', it.website_name)}
        </p>
    </div>
);

export default PaymentAgentList;
