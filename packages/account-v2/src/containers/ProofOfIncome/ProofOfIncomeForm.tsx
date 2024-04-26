import React from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { StandaloneArrowUpFromBracketBoldIcon } from '@deriv/quill-icons';
import { Button, Divider, Text, useDevice } from '@deriv-com/ui';
import { FormDropDownField } from '../../components/FormFields';
import { FormDocumentUploadField } from '../../components/FormFields/FormDocumentUploadField';
// import { LeaveConfirm } from 'src/components/LeaveConfirm';x
import { FormSubHeader } from '../../components/FormSubHeader';
import { ProofOfIncomeUtils } from './ProofOfIncomeUtils';

export const ProofOfIncomeForm = () => {
    const PoincDocumentsList = ProofOfIncomeUtils();
    const { isMobile } = useDevice();
    const listItems = [
        'The document must be up-to-date and signed by the issuance authority.',
        'The document must contain a letterhead.',
        'Invalid or incomplete documents shall be rejected.',
    ];
    const documentValidation = Yup.mixed().required('Please upload a file');

    return (
        <div className='relative z-0 h-full w-full  grid gap-16 '>
            <Formik>
                <Form>
                    <section>
                        <section>
                            <div className='mb-[2.4rem]'>
                                <FormSubHeader>Select Document</FormSubHeader>
                            </div>

                            <FormDropDownField
                                className='flex items-start self-stretch h-full border border-[color:var(--border-normal)] border-solid justify-between'
                                label='Select Document'
                                list={PoincDocumentsList}
                                name='Select Document'
                            />
                        </section>

                        <section>
                            <div className='mb-[1.4rem]'>
                                <FormSubHeader>Document submission</FormSubHeader>
                            </div>

                            <section className='flex flex-col items-start w-full px-16 py-16 space-y-20 lg:border-solid lg:border-1 border-solid-grey-5  mb-[2.4rem]'>
                                <Text size='sm' weight='bold'>
                                    The document must be recent and include your name and address:
                                </Text>

                                <ul className='pl-20 list-disc'>
                                    {listItems.map(item => (
                                        <li className='py-5' key={`list-item-${item}`}>
                                            <Text size='sm'>{item}</Text>
                                        </li>
                                    ))}
                                </ul>

                                <div className='flex flex-col items-start gap-16 w-full'>
                                    <Text size='sm' weight='bold'>
                                        Upload File
                                    </Text>
                                    <FormDocumentUploadField
                                        className='w-full'
                                        description='Remember, selfies , pictures of houses, or non-related images will be rejected.'
                                        descriptionColor='primary'
                                        descriptionSize='2xs'
                                        fileFormats={[
                                            'image/jpeg',
                                            'image/jpg',
                                            'image/png',
                                            'image/gif',
                                            'application/pdf',
                                        ]}
                                        hoverMessage='Upload your file here'
                                        icon={
                                            <StandaloneArrowUpFromBracketBoldIcon
                                                className='fill-solid-green-2'
                                                iconSize='lg'
                                            />
                                        }
                                        maxSize={8388608}
                                        name='document'
                                        title='Drag and drop a file or click to browse your files.'
                                        titleType='bold'
                                        validationSchema={documentValidation}
                                    />
                                    <div className='flex items-start self-stretch justify-between'>
                                        <Text size={isMobile ? '2xs' : 'xs'}>
                                            Supported formats : JPEG, JPG, PNG, PDF, and GIF only
                                        </Text>
                                        <Text size={isMobile ? '2xs' : 'xs'}>Maximum size : 8MB</Text>
                                    </div>
                                </div>
                            </section>
                        </section>
                    </section>
                </Form>
            </Formik>

            <div>
                <Divider />
                <div className='sticky bottom-0 flex justify-end flex-shrink-0 w-full px-20 py-16 '>
                    <Button color='primary' rounded='sm' size='md' type='button' variant='contained'>
                        Save and Submit
                    </Button>
                </div>
            </div>
        </div>
    );
};
