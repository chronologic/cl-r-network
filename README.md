# CL-R-Network (ChronoLogic Relayers Network)

## Option 1 - Request-response (bidding)

User sends request for execution, relayers send theirs offers, user picks the cheapest one and signs the allowance for the cheapest relayer

Known issues / attacks:
* Relayer does not execute after being picked
  * Potential solution: Wait for tx hash for some time and repeat the query - exclude the previous relayer (temporary blacklist)

```mermaid
sequenceDiagram
    participant User
    participant PubSub Requests
    participant R1
    participant R2
    participant R3
    participant Ethereum
    User->>PubSub Requests: TX1 Request
    R1->>User: Offer1 (price 1)
    R2->>User: Offer2 (price 2)
    R3->>User: Offer3 (price 1)
    User->>R1: Accept Offer1 (sign with relayer address as param)
    R1->>Ethereum: Send TX1
    Ethereum-->>R1: TxHash 
    R1->>User: TxHash