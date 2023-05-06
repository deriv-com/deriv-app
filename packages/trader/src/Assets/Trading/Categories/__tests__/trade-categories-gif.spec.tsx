import React from 'react';
import { render, screen } from '@testing-library/react';

describe('<TradeCategoriesGIF />', () => {
    afterEach(() => {
        jest.resetModules();
    });
    it('expect ImageAsianUpDown to be rendered when trade category is asian', async () => {
        jest.isolateModules(() => {
            jest.doMock('Assets/SvgComponents/trade_explanations/img-asian.svg', () => ({
                __esModule: true,
                default: jest.fn(() => 'ImageAsian'),
            }));

            import('../trade-categories-gif').then(moduleName => {
                render(<moduleName.default category='asian' />);
                expect(screen.getByText(/imageasian/i)).toBeInTheDocument();
            });
        });
    });
    it('expect ImageSpread to be rendered when trade category is callputspread', async () => {
        jest.isolateModules(() => {
            jest.doMock('Assets/SvgComponents/trade_explanations/img-spread.svg', () => ({
                __esModule: true,
                default: jest.fn(() => 'ImageSpread'),
            }));

            import('../trade-categories-gif').then(moduleName => {
                render(<moduleName.default category='callputspread' />);
                expect(screen.getByText(/imagespread/i)).toBeInTheDocument();
            });
        });
    });
    it('expect ImageEndsInOut to be rendered when trade category is end', async () => {
        jest.isolateModules(() => {
            jest.doMock('Assets/SvgComponents/trade_explanations/img-ends-in-out.svg', () => ({
                __esModule: true,
                default: jest.fn(() => 'ImageEndsInOut'),
            }));

            import('../trade-categories-gif').then(moduleName => {
                render(<moduleName.default category='end' />);
                expect(screen.getByText(/imageendsinout/i)).toBeInTheDocument();
            });
        });
    });
    it('expect ImageEvenOdd to be rendered when trade category is even_odd', async () => {
        jest.isolateModules(() => {
            jest.doMock('Assets/SvgComponents/trade_explanations/img-even-odd.svg', () => ({
                __esModule: true,
                default: jest.fn(() => 'ImageEvenOdd'),
            }));

            import('../trade-categories-gif').then(moduleName => {
                render(<moduleName.default category='even_odd' />);
                expect(screen.getByText(/imageevenodd/i)).toBeInTheDocument();
            });
        });
    });
    it('expect ImageHighLow to be rendered when trade category is high_low', async () => {
        jest.isolateModules(() => {
            jest.doMock('Assets/SvgComponents/trade_explanations/img-high-low.svg', () => ({
                __esModule: true,
                default: jest.fn(() => 'ImageHighLow'),
            }));

            import('../trade-categories-gif').then(moduleName => {
                render(<moduleName.default category='high_low' />);
                expect(screen.getByText(/imagehighlow/i)).toBeInTheDocument();
            });
        });
    });
    it('expect ImageCloseToLow to be rendered when trade category is lb_call', async () => {
        jest.isolateModules(() => {
            jest.doMock('Assets/SvgComponents/trade_explanations/img-close-to-low.svg', () => ({
                __esModule: true,
                default: jest.fn(() => 'ImageCloseToLow'),
            }));

            import('../trade-categories-gif').then(moduleName => {
                render(<moduleName.default category='lb_call' />);
                expect(screen.getByText(/imageclosetolow/i)).toBeInTheDocument();
            });
        });
    });
    it('expect ImageHighToClose to be rendered when trade category is lb_put', async () => {
        jest.isolateModules(() => {
            jest.doMock('Assets/SvgComponents/trade_explanations/img-high-to-close.svg', () => ({
                __esModule: true,
                default: jest.fn(() => 'ImageHighToClose'),
            }));

            import('../trade-categories-gif').then(moduleName => {
                render(<moduleName.default category='lb_put' />);
                expect(screen.getByText(/imagehightoclose/i)).toBeInTheDocument();
            });
        });
    });
    it('expect ImageHighToLow to be rendered when trade category is lb_high_low', async () => {
        jest.isolateModules(() => {
            jest.doMock('Assets/SvgComponents/trade_explanations/img-high-to-low.svg', () => ({
                __esModule: true,
                default: jest.fn(() => 'ImageHighToLow'),
            }));

            import('../trade-categories-gif').then(moduleName => {
                render(<moduleName.default category='lb_high_low' />);
                expect(screen.getByText(/imagehightolow/i)).toBeInTheDocument();
            });
        });
    });
    it('expect ImageRiseFall to be rendered when trade category is rise_fall', async () => {
        jest.isolateModules(() => {
            jest.doMock('Assets/SvgComponents/trade_explanations/img-rise-fall.svg', () => ({
                __esModule: true,
                default: jest.fn(() => 'ImageRiseFall'),
            }));

            import('../trade-categories-gif').then(moduleName => {
                render(<moduleName.default category='rise_fall' />);
                expect(screen.getByText(/imagerisefall/i)).toBeInTheDocument();
            });
        });
    });
    it('expect ImageRiseFall to be rendered when trade category is rise_fall_equal', async () => {
        jest.isolateModules(() => {
            jest.doMock('Assets/SvgComponents/trade_explanations/img-rise-fall.svg', () => ({
                __esModule: true,
                default: jest.fn(() => 'ImageRiseFall'),
            }));

            import('../trade-categories-gif').then(moduleName => {
                render(<moduleName.default category='rise_fall_equal' />);
                expect(screen.getByText(/imagerisefall/i)).toBeInTheDocument();
            });
        });
    });
    it('expect ImageMatchDiff to be rendered when trade category is match_diff', async () => {
        jest.isolateModules(() => {
            jest.doMock('Assets/SvgComponents/trade_explanations/img-match-diff.svg', () => ({
                __esModule: true,
                default: jest.fn(() => 'ImageMatchDiff'),
            }));

            import('../trade-categories-gif').then(moduleName => {
                render(<moduleName.default category='match_diff' />);
                expect(screen.getByText(/imagematchdiff/i)).toBeInTheDocument();
            });
        });
    });
    it('expect ImageMultiplier to be rendered when trade category is multiplier', async () => {
        jest.isolateModules(() => {
            jest.doMock('Assets/SvgComponents/trade_explanations/img-multiplier.svg', () => ({
                __esModule: true,
                default: jest.fn(() => 'ImageMultiplier'),
            }));

            import('../trade-categories-gif').then(moduleName => {
                render(<moduleName.default category='multiplier' />);
                expect(screen.getByText(/imagemultiplier/i)).toBeInTheDocument();
            });
        });
    });
    it('expect ImageOverUnder to be rendered when trade category is over_under', async () => {
        jest.isolateModules(() => {
            jest.doMock('Assets/SvgComponents/trade_explanations/img-over-under.svg', () => ({
                __esModule: true,
                default: jest.fn(() => 'ImageOverUnder'),
            }));

            import('../trade-categories-gif').then(moduleName => {
                render(<moduleName.default category='over_under' />);
                expect(screen.getByText(/imageoverunder/i)).toBeInTheDocument();
            });
        });
    });
    it('expect ImageReset to be rendered when trade category is reset', async () => {
        jest.isolateModules(() => {
            jest.doMock('Assets/SvgComponents/trade_explanations/img-reset.svg', () => ({
                __esModule: true,
                default: jest.fn(() => 'ImageReset'),
            }));

            import('../trade-categories-gif').then(moduleName => {
                render(<moduleName.default category='reset' />);
                expect(screen.getByText(/imagereset/i)).toBeInTheDocument();
            });
        });
    });
    it('expect ImageRunHighLow to be rendered when trade category is run_high_low', async () => {
        jest.isolateModules(() => {
            jest.doMock('Assets/SvgComponents/trade_explanations/img-run-high-low.svg', () => ({
                __esModule: true,
                default: jest.fn(() => 'ImageRunHighLow'),
            }));

            import('../trade-categories-gif').then(moduleName => {
                render(<moduleName.default category='run_high_low' />);
                expect(screen.getByText(/imagerunhighlow/i)).toBeInTheDocument();
            });
        });
    });
    it('expect ImageAccumulator to be rendered when trade category is accumulator', async () => {
        jest.isolateModules(() => {
            jest.doMock('Assets/SvgComponents/trade_explanations/img-accumulator.svg', () => ({
                __esModule: true,
                default: jest.fn(() => 'ImageAccumulator'),
            }));

            import('../trade-categories-gif').then(moduleName => {
                render(<moduleName.default category='accumulator' />);
                expect(screen.getByText(/imageaccumulator/i)).toBeInTheDocument();
            });
        });
    });
    it('expect ImageTickHighLow to be rendered when trade category is tick_high_low', async () => {
        jest.isolateModules(() => {
            jest.doMock('Assets/SvgComponents/trade_explanations/img-tick-high-low.svg', () => ({
                __esModule: true,
                default: jest.fn(() => 'ImageTickHighLow'),
            }));

            import('../trade-categories-gif').then(moduleName => {
                render(<moduleName.default category='tick_high_low' />);
                expect(screen.getByText(/imagetickhighlow/i)).toBeInTheDocument();
            });
        });
    });
    it('expect ImageTouch to be rendered when trade category is touch', async () => {
        jest.isolateModules(() => {
            jest.doMock('Assets/SvgComponents/trade_explanations/img-touch.svg', () => ({
                __esModule: true,
                default: jest.fn(() => 'ImageTouch'),
            }));

            import('../trade-categories-gif').then(moduleName => {
                render(<moduleName.default category='touch' />);
                expect(screen.getByText(/imagetouch/i)).toBeInTheDocument();
            });
        });
    });
    it('expect ImageVanilla to be rendered when trade category is vanilla', async () => {
        jest.isolateModules(() => {
            jest.doMock('Assets/SvgComponents/trade_explanations/img-vanilla.svg', () => ({
                __esModule: true,
                default: jest.fn(() => 'ImageVanilla'),
            }));

            import('../trade-categories-gif').then(moduleName => {
                render(<moduleName.default category='vanilla' />);
                expect(screen.getByText(/imagevanilla/i)).toBeInTheDocument();
            });
        });
    });
    it('component should return null if category is not defined correctly', async () => {
        import('../trade-categories-gif').then(moduleName => {
            const { container } = render(<moduleName.default category='wrong_trade_category' />);
            expect(container).toBeEmptyDOMElement();
        });
    });
});
