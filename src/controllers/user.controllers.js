"use strict";

// IMPORTS ==================================================================================================
const { userService } = require("../services");
const { ER_FIELD_EMPTY } = require("../constants/errors.constants");
const Connection = require("../includes/database_connection");

// CONTROLLERS ==============================================================================================
/**
 * List all users - controller
 * @param {object} req
 * @param {object} res
 * @param {object} next
 */


/**
 * Add new user - controller
 * @param {object} req
 * @param {object} res
 * @param {object} next
 */
const addUser = async (req, res, next) => {
    const con = new Connection();
    await con.connect();
    await con.begin();

    try {
        // Validations
        if (!req.body.email_id) throw ER_FIELD_EMPTY("email");
        if (!req.body.password) throw ER_FIELD_EMPTY("password");
        if (!req.body.name) throw ER_FIELD_EMPTY("name");

        const response = await userService.addUser(con, req.body);

        await con.commit();
        con.release();

        res.send(response);
    } catch (error) {
        await con.rollback();
        con.release();

        next(error);
    }
};

/**
 * Login user - controller
 * @param {object} req
 * @param {object} res
 * @param {object} next
 */
const userLogin = async (req, res, next) => {
    const con = new Connection();
    await con.connect();
    await con.begin();

    try {
        // Validations
        if (!req.body.email_id) throw ER_FIELD_EMPTY("email_id");
        if (!req.body.password) throw ER_FIELD_EMPTY("password");

        const response = await userService.userLogin(con, req.body);

        await con.commit();
        con.release();

        res.send(response);
    } catch (error) {
        await con.rollback();
        con.release();

        next(error);
    }
};

/**
 * Logout user - controller
 * @param {object} req
 * @param {object} res
 * @param {object} next
 */
 const userLogout = async (req, res, next) => {
    const con = req._con;
    await con.begin();

    try {
        const response = await userService.userLogout(con, req._emp_id);

        await con.commit();
        con.release();

        res.send(response);
    } catch (error) {
        await con.rollback();
        con.release();

        next(error);
    }
};

/**
 * Update user - controller
 * @param {object} req
 * @param {object} res
 * @param {object} next
 */
 const updateUser = async (req, res, next) => {
	const con = req._con;
	await con.begin();

	try {
		const { emp_id, name, email_id,mobile_number, national_id } = req.body;
		// Check if email is passed
		if (!email_id) throw ER_FIELD_EMPTY("email_id");
		// Check if at least one of the following set items is passed.
		if (!name && !mobile_number && !national_id && !emp_id)
			throw ER_MISSING_FIELDS("name, mobile_number, national_id, emp_id");

		let response = await userService.updateUser(con, req.body);

		await con.commit();
		con.release();

		res.send(response);
	} catch (error) {
		await con.rollback();
		con.release();

		next(error);
	}
};


 /* User Update Password - controller
 * @param {object} req
 * @param {object} res
 * @param {object} next
 */
const forgot = async (req, res, next) => {
	const con = new Connection();
	await con.connect();
	await con.begin();

	try {
		const response = await userService.forgot(con, req.body);

		await con.commit();
		con.release();

		res.send(response);
	} catch (error) {
		await con.rollback();
		con.release();

		next(error);
	}
};


// EXPORTS ==================================================================================================
module.exports = {
    
    addUser,
    userLogin,
    userLogout,
    updateUser,
    forgot,
};
