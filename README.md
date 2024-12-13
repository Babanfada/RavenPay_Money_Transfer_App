# RavenPay_Money_Transfer_App
This is a mini banking application that supports key functionalities such as creating bank accounts, handling transfers, retrieving transaction history, and receiving webhook notifications.

# Postman Documentation
Access the published Postman documentation for this project [here](https://documenter.getpostman.com/view/25879868/2sAYHxmiXH).


## Features
- **Bank Account Management**: Create and manage bank accounts.
- **Transactions**: Perform deposits, transfers, and track transaction history.
- **Webhooks**: Handle incoming webhook notifications for deposits.
- **API Documentation**: Comprehensive API documentation via Postman.

## Technologies Used
- Node.js
- Express.js
- Knex.js (MySQL)
- Axios
- Raven Atlas API for integration
- Postman for testing and documentation

## Endpoints

### Bank Account Management
- `POST /create_account`: Generate a bank account.
- `POST /transfers`: Send money to other banks.
- `GET /transactions`: Retrieve transaction history.
- `GET /transactions/:type`: Retrieve specific transaction types (e.g., `deposit`, `transfer`).

### Webhooks
- `POST /webhooks/notifications`: Handle incoming webhook notifications for deposits.

## Setup and Installation

### Prerequisites
- Node.js (v16 or higher)
- MySQL database

