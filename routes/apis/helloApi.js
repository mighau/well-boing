import * as helloService from "../../services/helloService.js";

const getHello = async({response}) => {
    response.body = {message: await helloService.getHello()};
};

const setHello = async({request, response}) => {
    const body = request.body({type: 'json'});
    const document = await body.value;
    helloService.setHello(document.message);
    response.status = 200;
};
   
export { getHello, setHello };