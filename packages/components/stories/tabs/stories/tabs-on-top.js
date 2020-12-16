import React from 'react';
import { boolean } from '@storybook/addon-knobs';
import Tabs from 'Components/tabs';
import Wrapper from '../../shared/wrapper';

const TabsOnTop = () => (
    <Wrapper is_block is_dark={boolean('Dark Theme', false)}>
        <Tabs top>
            <div header_content='Tab one' label='Tab label'>
                <div className='tab-content-storybook'>Content for tab 1</div>
            </div>
            <div header_content='Tab two' label='Tab label'>
                <div className='tab-content-storybook'>Content for tab 2</div>
            </div>
            <div header_content='Tab three' label='Tab label'>
                <div className='tab-content-storybook'>Content for tab 3</div>
            </div>
        </Tabs>
    </Wrapper>
);

export default TabsOnTop;
