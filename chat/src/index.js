import { WebPubSubClient } from "@azure/web-pubsub-client"
import Vue from "vue";

new Vue({
  el: '#app',
  data: {
    connection: null,
    newMessage: '',
    chat: [],
    connected: false,
    userId: null,
  },
  methods: {
    connect: async function () {
      let client = this.connection = new WebPubSubClient({
        getClientAccessUrl: async _ => {
          let value = await (await fetch(`/negotiate?id=${this.userId}`)).json();
          return value.url;
        }
      });

      client.on("connected", (e) => {
        console.log(`Connected: ${e.connectionId}.`);
        this.connected = true;
      });

      client.on("disconnected", (e) => {
        console.log(`Disconnected: ${e.connectionId}.`);
        this.connected = false;
      });

      client.on("group-message", (e) => {
        let data = e.message.data;
        addItem({ from: data.from, content: data.message }, this.chat);
      });

      await client.start();
      await client.joinGroup("chatgroup");
    },
    send: function () {
      this.connection.sendToGroup("chatgroup", {
        from: this.userId,
        message: this.newMessage
      }, "json", { noEcho: true });
      addItem({ type: "self", content: this.newMessage }, this.chat);
      this.newMessage = '';
    }
  }
});

function addItem(item, owner) {
  item.id = owner.length;
  owner.push(item);
  window.scrollTo(0, document.body.scrollHeight);
}

