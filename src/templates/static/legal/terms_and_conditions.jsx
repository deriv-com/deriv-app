import React from 'react';
import Affiliate from './tac_sections/affiliate.jsx';
import Api from './tac_sections/api.jsx';
import Biel from './tac_sections/biel.jsx';
import DepositBonus from './tac_sections/deposit_bonus.jsx';
import Tac from './tac_sections/tac.jsx';
import TradingRules from './tac_sections/trading_rules.jsx';

const Section = ({
    id = '',
    link_id,
    className = '',
    children,
    sectionNum,
}) => (
    <div id={id} className={`section ${className}`}>
        <a id={link_id} />
        <div className='section-content'>
            <div id={`section-${sectionNum}`}>{children}</div>
        </div>
    </div>
);

const TermsAndConditions = () => (
    <div className='tac-binary gr-row'>
        <div className='gr-12 gr-12-m gr-parent'>
            <Section sectionNum='1' link_id='tac'>
                <Tac />
            </Section>

            <Section sectionNum='2' link_id='trading-rules'>
                <TradingRules />
            </Section>

            <Section sectionNum='3' link_id='deposit-bonus' data-show='-eucountry'>
                <DepositBonus />
            </Section>

            <Section sectionNum='4' link_id='affiliate'>
                <Affiliate />
            </Section>

            <Section sectionNum='5' link_id='api'>
                <Api />
            </Section>

            <Section sectionNum='6' link_id='biel' data-show='eucountry'>
                <Biel />
            </Section>

            <Section sectionNum='7' id='tnc_accept' link_id='accept' className='tnc_accept invisible'>
                <div className='gr-9 gr-12-m gr-centered center-text'>
                    <p>{it.L('By clicking OK, you confirm that you have read and accepted Terms & Conditions.')}</p>
                    <button className='button' id='btn_accept'>{it.L('OK')}</button>
                    <p className='gr-12 error-msg center-text invisible' id='err_message' />
                </div>
            </Section>
        </div>
    </div>
);

export default TermsAndConditions;
