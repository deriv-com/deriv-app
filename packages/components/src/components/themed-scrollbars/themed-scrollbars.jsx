import React          from 'react';
import { Scrollbars } from 'tt-react-custom-scrollbars';

class ThemedScrollbars extends React.Component {
    render() {
        return (
            <Scrollbars
                ref={this.props.list_ref}
                renderTrackHorizontal={ props =>
                    <div {...props} className='dc-themed-scrollbars__track--horizontal' />
                }
                renderTrackVertical={ props =>
                    <div {...props} className='dc-themed-scrollbars__track--vertical' />
                }
                renderThumbHorizontal={ props =>
                    <div {...props} className='dc-themed-scrollbars__thumb--horizontal' />
                }
                renderThumbVertical={ props =>
                    <div {...props} className='dc-themed-scrollbars__thumb--vertical' />
                }
                {...this.props}
            >
                {this.props.children}
            </Scrollbars>
        );
    }
}

export default ThemedScrollbars;
