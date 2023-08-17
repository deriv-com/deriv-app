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

            import('../trade-categories-gif')
                .then(moduleName => {
                    render(<moduleName.default category='asian' selected_contract_type='asian' />);
                    expect(screen.getByText(/imageasian/i)).toBeInTheDocument();
                })
                .catch(error => {
                    throw new Error(error);
                });
        });
    });
    it('expect ImageSpread to be rendered when trade category is callputspread', async () => {
        jest.isolateModules(() => {
            jest.doMock('Assets/SvgComponents/trade_explanations/img-spread.svg', () => ({
                __esModule: true,
                default: jest.fn(() => 'ImageSpread'),
            }));

            import('../trade-categories-gif')
                .then(moduleName => {
                    render(<moduleName.default category='callputspread' selected_contract_type='callputspread' />);
                    expect(screen.getByText('ImageSpread')).toBeInTheDocument();
                })
                .catch(error => {
                    throw new Error(error);
                });
        });
    });
    it('expect ImageEndsInOut to be rendered when trade category is end', async () => {
        jest.isolateModules(() => {
            jest.doMock('Assets/SvgComponents/trade_explanations/img-ends-in-out.svg', () => ({
                __esModule: true,
                default: jest.fn(() => 'ImageEndsInOut'),
            }));

            import('../trade-categories-gif')
                .then(moduleName => {
                    render(<moduleName.default category='end' selected_contract_type='end' />);
                    expect(screen.getByText(/imageendsinout/i)).toBeInTheDocument();
                })
                .catch(error => {
                    throw new Error(error);
                });
        });
    });
    it('expect ImageEvenOdd to be rendered when trade category is even_odd', async () => {
        jest.isolateModules(() => {
            jest.doMock('Assets/SvgComponents/trade_explanations/img-even-odd.svg', () => ({
                __esModule: true,
                default: jest.fn(() => 'ImageEvenOdd'),
            }));

            import('../trade-categories-gif')
                .then(moduleName => {
                    render(<moduleName.default category='even_odd' selected_contract_type='even_odd' />);
                    expect(screen.getByText(/imageevenodd/i)).toBeInTheDocument();
                })
                .catch(error => {
                    throw new Error(error);
                });
        });
    });
    it('expect ImageHighLow to be rendered when trade category is high_low', async () => {
        jest.isolateModules(() => {
            jest.doMock('Assets/SvgComponents/trade_explanations/img-high-low.svg', () => ({
                __esModule: true,
                default: jest.fn(() => 'ImageHighLow'),
            }));

            import('../trade-categories-gif')
                .then(moduleName => {
                    render(<moduleName.default category='high_low' selected_contract_type='high_low' />);
                    expect(screen.getByText(/imagehighlow/i)).toBeInTheDocument();
                })
                .catch(error => {
                    throw new Error(error);
                });
        });
    });
    it('expect ImageCloseToLow to be rendered when trade category is lb_call', async () => {
        jest.isolateModules(() => {
            jest.doMock('Assets/SvgComponents/trade_explanations/img-close-to-low.svg', () => ({
                __esModule: true,
                default: jest.fn(() => 'ImageCloseToLow'),
            }));

            import('../trade-categories-gif')
                .then(moduleName => {
                    render(<moduleName.default category='lb_call' selected_contract_type='lb_call' />);
                    expect(screen.getByText(/imageclosetolow/i)).toBeInTheDocument();
                })
                .catch(error => {
                    throw new Error(error);
                });
        });
    });
    it('expect ImageHighToClose to be rendered when trade category is lb_put', async () => {
        jest.isolateModules(() => {
            jest.doMock('Assets/SvgComponents/trade_explanations/img-high-to-close.svg', () => ({
                __esModule: true,
                default: jest.fn(() => 'ImageHighToClose'),
            }));

            import('../trade-categories-gif')
                .then(moduleName => {
                    render(<moduleName.default category='lb_put' selected_contract_type='lb_put' />);
                    expect(screen.getByText(/imagehightoclose/i)).toBeInTheDocument();
                })
                .catch(error => {
                    throw new Error(error);
                });
        });
    });
    it('expect ImageHighToLow to be rendered when trade category is lb_high_low', async () => {
        jest.isolateModules(() => {
            jest.doMock('Assets/SvgComponents/trade_explanations/img-high-to-low.svg', () => ({
                __esModule: true,
                default: jest.fn(() => 'ImageHighToLow'),
            }));

            import('../trade-categories-gif')
                .then(moduleName => {
                    render(<moduleName.default category='lb_high_low' selected_contract_type='lb_high_low' />);
                    expect(screen.getByText(/imagehightolow/i)).toBeInTheDocument();
                })
                .catch(error => {
                    throw new Error(error);
                });
        });
    });
    it('expect ImageRiseFall to be rendered when trade category is rise_fall', async () => {
        jest.isolateModules(() => {
            jest.doMock('Assets/SvgComponents/trade_explanations/img-rise-fall.svg', () => ({
                __esModule: true,
                default: jest.fn(() => 'ImageRiseFall'),
            }));

            import('../trade-categories-gif')
                .then(moduleName => {
                    render(<moduleName.default category='rise_fall' selected_contract_type='rise_fall' />);
                    expect(screen.getByText(/imagerisefall/i)).toBeInTheDocument();
                })
                .catch(error => {
                    throw new Error(error);
                });
        });
    });
    it('expect ImageRiseFall to be rendered when trade category is rise_fall_equal', async () => {
        jest.isolateModules(() => {
            jest.doMock('Assets/SvgComponents/trade_explanations/img-rise-fall.svg', () => ({
                __esModule: true,
                default: jest.fn(() => 'ImageRiseFall'),
            }));

            import('../trade-categories-gif')
                .then(moduleName => {
                    render(<moduleName.default category='rise_fall_equal' selected_contract_type='rise_fall_equal' />);
                    expect(screen.getByText(/imagerisefall/i)).toBeInTheDocument();
                })
                .catch(error => {
                    throw new Error(error);
                });
        });
    });
    it('expect ImageMatchDiff to be rendered when trade category is match_diff', async () => {
        jest.isolateModules(() => {
            jest.doMock('Assets/SvgComponents/trade_explanations/img-match-diff.svg', () => ({
                __esModule: true,
                default: jest.fn(() => 'ImageMatchDiff'),
            }));

            import('../trade-categories-gif')
                .then(moduleName => {
                    render(<moduleName.default category='match_diff' selected_contract_type='match_diff' />);
                    expect(screen.getByText(/imagematchdiff/i)).toBeInTheDocument();
                })
                .catch(error => {
                    throw new Error(error);
                });
        });
    });
    it('expect ImageMultiplier to be rendered when trade category is multiplier', async () => {
        jest.isolateModules(() => {
            jest.doMock('Assets/SvgComponents/trade_explanations/img-multiplier.svg', () => ({
                __esModule: true,
                default: jest.fn(() => 'ImageMultiplier'),
            }));

            import('../trade-categories-gif')
                .then(moduleName => {
                    render(<moduleName.default category='multiplier' selected_contract_type='multiplier' />);
                    expect(screen.getByText(/imagemultiplier/i)).toBeInTheDocument();
                })
                .catch(error => {
                    throw new Error(error);
                });
        });
    });
    it('expect ImageOverUnder to be rendered when trade category is over_under', async () => {
        jest.isolateModules(() => {
            jest.doMock('Assets/SvgComponents/trade_explanations/img-over-under.svg', () => ({
                __esModule: true,
                default: jest.fn(() => 'ImageOverUnder'),
            }));

            import('../trade-categories-gif')
                .then(moduleName => {
                    render(<moduleName.default category='over_under' selected_contract_type='over_under' />);
                    expect(screen.getByText(/imageoverunder/i)).toBeInTheDocument();
                })
                .catch(error => {
                    throw new Error(error);
                });
        });
    });
    it('expect ImageReset to be rendered when trade category is reset', async () => {
        jest.isolateModules(() => {
            jest.doMock('Assets/SvgComponents/trade_explanations/img-reset.svg', () => ({
                __esModule: true,
                default: jest.fn(() => 'ImageReset'),
            }));

            import('../trade-categories-gif')
                .then(moduleName => {
                    render(<moduleName.default category='reset' selected_contract_type='reset' />);
                    expect(screen.getByText(/imagereset/i)).toBeInTheDocument();
                })
                .catch(error => {
                    throw new Error(error);
                });
        });
    });
    it('expect ImageRunHighLow to be rendered when trade category is run_high_low', async () => {
        jest.isolateModules(() => {
            jest.doMock('Assets/SvgComponents/trade_explanations/img-run-high-low.svg', () => ({
                __esModule: true,
                default: jest.fn(() => 'ImageRunHighLow'),
            }));

            import('../trade-categories-gif')
                .then(moduleName => {
                    render(<moduleName.default category='run_high_low' selected_contract_type='run_high_low' />);
                    expect(screen.getByText(/imagerunhighlow/i)).toBeInTheDocument();
                })
                .catch(error => {
                    throw new Error(error);
                });
        });
    });
    it('expect ImageAccumulator to be rendered when trade category is accumulator', async () => {
        jest.isolateModules(() => {
            jest.doMock('../contract-type-description-video', () => ({
                __esModule: true,
                default: jest.fn(() => 'VideoAccumulator'),
            }));

            import('../trade-categories-gif')
                .then(moduleName => {
                    render(<moduleName.default category='accumulator' selected_contract_type='accumulator' />);
                    expect(screen.getByText(/videoaccumulator/i)).toBeInTheDocument();
                })
                .catch(error => {
                    throw new Error(error);
                });
        });
    });
    it('expect ImageTickHighLow to be rendered when trade category is tick_high_low', async () => {
        jest.isolateModules(() => {
            jest.doMock('Assets/SvgComponents/trade_explanations/img-tick-high-low.svg', () => ({
                __esModule: true,
                default: jest.fn(() => 'ImageTickHighLow'),
            }));

            import('../trade-categories-gif')
                .then(moduleName => {
                    render(<moduleName.default category='tick_high_low' selected_contract_type='tick_high_low' />);
                    expect(screen.getByText(/imagetickhighlow/i)).toBeInTheDocument();
                })
                .catch(error => {
                    throw new Error(error);
                });
        });
    });
    it('expect ImageTouch to be rendered when trade category is touch', async () => {
        jest.isolateModules(() => {
            jest.doMock('Assets/SvgComponents/trade_explanations/img-touch.svg', () => ({
                __esModule: true,
                default: jest.fn(() => 'ImageTouch'),
            }));

            import('../trade-categories-gif')
                .then(moduleName => {
                    render(<moduleName.default category='touch' selected_contract_type='touch' />);
                    expect(screen.getByText(/imagetouch/i)).toBeInTheDocument();
                })
                .catch(error => {
                    throw new Error(error);
                });
        });
    });
    it('expect ImageVanilla to be rendered when trade category is vanilla', async () => {
        jest.isolateModules(() => {
            jest.doMock('../contract-type-description-video', () => ({
                __esModule: true,
                default: jest.fn(() => 'VideoVanilla'),
            }));

            import('../trade-categories-gif')
                .then(moduleName => {
                    render(<moduleName.default category='vanilla' selected_contract_type='vanilla' />);
                    expect(screen.getByText(/videovanilla/i)).toBeInTheDocument();
                })
                .catch(error => {
                    throw new Error(error);
                });
        });
    });
    it('component should return null if category is not defined correctly', async () => {
        import('../trade-categories-gif')
            .then(moduleName => {
                const { container } = render(<moduleName.default category='wrong_trade_category' />);
                expect(container).toBeEmptyDOMElement();
            })
            .catch(error => {
                throw new Error(error);
            });
    });
});
