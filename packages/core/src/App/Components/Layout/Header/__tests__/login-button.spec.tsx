// TODO refactor old tests in this component
import React from 'react';
import { Button } from '@deriv/components';
import { LoginButton } from '../login-button.jsx';
import { render } from '@testing-library/react';

// configure({ adapter: new Adapter() });

describe('LoginButton', () => {
    it('should render one <LoginButton /> component', () => {
        render(<LoginButton />);
        // const wrapper = shallow(<LoginButton />);
        // expect(wrapper).toHaveLength(1);
    });
    // it('should have Button', () => {
    //     const wrapper = shallow(<LoginButton />);
    //     expect(wrapper.find(Button).exists()).toBe(true);
    // });
    // it('should have onClick prop of Button as an instance of Function', () => {
    //     const wrapper = shallow(<LoginButton />);
    //     expect(wrapper.find(Button).prop('onClick')).toBeInstanceOf(Function);
    // });
});
