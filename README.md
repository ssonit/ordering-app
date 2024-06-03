# Microservices project

This project implements a microservices architecture using NestJS and Kafka for message queuing, featuring three main services: Auth for user authentication and authorization, Order for managing user orders, and Payment for handling Stripe payments.

## Services

### 1. Auth Service

Login: Allows users to log in with their credentials.

Register: Allows new users to register an account.

Authentication: Provides JWT-based authentication for securing other services.

#### Endpoints

POST /auth/register: Register a new user.

POST /auth/login: Log in an existing user.

GET /auth/me: Get the authenticated user's information.

### 2. Order Service

Create Order: Creates an order based on the products selected by the user.

List Orders: Retrieves a list of orders for the authenticated user.

#### Endpoints

POST /orders: Create a new order.

GET /orders: Get a list of orders for the authenticated user.

### 3. Payment Service

Stripe Integration: Handles payments using Stripe.

Create Payment: Initiates a payment session with Stripe.

Stripe Webhook: Listens for Stripe webhook events to handle payment confirmations and create orders.

#### Endpoints

POST /payment: Create a new Stripe payment session.

POST /payment/stripe/webhook: Handle Stripe webhook events.
