import React                  from 'react';
import { expect }             from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter                from 'enzyme-adapter-react-16';
import Toast                  from '../toast.jsx';

configure({ adapter: new Adapter() });

describe('Toast', () => {
    it('should render one <Toast /> component', () => {
        const wrapper = shallow(<Toast />);
        expect(wrapper).to.have.length(1);
    });
});
