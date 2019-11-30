CREATE SCHEMA hackathon;

CREATE TABLE hackathon.bankaccounts (
    id serial primary key,
    pubk character varying NOT NULL,
    seed character varying NOT NULL,
    name character varying NOT NULL
);

CREATE TABLE hackathon.tokens (
    id      serial primary key,
    token   character varying NOT NULL,
    minted  bigint NOT NULL,
    frozen  boolean NOT NULL
);

CREATE TABLE hackathon.investors (
    id      serial primary key,
    email   character varying NOT NULL,
    token   character varying NOT NULL,
    pubk    character varying NOT NULL,
    frozen  boolean NOT NULL
);
