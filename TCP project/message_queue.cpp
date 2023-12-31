#include <cassert>
#include <ctime>
#include "message_queue.h"
#include "guard.h"

MessageQueue::MessageQueue() {
  pthread_mutex_init(&m_lock, NULL); // initialize the mutex
  sem_init(&m_avail, 0, 0); // initialize the semophore
}

MessageQueue::~MessageQueue() {
  pthread_mutex_destroy(&m_lock); // initialize the mutex
  sem_destroy(&m_avail); // initialize the semophore
}

void MessageQueue::enqueue(Message *msg) {
  
  Guard gd(m_lock);
  // put the specified message on the queue
  m_messages.push_front(msg);

  // be sure to notify any thread waiting for a message to be
  // available by calling sem_post
  sem_post(&m_avail);
}

Message *MessageQueue::dequeue() {
  struct timespec ts;

  // get the current time using clock_gettime:
  // we don't check the return value because the only reason
  // this call would fail is if we specify a clock that doesn't
  // exist
  clock_gettime(CLOCK_REALTIME, &ts);

  // compute a time one second in the future
  ts.tv_sec += 1;

  // call sem_wait to wait up to 1 second for a message
  //       to be available, return nullptr if no message is available
  sem_wait(&m_avail);
  Guard gd(m_lock);
  // remove the next message from the queue, return it
  Message *msg = m_messages.back();
  m_messages.pop_back();
  return msg;
}
