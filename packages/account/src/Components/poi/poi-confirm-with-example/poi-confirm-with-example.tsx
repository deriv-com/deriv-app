import PoiNameDobExample from 'Assets/ic-poi-name-dob-example.svg';
import React from 'react';
import { HintBox, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import InlineNoteWithIcon from 'Components/inline-note-with-icon';

type TPoiConfirmWithExample = {
    name_dob_message?: string;
    // should_confirm_dob?: boolean;
};

const PoiNameDobExampleIcon = PoiNameDobExample as React.ElementType;

const PoiConfirmWithExample = ({ name_dob_message }: TPoiConfirmWithExample) => {
    return (
        <div className='poi-confirm-example'>
            <InlineNoteWithIcon message={name_dob_message} font_size='xs' />
            <div className='poi-confirm-example__container'>
                {name_dob_message && <PoiNameDobExampleIcon />}
                <div>
                    <Text className='proof-of-identity__text text' size='xs' align='center'>
                        {localize(
                            'I confirm that the name and date of birth above match my chosen identity document (see below)'
                        )}
                    </Text>
                </div>
            </div>
        </div>
    );
};

export default PoiConfirmWithExample;
