import {customAlphabet as nanoid} from 'nanoid';


onmessage = function (e) {
    console.log(e.data);
    postMessage('worker result' + nanoid('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 4)());
}
