import React                         from 'react';
import { expect }                    from 'chai';
import { configure, mount, shallow } from 'enzyme';
import Adapter                       from 'enzyme-adapter-react-16';
import Localize                      from '../localize.jsx';

configure({ adapter: new Adapter() });

describe('Localize', () => {
    it('should render one <Localize /> component', () => {
        const wrapper = shallow(<Localize i18n_default_text={'something without replacer'} />);
        expect(wrapper).to.have.length(1);
    });
    it('should render with replacers', () => {
        const replacers = [ <a key={0} className='a-cool-classname' /> ];
        const wrapper = mount(<Localize i18n_default_text='something with <0>replacer</0>' components={replacers} />);
        expect(wrapper).to.have.length(1);
        expect(wrapper.find('.a-cool-classname').exists()).to.be.true;
    });
});
