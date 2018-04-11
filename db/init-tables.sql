CREATE TABLE public.app_users
(
    "userID" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "userName" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    password character varying(255) COLLATE pg_catalog."default" NOT NULL,
    credits double precision NOT NULL,
    "registrationDate" bigint NOT NULL,
    CONSTRAINT app_users_pkey PRIMARY KEY ("userID")
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.app_users
    OWNER to local_user;

-- Table: public.items

-- DROP TABLE public.items;

CREATE TABLE public.items
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