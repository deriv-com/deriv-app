import React                  from 'react';
import { expect }             from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter                from 'enzyme-adapter-react-16';
import TradeTypeInfoDialog    from '../trade-type-info-dialog.jsx';

configure({ adapter: new Adapter() });

describe('TradeTypeInfoDialog', () => {
    it('should render one <TradeTypeInfoDialog /> component', () => {
        const wrapper = shallow(<TradeTypeInfoDialog />);
        expect(wrapper).to.have.length(1);
    });
    it('should render children when passed in', () => {
        const child_div = <div className='sweet-child-of-mine' />;
        const wrapper = shallow(
            <TradeTypeInfoDialog>
                { child_div }
            </TradeTypeInfoDialog>
        );
        expect(wrapper.contains(child_div)).to.equal(true);
    });
});
