import React                 from 'react';
import Icon                  from 'Assets/icon.jsx';
import PositionsDrawerDialog from './positions-drawer-dialog.jsx';

class TogglePositionsDrawerDialog extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            is_visible: false,
            top       : 0,
            left      : 0,
        };
        this.ref = React.createRef();
    }

    toggleDialog = () => {
        this.setState(state => ({ is_visible: !state.is_visible }), () => {
            if (this.state.is_visible && this.ref && this.ref.current) {
                const { top, left } = this.ref.current.getBoundingClientRect();
                this.setState({
                    top,
                    left,
                });
            }
        });
    }

    render() {
        return (
            <React.Fragment>
                <div
                    ref={this.ref}
                    className='positions-drawer-dialog-toggle'
                    onClick={this.toggleDialog}
                >
                    <Icon icon='IconSettings' />
                </div>
                <PositionsDrawerDialog
                    is_visible={this.state.is_visible}
                    left={this.state.left}
                    top={this.state.top}
                    toggle_ref={this.ref}
                    toggleDialog={this.toggleDialog}
                />
            </React.Fragment>
        );
    }
}

export default TogglePositionsDrawerDialog;
