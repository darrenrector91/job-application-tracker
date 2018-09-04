CREATE TABLE job (
    id SERIAL PRIMARY KEY NOT NULL,
    company VARCHAR(100) NULL,
    contact VARCHAR(100) NULL,
    email VARCHAR NULL,
	position VARCHAR(100) NULL,
    notes VARCHAR(255) NULL,
    date DATE NOT NULL,
    status VARCHAR(200) NULL,
    filename VARCHAR(255) NULL
);
