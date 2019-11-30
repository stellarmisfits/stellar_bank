import { Pool } from 'pg';

import {config} from './config';

const pool = new Pool({
  user: config.DB_user,
  host: config.DB_hostname,
  database: config.DB_database,
  port: config.DB_port,
  password: config.DB_password
});

export const dbQuery = async (query: string, params: any[]) => {
  return pool.query(query, params);
};
