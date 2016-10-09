'use strict';

angular.module('myApp.map', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/map', {
    templateUrl: 'views/map/map.html',
    controller: 'MapCtrl'
  });
}])

.controller('MapCtrl', ['$scope', function($scope) {

    $scope.mapObj = {
        controls: 'zoomControl',
        center: [34.081561,44.961853],
        zoom: 15,
        yaMap: null
    }

    // Array for storing all map points. However, the first element
    // of the array is for storing lines coordinates. This first element
    // should never be deleted.
    $scope.points = [
        {
            name: 'Lines Coordinates',
            isPoint: false,
            geometry: {
                type: 'LineString',
                coordinates: []
            },
            options: {
                strokeColor: "#FF0000",
                strokeWidth: 6
            }
        }
    ];

    $scope.afterMapInit = afterMapInit;
    $scope.addNewPoint = addNewPoint;
    $scope.delPoint = delPoint;
    $scope.onDragEnd = onDragEnd;
    $scope.updateLinesCoords = updateLinesCoords;


    // callback function, called by yaMap provider after map initialization
    function afterMapInit(map) {
        $scope.mapObj.yaMap = map;
    }


    function addNewPoint() {
        if (!$scope.newPoint)
            return;
        var coords = $scope.mapObj.yaMap.getCenter();
        $scope.points.push(
            {
                name: $scope.newPoint,
                isPoint: true,
                geometry: {
                    type: 'Point',
                    coordinates: coords
                },
                properties: {
                    balloonContent: $scope.newPoint
                },
                options: {
                    draggable: true
                }
            }
        );
        $scope.points[0].geometry.coordinates.push(coords);
        $scope.newPoint = '';
    }


    function delPoint(index) {
        $scope.points.splice(index, 1);
        updateLinesCoords();
    }


    // Called when a point moved to another place in UI points list.
    // @e: event
    // @p: point
    function onDragEnd(e, p) {
        p.geometry.coordinates =
            e.originalEvent.target.geometry._coordinates;
        updateLinesCoords();
    }


    // Rebuild lines coordinates
    function updateLinesCoords() {
        $scope.points[0].geometry.coordinates = [];
        $scope.points.forEach(function(x) {
            if (!x.isPoint)
                return;
            $scope.points[0].geometry.coordinates.push(
                x.geometry.coordinates
            );
        });
    }
}]);