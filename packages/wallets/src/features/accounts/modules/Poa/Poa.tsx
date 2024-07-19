import React from 'react';
import { Formik } from 'formik';
import { Loader } from '@deriv-com/ui';
import { ModalStepWrapper } from '../../../../components';
import { Footer } from '../components';
import { AddressSection, DocumentSubmission } from './components';
import { usePoa } from './hooks';
import { poaValidationSchema } from './utils';
import './Poa.scss';

type TPoaProps = {
    onCompletion?: () => void;
};

const Poa: React.FC<TPoaProps> = ({ onCompletion }) => {
    const { initialStatus, initialValues, isLoading, isSuccess: isSubmissionSuccess, submit } = usePoa();

    if (isLoading) return <Loader />;

    if (isSubmissionSuccess && onCompletion) {
        onCompletion();
    }

    return (
        <Formik
            initialStatus={initialStatus}
            initialValues={initialValues}
            onSubmit={submit}
            validationSchema={poaValidationSchema}
        >
            {({ handleSubmit, isValid }) => {
                return (
                    <ModalStepWrapper
                        renderFooter={() => <Footer disableNext={!isValid} onClickNext={handleSubmit} />}
                        title='Add a real MT5 account'
                    >
                        <div className='wallets-poa'>
                            <AddressSection />
                            <DocumentSubmission />
                        </div>
                    </ModalStepWrapper>
                );
            }}
        </Formik>
    );
};

export default Poa;
