const data = require('./data.json');

math = require( 'mathjs');

/*
 * Input: a file of all of the activities of one Strava User
 * Goal: find a method to identify best time to notify them
 * 
 * look over past 3 months
 * - if the user does not have that much data (ex: only has 2 months) then use the data that they do have
 * - if the user has data but has not run over the past 3 months, then pick a default notification time
 *      - reasoning: they aren't running consistently, so their injury probably isn't a result of running at this point
 * 
 * if the user has data within the past 3 months:
 *            | Mon | Tues | Wed | Thurs | Fri | Sat | Sun
 * -----------+-----+------+-----+-------+-----+-----+------
 * Mean Time  | 
 * -----------+-----+------+-----+-------+-----+-----+------
 * SD         |
 * -----------+-----+------+-----+-------+-----+-----+------
 * Median     |
 * -----------+-----+------+-----+-------+-----+-----+------
 * Q1         |
 * -----------+-----+------+-----+-------+-----+-----+------
 * Q3         |
 * -----------+-----+------+-----+-------+-----+-----+------
 * IQR        |
 * -----------+-----+------+-----+-------+-----+-----+------
 * 
 * Assumptions:
 * - if they run multiple times during the day, they should do recovery before the first run
 *      this means we can ignore all runs that are NOT the first run in a day
 * 
 * 
 */



defaultNotTime = ["12PM","12PM","12PM","12PM","12PM","12PM","12PM"];

if(data.length==0) {
    return defaultNotTime;
}

today = new Date();

threeMonthsAgo = new Date();

threeMonthsAgo.setMonth(today.getMonth()-3);

timeTable = [
    {
        "day_of_week":"Monday",
        "time":[],
        "mean_time":0,
        "sd":"",
        "median":"",
        "q1":"",
        "q3":"",
        "IQR":""
    },
    {
        "day_of_week":"Tuesday",
        "time":[],
        "mean_time":0,
        "sd":"",
        "median":"",
        "q1":"",
        "q3":"",
        "IQR":""
    },
    {
        "day_of_week":"Wednesday",
        "time":[],
        "mean_time":0,
        "sd":"",
        "median":"",
        "q1":"",
        "q3":"",
        "IQR":""
    },
    {
        "day_of_week":"Thursday",
        "time":[],
        "mean_time":0,
        "sd":"",
        "median":"",
        "q1":"",
        "q3":"",
        "IQR":""
    },
    {
        "day_of_week":"Friday",
        "time":[],
        "mean_time":0,
        "sd":"",
        "median":"",
        "q1":"",
        "q3":"",
        "IQR":""
    },
    {
        "day_of_week":"Saturday",
        "time":[],
        "mean_time":0,
        "sd":0,
        "median":"",
        "q1":"",
        "q3":"",
        "IQR":""
    },
    {
        "day_of_week":"Sunday",
        "time":[],
        "mean_time":0,
        "sd":0,
        "median":"",
        "q1":"",
        "q3":"",
        "IQR":""
    }
]

count = 1;
curDate = new Date(data[0]['start_date']);

while(curDate<today && count<data.length) {
    
    dayOfWeek = curDate.getDay();

    curTime = getTime(curDate);

    timeTable[dayOfWeek]['time'].push(curTime);

    curTimeList = timeTable[dayOfWeek]['time'];
    curTimeList = curTimeList.sort();
    timeTable[dayOfWeek]['time'] = curTimeList;

    // updating average time
    timeTable[dayOfWeek]['mean_time'] = (timeTable[dayOfWeek]['mean_time']*(count-1)+curTime)/count;
    
    // updating sd
    timeTable[dayOfWeek]['sd'] = math.std(curTimeList);

    // updating median
    timeTable[dayOfWeek]['median'] = math.median(curTimeList);

    // update first quartile
    timeTable[dayOfWeek]['q1'] = math.quantileSeq(curTimeList,0.25);

    // update third quartile 
    timeTable[dayOfWeek]['q3'] = math.quantileSeq(curTimeList,0.75);

    // update IQR
    timeTable[dayOfWeek]['IQR'] = timeTable[dayOfWeek]['q3'] - timeTable[dayOfWeek]['q1'];

    curDate = new Date(data[count]['start_date']);
    count++;
}

console.log(timeTable)

/*
 * If mean is less than median, left skew
 * so we can estimate by doing mean - 1 SD
 * if right skew, then we can do mean + 1 SD
 */

finalTime = [];

for(var i=0;i<timeTable.length;i++) {
    if(timeTable[i]['median']>timeTable[i]['mean_time']*1.1) {
        if(timeTable[i]['mean_time']-1*timeTable[i]['sd'] > 0) {
            finalTime.push(timeTable[i]['mean_time']-1*timeTable[i]['sd']);
        }
        else finalTime.push(timeTable[i]['mean_time']);
    }
    else if(timeTable[i]['median']<timeTable[i]['mean_time']*0.9) {
        if(timeTable[i]['mean_time']-1*timeTable[i]['sd'] < 24*60) {
            finalTime.push(timeTable[i]['mean_time']+1*timeTable[i]['sd']);
        }
        else finalTime.push(timeTable[i]['mean_time']);
    }
    else finalTime.push(timeTable[i]['mean_time']);
}

console.log(finalTime);


/*
 * input: a Date object
 * output: number of minutes it has been into that day
 */
function getTime(date) {
    return date.getHours()*60+date.getMinutes();
}




