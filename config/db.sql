-- DB tables with mocked data

\set YOUR_DB_ACCOUNT tomasz

-- DB 
CREATE DATABASE stellar_bank
    WITH 
    OWNER = :YOUR_DB_ACCOUNT
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;


-- account table
CREATE TABLE public.accounts
(
    email character varying NOT NULL,
    token character varying NOT NULL,
    frozen boolean NOT NULL,
    PRIMARY KEY (email, token)
)
WITH (
    OIDS = FALSE
);

ALTER TABLE public.accounts
    OWNER to :YOUR_DB_ACCOUNT;

INSERT INTO public.accounts(email, token, frozen) VALUES('place@holder.com', 'MIM', false);
INSERT INTO public.accounts(email, token, frozen) VALUES('bob@gmail.com', 'BTC', false);
INSERT INTO public.accounts(email, token, frozen) VALUES('alice@yahoo.com', 'FUN', false);

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

INSERT INTO public.tokens(token, minted, frozen) VALUES('MIM', 1000, false);
INSERT INTO public.tokens(token, minted, frozen) VALUES('BTC', 10000, false);
INSERT INTO public.tokens(token, minted, frozen) VALUES('FUN', 5000, false);