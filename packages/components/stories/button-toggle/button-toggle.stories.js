import { storiesOf } from '@storybook/react';
import ButtonToggle from 'Components/button-toggle';
import React from 'react';
import notes from './README.md';
import './button-toggle.stories.scss';

storiesOf('ButtonToggle', module).add(
    'Main function',
    () => {
        const [selected, setSelected] = React.useState('BUY');

        const bottons_list = [
            {
                text: 'Buy',
                value: 'BUY',
                count: 5,
            },
            {
                text: 'Sell',
                value: 'SELL',
            },
        ];

        return (
            <React.Fragment>
                <div className={'buttontoggle__wrapper'}>
                    <ButtonToggle
                        buttons_arr={bottons_list}
                        is_animated
                        name='type'
                        onChange={item => {
                            setSelected(item.target.value);
                        }}
                        value={selected}
                        has_rounded_button
                    />
                </div>
            </React.Fragment>
        );
    },
    {
        notes,
    }
);
