import { db } from './store.js';
import * as sapper from '@sapper/app';
import { createClient } from '@supabase/supabase-js';

db.set(createClient(
    'https://ubqeqgehiclrzutwihws.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYwMjgyNzc3MiwiZXhwIjoxOTE4NDAzNzcyfQ.Trii68Rql6_K6EO-BsS-1btZ3hk8ULmKgWZ0STBiMiw'
));

sapper.start({
	target: document.querySelector('#sapper')
});
