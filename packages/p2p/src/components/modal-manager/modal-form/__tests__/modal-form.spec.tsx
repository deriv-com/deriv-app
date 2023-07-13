import React from 'react';
import { screen, render } from '@testing-library/react';
import { useStores } from 'Stores/index';
import ModalForm from '../modal-form';
import { FormikProps, FormikValues } from 'formik';

const modal_form_props = {
    initialValues: {
        n: 0,
    },
    onSubmit: jest.fn(),
};

let mock_store: DeepPartial<ReturnType<typeof useStores>>;

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

describe('<ModalForm />', () => {
    beforeEach(() => {
        mock_store = {
            general_store: {
                formik_ref: null,
                saved_form_state: null,
            },
        };

        mock_store.general_store.setFormikRef = (formik_ref: React.MutableRefObject<FormikProps<FormikValues>>) => {
            mock_store.general_store.formik_ref = formik_ref;
        };
    });

    it('should render ModalForm component', () => {
        render(<ModalForm {...modal_form_props}>{({ values }) => <h1>Value: {values.n}</h1>}</ModalForm>);

        expect(screen.getByText('Value: 0')).toBeInTheDocument();
    });

    it('should set formik_ref', () => {
        render(<ModalForm {...modal_form_props}>{({ values }) => <h1>Value: {values.n}</h1>}</ModalForm>);

        expect(mock_store.general_store.formik_ref).not.toBeNull();
    });

    it('should restore saved form values when ModalForm is rendered', () => {
        mock_store.general_store.saved_form_state = {
            values: {
                n: 1,
            },
        };

        render(<ModalForm {...modal_form_props}>{({ values }) => <h1>Value: {values.n}</h1>}</ModalForm>);

        expect(screen.getByText('Value: 1')).toBeInTheDocument();
    });
});
