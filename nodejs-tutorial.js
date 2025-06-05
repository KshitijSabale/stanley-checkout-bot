


// console is a global object that provides information about, and control over, the current Node.js process.
console.log(global.console);

// global is a global object that provides information about, and control over, the current Node.js process.
console.log(global);

// process is a global object that provides information about, and control over, the current Node.js process.
console.log(global.process);

// version is a global object that provides information about, and control over, the current Node.js process.
console.log(global.process.version);

// platform is a global object that provides information about, and control over, the current Node.js process.
console.log(global.process.platform);

// arch is a global object that provides information about, and control over, the current Node.js process.
console.log(global.process.arch);

// cwd is a global object that provides information about, and control over, the current Node.js process.
console.log(global.process.cwd());

// env is a global object that provides information about, and control over, the current Node.js process.
console.log(global.process.env);


// global variables

global.name = "Kshitij";

console.log(global.name);

// global variables

global.name = "Mihir";

console.log(global.name);



// Events in node js

// EventEmitter is a class that allows you to create and handle events in node js.



// exit event is emitted when the process is exiting.
process.on('exit', () => {
    console.log("Process is exiting");
});



// custom event

const EventEmitter = require('events');

const eventEmitter = new EventEmitter();

eventEmitter.on('greet', () => {
    console.log("Hello, World! , Great Day!");
});

eventEmitter.emit('greet');

eventEmitter.emit('greet');


// file read 
// builtin file system module

const {readFile , readFileSync} = require('fs');

const txt = readFileSync('./hello.txt', 'utf8');

console.log(txt);

readFile('./hello.txt', 'utf8', (err, data) => {
    if (err) {
        console.log(err);
    } else {
        console.log(data);
    }
});

console.log("log after file read");


// using promises to read file

// const {readFile} = require('fs').promises;

// async function readFileAsync() {
//     const file = await readFile('./hello.txt', 'utf8');

//     console.log(file);
// }
// readFileAsync();


// modules javascript files that can be used in other files

// COMMON JS modules - require()

// ES6 modules - import() / export

// import {readFile} from 'fs';
// export {readFile};


const myModule = require('./my-module');

console.log(myModule);

myModule.greet();







