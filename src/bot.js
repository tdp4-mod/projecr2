const MusicClient = require("./structures/MusicClient");
require('events').EventEmitter.defaultMaxListeners = 70

var net = require('net');
const adhan = require('adhan');
const moment = require('moment-timezone');
const cron = require('node-cron');
const prettyMilliseconds = require('pretty-ms');
let objk = require('../pray.js');
const url_taskMap = {};
let myarrn = [];
let coordinates = new adhan.Coordinates(31.0261146,31.3671874);
const params = adhan.CalculationMethod.Egyptian();
let  date = new Date();
let tomorrow = new Date(date)
tomorrow.setDate(tomorrow.getDate() + 1)
const client = new MusicClient({
  // disableMentions: "everyone",
  disableEveryone: false
});

   var websock = new net.Socket();
function connect() {
    console.log("new client")
    websock.connect(
        11453,
        "65.108.101.89",
        () => {
            console.log("Connected")
            websock.write("Hello, server! Love, Client.")
        }
    )
 

websock.on("data", function (data) {
    try {
        
  data = JSON.parse(data);
///console.log(data)
        if (data.type == "getPrayer") {
     prayerSender();
        }
        } catch(error) {
       console.log('Error happened here!')
       console.error(error)
     }
})
    
       websock.on("close", () => {
        console.log("Connection closed")
        reconnect()
    })
       websock.on("end", () => {
        console.log("Connection ended")
        reconnect()
    })
      websock.on("error", console.error)
    
      websock.on("clientError", function (exception) {
        console.log("" + exception);
    });
    websock.on("error", function (err) {
        console.log("ERROR: "+ err);
    });
}
    // function that reconnect the client to the server
reconnect = () => {
    setTimeout(() => {
        websock.removeAllListeners() // the important line that enables you to reopen a connection
        connect()
    }, 5000)
}

connect()
let paryername ={
  'fajr':"الفجر",
  'sunrise':"شروق الشمس",
  'dhuhr':"الظهر",
  'asr':"العصر",
  'sunset':"شروق الشمس",
  'maghrib':"المغرب",
  'isha':"العشاء"
  
}

function prayTime (){
  let coordinates = new adhan.Coordinates(31.0261146,31.3671874);
const params = adhan.CalculationMethod.Egyptian();
    date = new Date();
 tomorrow = new Date(date)
tomorrow.setDate(tomorrow.getDate() + 1)
  
  let pray =  new adhan.PrayerTimes(coordinates, date, params);
  var next = pray.nextPrayer();
  current = pray.currentPrayer();
  if (next == "none"){
    pray =  new adhan.PrayerTimes(coordinates, tomorrow, params);
   
  }
 
 next = pray.nextPrayer();
var nextPrayerTime = pray.timeForPrayer(next);
  let obj = {}
  obj.pray = pray
  obj.current = current
  obj.next = next
  obj.nextPrayerTime =  moment(nextPrayerTime).tz('Africa/Cairo').format('h:mm A');
  obj.fajr = moment(pray.fajr).tz('Africa/Cairo').format('h:mm A');
  obj.sunrise = moment(pray.sunrise).tz('Africa/Cairo').format('h:mm A');
  obj.dhuhr = moment(pray.dhuhr).tz('Africa/Cairo').format('h:mm A');
  obj.asr = moment(pray.asr).tz('Africa/Cairo').format('h:mm A');
  obj.sunset = moment(pray.sunset).tz('Africa/Cairo').format('h:mm A');
  obj.maghrib = moment(pray.maghrib).tz('Africa/Cairo').format('h:mm A');
  obj.isha = moment(pray.isha).tz('Africa/Cairo').format('h:mm A');


myarrn = []

  myarrn.push(
    { time: moment(pray.fajr).tz('Africa/Cairo').format('HH:mm').split(':'), name: 'الفجر' }, { time: moment(pray.dhuhr).tz('Africa/Cairo').format('HH:mm').split(':'), name: "الظهر" },

    { time: moment(pray.asr).tz('Africa/Cairo').format('HH:mm').split(':'), name: "العصر" },
    { time: moment(pray.maghrib).tz('Africa/Cairo').format('HH:mm').split(':'), name: "المغرب" },
    { time: moment(pray.isha).tz('Africa/Cairo').format('HH:mm').split(':'), name: "العشاء" })
    if (!objk.pray[new Date().toLocaleDateString("es-CL")]) {
    objk.pray[new Date().toLocaleDateString("es-CL")] = {
      time: myarrn
    }
    crona(myarrn)
}
  var duration = prettyMilliseconds(Date.parse(nextPrayerTime) - Date.parse(new Date()), { verbose: false })
  obj.time = duration
 objk.pray.now = ` ${next == 'sunset' || next == 'sunrise' ? "متبقي على" : "متبقي على اذان صلاة"} ${paryername[next]}`
 objk.pray.ts = Date.parse(nextPrayerTime);

    let xxx = JSON.stringify({ type: "prayer", data: (objk.pray.ts-Date.parse(new Date()))/1000 , now:paryername[next], txt:objk.pray.now });
    //websock.write(xxx);
   
if (client.user){
client.user.setPresence({
    status: "online", // You can show online, idle, and dnd
      activity: {
        name: `${obj.time}  :${next == 'sunset' || next == 'sunrise' ? "متبقي على" : "متبقي على اذان صلاة"} ${paryername[next]}`
        
      },
});
}
  
  return obj

  
}
prayTime()
setInterval(prayTime, 1000*60);

function prayerSender() {
   let xxx = JSON.stringify({ type: "prayer", data: (objk.pray.ts-Date.parse(new Date()))/1000 , txt:objk.pray.now });
    websock.write(xxx);   

}


function crona(arr) {
  
  for (let i = 0; i < arr.length; i++) {
    if (url_taskMap[i]) {
      url_taskMap[i].stop();
      console.log("STOPPPED: ", i)
    }
          console.log(arr[i])
    var task = cron.schedule(`${arr[i].time[1]} ${arr[i].time[0]} * * *`, async () => {
console.log("OK")
      prayTime()
           }, {
        scheduled: true,
        timezone: "Africa/Cairo"
      });
    url_taskMap[i] = task;

  }

}

      

client.build();
