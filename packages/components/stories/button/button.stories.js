import { action }    from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React         from 'react';
import Button        from '../../src/components/button/button.jsx';

storiesOf('Button', module)
    .add(
        'simple',
        () => (
            <Button
                onClick={action('clicked')}
                text='Simple'
                classNameSpan='text-wrapper'
                id='button_id'
            />
        ), {
            notes: 'A very simple example of button example',
        }
    )
    .add(
        'disabled',
        () => (
            <Button
                is_disabled={true}
                onClick={action('clicked!!')}
                id='button_id'
                text='Disabled button'
            />
        ), {
            notes: 'Set `is_disabled={true}` prop to make it disabled',
        }
    )
    .add(
        'with children',
        () => (
            <Button id='button_id' onClick={action('clicked!')}>
                <h1>Multiline</h1>
                <p>This is a simple paragraph</p>
            </Button>
        ),
    )
    .add(
        'wrapped',
        () => (
            <Button
                onClick={action('clicked!')}
                text='This is wrapped inside class .wrapped'
                id='button_id'
                wrapperClassName='wrapped'
            />
        ), {
            notes: 'if you pass `wrapperClassName=\'CLASSNAME\'` it will be wrapped inside another div with the given class name.',
        }
    )
    .add(
        'withEffect',
        () => (
            <div>
                <Button
                    id='button_id'
                    has_effect={true}
                    onClick={action('clicked!')}
                    text='Click me!'
                />
                <Button
                    id='button_id'
                    has_effect={false}
                    onClick={action('clicked!')}
                    text='No effects'
                />
            </div>
        ), {
            notes: 'Enabling effects is as easy as passing `has_effect=true` to the prop',
        }
    );
