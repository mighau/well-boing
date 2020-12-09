import { Router } from "../deps.js";
import * as wbctrl from "./controllers/wellBoingController.js";
import * as wellBoingApi from "./apis/helloApi.js";
import * as wbservices from "../services/wellBoingServices.js";

const router = new Router();

router.get('/', wbctrl.wellBoingMain);

router.get('/auth/login', wbctrl.wellBoingLogin);
//router.get('/auth/login', wbctrl.wellBoingLogin);

router.get('/auth/register', wbctrl.wellBoingRegister);
//router.get('/auth/register', );

router.get('/report/morning', wbctrl.morningReport);
router.post('/report/morning', wbservices.reportMorningData);

router.get('/report/evening', wbctrl.eveningReport);
router.post('/report/evening', wbservices.reportEveningData);

router.get('/behavior/summary', wbctrl.summary);
router.post('/behavior/summary/refresh', wbservices.dataRefresh);




export { router };