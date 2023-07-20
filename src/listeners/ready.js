let started = false;
module.exports = {
    name: "ready",
    exec: async (client) => {
           
        console.log(`Logged in as ${client.user.tag}`);
client.guilds.cache.forEach(guild => {
  console.log(`${guild.name} | ${guild.id}`);
})
        if (client.spotify) await client.spotify.requestToken();

        const nodes = [...client.manager.nodes.values()];
        for (const node of nodes) {
            try {
                   node.connect();
            
            } catch  (e)  {
                
                client.manager.emit("error", e, node);
            }
                   
        }

    }
};
