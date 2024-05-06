CREATE VIEW "ViewUsers" AS
SELECT
    id,
    email,
    created_at,
    raw_user_meta_data ->> 'role' AS role,
    raw_user_meta_data ->> 'last_name' AS last_name,
    raw_user_meta_data ->> 'first_name' AS first_name
FROM
    auth.users;

CREATE
OR REPLACE VIEW "ViewRoles" AS
SELECT
    DISTINCT role
FROM
    "ViewUsers"
WHERE
    role IS NOT NULL
ORDER BY
    role ASC;