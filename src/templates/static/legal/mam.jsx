import React from 'react';

const MAM = () => (
    <div>
        <h2 data-anchor='mam-agreement'>{it.L('Multi-Account Manager (MAM) Agreement')}</h2>

        <h2 data-anchor='scope-of-agreement'>A. {it.L('Scope of Agreement')}</h2>
        <ol>
            <li>{it.L('This Agreement is between Binary (V) Ltd (hereinafter referred to as \'the Company\') and Client who authorises a Multi-Account Manager (hereinafter referred to as \'Money Manager\') to manage the Account on behalf of the Client, both of whom agree to bound by this Agreement as a supplement to the Client Agreement.')}</li>
        </ol>

        <h2 data-anchor='general'>B. {it.L('General')}</h2>
        <ol>
            <li>{it.L('This Agreement constitutes the entire Agreement between the Parties and no earlier representation, arrangement or agreement written or oral relation to any matter dealt with in this Agreement between the Parties shall have any force or effect before the Commencement Date.')}</li>
            <li>{it.L('This Agreement is supplied to the Client in English. In the event that there is a difference between the English version and any translated versions of this document, the English version shall prevail.')}</li>
            <li>{it.L('Each Party shall do anything reasonably required by the other Party to give effect to the terms of this Agreement.')}</li>
            <li>{it.L('If any terms of this Agreement be held invalid, void, or unenforceable by any relevant authority or regulatory body, the remainder of this Agreement shall remain in full force and effect.')}</li>
        </ol>

        <h2 data-anchor='interpretation'>C. {it.L('Interpretation')}</h2>
        <p>{it.L('For the purposes of this Agreement, the following shall mean:')}</p>
        <p>{it.L('"Account" means Client Trading Account opened with Binary (V) Ltd.')}</p>
        <p>{it.L('"Client Agreement" means the Agreement between the Client and the Company including but not limited to the Terms and Conditions, Order Execution Policy, and Slippage Policy.')}</p>
        <p>{it.L('"Commencement Date of this Agreement" shall mean the date on which an appointment of a Money Manager is made by the Client.')}</p>
        <p>{it.L('"Company" means Binary (V) Ltd, operating under the brand or trademark of [_1], incorporated and registered in the Republic of Vanuatu, under the International Companies Act Cap. 222 and Financial Dealers Licensing Act (Cap. 70), licensed to provide Investment services and dealing with Securities.', it.website_name)}</p>
        <p>{it.L('"Money Manager" means any physical person including any executor, representative, administrator or successor in law, authorised to manage the Account on behalf of the Client in accordance with this Agreement.')}</p>
        <p>{it.L('"Orders" means any Order or Orders for any transaction, under the Client Agreement and this Multi-Account Manager (MAM) Agreement.')}</p>
        <p>{it.L('"Transaction" means any purchase or sale of any financial Instrument including but not limited to CFDs, Rolling Spot FX, Commodities and any other securities or products may be offered by the Company to the Client, from time to time in accordance with the Client Agreement.')}</p>
        <p>{it.L('Binary options transactions fall out of the scope of this Multi-Account Manager (MAM) Agreement.')}</p>

        <h2 data-anchor='provisions-of-agreement'>D. {it.L('Provisions of Agreement')}</h2>
        <ol>
            <li>{it.L('By accepting this Agreement, you agree to authorise the Money Manager to manage your Account on your behalf in accordance with the Client Agreement.')}</li>
            <li>{it.L('You acknowledge that your Account shall be managed and traded only by the Money Manager and not by any other third parties.')}</li>
            <li>{it.L('You agree and authorise the Company to disclose to the Money Manager any data or information related to your Account.')}</li>
            <li>{it.L('Without prejudice of any right of the Company to decline any Order placed by the Money Manager, you hereby authorise the Company to accept Orders from the Money Manager and proceed transactions for your Account.')}</li>
            <li>{it.L('You agree and authorise the Money Manager to place all Orders and transactions for your Account in the same way and validity as you might place such Orders for your Account.')}</li>
            <li>{it.L('You acknowledge that the Company may accept Orders and proceed with transactions for your Account executed by any employees or representatives of the Money Manager.')}</li>
            <li>{it.L('You agree that this Agreement shall become effective on the Commencement Date. You also agree that unless this Agreement is revoked or terminated in accordance with Section E below, this Agreement shall remain valid and in full force.')}</li>
            <li>{it.L('You acknowledge that the Money Manager is entitled to receive USD 20/per lot for Commission as fee charges. You also agree that the Company reserves the right to revise the fee charges from time to time. You further acknowledge that the Company shall be responsible for calculating the fee charges, via its automated systems. Thus, the Company shall be duly authorised to deduct the amount, defined as Commission, from the Account and to pay the Money Manager.')}</li>
        </ol>

        <h2 data-anchor='termination'>E. {it.L('Termination')}</h2>
        <ol>
            <li>{it.L('You are unilaterally entitled to request the revocation of the appointment of your Money Manager by electronically revoking your Money Manager\'s authorisation through the relevant functions provided in the system.')}</li>
            <li>{it.L('Upon revocation, you acknowledge and understand that your Money Manager will lose all authorisation to manage your Account.')}</li>
            <li>{it.L('You acknowledge and agree that it is your absolute responsibility to ensure that all orders or positions have been closed in your Account prior to revocation.')}</li>
        </ol>

        <h2 data-anchor='indemnification'>F. {it.L('Indemnification')}</h2>
        <ol>
            <li>{it.L('Subject to the law and the terms of the Client Agreement, the Company shall not be liable to you or your Money Manager for any matter arising out of or in relation to this Agreement.')}</li>
            <li>{it.L('The Company shall not be responsible or liable to you for any negligence, misconduct, fraudulent acts and omissions made by you or your Money Manager.')}</li>
            <li>{it.L('You further agree to indemnify the Company from any loss, damage or liability arising out of your failure or refuse to confirm all Orders and/or transactions proceeded.')}</li>
        </ol>

        <h2 data-anchor='representation-or-warranty'>G. {it.L('Representation or Warranty')}</h2>
        <h3>I. {it.L('Company\'s Representation')}</h3>
        <ol>
            <li>{it.L('The Company shall provide you with online access to the trading platform on which the balance, margin, credit, and equity is displayed so you are able to monitor the status and performance of the Account. You agree that in case of incongruity, you will immediately contact the Company at [_1].', '<a href=\'mailto:support@binary.com\'>support@binary.com</a>')}</li>
        </ol>
        <h3>II. {it.L('Client\'s Representation')}</h3>
        <ol>
            <li>{it.L('You acknowledge that you have full legal power and capacity to submit and execute this Agreement and grant authorisation to the Money Manager to place any Order or proceed any transaction for your Account.')}</li>
            <li>{it.L('You acknowledge that your decision to assign all rights in relation to the management, trading and operation of the Account to the Money Manager is duly clear, voluntary and unqualified. You also declare that you took into consideration the risks associated with trading of Rolling Spot FX, CFDs, Commodities and any other securities or products that may be offered by the Company to you, from time to time in accordance with the Client Agreement.')}</li>
            <li>{it.L('You acknowledge that the Company cannot guarantee that the Software provided to the Money Manager is free of any errors. Thus, you agree that the Company shall not be liable or responsible for any damage and loss that incurs as a result of such error.')}</li>
            <li>{it.L('You acknowledge that the Money Manager is not an employee or representative of the Company. Thus, you agree that you have an absolute responsibility to diligently monitor the entire performance of your Account.')}</li>
            <li>{it.L('You acknowledge that the Money Manager is not authorised to withdraw or give instructions in relation to any payment transactions for your Account to any person other than yourself. Likewise, the Money Manager is not authorised to accept or amend any of the terms of the Client Agreement.')}</li>
            <li>{it.L('Subject to the applicable governing law and the Client Agreement, you represent and acknowledge that this Agreement shall be admissible as an evidence in any legal, judicial, administrative, arbitration or mediation proceedings.')}</li>
            <li>{it.L('You hereby confirm that in addition to the Client Agreement, you have carefully read and duly understood the contents of this Agreement and agree to be legally bound thereby.')}</li>
        </ol>
    </div>
);

export default MAM;
