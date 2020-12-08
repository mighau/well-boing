import { executeQuery } from "../database/database.js";
import { bcrypt } from "../deps.js";

function getNumberOfWeek() {
  const today = new Date();
  const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
  const pastDaysOfYear = (today - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

const wellBoingAuth = async({request, response}) => {
  const body = request.body();
  const params = await body.value;

  const email = params.get('email');
  const password = params.get('password');

  // check if the email exists in the database
  const res = await executeQuery("SELECT * FROM users WHERE email = $1;", email);
  if (res.rowCount === 0) {
      response.status = 401;
      return;
  }

  // take the first row from the results
  const userObj = res.rowsOfObjects()[0];

  const hash = userObj.password;

  const passwordCorrect = await bcrypt.compare(password, hash);
  if (!passwordCorrect) {
      respnse.status = 401;
      return;
  }

  response.redirect("/");
};

const wellBoingRegister = async({request, response, session}) => {
  const body = request.body();
  const params = await body.value;
  
  const email = params.get('email');
  const password = params.get('password');
  const verification = params.get('verification');

  // here, we would validate the data, e.g. checking that the 
  // email really is an email

  if (password !== verification) {
    response.body = 'The entered passwords did not match';
    return;
  }

  // check if there already exists such an email in the database
  // -- if yes, respond with a message telling that the user
  // already exists
  const existingUsers = await executeQuery("SELECT * FROM users WHERE email = $1", email);
  if (existingUsers.rowCount > 0) {
    response.body = 'The email is already reserved.';
    return;
  }

  // otherwise, store the details in the database
  const hash = await bcrypt.hash(password);
  // when storing a password, store the hash    
  await executeQuery("INSERT INTO users (email, password) VALUES ($1, $2);", email, hash);
  response.body = 'Registration successful!';
};

const showLoginForm = ({render}) => {
  render('login.ejs');
};

const reportMorningData = async({response, request, render, session}) => {
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

  const userId = 2/* (await session.get('user')).id */;
  if (data.errors.length === 0) {
    await executeQuery("INSERT INTO morning_data (sleep_duration, sleep_quality, generic_mood, date, user_id) VALUES ($1, $2, $3, $4, $5);", sleepHours, sleepQuality, morningMood, morningDate, userId);
    response.redirect('/');
  } else {
    await render('morningReport.ejs', data);
  }
};

const reportEveningData = async({response, request, render, session}) => {
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
  

  const userId = 2/* (await session.get('user')).id */;
  if (data.errors.lenth === 0){
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

  const userId = 2 // FROM SESSION, FIX!!!!
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

  const userId = 2 // FROM SESSION, FIX!!!!
  weeklySum.avgWeeSleep = Number((await executeQuery("SELECT ROUND(AVG(sleep_duration)) FROM morning_data WHERE user_id = $1 AND sleep_duration IS NOT NULL AND date_part('week', date)= $2;", userId, week)).rowsOfObjects()[0].round);

  weeklySum.avgWeeSleepQuality = Number((await executeQuery("SELECT ROUND(AVG(sleep_quality)) FROM morning_data WHERE user_id = $1 AND sleep_quality IS NOT NULL AND date_part('week', date)= $2;", userId, week)).rowsOfObjects()[0].round);

  weeklySum.avgWeeSport = Number((await executeQuery("SELECT ROUND(AVG(sport_time)) FROM evening_data WHERE user_id = $1 AND sport_time IS NOT NULL AND date_part('week', date)= $2;", userId, week)).rowsOfObjects()[0].round);

  weeklySum.avgWeeStudy = Number((await executeQuery("SELECT ROUND(AVG(study_time)) FROM evening_data WHERE user_id = $1 AND study_time IS NOT NULL AND date_part('week', date)= $2;", userId, week)).rowsOfObjects()[0].round);

  weeklySum.avgWeeMood = Number((await executeQuery("SELECT ROUND(AVG(generic_mood)) FROM (SELECT (generic_mood) FROM morning_data WHERE user_id = $1 AND generic_mood IS NOT NULL AND date_part('week', date) = $2 UNION ALL SELECT (generic_mood) FROM evening_data WHERE user_id = $1 AND generic_mood IS NOT NULL AND date_part('week', date) = $2) AS summed_moods", userId, week)).rowsOfObjects()[0].round);
  
  return weeklySum;
};



export { wellBoingAuth, wellBoingRegister, showLoginForm, reportMorningData, reportEveningData, monthlySummary, weeklySummary };