-- Step 1: Create the trigger function
CREATE OR REPLACE FUNCTION update_gift_progress()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the progress in the Gifts table
    UPDATE gifts
    SET progress = progress + NEW.amount
    WHERE id = NEW."giftId";

   UPDATE Gifts
    SET 
        active = FALSE
    WHERE 
        id = NEW."giftId" AND
        progress >= (SELECT price FROM gifts WHERE id = NEW."giftId");

    -- Ensure the operation is logged correctly
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 2: Create the trigger on the GiftPayments table
CREATE OR REPLACE TRIGGER trigger_update_gift_progress
AFTER INSERT ON gifts_payments
FOR EACH ROW
EXECUTE FUNCTION update_gift_progress();