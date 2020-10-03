import * as sapper from '@sapper/app';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { db } from './store.js';

firebase.initializeApp({
    apiKey: "AIzaSyC5bthZaINKH0tammgefutfrkdV0cdsvG8",
    authDomain: "flicker-c92ac.firebaseapp.com",
    projectId: "flicker-c92ac",
});

db.set(firebase.firestore());

sapper.start({
	target: document.querySelector('#sapper')
});
