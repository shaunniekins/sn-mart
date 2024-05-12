SELECT
    *
FROM
    auth.users
WHERE
    email = 'admin@gmail.com';

-- Update the meta_data of admin user
UPDATE
    auth.users
SET
    raw_user_meta_data = '{"role": "admin", "last_name": "Admin", "first_name": "Admin"}'
WHERE
    email = 'admin@gmail.com';