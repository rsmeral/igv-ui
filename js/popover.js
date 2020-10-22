/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Broad Institute
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import { DOMUtils, UIUtils, Icon, makeDraggable } from '../node_modules/igv-utils/src/index.js'
import ColorPicker from "./colorPicker.js";

class Popover {

    constructor(parent, { width, height }) {

        this.parent = parent;

        // popover
        this.popover = DOMUtils.div({ class: "igv-ui-popover" })
        parent.appendChild(this.popover)

        this.popover.style.width = `${ width }px`;
        this.popover.style.height = `${ height }px`;

        // header
        const popoverHeader = DOMUtils.div();
        this.popover.appendChild(popoverHeader);

        UIUtils.attachDialogCloseHandlerWithParent(popoverHeader,  () => this.hide())
        makeDraggable(this.popover, popoverHeader);

        // content
        this.popoverContent = DOMUtils.div();
        this.popover.appendChild(this.popoverContent);

        this.popover.style.display = 'none'


    }

    presentContentWithEvent(e, content) {

        this.popover.style.display = 'block'

        const { x, y } = DOMUtils.translateMouseCoordinates(e, this.popover.parentNode)
        this.popover.style.left = `${ x }px`
        this.popover.style.top  = `${ y }px`

        this.popoverContent.innerHTML = content;

    }

    presentMenu(e, menuItems) {

        // Only 1 popover open at a time
        DOMUtils.hideAll('.igv-ui-popover')

        DOMUtils.empty(this.popoverContent)
        DOMUtils.show(this.popover)

        if (menuItems.length > 0) {
            const menuElements = createMenuElements(menuItems, this.popover)
            for (let item of menuElements) {
                this.popoverContent.appendChild(item.object)
            }

            const { x, y } = DOMUtils.translateMouseCoordinates(e, this.popover.parentNode)
            this.popover.style.left = `${ x }px`
            this.popover.style.top  = `${ y }px`
        }
    }

    presentContent(pageX, pageY, content) {

        // Only 1 popover open at a time
        DOMUtils.hideAll('.igv-ui-popover');

        if (undefined === content) {
            return;
        }

        DOMUtils.empty(this.popoverContent);
        DOMUtils.show(this.popover);

        this.popoverContent.innerHTML = content;
        popupAt(this.popover, pageX, pageY);
    }

    hide() {
        this.popover.style.display = 'none'
        this.dispose()
    }

    dispose() {

        if (this.popover) {
            this.popover.parentNode.removeChild(this.popover);
        }

        const keys = Object.keys(this)
        for (let key of keys) {
            this[ key ] = undefined
        }
    }

}

const popupAt = (popover, pageX, pageY) => {
    const { x, y } = popover.parentNode.getBoundingClientRect()
    popover.style.left = `${ pageX - x }px`
    popover.style.top  = `${ pageY - y }px`
}

function createMenuElements(itemList, popover) {

    let list;
    if (itemList.length > 0) {

        list = itemList.map(function (item, i) {
            let elem;

            if (typeof item === 'string') {
                elem = DOMUtils.div();
                elem.innerHTML = item;
            } else if (typeof item === 'Node') {
                elem = item;
            } else {
                if (typeof item.init === 'function') {
                    item.init();
                }

                if ("checkbox" === item.type) {
                    elem = Icon.createCheckbox("Show all bases", item.value);
                } else if("color" === item.type) {
                    const colorPicker = new ColorPicker({
                        parent: popover.parentElement,
                        width: 364,
                        //defaultColor: 'aqua',
                        colorHandler: (color) => item.click(color)
                    })
                    elem = DOMUtils.div();
                    if (typeof item.label === 'string') {
                        elem.innerHTML = item.label;
                    }
                    const clickHandler =  e => {
                        colorPicker.show();
                        DOMUtils.hide(popover);
                        e.preventDefault();
                        e.stopPropagation()
                    }
                    elem.addEventListener('click', clickHandler);
                    elem.addEventListener('touchend', clickHandler);
                    elem.addEventListener('mouseup', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                    })
                }

                else {
                    elem = DOMUtils.div();
                    if (typeof item.label === 'string') {
                        elem.innerHTML = item.label;
                    }
                }

                if (item.click && "color" !== item.type) {
                    elem.addEventListener('click', handleClick);
                    elem.addEventListener('touchend', handleClick);
                    elem.addEventListener('mouseup', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                    })

                    // eslint-disable-next-line no-inner-declarations
                    function handleClick(e) {
                        item.click();
                        DOMUtils.hide(popover);
                        e.preventDefault();
                        e.stopPropagation()
                    }
                }
            }


            return {object: elem, init: item.init};
        })
    } else {
        list = [];
    }
    return list;
}

export default Popover;

