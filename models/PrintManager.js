class PrintManager{



    constructor(printQueue, state){
        this._printQueue = printQueue;
        this._state = state;
    }

    print(){
        try{
            let print = this._printQueue.dequeue();
        } catch (e){

        }

    }

    get checkState() {
        return this._state;
    }

    set updateState(value) {
        this._state = value;
    }
}

let PRINT_STATE = {

    STARTED:            'print started',
    GENERATING_GCODE:   'gcode generation',
    STREAMING_GCODE:    'gcode streaming',
    ERROR:              'error',



};

