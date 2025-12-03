-- Step 1: Create the trigger function
CREATE OR REPLACE FUNCTION update_gift_progress()
RETURNS TRIGGER AS $$
BEGIN
    -- Only update progress when status is "approved"
    -- For INSERT: check if status is approved
    -- For UPDATE: check if status is set to approved and wasn't already approved
    IF NEW.status = 'approved' AND (TG_OP = 'INSERT' OR OLD.status IS NULL OR OLD.status != 'approved') THEN
        -- Update the progress in the Gifts table
        UPDATE gifts
        SET progress = progress + NEW.amount
        WHERE id = NEW."giftId";

        UPDATE Gifts
        SET 
            successful = TRUE
        WHERE 
            id = NEW."giftId" AND
            progress >= (SELECT price FROM gifts WHERE id = NEW."giftId");
    END IF;

    -- Ensure the operation is logged correctly
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 2: Create the trigger on the GiftPayments table for INSERT
CREATE OR REPLACE TRIGGER trigger_update_gift_progress_insert
AFTER INSERT ON gifts_payments
FOR EACH ROW
EXECUTE FUNCTION update_gift_progress();

-- Step 3: Create the trigger on the GiftPayments table for UPDATE
CREATE OR REPLACE TRIGGER trigger_update_gift_progress_update
AFTER UPDATE ON gifts_payments
FOR EACH ROW
EXECUTE FUNCTION update_gift_progress();