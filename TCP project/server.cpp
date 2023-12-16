#include <pthread.h>
#include <iostream>
#include <sstream>
#include <memory>
#include <set>
#include <vector>
#include <cctype>
#include <cassert>
#include "message.h"
#include "connection.h"
#include "user.h"
#include "room.h"
#include "guard.h"
#include "server.h"

////////////////////////////////////////////////////////////////////////
// Server implementation data types
////////////////////////////////////////////////////////////////////////

// add any additional data types that might be helpful
//       for implementing the Server member functions

struct ConnInfo {
  Connection *connection;
  Server *server;
  std::string username;
};

////////////////////////////////////////////////////////////////////////
// Client thread functions
////////////////////////////////////////////////////////////////////////

void chat_with_sender(struct ConnInfo &info) {
// join leave sendall quit 
  Room *room;

  while (1) {
    Message msg;
    if (!info.connection->receive(msg)) {
      Message err_msg(TAG_ERR, "Error receiving message");
      info.connection->send(err_msg);
    }
    if (msg.tag == TAG_JOIN) {
      room = info.server->find_or_create_room(msg.data);
      Message ok_msg(TAG_OK, "ok");
      info.connection->send(ok_msg);

    } else if (msg.tag == TAG_SENDALL) {
      if (room == NULL) {
        Message err_msg(TAG_ERR, "No room to send message");
        info.connection->send(err_msg);
      } else {
        room->broadcast_message(info.username, msg.data);
        Message ok_msg(TAG_OK, "ok");
        info.connection->send(ok_msg);
      }
    } else if (msg.tag == TAG_LEAVE) {
      room = NULL;
      Message ok_msg(TAG_OK, "ok");
      info.connection->send(ok_msg);
    } else if (msg.tag == TAG_QUIT) {
      Message ok_msg(TAG_OK, "ok");
      info.connection->send(ok_msg);
      break;
    }

  }
}
void chat_with_receiver(struct ConnInfo &info) {
 
    Room *room;
    Message msg;
    info.connection->receive(msg);
    User user("");
            
    if (msg.tag == TAG_JOIN) {
      room = info.server->find_or_create_room(msg.data);
      user.username = info.username;
      room->add_member(&user);
      Message ok_msg(TAG_OK, "welcome");
      info.connection->send(ok_msg);
    }

    while (1) {
      Message *msg1 = user.mqueue.dequeue();
      if (!info.connection->send(*msg1)) {
        room->remove_member(&user);
        return;
      }
    }

}



namespace {

void *worker(void *arg) {
  pthread_detach(pthread_self());

  // use a static cast to convert arg from a void* to
  //       whatever pointer type describes the object(s) needed
  //       to communicate with a client (sender or receiver)

  struct ConnInfo *info = static_cast<struct ConnInfo*>(arg);

  // read login message (should be tagged either with
  //       TAG_SLOGIN or TAG_RLOGIN), send response

  Message msg;
  if (!info->connection->receive(msg)) {
    Message err_msg(TAG_ERR, "Unable to receive message");
    info->connection->send(err_msg);

  }

  if (msg.tag == TAG_SLOGIN) {
    Message ok_msg(TAG_OK, "logged in as " + msg.data);
    info->username = msg.data;
    info->connection->send(ok_msg);
    chat_with_sender(*info);
  } else if (msg.tag == TAG_RLOGIN) {
    Message ok_msg(TAG_OK, "logged in as " + msg.data);
    info->username = msg.data;
    info->connection->send(ok_msg);
    chat_with_receiver(*info);
  } else {
    Message err_msg(TAG_ERR, "Incorrect login message");
    info->connection->send(err_msg);
  }

  // depending on whether the client logged in as a sender or
  //       receiver, communicate with the client (implementing
  //       separate helper functions for each of these possibilities
  //       is a good idea)

  free(info);

  return nullptr;
}

}

////////////////////////////////////////////////////////////////////////
// Server member function implementation
////////////////////////////////////////////////////////////////////////

Server::Server(int port)
  : m_port(port)
  , m_ssock(-1) {
  // initialize the mutex
  pthread_mutex_init(&m_lock, NULL);
}

Server::~Server() {
  // destroy the mutex
  pthread_mutex_destroy(&m_lock);
}

bool Server::listen() {
  // use open_listenfd to create the server socket, return true
  //       if successful, false if not
  std::stringstream ss;
  ss << m_port;
  m_ssock = open_listenfd(ss.str().c_str());
  if (m_ssock < 0) {
    return false;
  }
  return true;
}

void Server::handle_client_requests() {
  // infinite loop calling accept or Accept, starting a new
  //       pthread for each connected client

  while (1) {
    int clientfd = accept(m_ssock, NULL, NULL);
    if (clientfd < 0) {
      exit(1);
    }
    struct ConnInfo *info = new ConnInfo;
    info->server = this;
    info->connection = new Connection(clientfd);
    info->username = "";
    pthread_t thr_id;
    if (pthread_create(&thr_id, NULL, worker, info) != 0) {
      Message err_msg(TAG_ERR, "pthread_create failed");
    }
    delete info;
  }

}

Room *Server::find_or_create_room(const std::string &room_name) {
  // return a pointer to the unique Room object representing
  //       the named chat room, creating a new one if necessary

  auto it = m_rooms.find(room_name);

  if (it != m_rooms.end()) {
    return (*it).second;
  } else {
    Room room(room_name);
    return &room;
  }
}

