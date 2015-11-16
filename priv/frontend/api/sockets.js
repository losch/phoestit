'use strict';

import * as Phoenix from 'phoenix';

var socket;
var channel;

/**
 * Runs the given function after obtaining a connected socket
 * @param {function} after
 */
export function withSocket(after) {
  if (!socket) {
    socket = new Phoenix.Socket("/socket");
    socket.connect();
  }
  after(socket);
}

/**
 * Runs the given function when a channel has been joined
 * @param after
 */
export function withChannel(after) {
  withSocket((socket) => {
    if (!channel) {
      channel = socket.channel("rooms:lobby", {});
    }
    after(channel);
  });
}

/**
 * Pushes a message to channel
 * @param {string} msg - Message type
 * @param {object} payload - Payload to push with the message type
 */
export function push(msg, ...payload) {
  withChannel(channel => {
    channel.push(msg, ...payload);
  });
}
