# Universal Sync Provider - Runy Coding Challenge

## Overview
This repository contains a functional NestJS application designed to orchestrate data synchronization between Runy's internal business domains (Listings, Communications) and multiple external platforms (Airbnb, Gmail, Slack).

The core challenge was to design a system that handles this relationship without creating tightly coupled, monolithic logic. To solve this, I implemented a combination of the **Strategy Pattern** and a **Registry Pattern** utilizing NestJS's Dependency Injection system.

## Architectural Decisions

### 1. The Contract (`ISyncProvider`)
Instead of hardcoding external integrations into a central service, I defined an `ISyncProvider` interface. Every external platform must implement this contract, defining its `providerName`, the `supportedDomains` it cares about, and a `sync()` execution method. 

### 2. The Orchestrator (`UniversalSyncService`)
The central service is completely agnostic to the concrete provider classes. It injects a generic array of `SYNC_PROVIDERS`. When a sync request comes in, the orchestrator acts as a router:
* It filters the registered providers by the requested `BusinessDomain`.
* It maps over the capable providers and executes their `.sync()` methods concurrently using `Promise.all()`.
* **Error Isolation:** Individual provider executions are wrapped in a `.catch()`. If the Slack API goes down, it will log the error but will not prevent the Gmail provider from successfully executing its sync.

### 3. SOLID Principles
This design heavily adheres to the **Open/Closed Principle (OCP)**. 
The core synchronization logic is *closed for modification* but *open for extension*. If Runy needs to add a new integration (e.g., a `BookingProvider`), developers simply create a new class implementing `ISyncProvider` and add it to the module's provider array. The `UniversalSyncService` does not need to be touched.

## Future Scaling Considerations
Given the constraints of the challenge, the sync is currently triggered and awaited synchronously (or fired-and-forgotten) within the HTTP controller. 

If this were moving into a production environment dealing with high-throughput synchronization, I would decouple the HTTP ingestion from the execution by introducing an event-driven architecture. By pushing sync payloads to a message broker or event stream like Kafka or Redis, we could handle retries, rate-limiting for external APIs, and guarantee delivery without blocking the initial request thread.

## How to Run & Test

**1. Install dependencies and start the server:**
\`\`\`bash
npm install
npm run start:dev
\`\`\`

**2. Test Domain Routing (Listings):**
This should only trigger the Airbnb provider.
\`\`\`bash
curl -X POST http://localhost:3000/sync/listings \
-H "Content-Type: application/json" \
-d '{"id": "prop-123", "data": {"title": "Beachhouse", "price": 250}}'
\`\`\`

**3. Test Concurrent Execution (Communications):**
This should concurrently trigger both the Gmail and Slack providers.
\`\`\`bash
curl -X POST http://localhost:3000/sync/communications \
-H "Content-Type: application/json" \
-d '{"id": "msg-456", "data": {"to": "host@email.com", "body": "Hello!"}}'
\`\`\`
