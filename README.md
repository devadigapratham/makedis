
# makedis: A Redis Server in Golang

This project is a simplified Redis-like server developed from scratch in Go. It implements core Redis functionalities such as TCP server setup, connection management, and client-server protocol handling. The project emphasizes scalability, performance, and a deep understanding of distributed systems and networking in Go.

----------

## Features

-   **TCP Server Setup**: Establishes a robust TCP server for handling client connections.
-   **Connection Management**: Manages multiple client connections efficiently.
-   **Protocol Handling**: Implements a custom protocol parser using pure functions for simplicity and maintainability.
-   **Data Storage**: Handles raw data storage and retrieval in memory for a fast and lightweight solution.
-   **Scalable Architecture**: Designed with scalability in mind, ensuring efficient resource utilization under load.
-   **Testing and Debugging**: Includes rigorous testing and debugging practices to maintain high performance and reliability.
-   **Performance Optimizations**: Optimized response times and resource handling for efficient server-client communication.

----------

## Getting Started

### Prerequisites

-   **Go** (Version 1.20 or higher recommended)

### Installation

1.  Clone the repository:
    
    ```bash
    git clone <repository-url>  
    cd makedis  
    
    ```
    
2.  Build the project:
    
    ```bash
    go build -o makedis main.go  
    
    ```
    
3.  Run the server:
    
    ```bash
    ./makedis
    
    ```
    
4.  Connect to the server using a Redis client or a simple TCP client:
    
    ```bash
    telnet localhost 6379  
    
    ```
    

----------

## Usage

### Basic Commands

Command

Description

Example

`SET`

Store a key-value pair

`SET key value`

`GET`

Retrieve the value of a key

`GET key`

`DEL`

Delete a key-value pair

`DEL key`

`EXISTS`

Check if a key exists

`EXISTS key`

`PING`

Test server connection

`PING`

----------

## Design and Implementation

1.  **TCP Server Setup**:
    
    -   Uses Go's `net` package to establish a TCP server.
    -   Listens on a configurable port and handles incoming client connections.
2.  **Connection Management**:
    
    -   Each client connection is handled in a separate Goroutine for concurrency.
    -   Implements mechanisms to gracefully handle connection closures.
3.  **Protocol Parsing**:
    
    -   Parses raw input from clients to identify commands and arguments.
    -   Utilizes pure functions for a clean and testable codebase.
4.  **Data Storage**:
    
    -   Maintains an in-memory key-value store for fast data access.
    -   Supports basic operations like `SET`, `GET`, and `DEL`.
5.  **Testing and Debugging**:
    
    -   Unit tests for individual components ensure robustness.
    -   Logs and error handling mechanisms are in place for debugging.
6.  **Performance Optimizations**:
    
    -   Implements strategies to reduce latency and optimize memory usage.

----------

## Benchmarking

The server has been benchmarked under different load scenarios to measure its performance and scalability.

-   **Latency**: Minimal delay for common operations like `GET` and `SET`.
-   **Throughput**: Handles multiple concurrent connections efficiently.

----------

## Future Improvements

-   Add support for advanced Redis commands like `INCR`, `EXPIRE`, and `LIST`.
-   Implement persistence for data storage to survive server restarts.
-   Extend the protocol to handle pipelined commands for higher throughput.

----------

## Contributing

Contributions are welcome! Please open an issue or submit a pull request with improvements or bug fixes.

----------

## License

This project is licensed under the MIT License.

----------

Feel free to use this project as a foundation for learning distributed systems and networking concepts in Go!
