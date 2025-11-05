-- Step 1: Create the trigger function
CREATE OR REPLACE FUNCTION update_gift_amount()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the amount field by multiplying the inserted value by 1.02
    UPDATE gifts
    SET price = NEW.price * 1.02
    WHERE id = NEW.id;

    -- Return the new row
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 2: Create the trigger on the gifts table
CREATE OR REPLACE TRIGGER trigger_update_gift_amount
AFTER INSERT ON gifts
FOR EACH ROW
EXECUTE FUNCTION update_gift_amount();