angular.module('todoApp', [])
    .controller('TodoListController', function() {
        var todoList = this;
        todoList.todos = [
            { text: 'learn AngularJS', done: true },
            { text: 'build an AngularJS app', done: false }
        ];

        todoList.addTodo = function() {
            todoList.todos.push({ text: todoList.todoText, done: false });
            todoList.todoText = '';
        };

        todoList.remaining = function() {
            var count = 0;
            angular.forEach(todoList.todos, function(todo) {
                count += todo.done ? 0 : 1;
            });
            return count;
        };

        todoList.archive = function() {
            var oldTodos = todoList.todos;
            todoList.todos = [];
            angular.forEach(oldTodos, function(todo) {
                if (!todo.done) todoList.todos.push(todo);
            });
        };
    })

.controller('CategoryController', function() {
    var todoList = this;

    $scope.category = [];
    $scope.getItems = function() {
        $http({ method: 'GET', url: 'https://api.superadmin.shop/api/category', headers: { 'X-Parse-Application-Id': 'XXXX', 'X-Parse-REST-API-Key': 'YYYY' } })
            .success(function(data, status) {
                $scope.category = data;
            })
            .error(function(data, status) {
                alert("Error");
            });
    };




});


function MyController($scope, $http) {


}