module.exports = {
    titlePrompt: {
        type: "list",
        name: "title",
        message: "Please choose the action you'd like to take with your employee database.",
        choices: [
            "View all employees",
            "View employees by manager",
            "View employees by department",
            "View all employee roles",
            "View department budgets",
            "View all departments",
            "Add employee",
            "Add department",
            "Add role",
            "Update employee role",
            "Update employee manager",
            "Remove employee",
            "Remove department",
            "Remove role",
            "Quit database",
        ],
    },

    viewByManagerPrompt: (managerChoices) => [
        {
            type: "list",
            name: "managerName",
            message: "Choose an employee manager",
            choices: managerChoices,
        },
    ],
    viewByDeptPrompt: (deptChoices) => [
        {
            type: "list",
            name: "deptID",
            message: "Choose an employee department",
            choices: deptChoices,
        },
    ],
    viewDeptBudgetPrompt: (deptChoices) => [
        {
            type: "list",
            name: "deptID",
            message: "Choose a department to view its budget",
            choices: deptChoices,
        },
    ],

    addEmployeePrompt: (roleArray, deptArray, managerArray) => [
        {
            type: "input",
            name: "firstName",
            message: "To add an employee, please enter their first name:",
        },
        {
            type: "input",
            name: "lastName",
            message: "Now enter their last name:",
        },
        {
            type: "list",
            name: "role",
            message: "Choose the employee's position/role within the company:",
            choices: roleArray,
        },
        {
            type: "list",
            name: "department",
            message: "Please assign the employee to a department of your choice:",
            choices: deptArray,
        },
        {
            type: "list",
            name: "manager",
            message: "Choose a manager for this employee:",
            choices: managerArray,
        },
    ],
    addRolePrompt: (deptChoices) => [
        {
            type: "input",
            name: "roleTitle",
            message: "What will this new role be called?",
        },
        {
            type: "input",
            name: "roleSalary",
            message: "What will this role pay an employee?",
        },
        {
            type: "list",
            name: "deptID",
            message: "Which department will this role lie in?",
            choices: deptChoices,
        },
    ],
    addDepartmentPrompt: {
        type: "input",
        name: "department",
        message: "What will this new department be called?",
    },

    updateManagerPrompt: (employees) => [
        {
            type: "update",
            name: "updateManager",
            message: "Choose the employee whose manager is being updated:",
            choices: employees,
        },
        {
            type: "list",
            name: "manager",
            message: "Choose employee's new manager:",
            choices: employees,
        },
    ],
    updateRolePrompt: (employees, job) => [
        {
            type: "list",
            name: "changeRole",
            message: "Choose the employee whose role is going to be changed:",
            choices: employees,
        },
        {
            type: "list",
            name: "newRole",
            message: "Choose the employee's new job position:",
            choices: jobs,
        },
    ],

    deleteEmployeePrompt: (deleteEmployeeChoices) => [
        {
            type: "list",
            name: "employeeID",
            message: "Which employee would you like to remove from the database?",
            choices: deleteEmployeeChoices,
        },
    ],
    deleteRolePrompt: (deleteRoleChoices) => [
        {
            type: "list",
            name: "roleID",
            message: "Which role would you like to remove from the database?",
            choices: deleteRoleChoices,
        },
    ],
    deleteDeptPrompt: (deleteDeptChoices) => [
        {
            type: "list",
            name: "deptID",
            message: "Which department would you like to remove?",
            choices: deleteDeptChoices,
        },
    ]
};
