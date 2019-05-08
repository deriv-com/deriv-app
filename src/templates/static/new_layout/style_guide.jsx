import React   from 'react';
import Tooltip from '../../../javascript/app_2/App/Components/Elements/tooltip.jsx';
import Button  from '../../../javascript/app_2/App/Components/Form/button.jsx';
import Input   from '../../../javascript/app_2/App/Components/Form/InputField/input.jsx';

const StyleGuide = () => (
    <div className='container'>
        <div className='gr-row gr-padding-20'>
            <div className='gr-8 gr-12-m'>
                <div className='gr-row'>
                    <div className='gr-12'>
                        <h2 className='center-text'>Buttons</h2>
                    </div>
                </div>
                <div className='gr-row'>
                    <div className='gr-12'>
                        <Button
                            id='test_btn'
                            className='primary orange'
                            text='primary'
                            has_effect
                        />
                        <Button
                            id ='test_btn'
                            className='primary green'
                            text='primary'
                            has_effect
                        />
                        <Button
                            id ='test_btn'
                            className='primary green'
                            text='primary'
                            has_effect
                            is_disabled
                        />
                    </div>
                    <div className='gr-12'>
                        <Button
                            id ='test_btn'
                            className='secondary orange'
                            text='secondary'
                            has_effect
                        />
                        <Button
                            id='test_btn'
                            className='secondary green'
                            text='secondary'
                            has_effect
                        />
                        <Button
                            id='test_btn'
                            className='secondary green'
                            text='secondary'
                            has_effect
                            is_disabled
                        />
                    </div>
                    <div className='gr-12 gr-centered'>
                        <Button
                            id='test_btn'
                            className='flat'
                            text='is used in a card'
                            has_effect
                        />
                    </div>
                </div>
            </div>
            <div className='gr-4 gr-12-m'>
                <div className='gr-row'>
                    <div className='gr-12'>
                        <h2 className='center-text'>Input Field</h2>
                    </div>
                </div>
                <div className='gr-row gr-padding-20'>
                    <div className='gr-12'>
                        <Input
                            type='text'
                            name='text'
                            is_read_only
                            value='text'
                            placeholder='Placeholder Text'
                            label='Text Field'
                        />
                    </div>
                </div>
                <div className='gr-row gr-padding-20'>
                    <div className='gr-12'>
                        <Input
                            type='number'
                            name='number'
                            is_read_only
                            value='1'
                            placeholder='Placeholder Number'
                            label='Numbers Field'
                        />
                    </div>
                </div>
                <div className='gr-row gr-padding-20'>
                    <div className='gr-12'>
                        <h2 className='center-text'>Tooltips</h2>
                        <div className='gr-row'>
                            <div className='gr-6'>
                                <p className='center-text'>
                                    <Tooltip alignment='top' message='Helper text here.' />
                                    <span style={{ fontSize: '12px' }}>Top</span>
                                </p>
                            </div>
                            <div className='gr-6'>
                                <p className='center-text'>
                                    <Tooltip alignment='left' message='Helper text here.' />
                                    <span style={{ fontSize: '12px' }}>Left</span>
                                </p>
                            </div>
                        </div>
                        <div className='gr-row'>
                            <div className='gr-6'>
                                <p className='center-text'>
                                    <Tooltip alignment='right' message='Helper text here.' />
                                    <span style={{ fontSize: '12px' }}>Right</span>
                                </p>
                            </div>
                            <div className='gr-6'>
                                <p className='center-text'>
                                    <Tooltip alignment='bottom' message='Helper text here.' />
                                    <span style={{ fontSize: '12px' }}>Bottom</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default StyleGuide;
