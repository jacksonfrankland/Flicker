import sirv from 'sirv';
import dotenv from 'dotenv';
import express from 'express';
import localIp from 'local-ip';
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

const ip = localIp();

express().use(
		compression({ threshold: 0 }),
		sirv('static', { dev }),
		bodyParser.json(),
		cookieParser(),
		async (req, res, next) => {
			req.db = db;
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
