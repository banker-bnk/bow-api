CREATE TABLE public.friend_invitations (
    id integer NOT NULL,
    status character varying DEFAULT 'PENDING'::character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "senderId" integer,
    "receiverId" integer
);

CREATE TABLE public.friends (
    id integer NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "userId" integer,
    "friendId" integer
);

CREATE TABLE public.gifts (
    id integer NOT NULL,
    title character varying NOT NULL,
    description character varying NOT NULL,
    link character varying NOT NULL,
    price numeric NOT NULL,
    currency character varying NOT NULL,
    progress integer DEFAULT 0 NOT NULL,
    active boolean DEFAULT false NOT NULL,
    "endDate" timestamp without time zone,
    image character varying,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "userId" integer,
    successful boolean DEFAULT false NOT NULL
);

CREATE TABLE public.gifts_payments (
    id integer NOT NULL,
    amount numeric NOT NULL,
    currency character varying NOT NULL,
    source character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "giftId" integer,
    "userId" integer
);

CREATE TABLE public.notifications (
    id integer NOT NULL,
    type public.notifications_type_enum NOT NULL,
    "entityId" integer,
    "entityType" character varying,
    message character varying,
    status character varying DEFAULT 'unread'::character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "userId" integer,
    "actorId" integer
);

CREATE TABLE public.users (
    id integer NOT NULL,
    "userId" character varying NOT NULL,
    "userName" character varying NOT NULL,
    "firstName" character varying,
    "lastName" character varying,
    email character varying,
    phone character varying,
    address character varying,
    image character varying,
    birthday timestamp without time zone,
    "lastSeen" timestamp without time zone NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE ONLY public.friend_invitations
    ADD CONSTRAINT "UQ_8f2533e85b7af4b1fbf9db00468" UNIQUE ("senderId", "receiverId");



ALTER TABLE ONLY public.friends
    ADD CONSTRAINT "UQ_ab7c3ff490dfe9056cd1db1c1e3" UNIQUE ("userId", "friendId");



ALTER TABLE ONLY public.gifts_payments
    ADD CONSTRAINT "FK_09ce2001cfa7d35ae7852048f9b" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE RESTRICT;


ALTER TABLE ONLY public.friends
    ADD CONSTRAINT "FK_0c4c4b18d8a52c580213a40c084" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE RESTRICT;



ALTER TABLE ONLY public.friend_invitations
    ADD CONSTRAINT "FK_15711b8fd1f129f1a30bd372a01" FOREIGN KEY ("senderId") REFERENCES public.users(id) ON DELETE RESTRICT;


ALTER TABLE ONLY public.gifts_payments
    ADD CONSTRAINT "FK_41af4dc3c38aa1b430202238cca" FOREIGN KEY ("giftId") REFERENCES public.gifts(id) ON DELETE RESTRICT;


ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "FK_44412a2d6f162ff4dc1697d0db7" FOREIGN KEY ("actorId") REFERENCES public.users(id) ON DELETE SET NULL;


ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "FK_692a909ee0fa9383e7859f9b406" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


ALTER TABLE ONLY public.gifts
    ADD CONSTRAINT "FK_6aea58d0a9f98925db3475b8bb3" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE RESTRICT;


ALTER TABLE ONLY public.friends
    ADD CONSTRAINT "FK_867f9b37dcc79035fa20e8ffe5e" FOREIGN KEY ("friendId") REFERENCES public.users(id) ON DELETE RESTRICT;


ALTER TABLE ONLY public.friend_invitations
    ADD CONSTRAINT "FK_b7b58f5bb6c845d6f0296bed041" FOREIGN KEY ("receiverId") REFERENCES public.users(id) ON DELETE RESTRICT;


