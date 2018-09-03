-- execute these queries
CREATE TABLE job (
    id INT PRIMARY KEY NOT NULL,
    company VARCHAR(100) NOT NULL,
    contact VARCHAR(100) NULL,
    email VARCHAR NULL,
    notes VARCHAR(255) NULL,
    date DATE NOT NULL,
    job_status VARCHAR(200) NOT NULL
);

INSERT INTO job (id, company, contact, email, notes, date, job_status) VALUES (1, 'August Ash', 'n/a', 'n/a', 'filled out additional information and submitted resume', '8/31/2018', 'Applied');

-- select * from job;