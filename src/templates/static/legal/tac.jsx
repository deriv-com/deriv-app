import React from 'react';
import Complaints from './complaints.jsx';
import ConflictsPolicy from './conflicts_policy.jsx';
import Copyright from './copyright.jsx';
import Datafeed from './datafeed.jsx';
import OrderExecutionBinary from './order_execution.jsx';
import OrderExecutionMT from './metatrader/order_execution.jsx';
import RiskDisclaimerBinary from './risk_disclaimer.jsx';
import MAM from './mam.jsx';
import RiskDisclaimerMT from './metatrader/risk_disclaimer.jsx';
import PaymentAgents from './payment_agents.jsx';
import Privacy from './privacy.jsx';
import TermsAndConditionsBinary from './terms_and_conditions.jsx';
import TermsAndConditionsMT from './metatrader/terms_and_conditions.jsx';
import { SidebarSubmenu, SidebarContent, SidebarContentContainer } from '../../_common/components/sidebar.jsx';

const Tac = () => (
    <div className='gr-row static_full'>
        <div className='gr-3 gr-12-p gr-12-m gr-padding-10'>
            <SidebarSubmenu
                id='legal-menu'
                items={[
                    {
                        id     : 'legal',
                        text   : it.L('Terms and Conditions'),
                        submenu: [
                            { id: 'legal-binary', text: it.L('General') },
                            { id: 'legal-mt',     text: it.L('MetaTrader') },
                        ],
                    },
                    { id: 'mam',              text: it.L('MAM'), className: 'invisible' }, // toEnableMAM: remove className
                    { id: 'datafeed',         text: it.L('Data Feed') },
                    { id: 'privacy',          text: it.L('Security and Privacy') },
                    { id: 'conflicts-policy', text: it.L('Conflicts Policy') },
                    { id: 'copyright',        text: it.L('Copyright') },
                    { id: 'complaints',       text: it.L('Complaints and Disputes') },
                    {
                        id     : 'risk',
                        text   : it.L('Risk Disclaimer'),
                        submenu: [
                            { id: 'risk-binary', text: it.L('Binary Options') },
                            { id: 'risk-mt',     text: it.L('MetaTrader') },
                        ],
                    },
                    {
                        id     : 'order-execution',
                        text   : it.L('Order Execution'),
                        submenu: [
                            { id: 'order-execution-binary', text: it.L('Binary Options') },
                            { id: 'order-execution-mt',     text: it.L('MetaTrader') },
                        ],
                    },
                    { id: 'payment-agents', text: it.L('Payment Agents'), dataShow: '-eucountry' },
                ]}
            />
        </div>

        <div className='gr-9 gr-12-p gr-12-m gr-padding-10'>
            <SidebarContentContainer>
                <SidebarContent id='legal-binary'>
                    <TermsAndConditionsBinary />
                </SidebarContent>

                <SidebarContent id='legal-mt'>
                    <TermsAndConditionsMT />
                </SidebarContent>

                <SidebarContent id='mam'>
                    <MAM />
                </SidebarContent>

                <SidebarContent id='datafeed'>
                    <Datafeed />
                </SidebarContent>

                <SidebarContent id='privacy'>
                    <Privacy />
                </SidebarContent>

                <SidebarContent id='conflicts-policy'>
                    <ConflictsPolicy />
                </SidebarContent>

                <SidebarContent id='copyright'>
                    <Copyright />
                </SidebarContent>

                <SidebarContent id='complaints'>
                    <Complaints />
                </SidebarContent>

                <SidebarContent id='risk-binary'>
                    <RiskDisclaimerBinary />
                </SidebarContent>

                <SidebarContent id='risk-mt'>
                    <RiskDisclaimerMT />
                </SidebarContent>

                <SidebarContent id='order-execution-binary'>
                    <OrderExecutionBinary />
                </SidebarContent>

                <SidebarContent id='order-execution-mt'>
                    <OrderExecutionMT />
                </SidebarContent>

                <SidebarContent id='payment-agents'>
                    <PaymentAgents />
                </SidebarContent>
            </SidebarContentContainer>
        </div>
    </div>
);

export default Tac;
