import { storiesOf } from '@storybook/react';
import {
    boolean,
    withKnobs }      from '@storybook/addon-knobs';
import { withInfo }  from '@storybook/addon-info';
import React         from 'react';
import Icon          from 'Components/icon';
import { icons }     from './icons.js';
import Theme         from '../shared/theme';
import {
    FlexWrapper,
    Text }           from '../button/shared-style';

const stories = storiesOf('Icon', module);

stories.addDecorator(withKnobs).addDecorator(withInfo);

const grid_style = {
    display            : 'grid',
    gridAutoRows       : 'auto',
    gridAutoColumns    : 'max-content',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gridColumnGap      : '0.8rem',
    gridRowGap         : '0.8rem',
};

stories
    .addDecorator(story => <div style={{ padding: '3.2rem' }}>{story()}</div>)
    .add(
        'color',
        () => (
            <Theme is_dark={boolean('Theme', false)}>
                <div style={{ padding: '3.2rem', ...grid_style, gridTemplateColumns: 'repeat(6, minmax(160px, 1fr))' }}>
                    <Text size='2.4rem'>default</Text>
                    <Text size='2.4rem'>active</Text>
                    <Text size='2.4rem'>disabled</Text>
                    <Text size='2.4rem'>red</Text>
                    <Text size='2.4rem'>green</Text>
                    <Text size='2.4rem'>color</Text>

                    <Icon icon='IcArrowUp' size={64} />
                    <Icon icon='IcArrowUp' size={64} active />
                    <Icon icon='IcArrowUp' size={64} disabled />
                    <Icon icon='IcArrowUp' size={64} red />
                    <Icon icon='IcArrowUp' size={64} green />
                    <Icon icon='IcArrowUp' size={64} color />

                    <Icon icon='IcTradetypeDigitdiff' size={64} />
                    <Icon icon='IcTradetypeDigitdiff' size={64} active />
                    <Icon icon='IcTradetypeDigitdiff' size={64} disabled />
                    <Icon icon='IcTradetypeDigitdiff' size={64} red />
                    <Icon icon='IcTradetypeDigitdiff' size={64} green />
                    <Icon icon='IcTradetypeDigitdiff' size={64} color />

                    <Icon icon='IcContractExitTime' size={64} />
                    <Icon icon='IcContractExitTime' size={64} active />
                    <Icon icon='IcContractExitTime' size={64} disabled />
                    <Icon icon='IcContractExitTime' size={64} red />
                    <Icon icon='IcContractExitTime' size={64} green />
                    <Icon icon='IcContractExitTime' size={64} color />
                </div>
            </Theme>
        )
    )
    .add(
        'size',
        () => (
            <Theme is_dark={boolean('Theme', false)}>
                <FlexWrapper>
                    <Icon icon='IcArrowUp' size={24} />
                    <Icon icon='IcArrowUp' size={48} />
                    <Icon icon='IcArrowUp' size={64} />
                    <Icon icon='IcArrowUp' size={96} />
                    <Icon icon='IcArrowUp' size={128} />
                </FlexWrapper>
            </Theme>
        )
    ).add(
        'gallery',
        () => (
            <Theme is_dark={boolean('Theme', false)}>
                <div style={{ padding: '3.2rem' }}>
                    {Object.keys(icons).map((sprite, idx) => {
                        return (
                            <React.Fragment key={idx}>
                                <Text size='2.4rem'>{sprite}</Text>
                                <ul style={grid_style}>
                                    {icons[sprite].map((icon, index) => (
                                        <li key={index} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <div style={{
                                                padding        : '16px',
                                                borderRadius   : '8px',
                                                boxShadow      : '0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06)',
                                                backgroundColor: 'var(--general-main-1)',
                                            }}
                                            >
                                                <Icon
                                                    icon={icon}
                                                    size={48}
                                                    active={boolean('active', undefined)}
                                                    disabled={boolean('disabled', undefined)}
                                                    secondary={boolean('secondary', undefined)}
                                                    green={boolean('green', undefined)}
                                                    red={boolean('red', undefined)}
                                                    color={boolean('color', undefined)}
                                                />
                                            </div>
                                            <Text size='1.4rem'>{icon}</Text>
                                        </li>
                                    ))}
                                </ul>
                            </React.Fragment>
                        );
                    })}
                </div>
            </Theme>
        )
    );
    
