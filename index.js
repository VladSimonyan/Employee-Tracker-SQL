
const inquirer = require("inquirer");
const table = require("require.table");
const connection = require("./config/connection");

const useConnection = require("./config/connection");
const prompts = require("./config/prompts");
const { titlePrompt, addEmployee, addRole, updateRole, updateManager, deleteEmployee, deleteDept, deleteRolePrompt } = require("./config/prompts");

const usePrompts = require("./config/prompts");
require("console.table");

console.log('You are now connected as id $(connection.threadId} \n');
runApp();

runApp = () => {
    inquirer.prompt(prompt.titlePrompt).then((response) => {
        switch (response.initialInquiry) {
            case 'View all employees':
                viewAllEmployees();
                break;
            case 'View all employee roles':
                viewAllRoles();
                break;
            case 'View employees by manager':
                viewAllManagers();
                break;
            case 'View employees by department':
                viewAllDepartments();
                break;
            case 'View department budget':
                viewDepartmentBudget();
            case 'Add employee':
                addEmployee();
                break;
            case 'Add department':
                addDepartment();
                break;
            case 'Add role':
                addRole();
                break;
            case 'Update employee role':
                updateRole();
                break;
            case 'Update employee manager':
                updateManager();
                break;
            case 'Remove employee':
                deleteEmployee();
                break;
            case 'Remove department':
                deleteDept();
                break;
            case 'Remove role':
                deleteRole();
                break;
            case 'Quit database':
                console.log('You have exited the employee database. So long and thanks for all the fish! \n');
                connection.end();
                return;
            default:
                break;
        }
    })
};

function viewAllEmployees() {
    console.log("Viewing Employees")
    connection.query(`SELECT employee.employeeID, employee.firstName, employee.lastName, role.roleTitle, department.dept_name AS department,
    role.roleSalary, CONCAT(manager.firstName, ' ', manager.lastName) AS manager FROM employee m RIGHT JOIN employee employee ON employee.managerID = manager.employeeID
    JOIN role ON employee.roleID = role.roleID JOIN department ON department.deptID = role.deptID ORDER BY employee.employeeID ASC;`, (err, res) => {
    if(err) throw(err);
    console.table('\n', res, '\n')
    });
    console.log("Running Employee View");
    runApp();
};

function viewAllDepartments() {
    console.log("Viewing Employees by Department")
    connection.query(`SELECT deparment.deptID, department.dept_name FROM employee employee LEFT JOIN role role ON employee.roleID = role.roleID
    LEFT JOIN department department ON department.deptID = role.deptID GROUP BY department.deptID, department.dept_name ASC;`, (err, res) => {
        if(err) throw(err);
        const deptChoices = res.map((viewDept) => ({name: viewDept.dept_name, value: viewDept.deptID}));
        inquirer.prompt(prompts.viewByDeptPrompt(deptChoices)).then(function(response){
            connection.query(`SELECT employee.employeeID, employee.firstName, employee.lastName, role.roleTitle, department.dept_name AS department FROM
            employee employee JOIN role role ON employee.roleID = role.roleID JOIN department department ON department.deptID = role.deptID WHERE department.deptID = ${response.department};`, (err, res) => {
                if(err) throw(err);
                console.table("\n Departments: ", res);
                console.log("Viewing Employees' Departments");
                runApp();
            });
        });
    });
};

function viewAllManagers() {
    console.log("Viewing Employees by Manager")
    connection.query(`SELECT employeeID, firstName, lastName FROM employee ORDER by employeeID ASC;`, (err, res) => {
        if(err) throw(err);
        const managerChoices = res.map((employee) => ({name: employee.firstName + ' ' + employee.lastName, value: employee.employeeID}));
        inquirer.prompt(prompts.viewByManagerPrompt(managerChoices)).then(function(response){
            connection.query(`SELECT employee.employeeID, employee.firstName, employee.lastName, role.roleTitle, department.dept_name, role.roleSalary, CONCAT(m.firstName,
            ' ', m.lastName) manager FROM employee m RIGHT JOIN employee employee ON employee.managerID = m.employeeID JOIN role ON employee.roleID = role.roleID JOIN
            department ON department.deptID = role.deptID WHERE employee.managerID = ${response.manager} ORDER BY employee.employeeID ASC;`, (err, res) => {
                if(err) throw(err);
                console.table('\n', res, '\n');
                runApp();
            });
        });
    });
};

function viewAllRoles() {
    console.log("Viewing Roles")
    connection.query(`SELECT * FROM role ORDER BY roleID ASC;`, (err, res) => {
        if(err) throw(err);
        console.table('\n', res, '\n')
        res.forEach((role) => {
            console.log(
            `ID: ${role.id} | Title: ${role.title}\n Salary: ${role.salary}\n`);
    });
    console.log("Running Role View");
    runApp();
    });
};

function viewAllDepartments() {
    console.log("Viewing Departments")
    connection.query(`SELECT * FROM department ORDER BY deptID ASC;`, (err, res) => {
        if(err) throw(err);
        console.table('\n', res, '\n');
        res.forEach((department) => {
            console.log(`ID: ${department.deptID} | ${department.dept_name} Department`);
        });
        console.log("Running Dept View");
        runApp();
    });
};

function viewDepartmentBudget() {
    console.log("Viewing Department Budgets")
    var query = `SELECT department.dept_name, role.roleSalary, sum(role.roleSlary) AS budget FROM employee LEFT JOIN role ON employee.roleID = role.roleID
    LEFT JOIN department ON role.deptID = department.deptID group by department.dept_name;`
    connection.query(query, function (err, res) {
        if(err) throw(err);
        res.forEach((department) => {
            console.log(
                `Department: ${department.dept_name} \n Budget: ${department.budget} \n`,
            );
        });
        console.log("Running Budget View");
        runApp();
    });
}

function addEmployee() {
    console.log("Adding New Employee");
    let deptArray = [];
    connection.query(`SELECT deptID, dept_name * FROM department`, (err, res) => {
        if(err) throw(err);
        res.forEach((newDept) => {
            deptArray.push(`${newDept.deptID} ${newDept.dept_name}`);
            console.log("Added Employee to Dept");
        });
        let roleArray = [];
        connection.query(`SELECT roleID, roleTitle from role`, (err, res) => {
            if(err) throw(err);
            res.forEach((newRole) => {
                roleArray.push(`${newRole.roleID} ${newRole.roleTitle}`);
                console.log("Added Role to Employee");
            });
            let managerArray = [];
            connection.query(`SELECT employeeID, firstName, lastName from employee`, (err, res) => {
                if(err) throw(err);
                res.forEach((newManager) => {
                    managerArray.push(`${newManager.employeeID} ${newManager.firstName} ${newManager.lastName}`);
                    console.log("Added Employee to Manager");
                });
            });
            inquirer.prompt(prompts.addEmployeePrompt(deptArray, roleArray, managerArray)).then((response) => {
                let roleChosen = parseInt(response.role);
                let managerChosen = parseInt(response.manager);
                connection.query("INSERT INTO employee SET ?", {
                    firstName: response.firstName,
                    lastName: response.lastName,
                    roleID: roleChosen,
                    managerID: managerChosen,
                },
                (err, res) => {
                    if(err) throw(err);
                    console.log("\n" + res.affectedRows + "Your new employee has been added");
                    runApp();
                },
                );
            });
        });
    });
};

function addDepartment() {
    console.log("Adding New Department");
    inquirer.prompt(prompts.addDepartmentPrompt()).then(function (response) {
        connection.query("INSERT INTO department (dept_name) VALUES ( ? )", response.department, function (err, res) {
            if(err) throw(err);
            console.log(`Congratulations on opening the new department, ${response.department}.`);
        });
        runApp();
    });
};

function addRole() {
    console.log("Adding New Role");
    connection.query(`SELECT * FROM department;`, function (err, res) {
        if(err) throw(err);
        const deptChoices = res.map(department => ({name: department.dept_name, value: department.deptID}));
        inquirer.prompt(prompts.addRolePrompt(deptChoices)).then(function (response){
            connection.query(`INSERT INTO role SET ?`, {
                roleTitle: response.roleTitle,
                roleSalary: response.roleSalary,
                deptID: response.deptID,
            },
            function (err, res) {
                if(err) throw(err);
                console.log("\n" + res.affectedRows + "Your new role has been added");
                runApp();
            });
        });
    });
};

function updateRole() {
    console.log("Updating Employee's Role");
    let employees = [];
    connection.query(`SELECT employeeID, firstName, lastName * FROM employee;`, (err, res) => {
        if(err) throw(err);
        res.forEach((thisEmployee) => {
            employees.push(`${thisEmployee.employeeID} ${thisEmployee.firstName} ${thisEmployee.lastName}`);
        });
        let job = [];
        connection.query(`SELECT roleID, roleTitle FROM role`, (err, res) => {
            if(err) throw(err);
            res.forEach((updatedRole) => {
                job.push(`${updatedRole.roleID} ${updatedRole.roleTitle}`);
            });
            inquirer.prompt(prompts.updateRolePrompt(employees, job)).then((response) => {
                let idChosen = parseInt(response.update);
                let roleChosen = parseInt(response.role);
                connection.query(`UPDATE employee SET roleID = ${roleChosen} WHERE employeeID = ${idChosen}`, (err, res) => {
                    if(err) throw(err);
                    console.log("\n You have updated these employees' roles" + res.affectedRows);
                    runApp();
                });
            });
        });
    });
};

function updateManager() {
    console.log("Updating Employee's Manager");
    let employees = [];
    connection.query(`SELECT employeeID, firstName, lastName * FROM employee;`, (err, res) => {
        if(err) throw(err);
        res.forEach((thatEmployee) => {
            employees.push(`${thatEmployee.employeeID} ${thatEmployee.firstName} ${thatEmployee.lastName}`);
        });
        inquirer.prompt(prompts.updateManagerPrompt(employees)).then((response) => {
            let idChosen = parseInt(response.update);
            let managerChosen = parseInt(response.manager);
            connection.query(`UPDATE employee SET managerID = ${managerChosen} WHERE employeeID = ${idChosen}`, (err, res) => {
                if(err) throw(err);
                console.log("\n You have updated these employees' managers" + res.affectedRows);
                runApp();
            });
        });
    });
};

function deleteEmployee() {
    console.log("Removing Employee");
    connection.query(`SELECT employeeID, firstName, lastName FROM employee;`, function(err, res) {
        if(err) throw(err);
        const deleteEmployeeChoices = res.map(employee => ({name: employee.firstName + ' ' + employee.lastName, value: employee.employeeID}));
        inquirer.prompt(prompts.deleteEmployeePrompt(deleteEmployeeChoices)).then(function(response){
            connection.query(`DELETE FROM employee WHERE ?;`, {employeeID: response.employeeID}, function (err, res){
                if(err) throw(err);
                console.log("\n You have deleted these employees" + res.affectedRows);
                runApp();
            })},
        );
    });
};

function deleteRole() {
    console.log("Removing Role");
    connection.query(`SELECT roleID, roleTitle, roleSalary, deptID FROM role;`, function(err, res) {
        if(err) throw(err);
        const deleteRoleChoices = res.map(role => ({name: role.roleTitle, value: role.roleID}));
        inquirer.prompt(prompts.deleteRolePrompt(deleteRoleChoices)).then(function (response) {
            connection.query(`DELETE FROM role WHERE ?;`, [
                {
                    roleID: response.roleTitle,
                },
            ],
            (err, res) => {
                if(err) throw(err);
                console.log('\n You have removed these roles' + res.affectedRows);
            })},
        );
    });
};

function deleteDept() {
    console.log("Removing Department");
    connection.query(`SELECT * FROM department ORDER BY deptID ASC; (err, res);`, (err, res) => {
        if(err) throw(err);
        const deleteDeptChoices = res.map(department => ({name: dept.dept_name, value: dept.deptID}));
        inquirer.prompt(prompts.deleteDeptPrompt(deleteDeptChoices)).then(function (response) {
            connection.query(`DELETE FROM department WHERE ?;`, [
                {
                    deptID: response.dept_name,
                },
            ],
            (err, res) => {
                if(err) throw(err);
                console.log(`\n You have removed these departments` + res.affectedRows);
            })},
        );
    });
};
