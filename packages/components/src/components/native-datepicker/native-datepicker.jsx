import React from 'react';

class NativeDatePicker extends React.Component {
    myRef = React.createRef();
    state = {
        date: null,
    };
    clickHandler = () => {
        this.myRef.current.click();
    };
    onChangeHandler = e => {
        this.setState({
            date: e.target.value,
        });
        this.props.onChange(e.target.value);
    };
    render() {
        return (
            <div id='dc-native-datepicker'>
                <span onClick={this.clickHandler}>Pick an end date</span>
                <input type='date' id='native-calender' ref={this.myRef} onChange={this.onChangeHandler} />
            </div>
        );
    }
}
export default NativeDatePicker;
