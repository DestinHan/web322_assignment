// Student Name:  Seung Hoon Han
// Student Number:  108302233
// Student Email:  shhan11@myseneca.ca
// Date Created:  2024/10/03
// Last Modified:  2024/11/13

const fs = require('fs'); // Import file system module to read .json files.
const { Pool } = require('pg');

// PostgreSQL Connection Setup
const pool = new Pool({
    user: 'neondb_owner',         
    host: 'ep-round-base-a5dqihfg',        
    database: 'blog_database',      
    password: 'fZkRXBTHY50g', 
    port: 5432,                    
    ssl: { rejectUnauthorized: false }
});

let articles = [];      // Array to store the articles.
let categories = [];    // Array to store categories.

function initialize() {
    return new Promise((resolve, reject) => {
        fs.readFile('./data/articles.json', 'utf8', (err, data) => {
            if (err) {
                reject("Unable to read articles file");
                return;
            }
            articles = JSON.parse(data);

            fs.readFile('./data/categories.json', 'utf8', (err, data) => {
                if (err) {
                    reject("Unable to read categories file");
                    return;
                }
                categories = JSON.parse(data);
                resolve();
            });
        });
    });
}

function addArticle(articleData) {
    return new Promise((resolve, reject) => {
        const { title, content, published, category } = articleData; 
        pool.query(
            'INSERT INTO articles (title, content, published, category) VALUES ($1, $2, $3, $4) RETURNING *', 
            [title, content, published, category]
        )
        .then(res => resolve(res.rows[0])) 
        .catch(err => reject("Error occured"));
    });
}


function getAllArticles() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM articles') 
            .then(res => resolve(res.rows)) 
            .catch(err => reject("No articles available")); 
    });
}


function getPublishedArticles() {
    return new Promise((resolve, reject) => {
        const publishedArticles = articles.filter(article => article.published);
        if (publishedArticles.length > 0) {
            resolve(publishedArticles);
        } else {
            reject("No published articles found");
        }
    });
}

function getArticlesByCategory(category) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM articles WHERE category = $1', [category]) 
            .then(res => {
                if (res.rows.length > 0) {
                    resolve(res.rows); 
                } else {
                    reject("No articles found");
                }
            })
            .catch(err => reject("Error occured")); 
    });
}


function getArticlesByMinDate(minDateStr) {
    return new Promise((resolve, reject) => {
        pool.query(
            'SELECT * FROM articles WHERE created_at >= $1',
            [minDateStr] 
        )
        .then(res => {
            if (res.rows.length > 0) {
                resolve(res.rows);
            } else {
                reject("No articles found");
            }
        })
        .catch(err => reject("Error occured"));
    });
}


function getArticleById(id) {
    return new Promise((resolve, reject) => {
        pool.query(
            'SELECT * FROM articles WHERE id = $1',
            [id]
        )
        .then(res => {
            if (res.rows.length > 0) {
                resolve(res.rows[0]); 
            } else {
                reject("No article found");
            }
        })
        .catch(err => reject("Error occured"));
    });
}


function getCategories() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM categories') 
            .then(res => resolve(res.rows)) 
            .catch(err => reject("No categories found")); 
    });
}


function getCategoryNameById(categoryId) {
    const category = categories.find(cat => cat.id.toString() === categoryId.toString());
    return category ? category.name : 'Unknown';
}




module.exports = {
    initialize,
    addArticle,
    getAllArticles,
    getPublishedArticles,
    getArticlesByCategory,
    getArticlesByMinDate,
    getArticleById,
    getCategories,
    getCategoryNameById
};
