/**
 *
 * Simple array implementation of a job queue.
 *
 */
class JobQueue{

    constructor(){
       this._queue = [];
    }


    push(print){
        if (this.queue.length > 4){
            throw new PrintQueueFullException();
        }
        this.queue.push(print);
    }

    dequeue(){
        if(this.queue.length === 0){
            throw new PrintQueueEmptyException();
        }
        this.queue.shift();
    }


    get queue() {
        return this._queue;
    }

    set queue(value) {
        this._queue = value;
    }

}

function PrintQueueFullException(){
    this.message = "The print queue is full, could not add the print to the queue.";
    this.name = 'PrintQueueFullException';
}

function PrintQueueEmptyException(){
    this.message = "The print queue is empty. Cannot start a print from an empty print queue";
    this.name = 'PrintQueueEmptyException';
}