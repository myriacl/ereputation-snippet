function uuid() {
  return Math.random()
    .toString(16)
    .slice(2);
}

// Categories //

function saveCategoriesPosition(categories) {
  return new Promise(resolve => {
    //ajax goes here
    console.log(
      'ajax call categories',
      categories.map(category => category.id)
    );

    resolve({
      success: true,
      message: null
    });
  });
}

function addCategory(name) {
  return new Promise(resolve => {
    setTimeout(function() {
      //ajax goes here
      console.log('ajax call add category', { name });

      resolve({
        success: true,
        message: { category: { id: uuid(), name } }
      });
    }, 1000);
  });
}

function updateCategory(category) {
  return new Promise(resolve => {
    setTimeout(function() {
      //ajax goes here
      console.log('ajax call update category', category);

      resolve({
        success: true,
        message: null
      });
    }, 1000);
  });
}

function deleteCategory(categoryId) {
  return new Promise(resolve => {
    setTimeout(function() {
      //ajax goes here
      console.log('ajax call delete category', categoryId);

      resolve({
        success: true,
        message: null
      });
    }, 1000);
  });
}

// Snippets //

function saveSnippetsPosition(snippets) {
  return new Promise(resolve => {
    //ajax goes here
    console.log(
      'ajax call snippets',
      snippets.map(snippet => {
        return {
          id: snippet.id,
          category_id: snippet.category_id,
          position: snippet.position
        };
      })
    );

    resolve({
      success: true,
      message: null
    });
  });
}

function saveSnippet(snippetToSave) {
  return new Promise(resolve => {
    setTimeout(function() {
      //ajax goes here
      console.log('ajax call save snippet', {
        id: snippetToSave.id,
        title: snippetToSave.title,
        contents: snippetToSave.contents
      });
      resolve({
        success: true,
        message: null
      });
    }, 1000);
  });
}

function getEmptySnippet() {
  return new Promise(resolve => {
    setTimeout(function() {
      //ajax goes here
      console.log('ajax call get empty snippet');

      resolve({
        success: true,
        message: {
          snippet: {
            id: uuid(),
            title: '',
            category_id: 0,
            position: 1000,
            contents: [
              {
                language_id: 1,
                content: ''
              },
              {
                language_id: 2,
                content: ''
              },
              {
                language_id: 3,
                content: ''
              }
            ]
          }
        }
      });
    }, 1000);
  });
}

function deleteSnippet(snippetId) {
  return new Promise(resolve => {
    setTimeout(function() {
      //ajax goes here
      console.log('ajax call delete snippet', snippetId);

      resolve({
        success: true,
        message: null
      });
    }, 1000);
  });
}

// Datas //

function load() {
  return new Promise(resolve => {
    let response = {
      success: true,
      message: {
        languages: [
          {
            id: 1,
            name: 'Français'
          },
          {
            id: 2,
            name: 'Anglais'
          },
          {
            id: 3,
            name: 'Allemand'
          },
          {
            id: 4,
            name: 'Breton'
          }
        ],

        categories: [
          {
            id: 1,
            name: 'Catégorie 1'
          },
          {
            id: 2,
            name: 'Catégorie 2'
          },
          {
            id: 3,
            name: 'Catégorie 3'
          }
        ],

        snippets: [
          {
            id: 1,
            title: 'Snippet 1',
            category_id: 1,
            position: 1,
            contents: [
              {
                language_id: 1,
                content: 'Lorem ipsum en francais'
              },
              {
                language_id: 2,
                content: 'Lorem ipsum en anglais'
              },
              {
                language_id: 3,
                content: 'Lorem ipsum en allemand'
              }
            ]
          },
          {
            id: 2,
            title: 'Snippet 2',
            category_id: 1,
            position: 2,
            contents: [
              {
                language_id: 1,
                content: 'Lorem ipsum en francais'
              },
              {
                language_id: 2,
                content: 'Lorem ipsum en anglais'
              },
              {
                language_id: 3,
                content: 'Lorem ipsum en allemand'
              }
            ]
          },
          {
            id: 3,
            title: 'Snippet 3',
            category_id: 2,
            position: 1,
            contents: [
              {
                language_id: 1,
                content: 'Lorem ipsum en francais'
              },
              {
                language_id: 2,
                content: 'Lorem ipsum en anglais'
              },
              {
                language_id: 3,
                content: 'Lorem ipsum en allemand'
              }
            ]
          },
          {
            id: 4,
            title: 'Snippet 4',
            category_id: 2,
            position: 2,
            contents: [
              {
                language_id: 1,
                content: 'Lorem ipsum en francais'
              },
              {
                language_id: 2,
                content: 'Lorem ipsum en anglais'
              },
              {
                language_id: 3,
                content: 'Lorem ipsum en allemand'
              },
              {
                language_id: 4,
                content: 'Lorem ipsum en breton'
              }
            ]
          },
          {
            id: 5,
            title: 'Snippet 5',
            category_id: 3,
            position: 1,
            contents: [
              {
                language_id: 1,
                content: 'Lorem ipsum en francais'
              },
              {
                language_id: 2,
                content: 'Lorem ipsum en anglais'
              },
              {
                language_id: 3,
                content: 'Lorem ipsum en allemand'
              }
            ]
          }
        ]
      }
    };

    resolve(response);
  });
}

export default {
  load,
  saveCategoriesPosition,
  addCategory,
  updateCategory,
  deleteCategory,
  saveSnippetsPosition,
  saveSnippet,
  getEmptySnippet,
  deleteSnippet
};
