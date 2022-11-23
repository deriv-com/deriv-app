import React from 'react';
import { expect } from 'chai';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import AccumulatorsProfitLossTooltip from '../accumulators-profit-loss-tooltip.jsx';

configure({ adapter: new Adapter() });

describe('AccumulatorsProfitLossTooltip', () => {
    const props = {
        currency: 'USD',
        exit_tick: 6468.95,
        exit_tick_time: 1666091856,
        profit: +0.15,
        is_sold: 1,
        className: 'profit-loss-tooltip',
    };

    it('should render the right-side tooltip with an arrow on the left', () => {
        const wrapper = shallow(<AccumulatorsProfitLossTooltip {...props} />);
        expect(wrapper.find('.profit-loss-tooltip').exists()).to.be.true;
        expect(wrapper.find('.profit-loss-tooltip__spot-circle').exists()).to.be.true;
        expect(wrapper.find('.profit-loss-tooltip__content').render()[0].attribs.class).to.include('arrow-left');
        expect(wrapper.find('.profit-loss-tooltip__close-icon').exists()).to.be.true;
    });
});
