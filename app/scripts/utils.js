

function ModelArray(){
    "use strict";

    if ( !(this instanceof ModelArray) ) {
        return new ModelArray(arguments);
    }

    var args = Array.prototype.slice.call(arguments);

    // if the first argument is an array then add all the elements to this
    if(args.length > 0 && args[0] instanceof Array) {
        Array.call(this);
        for(var i=0; i<args[0].length; i++) {
            Array.prototype.push.call(this, args[0][i]);
        }
    } else {
        Array.apply(this, args);
    }

    this.added = [];
    this.removed = [];
}

ModelArray.prototype = [];  //new Array();
//ModelArray.prototype = new Array();


ModelArray.prototype.remove = function(object) {
    "use strict";

    var index = this.indexOf(object);
    if(index === -1) {
        throw new Error("could not find object in array");
    }

    this.splice(index, 1);

    index = this.added.indexOf(object);
    if(index !== -1) {
        this.added.splice(index, 1);
    } else {
        this.removed.push(index);
    }
    //console.log('this: ', this);
};


ModelArray.prototype.push = function(object) {
    "use strict";

    this.added.push(object);
    Array.prototype.push.call(this, object);
};


// var a = new ModelArray(["x", "y", "z"]);
// console.log('a: ', a);
// console.log('a[0]: ', a[0]);
