function uuid() {
  return Math.random().toString(16).slice(2)
}


// Categories //

function saveCategoriesPosition(categories) {
  return new Promise(resolve => {
    //ajax goes here
    console.log('ajax call categories', categories.map(category => category.id));

    resolve({
      success: true,
      message: null
    });
  });
}

function addCategory(name) {
  return new Promise(resolve => {
    //ajax goes here
    console.log('ajax call add category', { name });

    resolve({
      success: true,
      message: { category: { id: uuid(), name } }
    });
  });
}

function updateCategory(category) {
  return new Promise(resolve => {
    //ajax goes here
    console.log('ajax call update category', category);

    resolve({
      success: true,
      message: null
    });
  });
}

function deleteCategory(categoryId) {
  return new Promise(resolve => {
    //ajax goes here
    console.log('ajax call delete category', categoryId);

    resolve({
      success: true,
      message: null
    });
  });
}


// Snippets //

function saveSnippetsPosition(snippets) {
  return new Promise(resolve => {
    //ajax goes here
    console.log('ajax call snippets', snippets.map(snippet => {
      return { id: snippet.id, category_id: snippet.category_id, position: snippet.position }
    }
    ));

    resolve({
      success: true,
      message: null
    });
  });
}

function saveSnippet(snippetToSave) {
  return new Promise(resolve => {
    setTimeout(function () {
      //ajax goes here
      console.log('ajax call save snippet', { id: snippetToSave.id, title: snippetToSave.title, contents: snippetToSave.contents });
      resolve({
        success: true,
        message: null
      });
    }, 3000);
  });
}

function getEmptySnippet() {
  return new Promise(resolve => {
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
              content: ""
            },
            {
              language_id: 2,
              content: ""
            },
            {
              language_id: 3,
              content: ""
            }
          ]
        }
      }
    });
  });
}

function deleteSnippet(snippetId) {
  return new Promise(resolve => {
    setTimeout(function () {
      //ajax goes here
      console.log('ajax call delete snippet', snippetId);
  
      resolve({
        success: true,
        message: null
      });
    }, 3000);
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
            name: 'Client fâchés',
          },
          {
            id: 2,
            name: 'Client content',
          },
          {
            id: 3,
            name: 'Client très content',
          },
        ],

        snippets: [
          {
            id: 1,
            title: 'A cause du bruit',
            category_id: 1,
            position: 1,
            contents: [
              {
                language_id: 1,
                content: "Lorem ipsum en francais"
              },
              {
                language_id: 2,
                content: "Lorem ipsum en anglais"
              },
              {
                language_id: 3,
                content: "Lorem ipsum en allemand"
              }
            ]
          },
          {
            id: 2,
            title: 'A cause du staff',
            category_id: 1,
            position: 2,
            contents: [
              {
                language_id: 1,
                content: "Toute notre équipe vous présente ses plus plates excuses"
              },
              {
                language_id: 2,
                content: "All the team is truly sorry and is being whipped right now"
              },
              {
                language_id: 3,
                content: "Lorem ipsum en allemand"
              }
            ]
          },
          {
            id: 3,
            title: 'Remercie le staff',
            category_id: 2,
            position: 1,
            contents: [
              {
                language_id: 1,
                content: "Merci mreci mreci"
              },
              {
                language_id: 2,
                content: "thanks thanks thanks"
              },
              {
                language_id: 3,
                content: "Lorem ipsum en allemand"
              }
            ]
          },
          {
            id: 4,
            title: 'Remercie le staff 2',
            category_id: 2,
            position: 2,
            contents: [
              {
                language_id: 1,
                content: "Merci mreci mreci"
              },
              {
                language_id: 2,
                content: "thanks thanks thanks"
              },
              {
                language_id: 3,
                content: "Lorem ipsum en allemand"
              }
            ]
          },
          {
            id: 5,
            title: 'Excellent',
            category_id: 3,
            position: 1,
            contents: [
              {
                language_id: 1,
                content: "Lorem ipsum en francais"
              },
              {
                language_id: 2,
                content: "Lorem ipsum en anglais"
              },
              {
                language_id: 3,
                content: "Lorem ipsum en allemand"
              }
            ]
          }
        ]
      }
    };

    resolve(response)
  })
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
}