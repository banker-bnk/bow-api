-- Trigger: after_update_friend_invitations

-- DROP TRIGGER IF EXISTS after_update_friend_invitations ON public.friend_invitations;

CREATE OR REPLACE TRIGGER after_update_friend_invitations
    AFTER UPDATE 
    ON public.friend_invitations
    FOR EACH ROW
    WHEN (new.status::text = 'APPROVED'::text OR new.status::text = 'REJECTED'::text)
    EXECUTE FUNCTION public.insert_into_friends();