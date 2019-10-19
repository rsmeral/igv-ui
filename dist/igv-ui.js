const httpMessages =
    {
        "401": "Access unauthorized",
        "403": "Access forbidden",
        "404": "Not found"
    };


const AlertDialog = function (parent) {

    const self = this;

    // container
    this.container = document.createElement("div");
    this.container.classList.add("igv-ui-alert-dialog-container");
    parent.appendChild(this.container);

    // header
    let header = document.createElement("div");
    this.container.appendChild(header);

    // body container
    let div = document.createElement("div");
    div.id =  'igv-ui-alert-dialog-body';
    this.container.appendChild(div);

    // body copy
    this.body = document.createElement("div");
    this.body.id=  'igv-ui-alert-dialog-body-copy';
    div.appendChild(this.body);

    // ok container
    let ok_container = document.createElement("div");
    this.container.appendChild(ok_container);

    // ok
    this.ok = document.createElement("div");
    ok_container.appendChild(this.ok);
    this.ok.textContent = 'OK';
    this.ok.addEventListener('click', function () {
        self.body.innerHTML = '';
        self.container.style.display = 'none';
    });

    this.container.style.display = 'none';
};

AlertDialog.prototype.present = function (alert, callback) {
    const self = this;
    let string = alert.message || alert;
    if (httpMessages.hasOwnProperty(string)) {
        string = httpMessages[string];
    }
    this.body.innerHTML = string;
    this.ok.addEventListener('click', function () {
        if(typeof callback === 'function') {
            callback("OK");
        }
        self.body.innerHTML = '';
        self.container.style.display = 'none';
    });
    this.container.style.display = 'flex';
};

function embedCSS() {

    var css =  '.igv-ui-alert-dialog-container {\n  position: fixed;\n  z-index: 2048;\n  top: 30%;\n  left: 50%;\n  margin: -150px 0 0 -150px;\n  width: 300px;\n  height: 256px;\n  border-color: #7F7F7F;\n  border-radius: 4px;\n  border-style: solid;\n  border-width: thin;\n  font-family: \"Open Sans\", sans-serif;\n  font-size: 15px;\n  font-weight: 400;\n  z-index: 2048;\n  background-color: white;\n  display: flex;\n  flex-flow: column;\n  flex-wrap: nowrap;\n  justify-content: flex-start;\n  align-items: center; }\n  .igv-ui-alert-dialog-container div:first-child {\n    display: flex;\n    flex-flow: row;\n    flex-wrap: nowrap;\n    justify-content: flex-end;\n    align-items: center;\n    width: 100%;\n    height: 24px;\n    cursor: move;\n    border-top-left-radius: 4px;\n    border-top-right-radius: 4px;\n    border-bottom-color: #7F7F7F;\n    border-bottom-style: solid;\n    border-bottom-width: thin;\n    background-color: #eee; }\n    .igv-ui-alert-dialog-container div:first-child div {\n      margin-right: 4px;\n      margin-bottom: 2px;\n      height: 12px;\n      width: 12px;\n      color: #7F7F7F; }\n    .igv-ui-alert-dialog-container div:first-child div:hover {\n      cursor: pointer;\n      color: #444; }\n  .igv-ui-alert-dialog-container #igv-ui-alert-dialog-body {\n    color: #373737;\n    width: 100%;\n    height: calc(100% - 24px - 64px);\n    overflow-y: scroll; }\n    .igv-ui-alert-dialog-container #igv-ui-alert-dialog-body #igv-ui-alert-dialog-body-copy {\n      cursor: pointer;\n      margin: 16px;\n      width: auto;\n      height: auto;\n      overflow-wrap: break-word;\n      word-break: break-word;\n      background-color: white;\n      border: unset; }\n  .igv-ui-alert-dialog-container div:last-child {\n    width: 100%;\n    height: 64px;\n    background-color: white;\n    display: flex;\n    flex-flow: row;\n    flex-wrap: nowrap;\n    justify-content: center;\n    align-items: center; }\n    .igv-ui-alert-dialog-container div:last-child div {\n      width: 98px;\n      height: 36px;\n      line-height: 36px;\n      text-align: center;\n      color: white;\n      font-family: \"Open Sans\", sans-serif;\n      font-size: medium;\n      font-weight: 400;\n      border-color: #2B81AF;\n      border-style: solid;\n      border-width: thin;\n      border-radius: 4px;\n      background-color: #2B81AF; }\n    .igv-ui-alert-dialog-container div:last-child div:hover {\n      cursor: pointer;\n      border-color: #25597f;\n      background-color: #25597f; }\n\n/*# sourceMappingURL=igv-ui.css.map */\n';

    var style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.innerHTML = css;

    document.head.insertBefore(style, document.head.childNodes[ document.head.childNodes.length - 1 ]);

}

embedCSS();

export { AlertDialog };
