import { storiesOf } from '@storybook/react';
import { boolean, number, withKnobs } from '@storybook/addon-knobs';
import React from 'react';
import Icon from 'Components/icon';
import LineSeparatedComponents from 'Components/line-separated-components';
import Text from 'Components/text';
import Theme from '../shared/theme.jsx';

storiesOf('LineSeparatedComponents', module)
    .addDecorator(withKnobs)
    .add('Main function', () => {
        return (
            <div style={{ padding: '16px', margin: 'auto', borderRadius: '4px' }}>
                <Theme is_dark={boolean('Theme', false)}>
                    <div style={{ padding: '16px' }}>
                        <div style={{ marginBottom: '8px' }}>
                            <Text as='p' size='s' color='prominent' weight='bold'>
                                Separate a bunch of components by a line
                            </Text>
                            <Text as='p' size='xs' color='less-prominent'>
                                Use the knobs below to interact with the component.
                            </Text>
                        </div>
                        <LineSeparatedComponents is_invisible_line={boolean('Invisible line?', false)}>
                            {Array.from(Array(number('Number of children', 3))).map((child, idx, array) => {
                                return (
                                    <React.Fragment key={idx}>
                                        <div style={{ marginRight: '8px', display: 'flex', alignItems: 'center' }}>
                                            <Icon icon='IcBrandDbot' size={20} />
                                        </div>
                                        <Text as='p'>{array.length} item(s)</Text>
                                    </React.Fragment>
                                );
                            })}
                        </LineSeparatedComponents>
                    </div>
                </Theme>
            </div>
        );
    });
