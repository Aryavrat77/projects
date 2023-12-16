#include <iostream>
#include <string>
#include <sstream>
#include <stdexcept>
#include "csapp.h"
#include "message.h"
#include "connection.h"
#include "client_util.h"


int main(int argc, char **argv) {
  if (argc != 4) {
    std::cerr << "Usage: ./sender [server_address] [port] [username]\n";
    return 1;
  }

  std::string server_hostname;
  int server_port;
  std::string username;

  server_hostname = argv[1];
  server_port = std::stoi(argv[2]);
  username = argv[3];

  Connection conn;

  // connect to server
  conn.connect(server_hostname, server_port);

  Message msg(TAG_SLOGIN, username); // instantiate Message object with slogin
  if (!conn.send_receive(msg)) {
      std::cerr << msg.data;
      return 1;
  }  // send slogin message


  // loop reading commands from user, sending messages to
  //       server as appropriate

  while (true) {
    std::string buffer;
    getline(std::cin, buffer);
    buffer = trim(buffer);

    if (buffer[0] == '/') {
      if (buffer.substr(1, 5) == "join ") {
        msg.tag = TAG_JOIN;
        msg.data = trim(buffer.substr(6));
        if (!conn.send_receive(msg)) {
          std::cerr << msg.data;
        } 
      }
      else if (buffer.substr(1, 5) == "leave") {
        msg.tag = TAG_LEAVE;
        if (buffer.size() == 6) {
          msg.data = trim(buffer.substr(6));
        }
        if (!conn.send_receive(msg)) {
          std::cerr << msg.data;
        } 
      }
      else if (buffer.substr(1, 4) == "quit") {
        msg.tag = TAG_QUIT;
        if (buffer.size() == 5) {
          msg.data = trim(buffer.substr(5));
        }
        if (!conn.send_receive(msg)) {
          std::cerr << msg.data;
        } 
        break;
      } else {
        std::cerr << "wrong format: /[tag] [room]" << std::endl;

      }
    } else {
      msg.tag = TAG_SENDALL;
      msg.data = buffer; 
      if (!conn.send_receive(msg)) {
        std::cerr << msg.data;
      } 
    }

  }
  

  return 0;
}
