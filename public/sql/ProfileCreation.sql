-- do not implement this in production, this is just a demo
-- inserts a row into public."Profiles"
create function public.handle_new_user() returns trigger language plpgsql security definer
set
    search_path = public as $ $ begin
insert into
    public."Profiles" (id, first_name, last_name, role)
values
    (
        new.id,
        new.raw_user_meta_data ->> 'first_name',
        new.raw_user_meta_data ->> 'last_name' new.raw_user_meta_data ->> 'role'
    );

return new;

end;

$ $;

-- trigger the function every time a user is created
create trigger on_auth_user_created
after
insert
    on auth.users for each row execute procedure public.handle_new_user();