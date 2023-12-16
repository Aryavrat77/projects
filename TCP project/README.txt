Sample README.txt

AV Gupta and Demetri Konstantopoulos worked in parallel together.

Eventually your report about how you implemented thread synchronization
in the server should go here


In general, synchronization is important to ensure that concurrent threads or processes can access shared resources in a mutually 
exclusive and safe manner. In this assignment, we need to identify the critical sections of your code, where shared resources are 
accessed and modified, and protect them with appropriate synchronization mechanisms.
The following sections highlight how we implemented thread synchronization in the server. 

Shared resources: 
Shared reources include data structures, files, network sockets, or any other resource that is accessed by multiple threads or processes.
In server.cpp, we access the same network socket m_ssock that helps communite over the network implemented. When multiple threads share a socket, 
they need to ensure that they don't interfere with each other's communication on the socket. To achieve this, we initialize mutex locks 
to synchronize access to the socket using pthread_mutex_init (initialization on creation of Server object) and pthread_mutex_destroy (destruction
when object goes out of scope). Before a thread performs any read or write operation on the socket, it should first acquire a 
lock on a shared mutex. Once the operation is complete, the thread should release the lock, allowing other threads to access the socket.
The ConnInfo struct is a data structure that is accessed by multiple threads. This struct helps access important objects like Connection Connection
and Server serv objects that help nevigate rooms, clients, etc. using declared private members. 

Potential race conditions: 
Now, we need to identify potential race conditions that could occur if two or more threads/processes access the same resource simultaneously.
A race condition occurs when the outcome of a program depends on the relative timing of two or more concurrent threads/processes. 
Using semophores, we ensure that messages are enqueued and dequeued properly so threaded processes work correctly. For instance, 
we wait for a message (sem_wait) before dequeueing it and sending it to the receiver. We use sem_post in enqueue to increment the 
semophore value to access other threads or processes. In other words, sem_post() is used to release or unlock a semaphore, allowing other 
threads or processes to access a shared resource that was previously locked.

Protecting critical sections: 
To avoid race conditions, we needed to protect the critical sections of our code, where shared resources are accessed and modified. 
Typically, one uses synchronization primitives such as locks and semaphores to protect critical sections. We predominantly used
Guard locks to accomplish the protection of critical sections. The Guard object is constructed with a mutex and blocks until the 
lock can be acquired. When the Guard object goes out of scope, the lock is automatically released. We use guard locks in enqueue and dequeue
functions in message_queue.cpp because both operations attempt to add or extract a message from the queue while another thread is 
adding or removing messages from it. Without synchronization, this could lead to the messages being added out of order, or even being 
lost altogether. By using a guard lock, the thread acquires exclusive access to the queue, ensuring that no other thread can modify 
it until the operation is complete.

Appropriate synchronization primitives: 
It is imperative to choose the appropriate synchronization primitives for each critical section. For example, if we are 
accessing a shared variable, we must use a mutex lock to ensure mutual exclusion. We use mutex locks on Server, Room and message_queue
objects because these are primarily being accessed by multiple threads. 

Testing and refining: 
Finally, we tested your program thoroughly to ensure that the synchronization requirements are met without introducing 
synchronization hazards. However, we are getting a seg fault when we run our program and it is hard to determine why. 
