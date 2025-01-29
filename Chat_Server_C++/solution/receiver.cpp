#include <iostream>
#include <string>
#include <sstream>
#include <vector>
#include <stdexcept>
#include "csapp.h"
#include "message.h"
#include "connection.h"
#include "client_util.h"



int main(int argc, char **argv) {
  if (argc != 5) {
    std::cerr << "Usage: ./receiver [server_address] [port] [username] [room]\n";
    return 1;
  }

  std::string server_hostname = argv[1];
  int server_port = std::stoi(argv[2]);
  std::string username = argv[3];
  std::string room_name = argv[4];

  Connection conn;

  Message msg(TAG_RLOGIN, username); // instantiate Message object with rlogin
  // connect to server
  conn.connect(server_hostname, server_port);

  // send rlogin and join messages (expect a response from
  //       the server for each one)

  if (!conn.send_receive(msg)) {
    std::cerr << msg.data;
    return 1;
  } // send rlogin message

  msg.tag = TAG_JOIN; // instantiate Message object with join
  msg.data = room_name;
  if (!conn.send_receive(msg)) {
    std::cerr << msg.data;
    return 1;
  } // send join message

  // TODO: loop waiting for messages from server
  //       (which should be tagged with TAG_DELIVERY)

  std::string string_arr[3];

  std::string sender;
  std::string message;

  while (true) {
    conn.receive(msg);
    if (msg.tag == TAG_DELIVERY) {
      std::stringstream ss(msg.data);
      int i = 0;
      while (getline(ss, msg.data, ':')) {
        string_arr[i++] = msg.data;
      }
      sender = string_arr[1];
      message = string_arr[2];
      std::cout << sender << ": " << message;
    }

  }


  return 0;
}
