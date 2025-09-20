-- create table teams(
--     id int auto_increment primary key,
--     team_id int,
--     emp_id int,
--     FOREIGN KEY (emp_id) REFERENCES employees(employee_id)
-- )

-- SELECT t.team_id, e.last_name, e.job as role
-- FROM employees e
-- JOIN teams t ON t.emp_id = e.employee_id

alter table projects add column manufacturing_end_date date;
