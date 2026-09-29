-- Bolt 1-Click OTP Checkout Database Schema
-- Compatible with PostgreSQL 12+

-- Drop existing tables if re-deploying
DROP TABLE IF EXISTS checkout_orders CASCADE;
DROP TABLE IF EXISTS shoppers CASCADE;

-- 1. Shoppers Table (Stores registered user accounts and 6-digit OTP passcodes)
CREATE TABLE shoppers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for real-time background recognition search by email
CREATE INDEX idx_shoppers_email ON shoppers(email);

-- 2. Checkout Orders Table (Stores completed checkout orders for registered shoppers or guest shoppers)
CREATE TABLE checkout_orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(32) UNIQUE NOT NULL,
    shopper_id INT REFERENCES shoppers(id) ON DELETE SET NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(30) NOT NULL,
    shipping_address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'United States',
    total_amount DECIMAL(10, 2) NOT NULL DEFAULT 99.99,
    status VARCHAR(20) NOT NULL DEFAULT 'COMPLETED',
    is_guest BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast order lookups by email or order number
CREATE INDEX idx_orders_email ON checkout_orders(email);
CREATE INDEX idx_orders_number ON checkout_orders(order_number);

-- Seed Initial Demo Shoppers for instant testing
INSERT INTO shoppers (email, first_name, last_name, otp_code) VALUES
('alex.merchant@bolt.com', 'Alex', 'Merchant', '482910'),
('sarah.connor@example.com', 'Sarah', 'Connor', '930182'),
('john.doe@example.com', 'John', 'Doe', '123456')
ON CONFLICT (email) DO NOTHING;
