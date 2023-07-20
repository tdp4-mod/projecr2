const util = require("../util");
const pretty = require("pretty-ms");
const axios = require("axios");
const getAttachmentURL = (msg) => (msg.attachments.first() || {}).url;
let surah = [
    { surah: "1", name: "الفاتحة" },
    { surah: "2", name: "البقرة" },
    { surah: "3", name: "آل عمران" },
    { surah: "4", name: "النساء" },
    { surah: "5", name: "المائدة" },
    { surah: "6", name: "الأنعام" },
    { surah: "7", name: "الأعراف" },
    { surah: "8", name: "الأنفال" },
    { surah: "9", name: "التوبة" },
    { surah: "10", name: "يونس" },
    { surah: "11", name: "هود" },
    { surah: "12", name: "يوسف" },
    { surah: "13", name: "الرعد" },
    { surah: "14", name: "ابراهيم" },
    { surah: "15", name: "الحجر" },
    { surah: "16", name: "النحل" },
    { surah: "17", name: "الإسراء" },
    { surah: "18", name: "الكهف" },
    { surah: "19", name: "مريم" },
    { surah: "20", name: "طه" },
    { surah: "21", name: "الأنبياء" },
    { surah: "22", name: "الحج" },
    { surah: "23", name: "المؤمنون" },
    { surah: "24", name: "النور" },
    { surah: "25", name: "الفرقان" },
    { surah: "26", name: "الشعراء" },
    { surah: "27", name: "النمل" },
    { surah: "28", name: "القصص" },
    { surah: "29", name: "العنكبوت" },
    { surah: "30", name: "الروم" },
    { surah: "31", name: "لقمان" },
    { surah: "32", name: "السجدة" },
    { surah: "33", name: "الأحزاب" },
    { surah: "34", name: "سبإ" },
    { surah: "35", name: "فاطر" },
    { surah: "36", name: "يس" },
    { surah: "37", name: "الصافات" },
    { surah: "38", name: "ص" },
    { surah: "39", name: "الزمر" },
    { surah: "40", name: "غافر" },
    { surah: "41", name: "فصلت" },
    { surah: "42", name: "الشورى" },
    { surah: "43", name: "الزخرف" },
    { surah: "44", name: "الدخان" },
    { surah: "45", name: "الجاثية" },
    { surah: "46", name: "الأحقاف" },
    { surah: "47", name: "محمد" },
    { surah: "48", name: "الفتح" },
    { surah: "49", name: "الحجرات" },
    { surah: "50", name: "ق" },
    { surah: "51", name: "الذاريات" },
    { surah: "52", name: "الطور" },
    { surah: "53", name: "النجم" },
    { surah: "54", name: "القمر" },
    { surah: "55", name: "الرحمن" },
    { surah: "56", name: "الواقعة" },
    { surah: "57", name: "الحديد" },
    { surah: "58", name: "المجادلة" },
    { surah: "59", name: "الحشر" },
    { surah: "60", name: "الممتحنة" },
    { surah: "61", name: "الصف" },
    { surah: "62", name: "الجمعة" },
    { surah: "63", name: "المنافقون" },
    { surah: "64", name: "التغابن" },
    { surah: "65", name: "الطلاق" },
    { surah: "66", name: "التحريم" },
    { surah: "67", name: "الملك" },
    { surah: "68", name: "القلم" },
    { surah: "69", name: "الحاقة" },
    { surah: "70", name: "المعارج" },
    { surah: "71", name: "نوح" },
    { surah: "72", name: "الجن" },
    { surah: "73", name: "المزمل" },
    { surah: "74", name: "المدثر" },
    { surah: "75", name: "القيامة" },
    { surah: "76", name: "الانسان" },
    { surah: "77", name: "المرسلات" },
    { surah: "78", name: "النبإ" },
    { surah: "79", name: "النازعات" },
    { surah: "80", name: "عبس" },
    { surah: "81", name: "التكوير" },
    { surah: "82", name: "الإنفطار" },
    { surah: "83", name: "المطففين" },
    { surah: "84", name: "الإنشقاق" },
    { surah: "85", name: "البروج" },
    { surah: "86", name: "الطارق" },
    { surah: "87", name: "الأعلى" },
    { surah: "88", name: "الغاشية" },
    { surah: "89", name: "الفجر" },
    { surah: "90", name: "البلد" },
    { surah: "91", name: "الشمس" },
    { surah: "92", name: "الليل" },
    { surah: "93", name: "الضحى" },
    { surah: "94", name: "الشرح" },
    { surah: "95", name: "التين" },
    { surah: "96", name: "العلق" },
    { surah: "97", name: "القدر" },
    { surah: "98", name: "البينة" },
    { surah: "99", name: "الزلزلة" },
    { surah: "100", name: "العاديات" },
    { surah: "101", name: "القارعة" },
    { surah: "102", name: "التكاثر" },
    { surah: "103", name: "العصر" },
    { surah: "104", name: "الهمزة" },
    { surah: "105", name: "الفيل" },
    { surah: "106", name: "قريش" },
    { surah: "107", name: "الماعون" },
    { surah: "108", name: "الكوثر" },
    { surah: "109", name: "الكافرون" },
    { surah: "110", name: "النصر" },
    { surah: "111", name: "المسد" },
    { surah: "112", name: "الإخلاص" },
    { surah: "113", name: "الفلق" },
    { surah: "114", name: "الناس" },
];

module.exports = {
    name: "quran",
    aliases: ["quran"],
    exec: async (msg, args) => {
        const { music } = msg.guild;
        //if (msg.channel.id !== "854088161210007572" && msg.channel.id !== "878753187388067890" && msg.channel.id !== "996467719585136811") return;
        if (!msg.member.voice.channel) return msg.channel.send(util.embed().setDescription("❌ | You must be on a voice channel."));
        if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel))
            return; /*
            msg.channel.send(util.embed().setDescription(`❌ | You must be on ${msg.guild.me.voice.channel} to use this command.`));
*/
        const missingPerms = util.missingPerms(msg.guild.me.permissionsIn(msg.member.voice.channel), ["CONNECT", "SPEAK"]);
        if ((!music.player || !music.player.playing) && missingPerms.length)
            return msg.channel.send(
                util.embed().setDescription(`❌ | I need ${missingPerms.length > 1 ? "these" : "this"} permission${missingPerms.length > 1 ? "s" : ""} on your voice channel: ${missingPerms.map((x) => `\`${x}\``).join(", ")}.`)
            );

        if (!music.node || !music.node.connected) return msg.channel.send(util.embed().setDescription("❌ | Lavalink node not connected."));

        let list = await axios.get("https://api.mushafmakkah.com/v1/reciters");
        let tracks = list.data.data;
        let setarray = list.data.data;
        tracks = tracks.map((x, i) => `\`${++i}.\` **${x.caption.ar}**`);

        //console.log(tracks)
        let args1 = args[0]; //surah
        let args2 = args.slice(1).join(" "); // shekh
        let selectedsurah;
        let result;
        console.log(args1)
if (args1){
         selectedsurah = surah.find((item) => item.name.replace("إ","ا").replace("أ","ا").replace("ه","ة").match(`${args1.replace("إ","ا").replace("أ","ا").replace("ه","ة")}`));
}
        if(args2){
  result  = setarray.find((item) => item.caption.ar.replace("إ","ا").replace("أ","ا").replace("ه","ة").match(`${args2.replace("إ","ا").replace("أ","ا").replace("ه","ة")}`));
        }
console.log(selectedsurah)
        if (!selectedsurah) {
            // display quarns names
            
        const queue = surah.map((t, i) => `\`${++i}.\` **${t.name}**`);
        const chunked = util.chunk(queue, 57).map(x => x.join("\n"));

        const embed = util.embed()
            .setAuthor(`${msg.guild.name} `, msg.guild.iconURL({ dynamic: true }))
            .setDescription(chunked[0])
            .setFooter(`Page 1 of ${chunked.length}.`);

        try {
            const queueMsg = await msg.channel.send(embed);
            if (chunked.length > 1) await util.pagination(queueMsg, msg.author, chunked);
            let collector = await awaitMessages();
        if (!collector) return queueMsg.edit(util.embed().setDescription("❌ | Time is up!"));
        const response = collector.first();
        if (response.deletable) response.delete();
         selectedsurah = surah.find((item) => item.surah.match(response.content));
 if (!selectedsurah) {
            return console.log("err");
        }else{
            queueMsg.edit(util.embed().setDescription(selectedsurah.name));
            queueMsg.delete();
        }
        console.log(selectedsurah);
        } catch (e) {
            msg.channel.send(`An error occured: ${e.message}.`);
        }
            
            
            
        }
if (!result || !args2){
   

        const resultMessage = await msg.channel.send(util.embed().setAuthor("Search Result", msg.client.user.displayAvatarURL()).setDescription(tracks));

        let collector = await awaitMessages();
    
        if (!collector) return resultMessage.edit(util.embed().setDescription("❌ | Time is up!"));
        const response = collector.first();
        if (response.deletable) response.delete();

        console.log(response.content);
    

         result = list.data.data.find((item) => item.id == `${response.content}`);
        if (!result) {
            return console.log("err");
        }else{
            resultMessage.edit(util.embed().setDescription(`تم اختيارة سورة **${selectedsurah.name}** بصوت الشيخ **${result.caption.ar}**`));
        }
    
}
        let direct;
        let selected = selectedsurah.surah;
        if (selected.toString().length == 1) {
            selectedpath = "00" + selected;
        } else if (selected.toString().length == 2) {
            selectedpath = "0" + selected;
        } else {
            selectedpath = selected;
        }
        let shekh = result;
        //console.log(list.data.data[1]);
        if (!shekh.src_base_url) {
            direct = `${shekh.src_base_url_without_sura}${selectedpath}.mp3`;
        } else {
            direct = `${shekh.src_base_url}${selected}/${selectedpath}.mp3`;
        }

        const query = direct || getAttachmentURL(msg);
        console.log(query);
        if (!query) return msg.channel.send(util.embed().setDescription("❌ | Missing args."));

        try {
            const { tracks } = await music.load(util.isValidURL(query) ? query : query);
            if (!tracks.length) return msg.channel.send(util.embed().setDescription("❌ | Couldn't find any results."));

            const track = tracks[0];
            track.requester = msg.author;
            music.queue.push(track);
            console.log(track)
            if (music.player && music.player.playing)
                msg.channel.send(
                    util
                        .embed()
                        .setDescription(`✅ | **[${track.info.title}](${track.info.uri})** added to the queue. \`${pretty(track.info.length, { colonNotation: true })}\``)
                        .setThumbnail(`https://i.ytimg.com/vi/${track.info.identifier}/maxresdefault.jpg`)
                );

            if (!music.player) await music.join(msg.member.voice.channel);
            if (!music.player.playing) await music.start();

            music.setTextCh(msg.channel);
        } catch (e) {
            msg.channel.send(`An error occured: ${e.message}.`);
        }
        async function awaitMessages() {
            try {
                const collector = await msg.channel.awaitMessages((m) => m.author.equals(msg.author) && (/^cancel$/i.exec(m.content) || (!isNaN(parseInt(m.content, 10)) && m.content >= 1 && m.content <= 114)), {
                    time: 1000*60,
                    max: 1,
                    errors: ["time"],
                });
                return collector;
            } catch {
                return null;
            }
        }
    },
};
