let Handler = function (name, Manager) {
    this.name =  name;
    this.next = null;
    this.Manager = Manager;
    this.eventBus = Manager.eventBus;
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
    }
};

module.exports = Handler;