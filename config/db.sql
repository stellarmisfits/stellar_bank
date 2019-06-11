-- DB tables with mocked data

\set YOUR_DB_ACCOUNT tomasz

-- DB 
CREATE DATABASE stellar_bank
    WITH 
    OWNER = :YOUR_DB_ACCOUNT
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;


-- bankaccounts table
CREATE TABLE public.bankaccounts
(
    pubk character varying NOT NULL,
    seed character varying NOT NULL,
    name character varying NOT NULL,
    PRIMARY KEY (pubk)
)
WITH (
    OIDS = FALSE
);

ALTER TABLE public.bankaccounts
    OWNER to :YOUR_DB_ACCOUNT;

-- token table
CREATE TABLE public.tokens
(
    token character varying NOT NULL,
    minted bigint NOT NULL,
    frozen boolean NOT NULL,
    PRIMARY KEY (token)
)
WITH (
    OIDS = FALSE
);

ALTER TABLE public.tokens
    OWNER to :YOUR_DB_ACCOUNT;

-- INSERT INTO public.tokens(token, minted, frozen) VALUES('MIM', 1000, false);
-- INSERT INTO public.tokens(token, minted, frozen) VALUES('BTC', 10000, false);
-- INSERT INTO public.tokens(token, minted, frozen) VALUES('FUN', 5000, false);

CREATE TABLE public.investors
(
    email character varying NOT NULL,
    token character varying NOT NULL,
    pubk character varying NOT NULL,
    frozen boolean NOT NULL,
    PRIMARY KEY (email, token)
)
WITH (
    OIDS = FALSE
);

ALTER TABLE public.investors
    OWNER to postgres;