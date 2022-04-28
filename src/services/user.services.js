"use strict";

// IMPORTS ==================================================================================================
const { USERS, employee } = require("../constants/tables.constants");
const {
    ER_DATA_ALREADY_EXISTS,
    ER_DATA_NOT_FOUND,
    ER_USER_BLOCKED,
} = require("../constants/errors.constants");
const { generateToken } = require("../helpers/jwt");

// SERVICES ==================================================================================================
/*
 * Add new user - Service
 * @param {object} con
 * @param {object} body
 * @returns
 */
const addUser = async (con, body) => {
    const response = {
        message: "User registered.",
    };

    const { emp_id, name, email_id,mobile_number, national_id, password } = body;
    if (password.length >= 6) {
        const find = await con.execute(
            `SELECT emp_id FROM ${employee} WHERE email_id = '${email_id}'`
          );
        
    // Check for existing email
    console.log(find)
        if (find.rowCount > 0) {
            throw ER_DATA_ALREADY_EXISTS("email_id");
        } else {
            // Insert operation
            const data =
                await con.execute(`INSERT INTO ${employee}(emp_id,name,email_id,mobile_number,national_id,password) 
                VALUES ('${emp_id}','${name}','${email_id}','${mobile_number}','${national_id}','${password}')
		        RETURNING  name, email_id, mobile_number, national_id`);

    return response;
};
  }  }
/**
 * User Login - service
 * @param {object} con
 * @param {object} body
 * @returns
 */
const userLogin = async (con, body) => {
    // console.log("entered into function");
    const response = {
        message: " logged in successfully",    
    };
    const { email_id, password } = body;

    // Check user if exists.
    // let query =`SELECT * FROM ${employee} WHERE email_id = "${email_id}"`;
    // console.log(query);
    let records = await con.execute(`SELECT * FROM ${employee} WHERE email_id = '${email_id}'`);
    

    // if records are found then proceed
    if (records.rowCount > 0) {
        const record = records.rows[0];
        //console.log(record);

        // Check if user is blocked
        if (record.blocked) throw ER_USER_BLOCKED;

        // Check password
        if (record.password !== password) {
            //**** ADD ENCRYPTION HERE LATER ON ****
            throw ER_DATA_NOT_FOUND("employee");
        }

        // Generate and update token.
        
                const token = generateToken(record.emp_id);
               
                response.data = (
                    await con.execute(
                        `UPDATE ${employee} 
                        SET token='${token}' 
                        WHERE emp_id='${record.emp_id}' 
        
				RETURNING    name, email_id, mobile_number, national_id,token`
            )
        ).rows[0];

        return response;
    }

    // else error
    throw ER_DATA_NOT_FOUND("user");
};

/**
//  * Logout user - service
//  * @param {object} con
//  * @param {string} id
//  * @returns
//  */
const userLogout = async (con, emp_id) => {
    const response = {
        message: "User successfully logged out.",
        data: {},
    };

    await con.execute(`UPDATE ${employee} SET token='' WHERE emp_id= '${emp_id}'`);
    return response;
};




const updateUser = async (con, body) => {
	let response = {
		message: "User Updated.",
	};

	// Destructure body
    const { emp_id, name, email_id,mobile_number, national_id } = body;
	// forming set variables and combining to string
	let set = [];
	if (emp_id) set.push(`emp_id = '${emp_id}'`);
	if (name) set.push(`name = '${name}'`);
	if (email_id) set.push(`email_id = '${email_id}'`);
	if (mobile_number) set.push(`mobile_number = '${mobile_number}'`);
    if (national_id) set.push(`national_id = '${national_id}'`);
  //  if (password) set.push(`password = '${password}'`);
	set = set.join(", ");

	// Fire query
	response.data = await con.execute(`
		UPDATE ${employee} 
		SET ${set} 
		WHERE email_id = '${email_id}'
		RETURNING emp_id,name,email_id, mobile_number, national_id,password
	`);

	// Error of entered email was wrong
	if (response.data.rowCount === 0) throw ER_DATA_NOT_FOUND("user");

	// Finally return
	if (response.data.rows) response.data = response.data.rows;
	return response;
};
/**
 * User Update Password - service
 * @param {object} con
 * @param {object} body
 * @returns
 */
 const forgot = async (con, body) => {
	const response = {
		message: "Password successfully updated.",
	};

	response.data = await con.execute(`
		UPDATE ${employee}
		SET password = '${body.password}', token = ''
		WHERE email_id = '${body.email_id}'
		RETURNING emp_id,name,email_id, mobile_number, national_id,password
	`);

	if (response.data.rowCount === 0) throw ER_DATA_NOT_FOUND("user");

	return response;
};
// EXPORTS ==================================================================================================
module.exports = {  addUser, userLogin,userLogout,updateUser ,forgot };
