create table public.songs (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    artist text not null,
    album text,
    cover_url text not null,
    audio_url text not null,
    created_at timestamptz default now()
);