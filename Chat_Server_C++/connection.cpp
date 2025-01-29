#include <sstream>
#include <cctype>
#include <iostream>
#include <cassert>
#include <unistd.h>
#include "csapp.h"
#include "message.h"
#include "connection.h"

Connection::Connection()
  : m_fd(-1)
  , m_last_result(SUCCESS) {
}

Connection::Connection(int fd)
  : m_fd(fd)
  , m_last_result(SUCCESS) {
    
  // call rio_readinitb to initialize the rio_t object
  rio_readinitb(&m_fdbuf, fd);

}

std::string Connection::get_tag(std::string message) {
  
  std::string::size_type pos = message.find(':');
  if (pos != std::string::npos)
  {
      return message.substr(0, pos);
  }
  else
  {
      return message;
  }

}

std::string Connection::get_data(std::string message) {
  
  std::string::size_type pos = message.find(':');
  if (pos != std::string::npos)
  {
      return message.substr(pos + 1);
  }
  else
  {
      return message;
  }
}

bool Connection::send_receive(Message &msg) {
  if (!send(msg)) {
    // error messages
    return false;
  }
  if (!receive(msg)) {
    // error messages
    return false;
  }

  if (msg.tag == TAG_ERR) {
    return false;
  }

  if (msg.tag != TAG_OK && msg.tag != TAG_DELIVERY && msg.tag != TAG_JOIN) {
    return false;
  }
  

  return true;

}

void Connection::connect(const std::string &hostname, int port) {
  
  // call open_clientfd to connect to the server
  std::stringstream ss;
  ss << port;
  // convert int port to const char *
  m_fd = open_clientfd(hostname.c_str(), ss.str().c_str());


  // call rio_readinitb to initialize the rio_t object
  if (m_fd >= 0) {
    rio_readinitb(&m_fdbuf, m_fd);
  } else {
    std::cerr << "Couldn't connect to the server" << std::endl; // error if socket description < 0

  }

}

Connection::~Connection() {
  // close the socket if it is open
  close();
}

bool Connection::is_open() const {
  // return true if the connection is open
  if (m_fd >= 0) {
    return true;
  } else {
    return false;
  }
}

void Connection::close() {
  // close the connection if it is open
  if (is_open()) {
    ::close(m_fd);
    m_fd = -1;
  }
}

bool Connection::send(const Message &msg) {
  
  // send a message
  std::string tag = msg.tag;
  std::string data = msg.data;
  std::string buffer = tag + ":" + data + "\n";
  ssize_t ret = rio_writen(m_fd, buffer.c_str(), buffer.length()); 

  
  // return true if successful, false if not
  if (ret == (ssize_t) buffer.length()) {
    m_last_result = SUCCESS;
    return true;
  } else {
    m_last_result = EOF_OR_ERROR;
    return false;
  }
  // make sure that m_last_result is set appropriately
}

bool Connection::receive(Message &msg) {
  // receive a message, storing its tag and data in msg

  char buffer_arr[msg.MAX_LEN + 1];
  ssize_t ret = rio_readlineb(&m_fdbuf, buffer_arr, msg.MAX_LEN) ; 
  buffer_arr[ret] = '\0';
  std::string buffer = buffer_arr;

  msg.tag = get_tag(buffer);
  msg.data = get_data(buffer);
  
  // return true if successful, false if not

  if (ret > 0) {
    m_last_result = SUCCESS;
    return true;
  } else {
    m_last_result = EOF_OR_ERROR;
    return false;
  }
  // make sure that m_last_result is set appropriately
}
