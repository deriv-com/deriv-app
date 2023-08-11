import React from 'react';
import { Localize } from '@deriv/translations';
import { getLegalEntityName } from '@deriv/shared';
import { Text } from '@deriv/components';
import { TBrokerCodes } from 'Types';

/**
 * Renders a horizontal line
 * @name Hr
 * @returns {JSX.Element}
 */
export const Hr = () => <div className='terms-of-use__hr' />;

/**
 * Renders the broker specific message based on the broker code
 *@name BrokerSpecificMessage
 * @param {TBrokerCodes} param - The broker code string
 * @returns {JSX.Element}
 */
export const BrokerSpecificMessage = ({ target }: { target: TBrokerCodes }) => (
    <React.Fragment>
        {target === 'svg' && <SVGDescription />}
        {target === 'iom' && <IOMDescription />}
        {target === 'malta' && <MaltaDescription />}
        {target === 'maltainvest' && <MaltaInvestDescription />}
        {target === 'samoa' && <SamoaDescription />}
    </React.Fragment>
);

/**
 * Returns the terms of use message specific to SVG broker code
 * @name SVGDescription
 * @returns {JSX.Element}
 */
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
                    legal_entity_name: getLegalEntityName('svg'),
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

/**
 * Returns the terms of use message specific to IOM broker code
 * @name IOMDescription
 * @returns {JSX.Element}
 */
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

/**
 * Returns the terms of use message specific to Malta broker code
 * @name MaltaDescription
 * @returns {JSX.Element}
 */
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

/**
 * Returns the terms of use message specific to MaltaInvest broker code
 * @name MaltaInvestDescription
 * @returns {JSX.Element}
 */
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
                    legal_entity_name: getLegalEntityName('maltainvest'),
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

/**
 * Returns the terms of use message specific to Samoa broker code
 * @name SamoaDescription
 * @returns {JSX.Element}
 */
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

/**
 * Returns the generic terms of use message
 * @name SVGDescription
 * @returns {JSX.Element}
 */
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
