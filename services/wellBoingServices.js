import { executeQuery } from "../database/database.js";
import {getUserID} from "./wellBoinAuthServices.js";


const reportMorningData = async({response, request, render}) => {
  const data = {
    errors:[],
    morningDate:'',
    sleepHours:'',
    sleepQuality:'',
    morningMood:''
  };
  const body = request.body();
  const params = await body.value;
  
  const morningDate = params.get('morningDate');
  if (!morningDate) {
    data.errors.push('Insert a valid date. [question #1]');
  };

  const sleepHours = params.get('sleepHours');
  if (!sleepHours) {
    data.errors.push('Insert your sleeping hours. [question #2]'); 
  };

  const sleepQuality = params.get('sleepQuality');
  if (sleepQuality === 'Choose...') {
    data.errors.push('Insert the quality of your sleep. [question #3]');  
  };

  const morningMood = params.get('morningMood');
  if (morningMood === 'Choose...') {
    data.errors.push('Insert your current mood. [question #4]');
  };

  data.morningDate = morningDate;
  data.sleepHours = sleepHours;
  data.sleepQuality = sleepQuality;
  data.morningMood = morningMood;

  const userId = await getUserID();
  if (data.errors.length === 0) {
    await executeQuery("INSERT INTO morning_data (sleep_duration, sleep_quality, generic_mood, date, user_id) VALUES ($1, $2, $3, $4, $5);", sleepHours, sleepQuality, morningMood, morningDate, userId);
    response.redirect('/');
  } else {
    await render('morningReport.ejs', data);
  }
};

const reportEveningData = async({response, request, render}) => {
  const data = {
    errors: [],
    sportHours:'', 
    studyHours:'', 
    eatingRegularity:'', 
    eatingQuality:'', 
    eveningMood:'', 
    eveningDate:''

  }
  const body = request.body();
  const params = await body.value;
  
  const eveningDate = params.get('eveningDate');
  if (!eveningDate) {
    data.errors.push('Insert a valid date. [question #1]');
  };

  const sportHours = params.get('sportHours');
  if (!sportHours) {
    data.errors.push('Insert the time you spent on excercise/sports. [question #2]');
  };

  const studyHours = params.get('studyHours');
  if (!sportHours) {
    data.errors.push('Insert the time you spent on studying. [question #3]');
  };

  const eatingRegularity = params.get('eatingRegularity');
  if (eatingRegularity === 'Choose...') {
    data.errors.push('Provide the value for the regularity of eating. [question #4]');
  };
  const eatingQuality = params.get('eatingQuality');
  if (eatingQuality === 'Choose...') {
    data.errors.push('Provide the value for the quality of eating. [question #5]');
  };
  const eveningMood = params.get('eveningMood');
  if (eveningMood === 'Choose...') {
    data.errors.push('Provide the value for your mood. [question #6]');
  };

  data.eveningDate = eveningDate;
  data.sportHours = sportHours;
  data.studyHours = studyHours;
  data.eatingRegularity = eatingRegularity;
  data.eatingQuality = eatingQuality;
  data.eveningMood = eveningMood;
  

  const userId = await getUserID();
  if (data.errors.length === 0){
    await executeQuery("INSERT INTO evening_data (sport_time, study_time, eating_regularity, eating_quality, generic_mood, date, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7);", sportHours, studyHours, eatingRegularity, eatingQuality, eveningMood, eveningDate, userId);
    response.redirect('/');
  } else {
    await render('eveningReport.ejs', data);
  }
};

const monthlySummary = async(desiredMonth) => {
  let month = desiredMonth;
  if (!month) {
    const date = new Date();
    month = date.getMonth() + 1;
  };

  const monthlySum = {
    avgMonSleep:0,
    avgMonSleepQuality:0,
    avgMonSport:0,
    avgMonStudy:0,
    avgMonMood:0
  }

  const userId = await getUserID();
  monthlySum.avgMonSleep = Number((await executeQuery("SELECT ROUND(AVG(sleep_duration)) FROM morning_data WHERE user_id = $1 AND sleep_duration IS NOT NULL AND date_part('month', date)= $2;", userId, month)).rowsOfObjects()[0].round);

  monthlySum.avgMonSleepQuality = Number((await executeQuery("SELECT ROUND(AVG(sleep_quality)) FROM morning_data WHERE user_id = $1 AND sleep_quality IS NOT NULL AND date_part('month', date)= $2;", userId, month)).rowsOfObjects()[0].round);

  monthlySum.avgMonSport = Number((await executeQuery("SELECT ROUND(AVG(sport_time)) FROM evening_data WHERE user_id = $1 AND sport_time IS NOT NULL AND date_part('month', date)= $2;", userId, month)).rowsOfObjects()[0].round);

  monthlySum.avgMonStudy = Number((await executeQuery("SELECT ROUND(AVG(study_time)) FROM evening_data WHERE user_id = $1 AND study_time IS NOT NULL AND date_part('month', date)= $2;", userId, month)).rowsOfObjects()[0].round);

  monthlySum.avgMonMood = Number((await executeQuery("SELECT ROUND(AVG(generic_mood)) FROM (SELECT (generic_mood) FROM morning_data WHERE user_id = $1 AND generic_mood IS NOT NULL AND date_part('month', date) = $2 UNION ALL SELECT (generic_mood) FROM evening_data WHERE user_id = $1 AND generic_mood IS NOT NULL AND date_part('month', date) = $2) AS summed_moods", userId, month)).rowsOfObjects()[0].round);
  
  return monthlySum;
};

const weeklySummary = async(desiredWeek) => {
  let week = desiredWeek;
  if (!week) {
    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    const pastDaysOfYear = (today - firstDayOfYear) / 86400000;
    week = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7); // inspired from TArch64 from GitHub
  };

  const weeklySum = {
    avgWeeSleep:'',
    avgWeeSleepQuality:'',
    avgWeeSport:'',
    avgWeeStudy:'',
    avgWeeMood:'',
  }

  const userId = await getUserID();
  weeklySum.avgWeeSleep = Number((await executeQuery("SELECT ROUND(AVG(sleep_duration)) FROM morning_data WHERE user_id = $1 AND sleep_duration IS NOT NULL AND date_part('week', date)= $2;", userId, week)).rowsOfObjects()[0].round);

  weeklySum.avgWeeSleepQuality = Number((await executeQuery("SELECT ROUND(AVG(sleep_quality)) FROM morning_data WHERE user_id = $1 AND sleep_quality IS NOT NULL AND date_part('week', date)= $2;", userId, week)).rowsOfObjects()[0].round);

  weeklySum.avgWeeSport = Number((await executeQuery("SELECT ROUND(AVG(sport_time)) FROM evening_data WHERE user_id = $1 AND sport_time IS NOT NULL AND date_part('week', date)= $2;", userId, week)).rowsOfObjects()[0].round);

  weeklySum.avgWeeStudy = Number((await executeQuery("SELECT ROUND(AVG(study_time)) FROM evening_data WHERE user_id = $1 AND study_time IS NOT NULL AND date_part('week', date)= $2;", userId, week)).rowsOfObjects()[0].round);

  weeklySum.avgWeeMood = Number((await executeQuery("SELECT ROUND(AVG(generic_mood)) FROM (SELECT (generic_mood) FROM morning_data WHERE user_id = $1 AND generic_mood IS NOT NULL AND date_part('week', date) = $2 UNION ALL SELECT (generic_mood) FROM evening_data WHERE user_id = $1 AND generic_mood IS NOT NULL AND date_part('week', date) = $2) AS summed_moods", userId, week)).rowsOfObjects()[0].round);
  
  return weeklySum;
};

const moodPerDay = async() => {
  const userId = await getUserID();


  let todayMood = Number((await executeQuery("SELECT ROUND(AVG(generic_mood)) FROM (SELECT (generic_mood) FROM morning_data WHERE user_id = $1 AND generic_mood IS NOT NULL AND date = CURRENT_DATE UNION ALL SELECT (generic_mood) FROM evening_data WHERE user_id = $1 AND generic_mood IS NOT NULL AND date = CURRENT_DATE) AS summed_moods", userId)).rowsOfObjects()[0].round);
  let yesterdayMood = Number((await executeQuery("SELECT ROUND(AVG(generic_mood)) FROM (SELECT (generic_mood) FROM morning_data WHERE user_id = $1 AND generic_mood IS NOT NULL AND date = CURRENT_DATE - 1 UNION ALL SELECT (generic_mood) FROM evening_data WHERE user_id = $1 AND generic_mood IS NOT NULL AND date = CURRENT_DATE - 1) AS summed_moods", userId)).rowsOfObjects()[0].round);
  let moodTrend = '(no changes)';

  if (todayMood < yesterdayMood) {
    moodTrend = "Going down, today's a new day though!";
  } else if (todayMood > yesterdayMood) {
    moodTrend = 'Going up, excellent!';
  };
  
  if (!todayMood) todayMood = '[no data]';
  if (!yesterdayMood) yesterdayMood = '[no data]';

  return { todayMood: todayMood, yesterdayMood: yesterdayMood, moodTrend: moodTrend };
};

const dataRefresh = async({request, response}) => {
  const body = request.body({type: 'json'});
  const document = await body.value;

  console.log(document);

  const month = Number(document.month);
  const week = Number(document.week);

  response.status = 200;
  response.body = {month: await monthlySummary(month), week: await weeklySummary(week) };
}


export { dataRefresh, reportMorningData, reportEveningData, monthlySummary, weeklySummary, moodPerDay };