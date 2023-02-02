const con = require('../ConnectDB/Connect')
const ical = require('node-ical');

con.connect(async (err)=>{
    if  (err) throw err;
    console.log("connected")

})
var getDetailReminders = function (dataics){
    return new Promise(function (resolve, reject) {
        ical.async.parseICS(dataics, function(err, data) {
            if(err){
                resolve(err)
            }else{
                let key = Object.keys(data)[0];
                let obj = {
                 summary:data[key].summary,
                 description:data[key].description,
                 location:data[key].location,
                 start:new Date(data[key].start).getTime(),
                 end:new Date(data[key].end).getTime(),
                }
                resolve(obj)
            }
            
          });
    });
}

var getQuery = function (sql){
    return new Promise(function (resolve, reject) {
        con.query(sql, function (err, result) {
            if (!err) {
                resolve(result);
            } else {
                resolve({
                    status: "error",
                    message: "Error Getting Data",
                    debug: err
                });
            }
        });
    });
}


module.exports.getjob = async (req, res) => {
    try {
        let result =[];
        let sql = "SELECT * FROM oc_calendar_reminders"; 
        let dataReminder = await getQuery(sql);
    
        for(let i=0;i<dataReminder.length;i++){
            let time = Date.now();    
            if(dataReminder[i].notification_date*1000>time&&dataReminder[i].type=="AUDIO"){
              var sql2 = `SELECT * FROM oc_calendarobjects WHERE id=${dataReminder[i].object_id}`;
              let rs2 = await getQuery(sql2);
              if(rs2[0].deleted_at==null){
                  let rsdetail = await getDetailReminders(rs2[0].calendardata.toString())
                  rsdetail["notification_date"] = dataReminder[i].notification_date*1000;
                  result.push(rsdetail)
              }
            }
        }
        res.json({status:true,message:result})
        
   
    } catch (error) {
        res.json({status:false,message:error})
    }
};

