const bcrypt = require('bcrypt');
const { getUserByEmail, addUser } = require('../models/userModel');

async function registerUser(email, password, role = 'user') {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
        throw new Error('Користувач уже існує');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await addUser({ email, password: hashedPassword, role });
}

async function loginUser(email, password) {
    console.log('Email для пошуку:', email);
    const user = await getUserByEmail(email);
    console.log('Знайдений користувач:', user);
    if (!user) {
        throw new Error('Користувача не знайдено');
    }
    const isValid = await bcrypt.compare(password, user.Password);
    if (!isValid) {
        throw new Error('Невірний пароль');
    }
    return user;
}


module.exports = { registerUser, loginUser };
