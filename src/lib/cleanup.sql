-- SökoPay Data Cleanup Script
-- Run this in Neon SQL Editor to clear all user data for a fresh start.
-- This preserves the table structure.

-- Delete in order (respecting foreign keys)
DELETE FROM notifications;
DELETE FROM messages;
DELETE FROM feedback;
DELETE FROM chats;
DELETE FROM vendors;
DELETE FROM user_roles;

-- Reset sequences if any (Neon uses UUID so not needed, but just in case)
-- ALTER SEQUENCE notifications_id_seq RESTART WITH 1;
