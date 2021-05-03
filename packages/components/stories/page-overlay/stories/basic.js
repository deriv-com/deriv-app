import React from 'react';
import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';
import PageOverlay from 'Components/page-overlay';
import page_content from '../page-content';
import Wrapper from '../../shared/wrapper';

const Basic = () => (
    <Wrapper is_dark={boolean('Dark Theme', false)}>
        <PageOverlay header={<h1>Page Header</h1>} onClickClose={action('onClickClose')}>
            <div>
                <h2>Page content:</h2>
                <p>{page_content}</p>
            </div>
        </PageOverlay>
    </Wrapper>
);

export default Basic;
