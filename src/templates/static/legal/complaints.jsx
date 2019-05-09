import React from 'react';

const Complaints = () => (
    <div>
        <h2 data-anchor='complaints-and-disputes'>{it.L('Complaints and disputes')}</h2>
        <p>{it.L('If the client would like to file a complaint with regards to the Company\'s service, the client can contact the Company at [_1], providing any relevant details relating to the client\'s complaint. The Company will investigate the client\'s enquiry and a response will be given. The Company usually provides a final response within [_2] working days from receipt of all relevant details.', '<a href=\'mailto:complaints@binary.com\'>complaints@binary.com</a>', '15')}</p>
        <p data-show='eucountry'>{it.L('If the client\'s complaint relates to the Company\'s data processing practices, the client may formally submit a complaint to the Information and Data Protection Commissioner (Malta) on the entity\'s [_1]website[_2]. Alternatively, the client can make a complaint to any Supervisory Authority within the European Union.',
            '<a href="https://idpc.org.mt/en/Pages/Home.aspx" target="_blank" rel="noopener noreferrer">', '</a>')}
        </p>
        <p>{it.L('Clients registered with Binary (IOM) Ltd can formally submit a complaint to their local Supervisory Authority.')}</p>
        <p data-show='eucountry'>{it.L('If the client\'s complaint relates to an outcome of a trade or a transaction and remains unresolved, it will turn into a dispute. Should clients be unsatisfied with the Company\'s response, they can choose to escalate their complaint to the regulator or to an alternative dispute resolution entity.')}</p>
        <p>{it.L('Clients registered with Binary (IOM) Ltd can raise their unresolved disputes with the alternative dispute resolution entity IBAS by filling the adjudication form on the ADR entity\'s [_1]website[_2].',
            '<a href=\'https://www.ibas-uk.com\' target=\'_blank\' rel=\'noopener noreferrer\'>', '</a>')}
        </p>
        <p data-show='eucountry'>{it.L('Clients registered with Binary (Europe) Ltd can raise their unresolved disputes with the alternative dispute resolution entity IBAS by filling the adjudication form on the ADR entity\'s [_1]website[_2] or they can refer to the Malta Gaming Authority via the [_3]Player Support Unit[_4].',
            '<a href="https://www.ibas-uk.com" target="_blank" rel="noopener noreferrer">', '</a>', '<a href="http://www.mga.org.mt/support/online-gaming-support/" target=\'_blank\' rel=\'noopener noreferrer\'>', '</a>')}
        </p>
        <p data-show='eucountry'>{it.L('Alternatively, EU residents who are registered with both Binary (IOM) Ltd and Binary (Europe) Ltd, can make use of the European Commission\'s Online Dispute Resolution (ODR) platform available [_1]here[_2].',
            '<a href="https://ec.europa.eu/odr" target="_blank" rel="noopener noreferrer">', '</a>')}
        </p>
        <p data-show='eucountry'>{it.L('Clients registered with Binary Investments (Europe) Ltd can raise their unresolved disputes with the Office of the Arbiter for Financial Services. Contact details and guidance on making a complaint with the Arbiter\'s Office can be found [_1]here[_2].',
            '<a href="https://financialarbiter.org.mt" target="_blank" rel="noopener noreferrer">', '</a>')}
        </p>
        <p>{it.L('It is important that clients refer their disputes to the appropriate ADR for the claims to be valid.')}</p>
    </div>
);

export default Complaints;
