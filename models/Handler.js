let Handler = function (name) {
    this.name =  name;
    this.next = null;
    this.Manager = null;
    this.eventBus = null;
};

Handler.prototype = {
    /**
     * Abstract method to be overriden when extending;
     * @param req
     */
    run: function(req){},
    /**
     * Link the next function in the middleware stack;
     * @param fn next middleware function to execute;
     */
    setNext: function (fn) {
        this.next = fn;
    },
    attachManager: function (printManager) {
        this.Manager = printManager;
        this.eventBus = printManager.eventBus;

    }
};

module.exports = Handler;