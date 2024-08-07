import React from 'react';
import { ActionSheet, Heading, Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { getTermDefinition } from 'AppV2/Utils/contract-description-utils';

type TGuideDefinitionModal = {
    contract_type: string;
    term: string;
    onClose: () => void;
};

const GuideDefinitionModal = ({ contract_type, term, onClose }: TGuideDefinitionModal) => (
    <ActionSheet.Root isOpen={!!term} onClose={onClose} position='left' expandable={false}>
        <ActionSheet.Portal shouldCloseOnDrag>
            <ActionSheet.Content className='definition__wrapper'>
                <Heading.H4 className='definition__title'>{term}</Heading.H4>
                <Text as='div'>{getTermDefinition({ term, contract_type })}</Text>
            </ActionSheet.Content>
            <ActionSheet.Footer
                alignment='vertical'
                primaryAction={{
                    content: <Localize i18n_default_text='Got it' />,
                    onAction: onClose,
                }}
                className='definition__button'
            />
        </ActionSheet.Portal>
    </ActionSheet.Root>
);

export default GuideDefinitionModal;
