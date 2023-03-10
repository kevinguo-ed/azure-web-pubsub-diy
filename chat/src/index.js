import { WebPubSubClient } from "@azure/web-pubsub-client"
import Vue from "vue";
const data = {
  client: {
    endpoint: '',
    connection: null,
    newMessage: '',
    chat: { messages: [] },
    connected: false,
    logs: [],
    userId: null,
    connectionId: null,
  },
};

new Vue({
  el: '#app',
  data: data,
  methods: {
    connect: async function () {
      let client = this.client.connection = new WebPubSubClient({
        getClientAccessUrl: async _ => {
          let value = await (await fetch(`/negotiate?id=${this.client.endpoint}`)).json();
          return value.url;
        }
      });

      client.on("connected", (e) => {
        console.log(`Connected: ${e.connectionId}.`);
        this.client.connected = true;
        this.client.userId = e.userId;
        this.client.connectionId = e.connectionId;
      });

      client.on("disconnected", (e) => {
        this.client.connected = false;
      });

      client.on("group-message", (e) => {
          let data = e.message.data;
          addItem({ from: data.from, content: data.message }, this.client.chat.messages);
      });

      await client.start();
      await client.joinGroup("chatgroup");
    },
    send: function (client) {
      client.connection.sendToGroup("chatgroup",
      {
        from: client.userId,
        message: client.newMessage
      },
      "json", {noEcho: true});
      addItem({ type: "self", content: client.newMessage }, this.client.chat.messages);
      client.newMessage = '';
    }
  }
});

function addItem(item, owner) {
  item.id = owner.length;
  owner.push(item);
  window.scrollTo(0, document.body.scrollHeight);
}

