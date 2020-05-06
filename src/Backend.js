// Permet de générer un fake id unique
function uuid() {
  return Math.random().toString(16).slice(2)
}

/* On sauvegarde la position des catégories via un tableau qui contient
l'ordre de leurs id */
function saveCategoriesPosition(categories) {
  return new Promise(resolve => {
    //ajax goes here
    console.log('ajax call categories', categories.map(category => category.id));

    /* Quand la promesse est résolue on retourne un objet de succès */
    resolve({
      success: true,
      message: null
    });
  });
}

/* On sauvegarde la position des snippets */
function saveSnippetsPosition(snippets) {
  return new Promise(resolve => {
    //ajax goes here
    //console.log('ajax call snippets', snippets.map(snippet => [snippet.id, snippet.category_id, snippet.position]));
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

/* On sauvegarde le snippet mis à jour */
function saveSnippet(snippetToSave) {
  return new Promise(resolve => {
    //ajax goes here
    console.log('ajax call save snippet', { id: snippetToSave.id, title: snippetToSave.title, contents: snippetToSave.contents });

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
      /* On retourne un objet category avec un id généré par
      le serveur */
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

function getEmptySnippet() {
  return new Promise(resolve => {
    //ajax goes here
    console.log('ajax call get empty snippet');

    resolve({
      success: true,
      /* On retourne un objet snippet vide avec un id généré par
      le serveur */
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


function load() {
  /* On simule le retour d'un appel asynchrone qui renvoie une promesse
  La promesse est résolue quand la fonction de callback
  resolve passée en paramètre de la promesse est appelée avec sa valeur
  en argument ici l'objet réponse. Quand la promesse est résolue
  .then() est appelé avec comme argument la valeur de resolve()
  ici l'objet reponse */
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

    /* La promesse est résolue à cette endroit quand resolve est appelée */
    resolve(response)
  })
}


export default {
  load,
  saveCategoriesPosition,
  saveSnippetsPosition,
  saveSnippet,
  addCategory,
  updateCategory,
  getEmptySnippet
}