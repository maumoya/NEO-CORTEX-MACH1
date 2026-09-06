create table if not exists app_user (id text primary key, email text, created_at timestamptz not null default now());
create table if not exists organization (id text primary key, name text not null, created_at timestamptz not null default now());
create table if not exists subscription (id text primary key, user_id text references app_user(id), stripe_customer_id text, stripe_subscription_id text, plan text not null, status text not null, mrr_cents integer not null default 0, updated_at timestamptz not null default now());
create table if not exists crm_contact (id bigserial primary key, email text, name text, stage text not null, source text, owner text, value_cents integer not null default 0, created_at timestamptz not null default now());
create table if not exists usage_daily (day date not null, user_id text not null, model_cost_cents integer not null default 0, agent_runs integer not null default 0, tool_calls integer not null default 0, primary key(day,user_id));
create table if not exists support_ticket (id bigserial primary key, user_id text, priority text, status text, subject text, created_at timestamptz not null default now());
create table if not exists release_event (version text primary key, shipped_at timestamptz not null, summary text not null, commit_sha text);
