import {dbQuery} from './db';

export const getUserByEmail = async (email: string) => {
  const sql = `SELECT * FROM investors WHERE email=$1`;
  const params = [email];
  return dbQuery(sql, params);
};

export const getUserByEmailAndToken = async (email: string, token: string) => {
  const sql = `SELECT * FROM investors WHERE email=$1 AND token=$2`;
  const params = [email, token];
  return dbQuery(sql, params);
};

export const getIssuerByToken = async (token: string) => {
  const sql = `SELECT pubk, seed FROM tokens AS t, bankaccounts AS ba WHERE t.name=$1 AND t.issuer = ba.pubk LIMIT 1`;
  const params = [token];
  return dbQuery(sql, params);
};

export const insertInvestor = async (email: string, token: string, pubkey: string, frozen: boolean) => {
  const sql = `INSERT INTO investors(email, token, pubk, frozen) VALUES($1, $2, $3, $4)`;
  const params = [email, token, pubkey, frozen];
  return dbQuery(sql, params);
};

// live error check
// const test2 = () => {
//   console.log('dupa')
//   const sql = `SELECT * FROM tokens where name='DUPA'`
//   const params = []
//   return dbQuery(sql, params)
// }


// test2()
//   .then((data) => {
//     console.log(data.rows);
//   })
//   .catch((err) => {
//     console.log(err)
//   })
