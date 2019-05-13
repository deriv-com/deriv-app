import React                  from 'react';
import { expect }             from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter                from 'enzyme-adapter-react-16';
import Transition             from '../transition.jsx';
import { testChildren }       from '../../../../../test-helper';

configure({ adapter: new Adapter() });

describe('Transition', () => {
    it('should render one <Transition /> component', () => {
        const wrapper = shallow(<Transition />);
        expect(wrapper).to.have.length(1);
    });
    it('should render children when passed in', () => {
        testChildren(<Transition />);
    });
});
