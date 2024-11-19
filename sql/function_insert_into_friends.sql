CREATE OR REPLACE FUNCTION public.insert_into_friends()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Check if the status is set to "APPROVED"
    IF NEW.status = 'APPROVED' THEN
        -- Insert a new row into friends table with user_id and friend_id
        INSERT INTO friends ("userId", "friendId") 
        VALUES (NEW."senderId", NEW."receiverId");

		DELETE FROM friend_invitations WHERE id = NEW.id;
    END IF;
    RETURN NEW;
END;

$function$