var mysql = require('mysql');
const ical = require('node-ical');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "app"
});
let datares = [];

async function getData(){
  con.connect(function(err) {
    if (err) throw err;
  console.log("Connected!");
  var sql = "SELECT * FROM oc_calendar_reminders";
  con.query(sql,async function (err, result) {
    if(result!=null){
        result.map((item)=>{
          let time = Date.now();    
          if(item.notification_date*1000>time&&item.type=="AUDIO"){
            var sql2 = `SELECT * FROM oc_calendarobjects WHERE id=${item.object_id}`;
            con.query(sql2,async function(err2,rs2){
              if(rs2[0].deleted_at==null){
                ical.async.parseICS(rs2[0].calendardata.toString(), function(err, data) {
                  let key = Object.keys(data)[0];
                   let obj = {
                    summary:data[key].summary,
                    description:data[key].description,
                    location:data[key].location,
                    start:new Date(data[key].start).getTime(),
                    end:new Date(data[key].end).getTime(),
                    notification_date:item.notification_date*1000
                   }
                   datares.push(obj);
                });
              }
              
            })
          }
 
          
        })
        console.log(datares)
    } 
  }); 
    
});
}
async function  main(){
  await getData();
  console.log(datares)
}
main();