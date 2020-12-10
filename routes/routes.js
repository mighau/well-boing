import { Router } from "../deps.js";
import * as wbctrl from "./controllers/wellBoingController.js";
import * as wbservices from "../services/wellBoingServices.js";
import * as authservices from "../services/wellBoinAuthServices.js";
import * as apis from "./apis/wellBoingApi.js";


const router = new Router();

router.get('/', wbctrl.wellBoingMain);

router.get('/auth/login', wbctrl.wellBoingLogin);
router.post('/auth/login', authservices.postLoginForm);

router.get('/auth/register', wbctrl.wellBoingRegister);
router.post('/auth/register', authservices.wellBoingRegister);

router.get('/auth/logout', authservices.logOut);

router.get('/report/morning', wbctrl.morningReport);
router.post('/report/morning', wbservices.reportMorningData);

router.get('/report/evening', wbctrl.eveningReport);
router.post('/report/evening', wbservices.reportEveningData);

router.get('/behavior/summary', wbctrl.summary);
router.post('/behavior/summary/refresh', wbservices.dataRefresh);

router.get('/api/summary', apis.weekSummary);
router.get('/api/summary/:year/:month/:day', apis.daySummary);


export { router };