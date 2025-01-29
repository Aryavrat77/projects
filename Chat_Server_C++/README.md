# Multi-Threaded Chat Server with Thread Synchronization
> Ensuring Secure and Efficient Real-Time Communication

## Contributors
* Aryavrat Gupta
* Demetri Konstantopoulos

## Project Overview
This project implements a multi-threaded chat server that enables real-time communication between clients using a synchronous protocol. The primary challenge addressed in this project is thread synchronization, ensuring safe and efficient concurrent access to shared resources such as network sockets, message queues, and chat rooms.

The server supports two types of clients:
1. **Senders** – Users who send messages to a chat room
2. **Receivers** – Users who listen for messages in a chat room

We focused on preventing race conditions, protecting critical sections, and ensuring message consistency using synchronization mechanisms such as mutex locks, semaphores, and guard locks.

## Project Goals
The primary objectives of this project were to:
* Implement a robust chat server supporting multiple senders and receivers
* Enable concurrent access to shared resources while preventing data corruption
* Use thread synchronization techniques to ensure safe interactions between clients
* Implement critical section protection for network sockets, message queues, and shared state
* Develop a scalable and reliable messaging protocol for chat communication

## Implementation Details

### 1. Message Protocol & Communication Flow
Clients communicate with the server using a tag-based protocol over TCP sockets. Messages follow the format:

```plaintext
<tag>:<payload>
```

* Clients first authenticate using `slogin` (for senders) or `rlogin` (for receivers)
* Senders send messages using `sendall`, which the server broadcasts to all receivers in the same chat room
* Receivers receive messages tagged as `delivery`
* Clients can switch rooms using `join`, leave using `leave`, and disconnect using `quit`

**Example chat session:**
```plaintext
[sender] slogin:bob
[sender] join:cafe
[sender] sendall:Hello everyone!
[receiver] [bob]: Hello everyone!
```

### 2. Thread Synchronization Strategy

**Why Synchronization?**  
Since multiple threads interact with shared resources like network sockets, chat rooms, and message queues, we must prevent race conditions and maintain message consistency.

| Shared Resource | Synchronization Mechanism | Purpose |
|----------------|---------------------------|----------|
| Network Socket (`m_ssock`) | Mutex Lock | Prevents simultaneous read/write conflicts |
| Message Queue (`enqueue/dequeue`) | Guard Lock + Semaphores | Ensures ordered message delivery and prevents message loss |
| Chat Rooms (`Room` object) | Mutex Locks | Prevents race conditions when users join/leave rooms |
| Server State (`Server` object) | Mutex Locks | Ensures correct client registration and message routing |

### 3. Preventing Race Conditions
Race conditions occur when multiple threads modify shared data simultaneously, leading to data inconsistency or server crashes.

#### Message Queue Protection
* Each receiver has a dedicated message queue
* The server locks the queue before adding messages (`enqueue`)
* Receivers lock the queue before retrieving messages (`dequeue`)
* Semaphores (`sem_wait()` / `sem_post()`) manage queue access

#### Network Socket Protection
* A global mutex ensures only one thread writes to a socket at a time

#### Room Management Synchronization
* Mutex locks prevent conflicts when users join/leave rooms

### 4. Protecting Critical Sections

Critical sections are parts of the code where shared resources are accessed or modified. We used guard locks to automate mutex handling and prevent deadlocks.

**Example: Guard Lock for Message Queue Access**
```cpp
void MessageQueue::enqueue(const Message &msg) {
    Guard lock(mutex_);  // Acquires lock automatically
    queue_.push(msg);
    sem_post(&message_sem_);  // Signals message availability
}
```

This ensures:
* Only one thread modifies the queue at a time
* The lock is automatically released when the function exits
* Other threads wait until a message is available before proceeding

### 5. Testing & Debugging
We conducted extensive manual and automated testing to validate the correctness and stability of our implementation.

#### Manual Testing (Using Netcat & Reference Clients)
```bash
# Server Startup
./server 5000

# Receiver Connection
./receiver localhost 5000 alice cafe

# Sender Connection & Message Sending
./sender localhost 5000 bob
> /join cafe
> sendall: Hello everyone!

# Expected Output on Receiver Terminal
[bob]: Hello everyone!
```

#### Automated Testing (Shell Scripts)
```bash
# Sequential Client Testing
./test_sequential.sh 5000 seq_send_1.in seq_send_2.in seq_recv

# Concurrency Stress Testing
./test_concurrent.sh 5000 10000 30 concurrent_test

# Valgrind Memory Leak Testing
valgrind --leak-check=full ./server 5000
```

## Current Issues & Debugging Efforts

### Segmentation Fault (Segfault) Issue
* The server occasionally crashes due to improper memory access or invalid pointer dereferences
* We suspect issues with thread synchronization in the message queue
* Debugging using gdb and Valgrind to isolate memory errors

### Potential Causes
* Race condition on shared resources
* Invalid socket references after client disconnect
* Double unlocking of mutexes

### Next Steps
* Implement detailed logging to track execution order
* Use thread-safe debugging tools like Helgrind (Valgrind tool for race conditions)
* Refactor message queue handling to prevent dangling references

## Future Improvements
* Optimize thread scheduling to handle high concurrent loads
* Implement fine-grained locking to reduce contention
* Add fault tolerance mechanisms to handle client crashes gracefully
* Improve debugging and logging tools for better monitoring

## Conclusion
This project successfully implements a multi-threaded chat server with robust thread synchronization mechanisms. By leveraging mutex locks, guard locks, and semaphores, we ensured safe concurrent access to shared resources while maintaining message consistency and data integrity.

However, ongoing debugging is required to resolve segfault issues and optimize thread scheduling for high-performance execution.
