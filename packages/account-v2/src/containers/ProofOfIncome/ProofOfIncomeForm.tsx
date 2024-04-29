import React from 'react';
import { Form, Formik } from 'formik';
import { StandaloneArrowUpFromBracketBoldIcon } from '@deriv/quill-icons';
import { Button, Divider, Text, useDevice } from '@deriv-com/ui';
import { FormDropDownField } from '../../components/FormFields';
import { FormDocumentUploadField } from '../../components/FormFields/FormDocumentUploadField';
import { FormSubHeader } from '../../components/FormSubHeader';
import { documentValidation, listItems, maxSizePOIC, poincDocumentsList } from '../../constants/proofofincomeConstants';

export const ProofOfIncomeForm = () => {
    const { isMobile } = useDevice();
    return (
        <div className='relative z-0 h-full w-full  grid gap-16 '>
            <Formik
                initialValues={{}}
                onSubmit={() => {
                    //TODO: Implement onSubmit
                }}
            >
                <Form>
                    <div>
                        <div>
                            <div className='mb-24'>
                                <FormSubHeader>Select Document</FormSubHeader>
                            </div>

                            <FormDropDownField
                                className='flex items-start self-stretch h-full border border-[color:var(--border-normal)] border-solid justify-between'
                                label='Select Document'
                                list={poincDocumentsList}
                                name='Select Document'
                            />
                        </div>

                        <section>
                            <div className='mb-14'>
                                <FormSubHeader>Document submission</FormSubHeader>
                            </div>

                            <section className='flex flex-col items-start w-full px-16 py-16 space-y-20 border-solid border-1 border-solid-grey-5  mb-24'>
                                <Text size='sm' weight='bold'>
                                    The document must be recent and include your name and address:
                                </Text>

                                <ul className='pl-20 list-disc'>
                                    {listItems.map(item => (
                                        <Text as='li' className='py-5' key={`list-item-${item}`} size='sm'>
                                            {item}
                                        </Text>
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
                                        maxSize={maxSizePOIC}
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
                    </div>
                </Form>
            </Formik>

            <section className='flex justify-end flex-col gap-8'>
                <Divider />
                <Button className='flex self-end' rounded='sm' size='lg' type='button'>
                    Save and Submit
                </Button>
            </section>
        </div>
    );
};
