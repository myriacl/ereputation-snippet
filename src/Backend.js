function saveCategoriesPosition(categories) {

    return new Promise(resolve => {

        //ajax goes here
        console.log('ajax call ', categories.map(category => category.id));

        resolve({
            success: true,
            message: null
        });
    });

}


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
                ],

                snippets: [
                    {
                        id: 1,
                        title: 'A cause du bruit',
                        category_id: 1,
                        content: [
                            {
                                language_id: 1,
                                content: "Lorem ipsum en francais"
                            },
                            {
                                language_id: 2,
                                content: "Lorem ipsum en anglais"
                            }
                        ]
                    },
                    {
                        id: 2,
                        title: 'A cause du staff',
                        category_id: 1,
                        position: 1,
                        content: [
                            {
                                language_id: 1,
                                content: "Toute notre équipe vous présente ses plus plates excuses"
                            },
                            {
                                language_id: 2,
                                content: "All the team is truly sorry and is being whipped right now"
                            }
                        ]
                    },
                    {
                        id: 3,
                        title: 'Remercie le staff',
                        category_id: 2,
                        position: 1,
                        content: [
                            {
                                language_id: 1,
                                content: "Merci mreci mreci"
                            },
                            {
                                language_id: 2,
                                content: "thanks thanks thanks"
                            }
                        ]
                    },
                ]
            }
        };


        resolve(response)


    })


}

//
// function savePosition() {
//
// }
//

export default {
    load,
    saveCategoriesPosition
}