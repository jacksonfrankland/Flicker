import sirv from 'sirv';
import dotenv from 'dotenv';
import express from 'express';
import localIp from 'local-ip';
import cors from 'cors';
import Pusher from "pusher";
import bodyParser from 'body-parser';
import compression from 'compression';
import jsonWebToken from 'jsonwebtoken';
import * as sapper from '@sapper/server';
import cookieParser from 'cookie-parser';
import { createClient } from '@supabase/supabase-js';

dotenv.config();
const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

const db = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_PRIVATE_KEY
);

const pusher = new Pusher({
	appId: process.env.PUSHER_APP_ID,
	key: process.env.PUSHER_KEY,
	secret: process.env.PUSHER_SECRET,
	cluster: process.env.PUSHER_CLUSTER,
	useTLS: true
  });

const ip = localIp();

express().use(
		compression({ threshold: 0 }),
		sirv('static', { dev }),
		bodyParser.json(),
		bodyParser.urlencoded({ extended: false }),
		cors(),
		cookieParser(),
		async (req, res, next) => {
			req.db = db;
			req.pusher = pusher;
			res.setToken = data => {
				res.cookie('flickerToken', jsonWebToken.sign(data, process.env.JWT_SECRET), { httpOnly: true });
			}
			req.token = {};
			if (req.cookies.flickerToken) {
				jsonWebToken.verify(req.cookies.flickerToken, process.env.JWT_SECRET, (error, decoded) => {
					req.token = decoded

				})
			}
			next();
		},
		sapper.middleware({
			session: (req, res) => ({
				ip
			})
		})
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});
