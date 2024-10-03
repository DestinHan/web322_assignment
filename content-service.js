const fs = require('fs');

let articles = [];
let categories = [];

// Initialize by loading articles and categories from JSON files
function initialize() {
  return new Promise((resolve, reject) => {
    fs.readFile('./data/articles.json', 'utf8', (err, data) => {
      if (err) {
        reject("Unable to load articles.json");
        return;
      }
      articles = JSON.parse(data);

      fs.readFile('./data/categories.json', 'utf8', (err, data) => {
        if (err) {
          reject("Unable to load categories.json");
          return;
        }
        categories = JSON.parse(data);
        resolve();
      });
    });
  });
}

// Get only published articles
function getPublishedArticles() {
  return articles.filter(article => article.published);
}

// Get all categories
function getCategories() {
  return categories;
}

// Export functions
module.exports = {
  initialize,
  getPublishedArticles,
  getCategories,
  getAllArticles: () => articles // Inline function for all articles
};
