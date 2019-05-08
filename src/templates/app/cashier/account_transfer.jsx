import React from 'react';

const Row = ({ id }) => (
    <React.Fragment>
        <div>
            <p id={`transfer_success_${id}`} className='mb-bottom-10' />
            <span id={`${id}_loginid`} />
        </div>
        <br />
        <div>
            <p>{it.L('Current balance')}:</p>
            <p id={`${id}_current_balance`} />
        </div>
    </React.Fragment>
);

const AccountTransfer = () => (
    <React.Fragment>
        <h1>{it.L('Transfer Between Accounts')}</h1>

        <div className='invisible' id='client_message'>
            <p className='center-text notice-msg'>
                <span className='invisible' id='no_account'>{it.L('Fund transfers between accounts are unavailable.')}&nbsp;</span>
                <span className='invisible' id='not_enough_balance'>
                    {it.L('The minimum required amount for using the account transfer facility is [_1].', '<span id="min_required_amount"></span>')}
                    &nbsp;
                </span>
                <span className='invisible' id='no_balance'>
                    {it.L('Please [_1]deposit[_2] to your account.', `<a href='${it.url_for('cashier/forwardws?action=deposit')}'>`, '</a>')}
                    &nbsp;
                </span>
                <span className='invisible' id='limit_reached'>{it.L('You have reached your withdrawal limit.')}&nbsp;</span>
            </p>
        </div>

        <div className='invisible' id='error_message'>
            <p className='center-text notice-msg' />
        </div>

        <div className='invisible' id='success_form'>
            <p>{it.L('Your fund transfer is successful. Your new balances are:')}</p>
            <div className='transfer_form'>
                <div className='transfer_form__left_pane'>
                    <Row id='from' />
                </div>
                <div className='transfer_form__right_pane'>
                    <Row id='to' />
                </div>
            </div>
            <p>
                <a href='javascript:;' id='reset_transfer'>{it.L('Make another transfer')}</a>
            </p>
        </div>

        <form className='invisible' id='frm_account_transfer'>
            <p>{it.L('Transfer funds between your real money accounts.')}</p>

            <div className='transfer_form'>
                <div className='transfer_form__left_pane'>
                    <p>{it.L('Transfer from')}:</p>
                    <p id='lbl_transfer_from' />
                    <br />
                    <p>{it.L('Current balance')}:</p>
                    <p id='limit_current_balance' />
                </div>
                <div className='transfer_form__right_pane'>
                    <p>{it.L('Transfer to')}:</p>
                    <select id='transfer_to' />
                    <br />
                    <p>{it.L('Amount')}:</p>
                    <div className='transfer_form__right_pane__input_group'>
                        <div className='transfer_form__right_pane__input_group__prefix'>
                            <span id='amount-add-on' className='input-add-on' />
                            <input id='amount' name='amount' type='text' maxLength='20' autoComplete='off' />
                        </div>
                        <p className='font-s'>{it.L('Min')}: <span id='range_hint_min' /></p>
                        <p className='error-msg invisible' id='form_error' />
                    </div>
                    <br />
                    <p className='error-msg invisible' id='form_error' />
                    <button id='btn_submit' type='submit' className='button'>{it.L('Transfer')}</button>
                </div>
            </div>
        </form>

        <div className='hint invisible' id='transfer_fee'>
            {it.L('Notes:')}
            <ul className='bullet'>
                <li>{it.L('Transfer limit: [_1]*', '<span id=\'limit_max_amount\' />')}<br /><span className='italic'>{it.L('(This limit may vary depending on current exchange rates.)')}</span></li>
                <li>{it.L('There may be times when transfers are not available because the market is closed (weekends or holidays), there is high volatility in the market or because of technical issues.')}</li>
                <li>{it.L('You may only transfer funds between fiat and cryptocurrency accounts.')}</li>
                <li>{it.L('Each transfer is subject to a [_1] transfer fee or a minimum fee of [_2], whichever is higher.', '<span id="transfer_fee_amount"></span>', '<span id="transfer_fee_minimum"></span>')}</li>
                <li>{it.L('Authorised payment agents are exempted from paying any transfer fees.')}</li>
            </ul>
        </div>
    </React.Fragment>
);

export default AccountTransfer;
