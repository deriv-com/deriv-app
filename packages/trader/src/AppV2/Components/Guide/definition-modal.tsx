import React from 'react';
import { ActionSheet, Heading, Text } from '@deriv-com/quill-ui';
import { Localize, localize } from '@deriv/translations';
import { DEFINITION } from 'AppV2/Utils/trade-types-utils';

type TDefinition = { is_accumulators: boolean; term: string; onClose: () => void };

const DefinitionModal = ({ is_accumulators, term, onClose }: TDefinition) => {
    const getDefinition = () => {
        const result = DEFINITION[term];
        if (typeof result === 'function') return result(is_accumulators);
        return result;
    };

    return (
        <ActionSheet.Root isOpen={!!term} onClose={onClose} position='left'>
            <ActionSheet.Portal shouldCloseOnDrag>
                <ActionSheet.Content className='definition__wrapper'>
                    <Heading.H4 className='definition__title'>{localize(term)}</Heading.H4>
                    <Text>{getDefinition()}</Text>
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
};

export default DefinitionModal;
