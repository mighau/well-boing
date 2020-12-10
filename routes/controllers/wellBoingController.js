import * as services from '../../services/wellBoingServices.js';



const wellBoingLogin = async({render}) => {
  const data = {
    errors: [],
    email:''
  };
  render('login.ejs', data);
}
const wellBoingRegister = async({render}) => {
  const data = {
    errors: [],
    email:''
  };

  render('register.ejs', data);
}

const wellBoingMain = async({render, response, session}) => {
  if (session && await session.get('authenticated')) {
    response.redirect('/behavior/summary');
}
  render('index.ejs');
}

const morningReport = async({render, session}) => {
  render('morningReport.ejs', {
    errors:[],
    morningDate:'',
    sleepHours:'',
    sleepQuality:'',
    morningMood:'',
    email: (await session.get('user')).email
  });
}

const eveningReport = async({render, session}) => {
  render('eveningReport.ejs', {
    errors: [],
    sportHours:'', 
    studyHours:'', 
    eatingRegularity:'', 
    eatingQuality:'', 
    eveningMood:'', 
    eveningDate:'',
    email: (await session.get('user')).email
  });
}

const summary = async({render, session}) => {
  const userId = (await session.get('user')).id;

  const data = {
    monthly: await services.monthlySummary(userId, ''),
    weekly: await services.weeklySummary(userId, ''),
    moods: await services.moodPerDay(userId),
    email: (await session.get('user')).email,
    todayDone: await services.isReportingDone(userId)
  };

  render('summaryMain.ejs', data);
};



export { wellBoingRegister, wellBoingLogin, wellBoingMain, morningReport, eveningReport, summary };


