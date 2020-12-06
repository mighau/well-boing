import { Router } from "../deps.js";
import { hello } from "./controllers/helloController.js";
import * as helloApi from "./apis/helloApi.js";

const router = new Router();

router.get('/', hello);

router.get('/api/hello', helloApi.getHello);
router.post('/api/hello', helloApi.setHello);

export { router };