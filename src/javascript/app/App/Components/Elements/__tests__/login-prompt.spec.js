import React                  from 'react';
import { expect }             from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter                from 'enzyme-adapter-react-16';
import LoginPrompt            from '../login-prompt.jsx';

configure({ adapter: new Adapter() });

describe('LoginPrompt', () => {
    it('should render one <LoginPrompt /> component', () => {
        const wrapper = shallow(<LoginPrompt />);
        expect(wrapper).to.have.length(1);
    });
});
