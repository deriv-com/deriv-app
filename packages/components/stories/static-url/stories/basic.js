import React from 'react';
import { PlatformContext } from '@deriv/shared';
import { boolean } from '@storybook/addon-knobs';
import StaticUrl from 'Components/static-url';
import Wrapper from '../../shared/wrapper';

const Provider = ({ children }) => <PlatformContext.Provider>{children}</PlatformContext.Provider>;

const Basic = () => (
    <Provider>
        <Wrapper is_dark={boolean('Dark Theme', false)}>
            <StaticUrl href={'about'}>Link to the about page on deriv.com.</StaticUrl>
        </Wrapper>
    </Provider>
);

export default Basic;
