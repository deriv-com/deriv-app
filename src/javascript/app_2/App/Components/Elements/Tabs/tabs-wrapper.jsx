import React        from 'react';
import PropTypes    from 'prop-types';
import { TabsItem } from './tabs-item.jsx';

class TabsWrapper extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            sizes: {},
        };
        this.els = {};
    }

    componentDidMount() {
        this.getSizes();
        window.addEventListener('resize', this.getSizes);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.getSizes);
    }

    getSizes = () => {
        const rootBounds = this.root.getBoundingClientRect();
        const sizes = {};
        Object.keys(this.els).forEach((key) => {
            const el = this.els[key];
            const bounds = el.getBoundingClientRect();

            const left = bounds.left - rootBounds.left;
            const right = rootBounds.right - bounds.right;

            sizes[key] = { left, right };
        });
        this.setState({ sizes });
    };

    getUnderlineStyle = () => {
        if (this.props.active == null || Object.keys(this.state.sizes).length === 0) {
            return { left: '0', right: '100%' };
        }
        const size = this.state.sizes[this.props.active];
        return {
            left      : `${size.left}px`,
            right     : `${size.right}px`,
            transition: 'left 0.2s, right 0.25s',
        };
    };

    render() {
        return (
            <div
                className='tab-wrapper'
                ref={el => this.root = el}
            >
                <TabsItem
                    active={this.props.active}
                    onChange={this.props.onChange}
                    elements={this.els}
                >
                    {this.props.children}
                </TabsItem>
                <div
                    className='tab-underline'
                    style={this.getUnderlineStyle()}
                />
            </div>
        );
    }
}

TabsWrapper.propTypes = {
    active      : PropTypes.string,
    children    : PropTypes.node,
    onChange    : PropTypes.func,
    toggleDialog: PropTypes.func,
};

export { TabsWrapper };
