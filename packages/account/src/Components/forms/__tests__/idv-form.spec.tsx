import React from 'react';
import { Formik } from 'formik';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import IDVForm from '../idv-form';
import { TIDVFormValues } from '../../../Types';

jest.mock('Helpers/utils', () => ({
    ...jest.requireActual('Helpers/utils'),
    getDocumentData: jest.fn((country_code: string, key) => {
        const data: {
            [key: string]: {
                [key: string]: { new_display_name: string; example_format: string; sample_image: string };
            };
        } = {
            tc: {
                document_1: {
                    new_display_name: '',
                    example_format: '5436454364243',
                    sample_image: '',
                },
                document_2: {
                    new_display_name: '',
                    example_format: 'A-52431',
                    sample_image: '',
                },
            },
        };
        return data[country_code][key];
    }),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isDesktop: jest.fn(() => true),
    isMobile: jest.fn(() => false),
}));

describe('<IDVForm/>', () => {
    const mock_props: React.ComponentProps<typeof IDVForm> = {
        selected_country: {
            value: 'tc',
            identity: {
                services: {
                    idv: {
                        documents_supported: {
                            document_1: {
                                display_name: 'Test document 1 name',
                                format: '5436454364243',
                            },
                            document_2: {
                                display_name: 'Test document 2 name',
                                format: 'A54321',
                            },
                        },
                        has_visual_sample: 1,
                    },
                },
            },
        },
    };

    const mock_values = {
        document_type: {
            display_name: 'Test document 1 name',
            format: '5436454364243',
            id: '1',
            value: 'document_1',
        },
        document_number: '5436454364243',
    };

    it('should render IDVForm component', () => {
        render(<IDVForm {...mock_props} />, {
            wrapper: ({ children }) => (
                <Formik initialValues={mock_values} onSubmit={jest.fn()}>
                    {() => children}
                </Formik>
            ),
        });

        const document_type_input = screen.getByLabelText('Choose the document type');
        const document_number_input = screen.getByLabelText('Enter your document number');

        expect(document_type_input).toBeInTheDocument();
        expect(document_number_input).toBeInTheDocument();
    });

    it('Should change the document type value when document type is changed', async () => {
        render(<IDVForm {...mock_props} />, {
            wrapper: ({ children }) => (
                <Formik initialValues={mock_values} onSubmit={jest.fn()}>
                    {() => children}
                </Formik>
            ),
        });

        const document_type_input = screen.getByLabelText('Choose the document type');

        userEvent.click(document_type_input);
        expect(await screen.findByText('Test document 1 name')).toBeInTheDocument();
        userEvent.tab();
        await waitFor(() => {
            expect(screen.queryByText('Test document 1 name')).not.toBeInTheDocument();
        });
    });

    it('should render the hint messages for the selected document', async () => {
        const new_props: React.ComponentProps<typeof IDVForm> = {
            selected_country: {
                value: 'tc',
                identity: {
                    services: {
                        idv: {
                            documents_supported: {
                                document_1: {
                                    display_name: 'Test document 1 name',
                                    format: '5436454364243',
                                    additional: {
                                        display_name: 'Test document additional',
                                        format: '001234',
                                    },
                                },
                                document_2: {
                                    display_name: 'Test document 2 name',
                                    format: 'A54321',
                                },
                            },
                            has_visual_sample: 1,
                        },
                    },
                },
            },
        };

        const new_values: TIDVFormValues = {
            ...mock_values,
            document_type: {
                ...mock_values.document_type,
                text: '12345',
                additional: {
                    display_name: 'Additional number',
                    example_format: '0123456789',
                },
            },
        };

        render(<IDVForm {...new_props} />, {
            wrapper: ({ children }) => (
                <Formik initialValues={new_values} onSubmit={jest.fn()}>
                    {() => children}
                </Formik>
            ),
        });

        const document_type_input = screen.getByLabelText('Choose the document type');

        userEvent.click(document_type_input);
        await waitFor(() => {
            const el_selected_document = screen.getByText('Test document 1 name');
            fireEvent.change(el_selected_document);
        });
        expect(await screen.findByText('Example: 0123456789')).toBeInTheDocument();
    });

    it("Should hide document number field when 'I dont have any of these is chosen'", async () => {
        render(<IDVForm {...mock_props} />, {
            wrapper: ({ children }) => (
                <Formik initialValues={mock_values} onSubmit={jest.fn()}>
                    {() => children}
                </Formik>
            ),
        });

        const document_type_input = screen.getByLabelText('Choose the document type');
        const document_number_input = screen.getByText('Enter your document number');

        expect(document_type_input).toBeVisible();
        expect(document_number_input).toBeVisible();

        userEvent.click(document_type_input);
        userEvent.type(document_type_input, "I don't have any of these");

        await waitFor(() => {
            expect(document_number_input).not.toBeVisible();
        });
    });
});
