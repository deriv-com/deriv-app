import React from 'react';
import { Localize } from '@deriv/translations';
import { getLegalEntityName, Jurisdiction } from '@deriv/shared';
import { Text } from '@deriv/components';

export const Hr = () => <div className='terms-of-use__hr' />;

export const BrokerSpecificMessage = ({ target }) => (
    <React.Fragment>
        {target === Jurisdiction.SVG && <SVGDescription />}
        {target === 'iom' && <IOMDescription />}
        {target === 'malta' && <MaltaDescription />}
        {target === Jurisdiction.MALTA_INVEST && <MaltaInvestDescription />}
        {target === 'samoa' && <SamoaDescription />}
    </React.Fragment>
);

export const SVGDescription = () => (
    <React.Fragment>
        <Text as='h4' size='xs' weight='bold'>
            <Localize i18n_default_text={'Jurisdiction and choice of law'} />
        </Text>
        <p>
            <Localize
                i18n_default_text={
                    'Your account will be opened with {{legal_entity_name}}, and will be subject to the laws of Saint Vincent and the Grenadines.'
                }
                values={{
                    legal_entity_name: getLegalEntityName(Jurisdiction.SVG),
                }}
            />
        </p>
        <Hr />
        <Text as='h4' size='xs' weight='bold'>
            <Localize i18n_default_text={'Risk warning'} />
        </Text>
        <p>
            <Localize
                i18n_default_text={
                    'The financial trading services offered on this site are only suitable for customers who accept the possibility of losing all the money they invest and who understand and have experience of the risk involved in the purchase of financial contracts. Transactions in financial contracts carry a high degree of risk. If the contracts you purchased expire as worthless, you will lose all your investment, which includes the contract premium.'
                }
            />
        </p>
    </React.Fragment>
);

export const IOMDescription = () => (
    <React.Fragment>
        <Text as='h4' size='xs' weight='bold'>
            <Localize i18n_default_text={'Jurisdiction and choice of law'} />
        </Text>
        <p>
            <Localize
                i18n_default_text={
                    'Your account will be opened with {{legal_entity_name}}, regulated by the UK Gaming Commission (UKGC), and will be subject to the laws of the Isle of Man.'
                }
                values={{
                    legal_entity_name: getLegalEntityName('mx'),
                }}
            />
        </p>
    </React.Fragment>
);

export const MaltaDescription = () => (
    <React.Fragment>
        <Text as='h4' size='xs' weight='bold'>
            <Localize i18n_default_text={'Jurisdiction and choice of law'} />
        </Text>
        <p>
            <Localize
                i18n_default_text={
                    'Your account will be opened with {{legal_entity_name}}, regulated by the Malta Gaming Authority, and will be subject to the laws of Malta.'
                }
                values={{
                    legal_entity_name: getLegalEntityName('malta'),
                }}
            />
        </p>
    </React.Fragment>
);

export const MaltaInvestDescription = () => (
    <React.Fragment>
        <Text as='h4' size='xs' weight='bold'>
            <Localize i18n_default_text={'Jurisdiction and choice of law'} />
        </Text>
        <p>
            <Localize
                i18n_default_text={
                    'Your account will be opened with {{legal_entity_name}}, regulated by the Malta Financial Services Authority (MFSA), and will be subject to the laws of Malta.'
                }
                values={{
                    legal_entity_name: getLegalEntityName(Jurisdiction.MALTA_INVEST),
                }}
            />
        </p>
        <Hr />
        <Text as='h4' size='xs' weight='bold'>
            <Localize i18n_default_text='Risk warning' />
        </Text>
        <p>
            <Localize
                i18n_default_text={
                    'The financial trading services offered on this site are only suitable for customers who accept the possibility of losing all the money they invest and who understand and have experience of the risk involved in the purchase of financial contracts. Transactions in financial contracts carry a high degree of risk. If the contracts you purchased expire as worthless, you will lose all your investment, which includes the contract premium.'
                }
            />
        </p>
    </React.Fragment>
);

export const SamoaDescription = () => (
    <React.Fragment>
        <Text as='h4' size='xs' weight='bold'>
            <Localize i18n_default_text={'Jurisdiction and choice of law'} />
        </Text>
        <p>
            <Localize
                i18n_default_text={
                    'Your account will be opened with {{legal_entity_name}} and will be subject to the laws of Samoa.'
                }
                values={{
                    legal_entity_name: getLegalEntityName('samoa'),
                }}
            />
        </p>
        <Hr />
        <Text as='h4' size='xs' weight='bold'>
            <Localize i18n_default_text={'Risk warning'} />
        </Text>
        <p>
            <Localize
                i18n_default_text={
                    'The financial trading services offered on this site are only suitable for customers who accept the possibility of losing all the money they invest and who understand and have experience of the risk involved in the purchase of financial contracts. Transactions in financial contracts carry a high degree of risk. If the contracts you purchased expire as worthless, you will lose all your investment, which includes the contract premium.'
                }
            />
        </p>
    </React.Fragment>
);

export const SharedMessage = () => (
    <React.Fragment>
        <Text as='h4' size='xs' weight='bold'>
            <Localize i18n_default_text='Real accounts are not available to politically exposed persons (PEPs).' />
        </Text>
        <p>
            <Localize i18n_default_text='A politically exposed person (PEP) is someone appointed with a prominent public position. Close associates and family members of a PEP are also considered to be PEPs.' />
        </p>
    </React.Fragment>
);
