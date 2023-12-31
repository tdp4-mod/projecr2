const { Manager } = require("@lavacord/discord.js");
const { Client, Collection } = require("discord.js");
const { promises: { readdir } } = require("fs");
const { join } = require("path");
const { LavasfyClient } = require("lavasfy");

require("../extensions");

module.exports = class MusicClient extends Client {
    /** @param {import("discord.js").ClientOptions} [opt] */
    constructor(opt) {
        super(opt);
        this.commands = new Collection();
      this.manager = new Manager(this, [
            {
                id: "main",
                host: "23.88.73.88",
                port: "10559",
                password: "youshallnotpass"
            }
        ]);
        this.spotify = process.env.ENABLE_SPOTIFY === "true"
            ? new LavasfyClient({
                clientID: process.env.SPOTIFY_ID,
                clientSecret: process.env.SPOTIFY_SECRET,
                playlistLoadLimit: process.env.SPOTIFY_PLAYLIST_PAGE_LIMIT,
                audioOnlyResults: true,
                useSpotifyMetadata: true
            }, [...[...this.manager.nodes.values()]])
            : null;

        this.prefix = process.env.PREFIX.toLowerCase();
    }

    build() {
        this.loadCommands();
        this.loadEventListeners();
        this.login(process.env.TOKEN);

        this.manager
            .on("ready", node => {
  console.log(`Node ${node.id} Connected.`)
})
            .on("disconnect", (ws, node) => {
   console.log(`Node ${node.id} disconnect.`)
 setTimeout(() => {
        node.connect();
      }, 1000);
})
            .on("reconnecting", (node) => console.log(`Node ${node.id} tries to reconnect.`))
            .on("error", (error, node) => {
                console.log(`Node ${node.id} got an error: ${error.message}`)
             setTimeout(() => {
        node.connect();
      }, 1000);
        });
    }

    /** @private */
    async loadCommands() {
        const commands = await readdir(join(__dirname, "..", "commands"));
        for (const commandFile of commands) {
            const command = require(`../commands/${commandFile}`);
            this.commands.set(command.name, command);
        }
    }

    /** @private */
    async loadEventListeners() {
        const listeners = await readdir(join(__dirname, "..", "listeners"));
        for (const listenerFile of listeners) {
            const listener = require(`../listeners/${listenerFile}`);
            this.on(listener.name, (...args) => listener.exec(this, ...args));
        }
    }
};
