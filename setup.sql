CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    published BOOLEAN NOT NULL,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO categories (name) VALUES
('AI'),
('Programming');

INSERT INTO articles (title, content, published, category) VALUES
('Learn AI-Assisted Python Programming', 'AI helps students skip...', true, 'AI'),
('Why elementary and high school students should learn computer programming', 'Meeting the growing needs...', true, 'Programming');


SELECT * FROM categories;
SELECT * FROM articles;
