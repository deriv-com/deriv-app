import React, { useMemo } from 'react';
import { Formik } from 'formik';
import { useSettings, useStatesList } from '@deriv/api-v2';
import { Loader, ModalStepWrapper, WalletButton } from '../../../../components';
import { AddressSection } from './components';
import './Poa.scss';

const Poa: React.FC = () => {
    const { data: settings, isLoading: isSettingsLoading } = useSettings();
    const country = settings?.country_code ?? '';
    const { data: statesList, isLoading: isStatesListLoading } = useStatesList(country);

    const initialValues = useMemo(
        () => ({
            firstLine: settings.address_line_1,
            secondLine: settings.address_line_2,
            stateProvinceLine: settings.address_state,
            townCityLine: settings.address_city,
            zipCodeLine: settings.address_postcode,
        }),
        [
            settings.address_city,
            settings.address_line_1,
            settings.address_line_2,
            settings.address_postcode,
            settings.address_state,
        ]
    );

    const initalStatus = useMemo(
        () => ({
            statesList,
        }),
        [statesList]
    );

    const handleOnSubmit = () => {
        null;
    };

    const Footer = () => {
        return <WalletButton type='submit'>Next</WalletButton>;
    };

    if (isSettingsLoading || isStatesListLoading) return <Loader />;

    return (
        <Formik initialStatus={initalStatus} initialValues={initialValues} onSubmit={handleOnSubmit}>
            {() => {
                return (
                    <ModalStepWrapper renderFooter={() => <Footer />} title='Add a real MT5 account'>
                        <div className='wallets-poa'>
                            <AddressSection />
                        </div>
                    </ModalStepWrapper>
                );
            }}
        </Formik>
    );
};

export default Poa;
