// TODO refactor old tests in this component
import React from 'react';
// import { fake } from 'sinon';
import { Button } from '@deriv/components';
import ToggleButton from '../toggle-button.jsx';
import { beforeEach } from '@jest/globals';

describe('<ToggleButton />', () => {
    it('should render a <Button /> element', () => {
        // const wrapper = shallow(<ToggleButton value='test'>Test</ToggleButton>);
        // expect(wrapper.type()).toBe(Button);
    });

    // it('should render a <Button /> element with selected class name', () => {
    //     const wrapper = shallow(
    //         <ToggleButton value='test' is_selected>
    //             Test
    //         </ToggleButton>
    //     );
    //     expect(wrapper.hasClass('toggle-button--selected')).toBe(true);
    // });

    // describe('prop: onClick', () => {
    //     let event;

    //     beforeEach(() => {
    //         event = {
    //             preventDefault: () => {},
    //             isDefaultPrevented: () => true,
    //         };
    //     });

    //     it('should be called when the button clicked', () => {
    //         const callback = fake();
    //         const wrapper = shallow(
    //             <ToggleButton value='test' onClick={callback}>
    //                 Test
    //             </ToggleButton>
    //         );
    //         wrapper.simulate('click', event);
    //         expect(callback.toBeCalled()).toBe(true);
    //     });

    //     it('should be called with the button value when the button clicked', () => {
    //         const callback = fake();
    //         const wrapper = shallow(
    //             <ToggleButton value='test' onClick={callback}>
    //                 Test
    //             </ToggleButton>
    //         );
    //         wrapper.simulate('click', event);
    //         expect(callback.lastArg).toBe('test');
    //     });
    // });

    // describe('prop: onChange', () => {
    //     let event;
    //     let defaultPreventd = false;

    //     beforeEach(() => {
    //         event = {
    //             preventDefault: () => {
    //                 defaultPreventd = true;
    //             },
    //             isDefaultPrevented: () => defaultPreventd,
    //         };
    //     });

    //     it('should be called when the button clicked', () => {
    //         const callback = fake();
    //         const wrapper = shallow(
    //             <ToggleButton value='test' onChange={callback}>
    //                 Test
    //             </ToggleButton>
    //         );
    //         wrapper.simulate('click', event);
    //         expect(callback.toBeCalled()).toBe(true);
    //     });

    //     it('should be called with the button value when the button clicked', () => {
    //         const callback = fake();
    //         const wrapper = shallow(
    //             <ToggleButton value='test' onChange={callback}>
    //                 Test
    //             </ToggleButton>
    //         );
    //         wrapper.simulate('click', event);
    //         expect(callback.lastArg).toBe('test');
    //     });

    //     it('should not be called when the click is prevented', () => {
    //         const callback = fake();
    //         const wrapper = shallow(
    //             <ToggleButton value='test' onChange={callback} onClick={event => event.preventDefault()}>
    //                 Test
    //             </ToggleButton>
    //         );

    //         wrapper.simulate('click', event);
    //         expect(callback.callCount).toBe(0);
    //     });
    // });
});
