/**
 * @type {TRouteDeclaration[]}
 */
module.exports = [
  {
    path: '/api/people',
    method: 'post',
    controller: 'app.http.controllers.PeopleController',
    action: 'listPeople',
  },
]
