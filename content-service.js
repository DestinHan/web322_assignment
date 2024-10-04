// Student Name:  Seung Hoon Han
// Student Number:  108302233
// Student Email:  shhan11@myseneca.ca
// Date Created:  2024/10/03
// Last Modified: 2024/10/04

const fs = require('fs');   // Import file system module to read .json files.

let articles = [];      // Array to store the articles.
let categories = [];    // array to store categories.

function initialize() {     // Function to initialize content service by reading .json files.
    return new Promise((resolve, reject) => {

        fs.readFile('./data/articles.json', 'utf8', (err, data) => {    // Read aricles.json file.
            if (err) {

                reject("Unable to read articles file");
                return;

            }
            articles = JSON.parse(data);

            fs.readFile('./data/categories.json', 'utf8', (err, data) => {  // Read categories.json file.
                if (err) {

                    reject("Unable to read categories file");
                    return;

                }
                categories = JSON.parse(data);

                resolve();  // If both files are succesfully read, resolve.
            });
        });
    });
}

function getPublishedArticles() {   // Function to get only published articles.
    return new Promise((resolve, reject) => {

        const publishedArticles = articles.filter(article => article.published);

        if (publishedArticles.length > 0) {

            resolve(publishedArticles);

        } else {

            reject("No published articles found");

        }
    });
}

function getCategories() {  // Function to get categories.
    return new Promise((resolve, reject) => {

        if (categories.length > 0) {

            resolve(categories);

        } else {

            reject("No categories found");

        }
    });
}

module.exports = {  // Exporting the functions which used in other files.

    initialize,
    getPublishedArticles,
    getCategories 

};
