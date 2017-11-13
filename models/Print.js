class Print{
    constructor(params){
        this.user = params.user;
        this._name = params._name;
        this._file = params._file;
        this._time = params._time;
        this.status = params.status;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get file() {
        return this._file;
    }

    set file(value) {
        this._file = value;
    }

    get time() {
        return this._time;
    }

    set time(value) {
        this._time = value;
    }

    updateStatus(status){
        this.status = status;
    }


}

/*

Print{
    user: username,
    print-name: name,
    file: gcode-file,
    timestamp: time,
    status: status,



}


 */