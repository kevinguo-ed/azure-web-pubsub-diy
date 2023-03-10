import { WebPubSubClient } from "@azure/web-pubsub-client"
import Vue from "vue";
const data = {
  client: {
    endpoint: '',
    connection: null,
    id: 1,
    newMessage: '',
    chat: { messages: [] },
    connected: false,
    logs: [],
    userId: null,
    connectionId: null,
    ackId: 0,
  },
};

new Vue({
  el: '#app',
  data: data,
  methods: {
    connect: async function () {
      // close the previous connection if any and start a new connection
      if (this.client.connection) {
        this.client.connection.stop();
        addItem(`${this.client.userId}:${this.client.connectionId} disconnected.`, this.client.logs);
      }
      let client = this.client.connection = new WebPubSubClient({
        getClientAccessUrl: async _ => {
          let value = await (await fetch(`/negotiate?id=${this.client.endpoint}`)).json();
          return value.url;
        }
      });

      client.on("connected", (e) => {
        console.log(`Connected: ${JSON.stringify(e)}.`);
        this.client.connected = true;
        this.client.userId = e.userId;
        this.client.connectionId = e.connectionId;
      });

      client.on("disconnected", (e) => {
        this.client.connected = false;
      });

      client.on("group-message", (e) => {
          let data = e.message.data;
          console.log(data);
          if (client.userId && data.from === client.userId)
            addItem({ type: "self", content: data.message }, client.chat.messages);
          else
            addItem({ from: data.from, content: data.message }, client.chat.messages);
        }
      );

      await client.start();
      await client.joinGroup("chatgroup");
    },
    send: function (client) {
      client.connection.sendToGroup("chatgroup",
        {
          from: client.userId,
          message: client.newMessage
        }
        , "json");
      client.newMessage = '';
    }
  }
});

function addItem(item, owner) {
  item.id = owner.length;
  owner.push(item);
  window.scrollTo(0, document.body.scrollHeight);
}

