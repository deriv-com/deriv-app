import * as React from 'react';
import { Autocomplete, Button, DesktopWrapper, Input, MobileWrapper, Text, SelectNative } from '@deriv/components';
import { localize } from '@deriv/translations';
import FormFooter from 'Components/form-footer';

import BackButtonIcon from '../../Assets/ic-poi-back-btn.svg';
import DocumentUploadLogo from '../../Assets/ic-document-upload-icon.svg';

const DocumentUpload = ({ handleBack }) => {
    return (
        <div className='proof-of-identity__container'>
            <DocumentUploadLogo className='btm-spacer' />
            <Text className='proof-of-identity__header' align='center' weight='bold'>
                Verify your identity
            </Text>
            <Text className='btm-spacer'>Please select the document type and enter the document number.</Text>
            <fieldset className='proof-of-identity__fieldset'>
                <DesktopWrapper>
                    <div className='document-dropdown'>
                        <Autocomplete
                            data-lpignore='true'
                            autoComplete='off' // prevent chrome autocomplete
                            type='text'
                            label={localize('Choose the document type')}
                            list_items={['Passport', 'National Id']}
                            required
                        />
                    </div>
                </DesktopWrapper>
                <MobileWrapper>
                    <SelectNative
                        label={localize('Choose the document type')}
                        list_items={['Passport', 'National Id']}
                        use_text={true}
                        required
                    />
                </MobileWrapper>
            </fieldset>
            <fieldset className='proof-of-identity__fieldset'>
                <Input autoComplete='off' name='document_number' placeholder='Enter your document number' required />
            </fieldset>
            <FormFooter>
                <Button onClick={handleBack} className='back-btn' type='button' has_effect large secondary>
                    <BackButtonIcon className='back-btn' /> {localize('Go Back')}
                </Button>
                <Button type='button' has_effect is_disabled={true} text={localize('Verify')} large primary />
            </FormFooter>
        </div>
    );
};

export default DocumentUpload;
