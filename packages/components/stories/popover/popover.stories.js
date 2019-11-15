import React         from 'react';
import { storiesOf } from '@storybook/react';
import Theme         from '../shared/theme';
import PopoverWrapper       from '../../src/components/popover/popover';

const portal_container = 'root';
storiesOf('PopoverWrapper', module)
    .add(
        'Basic usage',
        () => (
            <div style={{
                display       : 'flex',
                width         : '100%',
                height        : '100%',
                justifyContent: 'center',
                alignItems    : 'center',
            }}
            >
                <PopoverWrapper
                    classNameBubble='network-status__tooltip'
                    alignment='bottom'
                    message='Network status: Connecting to server'
                    has_error={true}
                    portal_container={portal_container}
                >
                    <p>
                        Hover me
                    </p>
                </PopoverWrapper>
            </div>
        )
    );
