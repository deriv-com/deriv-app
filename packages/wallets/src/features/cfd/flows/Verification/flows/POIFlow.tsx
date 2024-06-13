import React, { useState } from 'react';
import { Formik, useFormikContext } from 'formik';
import { useInvalidateQuery } from '@deriv/api-v2';
import { FlowProvider, ModalStepWrapper, WalletButton } from '../../../../../components';
import { THooks } from '../../../../../types';
import { IDVDocumentUpload, ManualDocumentUpload } from '../../../../accounts';
import { Onfido } from '../../../screens';

type TPOIFlow = {
    poiData?: THooks.POI;
};

const Footer = (onBackHandler, onNextHandler) => {
    return (
        <div>
            {onBackHandler && (
                <WalletButton onClick={onBackHandler} variant='outlined'>
                    Back
                </WalletButton>
            )}
            {onNextHandler && <WalletButton onClick={onNextHandler}>Next</WalletButton>}
        </div>
    );
};

const POIFlow: React.FC<TPOIFlow> = ({ poiData }) => {
    const invalidate = useInvalidateQuery();
    const service = poiData?.current.service;
    let Screen: () => JSX.Element, nextHandler: () => void, backHandler: () => void;

    switch (service) {
        case 'idv':
            Screen = IDVDocumentUpload;
            break;
        case 'onfido':
            Screen = Onfido;
            break;
        case 'manual':
            Screen = ManualDocumentUpload;
            nextHandler = () => {
                invalidate('get_account_status');
            };
            break;
        default:
            break;
    }

    return (
        <Formik
            initialStatus={{
                onNextHandler: null,
            }}
            initialValues={{}}
            // onSubmit={() => {}}
        >
            {() => {
                return (
                    <ModalStepWrapper
                        renderFooter={() => <Footer onBackHandler={backHandler} onNextHandler={nextHandler} />}
                    >
                        <Screen />
                    </ModalStepWrapper>
                );
            }}
        </Formik>
    );
};

export default POIFlow;
