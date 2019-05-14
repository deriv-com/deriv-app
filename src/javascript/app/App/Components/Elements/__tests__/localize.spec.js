import React                  from 'react';
import { expect }             from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter                from 'enzyme-adapter-react-16';
import Localize               from '../localize.jsx';

configure({ adapter: new Adapter() });

describe('Localize', () => {
    it('should render one <Localize /> component', () => {
        const str = 'something without replacer';
        const wrapper = shallow(<Localize str={str} />);
        expect(wrapper).to.have.length(1);
    });
    it('should render with replacers', () => {
        const str = 'something with [_1] replacer [_2]';
        const replacers = {
            '1_2': <a className='a-cool-classname' />,
        };
        const wrapper = shallow(<Localize str={str} replacers={replacers} />);
        expect(wrapper).to.have.length(1);
        expect(wrapper.find('.a-cool-classname').exists()).to.be.true;
    });
});
