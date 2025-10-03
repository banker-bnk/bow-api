-- Add shipping attributes to gifts table
-- This migration adds shipping tracking capabilities to the gifts table

-- First, create the shipping status enum type
CREATE TYPE shipping_status_enum AS ENUM (
  'not_shipped',
  'preparing',
  'shipped',
  'in_transit',
  'out_for_delivery',
  'delivered',
  'failed_delivery',
  'returned'
);

-- Add comments to document the new columns
COMMENT ON COLUMN gifts."shippingStatus" IS 'Current status of the gift shipment';
COMMENT ON COLUMN gifts."trackingNumber" IS 'Tracking number provided by the shipping carrier';
COMMENT ON COLUMN gifts."shippingCarrier" IS 'Name of the shipping carrier (e.g., FedEx, UPS, DHL)';
COMMENT ON COLUMN gifts."shippedAt" IS 'Timestamp when the gift was shipped';
COMMENT ON COLUMN gifts."deliveredAt" IS 'Timestamp when the gift was delivered';
COMMENT ON COLUMN gifts."shippingAddress" IS 'Delivery address for the gift';
COMMENT ON COLUMN gifts."deliveryNotes" IS 'Additional notes about the delivery';
