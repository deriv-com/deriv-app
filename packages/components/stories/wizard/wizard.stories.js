import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import Wizard from 'Components/wizard';
import Button from 'Components/button';
import { FlexWrapper, GroupWrapper, ButtonWrapper, Text } from '../button/shared-style';
import Theme from '../shared/theme';

const stories = storiesOf('Wizard', module);

stories.addDecorator(withKnobs).addDecorator(withInfo);

stories
    .add('Basic Usage', () => (
        <Theme is_dark={boolean('Theme', false)}>
            <FlexWrapper>
                <Wizard
                    steps={[
                        {
                            component: <Text size='1.2rem'>Customized component 1</Text>,
                        },
                        {
                            component: <Text size='1.2rem'>Customized component 2</Text>,
                        },
                    ]}
                    has_next
                    has_prev
                >
                    <Wizard.Header>
                        <Text size='1.6rem'>Customizable Header</Text>
                    </Wizard.Header>
                </Wizard>
            </FlexWrapper>
        </Theme>
    ))
    .add('Labeled Icons', () => (
        <Theme is_dark={boolean('Theme', false)}>
            <FlexWrapper>
                <Wizard
                    steps={[
                        {
                            component: <Text size='1.2rem'>Customized component 1</Text>,
                        },
                        {
                            component: <Text size='1.2rem'>Customized component 2</Text>,
                        },
                    ]}
                    lbl_previous='Back'
                    lbl_next='Next'
                    has_next
                    has_prev
                >
                    <Wizard.Header>
                        <Text size='1.6rem'>Labeled Icons Header</Text>
                    </Wizard.Header>
                </Wizard>
            </FlexWrapper>
        </Theme>
    ))
    .add('Custom Component', () => {
        const childRef = React.useRef();
        return (
            <Theme is_dark={boolean('Theme', false)}>
                <FlexWrapper>
                    <Wizard
                        ref={childRef}
                        steps={[
                            {
                                component: (
                                    <GroupWrapper>
                                        <Text size='1.2rem'>Customized component 1</Text>
                                        <ButtonWrapper>
                                            <Button
                                                onClick={() => childRef.current.nextStep()}
                                                text='Go to Next Step'
                                                primary
                                                medium
                                            />
                                        </ButtonWrapper>
                                    </GroupWrapper>
                                ),
                            },
                            {
                                component: (
                                    <GroupWrapper>
                                        <Text size='1.2rem'>Customized component 2</Text>
                                        <ButtonWrapper>
                                            <Button
                                                onClick={() => childRef.current.prevStep()}
                                                text='Go to previous Step'
                                                primary
                                                medium
                                            />
                                        </ButtonWrapper>
                                    </GroupWrapper>
                                ),
                            },
                        ]}
                    >
                        <Wizard.Header>
                            <Text size='1.6rem'>Custom Component Header</Text>
                        </Wizard.Header>
                    </Wizard>
                </FlexWrapper>
            </Theme>
        );
    });
