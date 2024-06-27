import React from 'react';
import { ActionSheet, Heading, Text } from '@deriv-com/quill-ui';
import { Localize, localize } from '@deriv/translations';

type TDefinition = { definition: string; onClose: () => void };

const Definition = ({ definition, onClose }: TDefinition) => {
    return (
        <ActionSheet.Root isOpen={!!definition} onClose={onClose} position='left'>
            <ActionSheet.Portal shouldCloseOnDrag>
                <ActionSheet.Content className='guide__wrapper'>
                    <Heading.H4 className='guide__title'>{localize(definition ?? '')}</Heading.H4>
                    <div>
                        <Text>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed asperiores, voluptates qui
                            velit accusamus excepturi possimus voluptatibus, eius maxime ipsa provident, repudiandae
                            officia sint cupiditate unde nam delectus cumque deserunt?
                        </Text>
                    </div>
                </ActionSheet.Content>
                <ActionSheet.Footer
                    alignment='vertical'
                    primaryAction={{
                        content: <Localize i18n_default_text='Got it' />,
                        onAction: onClose,
                    }}
                    className='guide__button'
                />
            </ActionSheet.Portal>
        </ActionSheet.Root>
    );
};

export default Definition;
