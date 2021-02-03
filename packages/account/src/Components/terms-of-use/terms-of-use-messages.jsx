import React from 'react';
import { Localize } from '@deriv/translations';
import { Text } from '@deriv/components';

export const Hr = () => <div className='terms-of-use__hr' />;

export const BrokerSpecificMessage = ({ target }) => (
    <React.Fragment>
        {target === 'svg' && <SVGDescription />}
        {target === 'iom' && <IOMDescription />}
        {target === 'malta' && <MaltaDescription />}
        {target === 'maltainvest' && <MaltaInvestDescription />}
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
                    'Your account will be opened with Deriv (SVG) LLC, and will be subject to the jurisdiction and laws of Saint Vincent and the Grenadines.'
                }
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
                    'Your account will be opened with Deriv (MX) Ltd, regulated by the UK Gaming Commission (UKGC) and subject to the jurisdiction and laws of Isle of Man.'
                }
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
                    'Your account will be opened with Deriv (Europe) Limited, regulated by the Malta Gaming Authority, and will be subject to the laws of Malta.'
                }
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
                    'Your account will be opened with Deriv Investments (Europe) Limited, regulated by the Malta Financial Services Authority (MFSA) and will be subject to the jurisdiction and laws of Malta.'
                }
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
                    'Your account will be opened with Deriv Capital International Ltd and will be subject to the jurisdiction and laws of Samoa.'
                }
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
