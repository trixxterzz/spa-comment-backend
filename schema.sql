CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    login VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    homepage VARCHAR(255) DEFAULT NULL
);

CREATE TABLE comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    parent_id INTEGER DEFAULT NULL,
    author_id INTEGER NOT NULL,
    createdAt TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP NOT NULL,
    CONSTRAINT fk_author_user
        FOREIGN KEY (author_id)
        REFERENCES users (id)
        ON DELETE CASCADE
);

CREATE TABLE file_applications (
    comment_id INTEGER NOT NULL,
    key VARCHAR NOT NULL,
    type VARCHAR NOT NULL,
    PRIMARY KEY (comment_id),
    CONSTRAINT fk_comment
        FOREIGN KEY (comment_id)
        REFERENCES comments (id)
        ON DELETE CASCADE
);

CREATE TABLE confirmation_tokens (
    user_id INTEGER NOT NULL,
    token VARCHAR NOT NULL,
    PRIMARY KEY (user_id),
    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE
);

CREATE TABLE comments_relations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    parent_id INTEGER NOT NULL,
    child_id INTEGER NOT NULL,
    CONSTRAINT fk_parent
        FOREIGN KEY (parent_id)
        REFERENCES comments (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_child
        FOREIGN KEY (child_id)
        REFERENCES comments (id)
        ON DELETE CASCADE
);