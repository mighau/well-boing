import * as services from '../../services/wellBoingServices.js';

const wellBoingLogin = async({render}) => {
  render('login.ejs');
}

const wellBoingMain = async({render}) => {
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
    summary: await services.monthlySummary()
  };
  console.log(data);
  render('summaryMain.ejs', data);
};

export { wellBoingLogin, wellBoingMain, morningReport, eveningReport, summary };


