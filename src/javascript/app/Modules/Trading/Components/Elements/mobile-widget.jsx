import React            from 'react';
import FullScreenDialog from './full-screen-dialog.jsx';
import TradeParams      from '../../Containers/trade-params.jsx';

class MobileWidget extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };
        this.handleDialogClose = this.handleDialogClose.bind(this);
        this.handleWidgetClick = this.handleWidgetClick.bind(this);
    }

    handleWidgetClick() {
        this.setState({
            open: true,
        });
    }

    handleDialogClose() {
        this.setState({
            open: false,
        });
    }

    render() {
        return (
            <React.Fragment>
                <div className='mobile-widget' onClick={this.handleWidgetClick}>
                    <TradeParams is_minimized />
                </div>

                <FullScreenDialog
                    title='Set parameters'
                    visible={this.state.open}
                    onClose={this.handleDialogClose}
                >
                    <TradeParams is_nativepicker />
                </FullScreenDialog>
            </React.Fragment>
        );
    }
}

export default MobileWidget;
