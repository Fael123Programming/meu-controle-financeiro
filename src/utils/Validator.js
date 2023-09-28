import { 
    emailDoesNotExistOnAppAsync,
    usernameNotTakenAsync
} from "../../service";
import { isValidBirthdayDate } from "./Date";

const alphaLower = 'abcdefghijklmnopqrstuvwxyz';
const alphaUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const digit = '0123456789';
const special = '!`\'"@#$%^&*()_+{}|\?/.><,+*/-';

function validateCity(city, cities) {
    let filtered = cities.filter(c => c.label.toLowerCase() === city.toLowerCase());
    if (filtered.length > 0)
        return true;
    return false;
}

function validatePostcode(postcode, type) {
    return new RegExp(`^\\d{${type[0]}}-\\d{${type[1]}}$`).test(postcode);
}

function validateEmail(email) {
    // return new RegExp(
    //     '[\\w.-]+@[\\w-]+(\\.[a-z]+)+'
    // ).test(email);
    let regex = /[\w.-]+@[\w-]+(\.[a-z]+)+/;
    return regex.test(email);
}

function validatePassword(password) {
    // A palavra-passe deve ter no mínimo 6 caracteres, 1 letra maiúscula, 1 letra minúscula e 1 caracter especial.
    let cleanPassword = password.trim();
    if (cleanPassword.length < 6) {
        return false;
    }
    let hasOneLowerCaseLetter = false, hasOneUpperCaseLetter = false, hasOneSpecial = false;
    for (let i of cleanPassword) {
        if (alphaLower.indexOf(i) != -1) {
            hasOneLowerCaseLetter = true;
        }
        if (alphaUpper.indexOf(i) != -1) {
            hasOneUpperCaseLetter = true;
        }
        if (special.indexOf(i) != -1) {
            hasOneSpecial = true;
        }
        if (hasOneLowerCaseLetter && hasOneUpperCaseLetter && hasOneSpecial) {
            break;
        }
    }
    return hasOneLowerCaseLetter && hasOneUpperCaseLetter && hasOneSpecial;
}

function validateTextField(text) {
    return text.trim().length > 0;
}

async function validateUserData(
    name, 
    surname, 
    username, 
    birthdayDate,
    street,
    city,
    postcode,
    email, 
    minAge,
    cities,
    postcodeType,
    id
) {
    let message = {};
    if (validateTextField(name) && validateTextField(surname) && validateTextField(username)) {
        if (await usernameNotTakenAsync(username, id)) {
            if (isValidBirthdayDate(birthdayDate, minAge)) {
                if (validateTextField(street) && validateCity(city, cities) && validatePostcode(postcode, postcodeType)) {
                    if (validateEmail(email)) {
                        if (await emailDoesNotExistOnAppAsync(email, id)) {
                            message.header = 'ok'; 
                            message.body = 'ok';             
                        } else {
                            message.header = 'E-mail Repetido';
                            message.body = 'O e-mail já está em uso!';
                        }
                    } else {
                        message.header = 'Formato do E-mail';
                        message.body = 'O e-mail possui formato inválido!';
                    }
                } else {
                    message.header = 'Endereço Inválido';
                    message.body = 'Digite valores válidos para logradouro, cidade e código postal';
                }
            } else {
                message.header = 'Data de Nascimento';
                message.body = `Apenas usuários com ${minAge} anos ou mais!`;
            }
        } else {
            message.header = 'Nome de Utilizador Repetido';
            message.body = 'O Nome de utilizador já está em uso!';
        }
    } else {
        message.header = 'Valores de Identificação Inválidos';
        message.body = 'Preencha os campos de nome, sobrenome e nome de utilizador corretamente!';
    }
    return message;
}

function validateExpenseData(title, issuer, price) {
    return title.length > 0 && issuer.length > 0 && price?.toString().length > 0;
}

const capitalize = str => {
    const split = str.split(' ');
    let newStr = '';
    split.forEach(s => newStr += s.charAt(0).toUpperCase() + s.slice(1) + ' ');
    return newStr.trim();
};

export { 
    validateEmail, 
    validatePassword, 
    validateTextField,
    validatePostcode,
    validateUserData,
    validateExpenseData,
    capitalize
};
