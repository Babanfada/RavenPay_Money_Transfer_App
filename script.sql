show databases;
create database ravenpay;
use ravenpay;
show tables;
select * from users;
-- create users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,          -- Primary key for the users table
    name VARCHAR(100) NOT NULL,                 -- User's name (cannot be null)
    email VARCHAR(255) NOT NULL UNIQUE,         -- Email (unique, cannot be null)
    password VARCHAR(255) NOT NULL,             -- Hashed password (cannot be null)
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp for when the user was created
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Timestamp for when the user was last updated
    
fisrt_name varchar(50) not null,
last_name varchar(50) not null,
user_name varchar(50) unique default "---" unique,
email varchar(255) unique not null,
password varchar(30) check(char_length(password) between 8 and 30) not null,
role enum('admin','user') default 'user',
phone varchar(30) not null unique,
image text,
gender enum('male','female') default 'female',
address varchar(1000) default 'please update your address' not null,
city varchar(50) default 'please update your city' not null,
state varchar(50) default 'please update your state' not null,
notification bool default false not null,
blacklisted bool default false not null,
verificationString text,
isVerified bool default false not null,
verified datetime,
passwordToken text,
passwordExpirationDate datetime
);


