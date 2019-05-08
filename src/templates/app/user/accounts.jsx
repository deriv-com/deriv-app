import React             from 'react';
import Loading           from '../../_common/components/loading.jsx';
import { SeparatorLine } from '../../_common/components/separator_line.jsx';
import { Table }         from '../../_common/components/elements.jsx';

const Accounts = () => (
    <React.Fragment>
        <div id='accounts_loading'>
            <Loading />
        </div>

        <div className='invisible' id='accounts_wrapper'>
            <h1>{it.L('Create or Manage Accounts')}</h1>

            <div className='invisible' id='new_accounts_wrapper'>
                <form id='new_accounts'>
                    <Table
                        className='responsive'
                        id='new_accounts_table'
                        scroll
                        data={{
                            thead: [
                                [
                                    { text: it.L('Account') },
                                    { text: it.L('Available Markets') },
                                    { text: it.L('Available Currencies') },
                                    { text: it.L('Action') },
                                ],
                            ],
                        }}
                    />
                </form>
                <div id='note' className='invisible fill-bg-color gr-padding-10 gr-gutter'>
                    <div className='gr-gutter hint'>
                        {it.L('Note: You can only have one fiat currency account and one of each cryptocurrency account.')}
                    </div>
                </div>
            </div>
            <div className='border-light-gray invisible' id='no_new_accounts_wrapper'>
                <p className='center-text gr-padding-30'>{it.L('You have created all accounts available to you.')}</p>
            </div>

            <SeparatorLine className='gr-padding-20' show_mobile invisible />

            <h1>{it.L('Your Existing Accounts')}</h1>
            <Table
                scroll
                id='existing_accounts'
                className='responsive'
                data={{
                    thead: [
                        [
                            { text: it.L('Account') },
                            { text: it.L('Type') },
                            { text: it.L('Available Markets') },
                            { text: it.L('Currency') },
                        ],
                    ],
                }}
            />
            <div id='note_support' className='invisible fill-bg-color gr-padding-10 gr-gutter'>
                <div className='gr-gutter hint'>
                    {it.L('Note: For any enquiries regarding disabled or excluded accounts, please contact [_1]Customer Support[_2].', `<a href="${it.url_for('contact')}">`, '</a>')}
                </div>
            </div>

            <SeparatorLine className='gr-padding-30' sub_class='gr-padding-10' show_mobile invisible />
        </div>
    </React.Fragment>
);

export default Accounts;
