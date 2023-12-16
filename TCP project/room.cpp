#include "guard.h"
#include "message.h"
#include "message_queue.h"
#include "user.h"
#include "room.h"

Room::Room(const std::string &room_name)
  : room_name(room_name) {
  pthread_mutex_init(&lock, NULL);
}

Room::~Room() {
  pthread_mutex_destroy(&lock);
}

void Room::add_member(User *user) {
  members.insert(user);

}

void Room::remove_member(User *user) {
  members.erase(user);
}

void Room::broadcast_message(const std::string &sender_username, const std::string &message_text) {
  
  Guard gd(lock);

  for (auto it = members.begin(); it != members.end(); ++it) {
    Message msg;
    msg.tag = TAG_DELIVERY;
    msg.data = room_name + ":" + sender_username + ":" + message_text;
    (*it)->mqueue.enqueue(&msg);
  }
}
