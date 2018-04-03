CREATE TABLE public.users
(
    "userID" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "userName" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    password character varying(255) COLLATE pg_catalog."default" NOT NULL,
    credits double precision NOT NULL,
    "registrationDate" bigint NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY ("userID")
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.users
    OWNER to local_user;

CREATE TABLE public.items
(
    "itemID" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "ownerID" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    title character varying(255) COLLATE pg_catalog."default" NOT NULL,
    description character varying(2555) COLLATE pg_catalog."default",
    price double precision NOT NULL,
    size character varying(255) COLLATE pg_catalog."default" NOT NULL,
    licence character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "itemAsBase64" bytea NOT NULL,
    tags character varying[] COLLATE pg_catalog."default",
    rating double precision[],
    "uploadedDate" bigint NOT NULL,
    CONSTRAINT items_pkey PRIMARY KEY ("itemID"),
    CONSTRAINT "ownerID" FOREIGN KEY ("ownerID")
        REFERENCES public.users ("userID") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.items
    OWNER to local_user;