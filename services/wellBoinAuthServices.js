import { executeQuery } from "../database/database.js";
import { bcrypt, validate, required, isEmail } from "../deps.js";


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

const postLoginForm = async({request, response, render, session}) => {
    const data = {
        errors: [],
        email:''
    };

    const body = request.body();
    const params = await body.value;

    const email = params.get('email');
    const password = params.get('password');

    const res = await executeQuery("SELECT * FROM users WHERE email = $1;", email);
    if (res.rowCount === 0) {
        data.errors.push('Email not found!');
        await render('login.ejs', data)
    }
    data.email = email;
    const userObj = res.rowsOfObjects()[0];
    const hash = userObj.password;

    const passwordCorrect = await bcrypt.compare(password, hash);
    if (!passwordCorrect) {
        data.errors.push('Password not valid!');
        await render('login.ejs', data)
    }

    await session.set('authenticated', true);
    await session.set('user', {
        id: userObj.id,
        email: userObj.email
    });
    console.log('login testi: ', await session.get('user'));

    response.redirect('/');
}
  
const wellBoingRegister = async({request, response, render, session}) => {
    const data = {
        errors: [],
        email:''
    };

    const validationRules = {
        email: [required, isEmail]
    };

    const body = request.body();
    const params = await body.value;

    const email = params.get('email');
    const password = params.get('password');
    const verification = params.get('verification');

    data.email = email;
    const [passes, errors] = await validate(data, validationRules);


    if (!passes) {
        data.errors.push(errors.email.isEmail);
        await render('register.ejs', data);
    };

    if (password !== verification) {
        data.errors.push("Passwords don't match!");
        await render('register.ejs', data);
    }

    const existingUsers = await executeQuery("SELECT * FROM users WHERE email = $1", email);
    if (existingUsers.rowCount > 0) {
        data.errors.push('The email is already reserved.');
        await render('register.ejs', data);    
    } else {
        const hash = await bcrypt.hash(password);
        await executeQuery("INSERT INTO users (email, password) VALUES ($1, $2);", email, hash);
    };


    const userObj = (await executeQuery("SELECT * FROM users WHERE email = $1;", email)).rowsOfObjects()[0];
    await session.set('authenticated', true);
    await session.set('user', {
        id: userObj.id,
        email: userObj.email
    });
    response.redirect('/');
};

const logOut = async({session, response}) => {
    if (session && await session.get('authenticated')) {
        await session.set('authenticated', false);
        await session.set('user', {
            id: '',
            email: ''
        });
        response.redirect('/');
    }
};

const getUserID = async({session}) => {
    return (await session.get('user')).id;
  }
  

  export { getUserID, wellBoingRegister, postLoginForm, wellBoingAuth, logOut }