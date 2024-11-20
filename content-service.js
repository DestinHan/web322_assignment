// Student Name:  Seung Hoon Han
// Student Number:  108302233
// Student Email:  shhan11@myseneca.ca
// Date Created:  2024/10/03
// Last Modified:  2024/11/13

const fs = require('fs'); // Import file system module to read .json files.

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
        try {
            articleData.published = articleData.published ? true : false;
            articleData.id = articles.length + 1; 
            articles.push(articleData);
            resolve(articleData);
        } catch (err) {
            reject("Error adding article");
        }
    });
}

function getAllArticles() {
    return new Promise((resolve, reject) => {
        if (articles.length > 0) {
            resolve(articles);
        } else {
            reject("No articles available");
        }
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
        const filteredArticles = articles.filter(article => article.category === category);
        if (filteredArticles.length > 0) {
            resolve(filteredArticles);
        } else {
            reject("No articles found for the given category");
        }
    });
}

function getArticlesByMinDate(minDateStr) {
    return new Promise((resolve, reject) => {
        const minDate = new Date(minDateStr);
        const filteredArticles = articles.filter(article => new Date(article.articleDate) >= minDate);
        if (filteredArticles.length > 0) {
            resolve(filteredArticles);
        } else {
            reject("No articles found after the given date");
        }
    });
}

function getArticleById(id) {
    return new Promise((resolve, reject) => {
        const foundArticle = articles.find(article => article.id === parseInt(id));
        if (foundArticle) {
            resolve(foundArticle);
        } else {
            reject("No article found with the given ID");
        }
    });
}

function getCategories() {
    return new Promise((resolve, reject) => {
        if (categories.length > 0) {
            resolve(categories);
        } else {
            reject("No categories found");
        }
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
