-- Description: First you need to create a user with the email 'admin@gmail.com' in supabase authentication. Then run this script to update the user with the role of admin and set the first and last name.

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