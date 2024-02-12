/* eslint-disable react/self-closing-comp */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-template */
/* eslint-disable radix */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
import React from 'react';

import './wheel-style.css';
import applyStyle from './apply-style';

class WheelPicker extends React.Component {
    constructor() {
        super();

        this._scrollTimer = null;
        this.handleScroll = this.handleScroll.bind(this);
    }

    componentDidMount() {
        var height = this.props.height || 40;
        height = this.props.animation === 'wheel' ? 40 : height;
        var scroller = document.getElementById(this.props.scrollerId);
        scroller.addEventListener('scroll', this.handleScroll);

        scroller.scroll({
            top: 1,
            behavior: 'smooth',
        });
        scroller.scroll({
            top: 0,
            behavior: 'smooth',
        });

        // scroll to index of default selection
        var y = this.props.defaultSelection * height - 1;
        y = y === -1 ? 0 : y;
        scroller.scroll({
            top: y,
            behavior: 'smooth',
        });
    }

    handleScroll(e) {
        var height = this.props.height || 40; // required to calculate which item should be selected on scroll
        height = this.props.animation === 'wheel' ? 40 : height;

        //if there is already a timeout in process cancel it
        if (this._scrollTimer) clearTimeout(this._scrollTimer);

        var scroll = e.srcElement.scrollTop; // scroll value

        // itemInSelectorArea height of area available to scroll / height of individual item
        var itemInSelectorArea = parseInt((scroll + height / 2) / height, 10); // add (height/2) to adjust error
        // this.props.updateSelection(itemInSelectorArea)

        if (itemInSelectorArea < this.props.data.length) {
            document
                .getElementById(`${this.props.scrollerId}-scroll-item--${itemInSelectorArea}`)
                .classList.add('selected-time');

            for (var i = 0; i < this.props.data.length; i++) {
                if (i !== itemInSelectorArea) {
                    document
                        .getElementById(`${this.props.scrollerId}-scroll-item--${i}`)
                        .classList.remove('selected-time');
                }
            }
        }

        function finishedScrolling(selectorAreaHeight, id, updateSelection) {
            updateSelection(itemInSelectorArea);
            var fix = document.getElementById(id);
            var y = itemInSelectorArea * selectorAreaHeight - 1;
            y = y === -1 ? 0 : y;
            fix.scroll({
                top: y,
                behavior: 'smooth',
            });
        }

        this._scrollTimer = setTimeout(
            () => finishedScrolling(height, this.props.scrollerId, this.props.updateSelection),
            150
        );

        applyStyle(this.props.scrollerId, itemInSelectorArea, this.props.data.length, this.props.animation);
    }

    renderListItems() {
        var height = this.props.height || 40;
        height = this.props.animation === 'wheel' ? 40 : height;
        return this.props.data.map((item, index) => {
            return index === 0 ? (
                <div className='scroll-item-container' style={{ minHeight: height + 'px', maxHeight: height + 'px' }}>
                    <div
                        key={item}
                        id={`${this.props.scrollerId}-scroll-item--${index}`}
                        className='scroll-item selected-time'
                        style={{
                            minHeight: height + 'px',
                            maxHeight: height + 'px',
                            fontSize: this.props.fontSize + 'px',
                        }}
                        onClick={e =>
                            document.getElementById(this.props.scrollerId).scroll({ top: 0, behavior: 'smooth' })
                        }
                    >
                        {item}
                    </div>
                </div>
            ) : (
                <div className='scroll-item-container' style={{ minHeight: height + 'px', maxHeight: height + 'px' }}>
                    <div
                        key={item}
                        id={`${this.props.scrollerId}-scroll-item--${index}`}
                        className='scroll-item'
                        style={{
                            minHeight: height + 'px',
                            maxHeight: height + 'px',
                            fontSize: this.props.fontSize + 'px',
                        }}
                        onClick={e => {
                            var m = e.target.id.split('--')[1];
                            document
                                .getElementById(this.props.scrollerId)
                                .scroll({ top: m * height - 1, behavior: 'smooth' });
                        }}
                    >
                        {item}
                    </div>
                </div>
            );
        });
    }

    render() {
        var height = this.props.height || 40;
        height = this.props.animation === 'wheel' ? 40 : height;
        const parentHeight = this.props.parentHeight || height * this.props.data.length || this.props.data.length * 40;

        return (
            <div className='scroll-select-container' style={{ height: parentHeight + 'px' }}>
                <div
                    className='scroll-selector-area'
                    style={{
                        height: height + 'px',
                        top: `${parentHeight / 2 - height / 2}px`,
                    }}
                    id={this.props.scrollerId + '--scroll-selector-area'}
                ></div>
                <div className='scroll-select-list' id={this.props.scrollerId}>
                    <div
                        style={{
                            paddingTop: `${parentHeight / 2 - height / 2}px`,
                            paddingBottom: `${parentHeight / 2 - height / 2}px`,
                        }}
                    >
                        {this.renderListItems()}
                    </div>
                </div>
            </div>
        );
    }
}

export default React.memo(WheelPicker);
