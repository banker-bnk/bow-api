WITH target_user AS (
    SELECT id FROM public.users WHERE "userId" = 'U017'
)
SELECT 
    u.id AS friend_id,
    u."userName",
    u."firstName",
    u."lastName",
    u.birthday
FROM 
    public.friends f
JOIN 
    public.users u
    ON (f."userId" = u.id AND f."friendId" = (SELECT id FROM target_user))
    OR (f."friendId" = u.id AND f."userId" = (SELECT id FROM target_user))
ORDER BY 
    EXTRACT(MONTH FROM u.birthday),
    EXTRACT(DAY FROM u.birthday);