import { executeQuery } from "../../database/database.js";


const weekSummary = async({response}) => {
    const returnJSON = {
        "Last-week-average-sleep":'',
        "Last-week-average-sports":'',
        "Last-week-average-studying":'',
        "Last-week-average-sleep-quality":'',
        "Last-week-average-generic-mood":''

    }

    returnJSON["Last-week-average-sleep"] = (await executeQuery("SELECT ROUND(AVG(sleep_duration)) FROM morning_data WHERE sleep_duration IS NOT NULL AND date BETWEEN (NOW() - INTERVAL '7 DAY') AND NOW();")).rowsOfObjects()[0].round;

    returnJSON["Last-week-average-sleep-quality"] = (await executeQuery("SELECT ROUND(AVG(sleep_quality)) FROM morning_data WHERE sleep_quality IS NOT NULL AND date BETWEEN (NOW() - INTERVAL '7 DAY') AND NOW();")).rowsOfObjects()[0].round;

    returnJSON["Last-week-average-sports"] = (await executeQuery("SELECT ROUND(AVG(sport_time)) FROM evening_data WHERE sport_time IS NOT NULL AND date BETWEEN (NOW() - INTERVAL '7 DAY') AND NOW();")).rowsOfObjects()[0].round;

    returnJSON["Last-week-average-studying"] = (await executeQuery("SELECT ROUND(AVG(study_time)) FROM evening_data WHERE study_time IS NOT NULL AND date BETWEEN (NOW() - INTERVAL '7 DAY') AND NOW();")).rowsOfObjects()[0].round;

    returnJSON["Last-week-average-generic-mood"] = (await executeQuery("SELECT ROUND(AVG(generic_mood)) FROM (SELECT (generic_mood) FROM morning_data WHERE generic_mood IS NOT NULL AND date BETWEEN (NOW() - INTERVAL '7 DAY') AND NOW() UNION ALL SELECT (generic_mood) FROM evening_data WHERE generic_mood IS NOT NULL AND date BETWEEN (NOW() - INTERVAL '7 DAY') AND NOW()) AS summed_moods")).rowsOfObjects()[0].round;
  

    response.body = returnJSON;
}

const daySummary = async({response, params}) => {
    const date = params.year + '-' + params.month + '-' +  params.day;
    

    const returnJSON = {
        "Day-average-sleep":'',
        "Day-average-sports":'',
        "Day-average-studying":'',
        "Day-average-sleep-quality":'',
        "Day-average-generic-mood":''

    }

    returnJSON["Day-average-sleep"] = (await executeQuery("SELECT ROUND(AVG(sleep_duration)) FROM morning_data WHERE sleep_duration IS NOT NULL AND date = $1;", date)).rowsOfObjects()[0].round;

    returnJSON["Day-average-sleep-quality"] = (await executeQuery("SELECT ROUND(AVG(sleep_quality)) FROM morning_data WHERE sleep_quality IS NOT NULL AND date = $1;", date)).rowsOfObjects()[0].round;

    returnJSON["Day-average-sports"] = (await executeQuery("SELECT ROUND(AVG(sport_time)) FROM evening_data WHERE sport_time IS NOT NULL AND date = $1;", date)).rowsOfObjects()[0].round;

    returnJSON["Day-average-studying"] = (await executeQuery("SELECT ROUND(AVG(study_time)) FROM evening_data WHERE study_time IS NOT NULL AND date = $1;", date)).rowsOfObjects()[0].round;

    returnJSON["Day-average-generic-mood"] = (await executeQuery("SELECT ROUND(AVG(generic_mood)) FROM (SELECT (generic_mood) FROM morning_data WHERE generic_mood IS NOT NULL AND date = $1 UNION ALL SELECT (generic_mood) FROM evening_data WHERE generic_mood IS NOT NULL AND date = $1) AS summed_moods;", date)).rowsOfObjects()[0].round;
  
    response.body = returnJSON;
    
}



export { weekSummary, daySummary }