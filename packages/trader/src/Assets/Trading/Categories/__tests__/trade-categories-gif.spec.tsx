import React from 'react';
import { render, screen } from '@testing-library/react';
import TradeCategoriesGIF from '../trade-categories-gif';

// jest.mock('Assets/SvgComponents/trade_explanations/img-ends-in-out.svg', () => 'ImageEndsInOut');
// jest.mock('Assets/SvgComponents/trade_explanations/img-even-odd.svg', () => 'ImageEvenOdd');
// jest.mock('Assets/SvgComponents/trade_explanations/img-high-low.svg', () => jest.fn(() => 'ImageHighLow'));
// jest.mock('Assets/SvgComponents/trade_explanations/img-close-to-low.svg', () => jest.fn(() => 'ImageCloseToLow'));
// jest.mock('Assets/SvgComponents/trade_explanations/img-high-to-close.svg', () => jest.fn(() => 'ImageHighToClose'));
// jest.mock('Assets/SvgComponents/trade_explanations/img-high-to-low.svg', () => jest.fn(() => 'ImageHighToLow'));
// jest.mock('Assets/SvgComponents/trade_explanations/img-rise-fall.svg', () => jest.fn(() => 'ImageRiseFall'));
// jest.mock('Assets/SvgComponents/trade_explanations/img-rise-fall.svg', () => jest.fn(() => 'ImageRiseFall'));
// jest.mock('Assets/SvgComponents/trade_explanations/img-match-diff.svg', () => jest.fn(() => 'ImageMatchDiff'));
// jest.mock('Assets/SvgComponents/trade_explanations/img-multiplier.svg', () => jest.fn(() => 'ImageMultiplier'));
// jest.mock('Assets/SvgComponents/trade_explanations/img-over-under.svg', () => jest.fn(() => 'ImageOverUnder'));
// jest.mock('Assets/SvgComponents/trade_explanations/img-reset.svg', () => jest.fn(() => 'ImageReset'));
// jest.mock('Assets/SvgComponents/trade_explanations/img-run-high-low.svg', () => jest.fn(() => 'ImageRunHighLow'));
// jest.mock('Assets/SvgComponents/trade_explanations/img-accumulator.svg', () => jest.fn(() => 'ImageAccumulator'));
// jest.mock('Assets/SvgComponents/trade_explanations/img-tick-high-low.svg', () => jest.fn(() => 'ImageTickHighLow'));
// jest.mock('Assets/SvgComponents/trade_explanations/img-touch.svg', () => jest.fn(() => 'ImageTouch'));
// jest.mock('Assets/SvgComponents/trade_explanations/img-vanilla.svg', () => jest.fn(() => 'ImageVanilla'));

describe('<TradeCategoriesGIF />', () => {
    it('expect ImageAsianUpDown to be rendered when trade category is asian', () => {
        jest.mock('../../../SvgComponents/trade_explanations/image-asian.svg', () => ({
            __esModule: true,
            default: jest.fn(() => 'ImageAsianUpDown'),
        }));
        render(<TradeCategoriesGIF category='asian' />);
        expect(screen.getByText(/imageasianupdown/i)).toBeInTheDocument();
    });

    it('expect ImageSpread to be rendered when trade category is callputspread', () => {
        jest.mock('../../../SvgComponents/trade_explanations/image-spread.svg', () => ({
            __esModule: true,
            default: jest.fn(() => 'ImageSpread'),
        }));
        render(<TradeCategoriesGIF category='callputspread' />);
        expect(screen.getByText(/imagespread/i)).toBeInTheDocument();
    });
});

// it('expect ImageEndsInOut to be rendered when trade category is end', () => {
//     render(<TradeCategoriesGIF category='end' />);
//     expect(screen.getByText(/imageendsinout/i)).toBeInTheDocument();
// });
// it('expect ImageEvenOdd to be rendered when trade category is even_odd', () => {
//     render(<TradeCategoriesGIF category='even_odd' />);
//     expect(screen.getByText(/imageevenodd/i)).toBeInTheDocument();
// });
// it('expect ImageHighLow to be rendered when trade category is high_low', () => {
//     render(<TradeCategoriesGIF category='high_low' />);
//     expect(screen.getByText(/imagehighlow/i)).toBeInTheDocument();
// });
// it('expect ImageCloseToLow to be rendered when trade category is lb_call', () => {
//     render(<TradeCategoriesGIF category='lb_call' />);
//     expect(screen.getByText(/imageclosetolow/i)).toBeInTheDocument();
// });
// it('expect ImageHighToClose to be rendered when trade category is lb_put', () => {
//     render(<TradeCategoriesGIF category='lb_put' />);
//     expect(screen.getByText(/imagehightoclose/i)).toBeInTheDocument();
// });
// it('expect ImageHighToLow to be rendered when trade category is lb_high_low', () => {
//     render(<TradeCategoriesGIF category='lb_high_low' />);
//     expect(screen.getByText(/iamgehightolow/i)).toBeInTheDocument();
// });
// it('expect ImageRiseFall to be rendered when trade category is rise_fall', () => {
//     render(<TradeCategoriesGIF category='rise_fall' />);
//     expect(screen.getByText(/imagerisefall/i)).toBeInTheDocument();
// });
// it('expect ImageRiseFall to be rendered when trade category is rise_fall_equal', () => {
//     render(<TradeCategoriesGIF category='rise_fall_equal' />);
//     expect(screen.getByText(/imagerisefall/i)).toBeInTheDocument();
// });
// it('expect ImageMatchDiff to be rendered when trade category is match_diff', () => {
//     render(<TradeCategoriesGIF category='match_diff' />);
//     expect(screen.getByText(/imagematchdiff/i)).toBeInTheDocument();
// });
// it('expect ImageMultiplier to be rendered when trade category is multiplier', () => {
//     render(<TradeCategoriesGIF category='multiplier' />);
//     expect(screen.getByText(/imagemultiplier/i)).toBeInTheDocument();
// });
// it('expect ImageOverUnder to be rendered when trade category is over_under', () => {
//     render(<TradeCategoriesGIF category='over_under' />);
//     expect(screen.getByText(/imageoverunder/i)).toBeInTheDocument();
// });
// it('expect ImageReset to be rendered when trade category is reset', () => {
//     render(<TradeCategoriesGIF category='reset' />);
//     expect(screen.getByText(/imagereset/i)).toBeInTheDocument();
// });
// it('expect ImageRunHighLow to be rendered when trade category is run_high_low', () => {
//     render(<TradeCategoriesGIF category='run_high_low' />);
//     expect(screen.getByText(/imagerunhighlow/i)).toBeInTheDocument();
// });
// it('expect ImageAccumulator to be rendered when trade category is accumulator', () => {
//     render(<TradeCategoriesGIF category='accumulator' />);
//     expect(screen.getByText(/imageaccumulator/i)).toBeInTheDocument();
// });
// it('expect ImageTickHighLow to be rendered when trade category is tick_high_low', () => {
//     render(<TradeCategoriesGIF category='tick_high_low' />);
//     expect(screen.getByText(/imagetickhighlow/i)).toBeInTheDocument();
// });
// it('expect ImageTouch to be rendered when trade category is touch', () => {
//     render(<TradeCategoriesGIF category='touch' />);
//     expect(screen.getByText(/imagetouch/i)).toBeInTheDocument();
// });
// it('expect ImageVanilla to be rendered when trade category is vanilla', () => {
//     render(<TradeCategoriesGIF category='vanilla' />);
//     expect(screen.getByText(/imagevanilla/i)).toBeInTheDocument();
// });
//     it('component should return null if category is not defined correctly', () => {
//         const { container } = render(<TradeCategoriesGIF category='wrong_trade_category' />);
//         expect(container).toBeEmptyDOMElement();
//     });
// });
