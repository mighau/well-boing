import { getHello } from "../../services/helloService.js";

const hello = async({render}) => {
  render('index.ejs', { hello: await getHello() });
};
  
export { hello };