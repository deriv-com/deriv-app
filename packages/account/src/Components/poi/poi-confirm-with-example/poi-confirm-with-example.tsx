import PoiNameDobExample from 'Assets/ic-poi-name-dob-example.svg';
import React from 'react';
import { HintBox, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import InlineNoteWithIcon from 'Components/inline-note-with-icon';

type TPoiConfirmWithExample =
    | {
          name_dob_clarification_message?: string;
          name_clarification_message?: never;
          dob_clarification_message?: never;
      }
    | {
          name_dob_clarification_message?: never;
          name_clarification_message?: string;
          dob_clarification_message?: never;
      }
    | {
          name_dob_clarification_message?: never;
          name_clarification_message?: never;
          dob_clarification_message?: string;
      };

const PoiNameDobExampleIcon = PoiNameDobExample as React.ElementType;

const PoiConfirmWithExample = ({
    name_dob_clarification_message,
    name_clarification_message,
    dob_clarification_message,
}: TPoiConfirmWithExample) => {
    return (
        <div className='poi-confirm-example'>
            <InlineNoteWithIcon message={name_dob_clarification_message} font_size='xs' />
            <div className='poi-confirm-example__container'>
                {name_dob_clarification_message && <PoiNameDobExampleIcon />}
                {name_clarification_message && 'name example'}
                {dob_clarification_message && 'dob example'}
                <div>
                    <div>inputs</div>
                    <div>inputs</div>
                    <div>inputs</div>
                </div>
            </div>
            <Text className='proof-of-identity__text text' size='xs' align='center'>
                {localize(
                    'I confirm that the name and date of birth above match my chosen identity document (see below)'
                )}
            </Text>
        </div>
    );
};

export default PoiConfirmWithExample;
