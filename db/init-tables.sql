CREATE TABLE IF NOT EXISTS public.app_users 
(
    "userID" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "userName" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    salt char(32) NOT NULL,
    hash char(128) NOT NULL,
    credits double precision NOT NULL,
    "registrationDate" bigint NOT NULL,
    "walletAddress" character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT app_users_pkey PRIMARY KEY ("userID")
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.app_users
    OWNER to local_user;

CREATE TABLE IF NOT EXISTS public.items
(
    "itemID" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "ownerID" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    title character varying(255) COLLATE pg_catalog."default" NOT NULL,
    description character varying(2555) COLLATE pg_catalog."default",
    price double precision NOT NULL,
    size integer NOT NULL,
    licence character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "itemUrl" character varying(255) COLLATE pg_catalog."default",
    tags character varying[] COLLATE pg_catalog."default",
    rating double precision[],
    "uploadedDate" bigint NOT NULL,
    featured boolean,
    
    CONSTRAINT items_pkey PRIMARY KEY ("itemID"),
    CONSTRAINT "ownerID" FOREIGN KEY ("ownerID")
        REFERENCES public.app_users ("userID") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.items
    OWNER to local_user;

CREATE TABLE IF NOT EXISTS public.credit_packages
(
    "packageID" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "ownerID" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    amount double precision NOT NULL DEFAULT 0,
    "bonusCredits" integer NOT NULL DEFAULT 0,
    "bonusTickets" integer NOT NULL DEFAULT 0,
    featured boolean NOT NULL DEFAULT false,
    "priceInUSD" double precision NOT NULL DEFAULT 0,
    description character varying(255) COLLATE pg_catalog."default" NOT NULL,
    title character varying(255) COLLATE pg_catalog."default" NOT NULL,

    CONSTRAINT packages_pkey PRIMARY KEY ("packageID"),
    CONSTRAINT "ownerID" FOREIGN KEY ("ownerID")
        REFERENCES public.app_users ("userID") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.credit_packages
    OWNER to local_user;

CREATE TABLE IF NOT EXISTS public.account_details
(
    "ownerID" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "date" bigint NOT NULL,
    "paymentMethod" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "totalTime" bigint NOT NULL,
    "chargePerMinute" integer NOT NULL,
    "discountPerMinute" integer NOT NULL,
    "totalCharged" integer NOT NULL,
    "totalCredited" integer NOT NULL,
    "transactionID" character varying(255) COLLATE pg_catalog."default" NOT NULL,
	
    CONSTRAINT account_pkey PRIMARY KEY ("transactionID"),
    CONSTRAINT "ownerID" FOREIGN KEY ("ownerID")
        REFERENCES public.app_users ("userID") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION	
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.account_details
    OWNER to local_user;


CREATE TABLE IF NOT EXISTS public.sessions
(
    "sessionID" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "txHash" character varying(255) COLLATE pg_catalog."default",
    status integer NOT NULL,
    "fromPumaWallet" boolean,
    CONSTRAINT sessions_pkey PRIMARY KEY ("sessionID")
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.sessions
    OWNER to local_user;

-- THIS IS A TEST TABLE USED ONLY FOR DEVELOPMENT AND UNIT TEST REASONS
-- DO NOT CREATE THIS TABLE IN THE PRODUCTION ENVIRONENT 
CREATE TABLE public.test_table
(
    "testID" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT test_table_pkey PRIMARY KEY ("testID")
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.items
    OWNER to local_user;
    