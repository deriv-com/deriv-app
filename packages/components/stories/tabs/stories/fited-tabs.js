import React from 'react';
import { boolean } from '@storybook/addon-knobs';
import Tabs from 'Components/tabs';
import Wrapper from '../../shared/wrapper';

const FitedTabs = () => (
    <Wrapper is_full_width is_dark={boolean('Dark Theme', false)}>
        <Tabs fit_content>
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

export default FitedTabs;
