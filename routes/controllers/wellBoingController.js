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

const morningReport = async({render}) => {
  render('morningReport.ejs', {
    errors:[],
    morningDate:'',
    sleepHours:'',
    sleepQuality:'',
    morningMood:''
  });
}

const eveningReport = async({render}) => {
  render('eveningReport.ejs', {
    errors: [],
    sportHours:'', 
    studyHours:'', 
    eatingRegularity:'', 
    eatingQuality:'', 
    eveningMood:'', 
    eveningDate:''
  });
}

const summary = async({render}) => {
  const data = {
    monthly: await services.monthlySummary(),
    weekly: await services.weeklySummary(),
    moods: await services.moodPerDay()
  };

  render('summaryMain.ejs', data);
};



export { wellBoingRegister, wellBoingLogin, wellBoingMain, morningReport, eveningReport, summary };


