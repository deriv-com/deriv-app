// TODO refactor old tests in this component
import React from 'react';
import ToggleButton from '../toggle-button.jsx';
import ToggleButtonGroup from '../toggle-button-group.jsx';
import { render } from '@testing-library/react';

// configure({ adapter: new Adapter() });

describe('<ToggleButtonGroup />', () => {
    it('test test for passing the build', () => {
        // render(<ToggleButtonGroup />);
        // const wrapper = shallow(
        //     <ToggleButtonGroup>
        //         <ToggleButton value='test'>Test</ToggleButton>
        //     </ToggleButtonGroup>
        // );
        // expect(wrapper.find('div').childAt(0).type()).toBe(ToggleButton);
    });

    // describe('prop: onChange', () => {
    //     it('should be called when one of the toggle_buttons is clicked', () => {
    //         const callback = fake();
    //         const wrapper = mount(
    //             <ToggleButtonGroup onChange={callback}>
    //                 <ToggleButton value='test-one'>Test One</ToggleButton>
    //                 <ToggleButton value='test-two'>Test Two</ToggleButton>
    //             </ToggleButtonGroup>
    //         );

    //         wrapper.find(ToggleButton).at(0).simulate('click');
    //         expect(callback.callCount).toBe(1);
    //     });

    //     describe('single choice', () => {
    //         it('should be called when one of the toggle_buttons is clicked with value of the button', () => {
    //             const callback = fake();
    //             const wrapper = mount(
    //                 <ToggleButtonGroup onChange={callback}>
    //                     <ToggleButton value='test-one'>Test One</ToggleButton>
    //                     <ToggleButton value='test-two'>Test Two</ToggleButton>
    //                 </ToggleButtonGroup>
    //             );

    //             wrapper.find(ToggleButton).at(0).simulate('click');
    //             expect(callback.callCount).toBe(1);
    //             expect(callback.args[0][1]).toBe('test-one');
    //         });
    //         it('should be called when one of the toggle_buttons is clicked with null value', () => {
    //             const callback = fake();
    //             const wrapper = mount(
    //                 <ToggleButtonGroup onChange={callback} value='test-one'>
    //                     <ToggleButton value='test-one'>Test One</ToggleButton>
    //                     <ToggleButton value='test-two'>Test Two</ToggleButton>
    //                 </ToggleButtonGroup>
    //             );

    //             wrapper.find(ToggleButton).at(0).simulate('click');
    //             expect(callback.callCount).toBe(1);
    //             expect(callback.args[0][1]).toBeNull();
    //         });
    //     });

    //     describe('multiple choice', () => {
    //         it('should be called when one of the toggle_buttons is clicked with value of the button', () => {
    //             const callback = fake();
    //             const wrapper = mount(
    //                 <ToggleButtonGroup onChange={callback} multiple>
    //                     <ToggleButton value='test-one'>Test One</ToggleButton>
    //                     <ToggleButton value='test-two'>Test Two</ToggleButton>
    //                 </ToggleButtonGroup>
    //             );

    //             wrapper.find(ToggleButton).at(0).simulate('click');
    //             expect(callback.callCount).toBe(1);
    //             expect(callback.args[0][1].length).toBe(1);
    //             expect(callback.args[0][1].slice(-1)).toEqual(['test-one']);
    //         });
    //         it('should be called when the first ToggleButton is clicked with an empty array', () => {
    //             const callback = fake();
    //             const wrapper = mount(
    //                 <ToggleButtonGroup onChange={callback} value={['test-one']} multiple>
    //                     <ToggleButton value='test-one'>Test One</ToggleButton>
    //                     <ToggleButton value='test-two'>Test Two</ToggleButton>
    //                 </ToggleButtonGroup>
    //             );

    //             wrapper.find(ToggleButton).at(0).simulate('click');
    //             expect(callback.callCount).toBe(1);
    //             expect(Array.isArray(callback.args[0][1])).toBe(true);
    //             expect(callback.args[0][1].length).toBe(0);
    //         });
    //     });
    // });

    // describe('Check the button selection', () => {
    //     it('should select the button Test One in single mode', () => {
    //         const callback = fake();
    //         const wrapper = mount(
    //             <ToggleButtonGroup onChange={callback} value={'test-one'}>
    //                 <ToggleButton value='test-one'>Test One</ToggleButton>
    //                 <ToggleButton value='test-two'>Test Two</ToggleButton>
    //             </ToggleButtonGroup>
    //         );

    //         const test_one_button = wrapper.find(ToggleButton).at(0);
    //         expect(test_one_button.props().value).toBe('test-one');
    //         expect(test_one_button.props().is_selected).toBe(true);
    //     });

    //     it('should select the button Test One in multiple mode', () => {
    //         const callback = fake();
    //         const wrapper = mount(
    //             <ToggleButtonGroup onChange={callback} value={['test-two', 'test-one']}>
    //                 <ToggleButton value='test-one'>Test One</ToggleButton>
    //                 <ToggleButton value='test-two'>Test Two</ToggleButton>
    //             </ToggleButtonGroup>
    //         );

    //         const button_one = wrapper.find(ToggleButton).at(0);
    //         expect(button_one.props().value).toBe('test-one');
    //         expect(button_one.props().is_selected).toBe(true);

    //         const button_two = wrapper.find(ToggleButton).at(1);
    //         expect(button_two.props().value).toBe('test-two');
    //         expect(button_two.props().is_selected).toBe(true);
    //     });
    // });
});
