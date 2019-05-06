import React from 'react';
import { Fieldset } from '../../_common/components/forms.jsx';

const ProfessionalClient = () => (
    <Fieldset legend={it.L('Professional Client')} id='fs_professional' className='invisible'>
        <div className='gr-padding-10 gr-12'>
            <p>{it.L('By default, all [_1] clients are retail clients but anyone can request to be treated as a professional client.', it.website_name)}</p>
            <input id='chk_professional' type='checkbox' />
            <label htmlFor='chk_professional'>{it.L('I would like to be treated as a professional client.')}&nbsp;</label>
            <a id='professional_info_toggle' className='toggle-arrow' href='javascript:;'>{it.L('Learn more.')}</a>
            <div id='professional_info' style={{ display: 'none' }}>
                <div id='non_uk' className='invisible'>
                    <p>{it.L('Clients need to satisfy at least two of the following criteria in order to receive Professional Client status:')}</p>
                    <ul className='checked'>
                        <li>{it.L('You\'ve carried out significant transactions on markets similar to the ones we offer, averaging 10 transactions per quarter for the previous four quarters')}</li>
                        <li>{it.L('The size of your instrument portfolio exceeds EUR 500,000 or its equivalent')}</li>
                        <li>{it.L('You\'ve worked in the financial sector for at least one year in a role that requires knowledge of your intended transactions on our platform')}</li>
                    </ul>
                    <p>{it.L('If you choose to be treated as a Professional Client, we\'ll regard you as having the required market knowledge and experience. As such, we\'ll take steps to ensure that your request for Professional Client status meets the above criteria, including a request for the following:')}</p>
                </div>
                <div id='uk' className='invisible'>
                    <p>{it.L('By opting to be treated as a Professional Client, we shall not presume that you possess market knowledge and experience as defined by the term \'Professional Client\'. We will contact you with the relevant form to complete and will take all reasonable steps to ensure that your request for this Categorization meets the aforementioned criteria, including, but not limited to copies of:')}</p>
                </div>
                <ul className='bullet'>
                    <li>{it.L('Statements that reflect your transactions from the previous four quarters')}</li>
                    <li>{it.L('Proof of your portfolio held elsewhere')}</li>
                    <li>{it.L('Proof of your employment')}</li>
                </ul>
            </div>
        </div>
        <div id='popup' className='invisible gr-padding-20 gr-gutter'>
            <h2>{it.L('Professional Clients')}</h2>
            <p>{it.L('A Professional Client receives a lower degree of client protection due to the following:')}</p>
            <ul className='bullet'>
                <li>{it.L('We presume that you possess the experience, knowledge, and expertise to make your own investment decisions and properly assess the risks involved')}</li>
                <li>{it.L('We\'re not obliged to conduct an appropriateness test, nor provide you with any risk warnings')}</li>
            </ul>
            <p>{it.L('As a Professional Client, you must keep us informed about any changes that may affect your status.')}</p>
            <div className='center-text'>
                <a className='button' id='btn_accept' href='javascript:;'><span>{it.L('Accept')}</span></a>
                <a className='button' id='btn_decline' data-value='decline' href='javascript:;'><span>{it.L('Decline')}</span></a>
            </div>
            <p><strong>{it.L('Note: You may decline and continue as a Retail Client.')}</strong></p>
        </div>
    </Fieldset>
);

export default ProfessionalClient;
