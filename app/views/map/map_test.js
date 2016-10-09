'use strict';

describe('myApp.map module', function() {

    beforeEach(module('myApp.map'));

    var $controller;

    beforeEach(inject(function(_$controller_){
        $controller = _$controller_;
    }));

    describe('MapCtrl controller', function() {
        var $scope, controller;
        var lines, points;

        beforeEach(function(){
            lines = {
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
            };
            points = [ lines ];

            $scope = {
                points: points
            };
            controller = $controller('MapCtrl', { $scope: $scope });
        });

        it('points[0] should contain lines object', function(){
            expect($scope.points[0]).toEqual(lines);
        });

        describe('addNewPoint()', function(){
            beforeEach(function(){
                $scope.mapObj.yaMap = {
                    getCenter: function() {
                        return [34.08,44.96];
                    }
                }
                $scope.newPoint = 'One';
            })
            it('should add a new point', function(){
                $scope.addNewPoint();
                expect($scope.points[1]).toEqual({
                    name: 'One',
                    isPoint: true,
                    geometry: {
                        type: 'Point',
                        coordinates: [34.08,44.96]
                    },
                    properties: {
                        balloonContent: 'One'
                    },
                    options: {
                        draggable: true
                    }
                });
            });
            it('should not add a point with empty name', function(){
                $scope.newPoint = '';
                $scope.addNewPoint();
                // points.length should be 1 not 0, because
                // points[0] contains lines, not points
                expect($scope.points.length).toEqual(1);
            });
            it('should add coordinates to lines coordinates', function(){
                $scope.addNewPoint();
                expect($scope.points[0].geometry.coordinates).toEqual([
                    [34.08,44.96]
                ]);
            });
            it('should empty newPoint', function(){
                $scope.addNewPoint();
                expect($scope.newPoint).toEqual('');
            });
        });

        describe('updateLinesCoords()', function(){
            it('should not add lines themselves to lines coordinates', function(){
                $scope.updateLinesCoords();
                expect($scope.points[0].geometry.coordinates).toEqual([]);
            });

            it('should add a point to lines coordinates', function(){
                $scope.points.push(
                    { isPoint: true, geometry: { coordinates: [1,2] }}
                );
                $scope.updateLinesCoords();
                expect($scope.points[0].geometry.coordinates).toEqual(
                    [[1,2]]
                );
            });

            it('should add several points to lines coordinates', function(){
                $scope.points.push(
                    { isPoint: true, geometry: { coordinates: [1,2] }},
                    { isPoint: true, geometry: { coordinates: [3,4] }},
                    { isPoint: true, geometry: { coordinates: [5,6] }}
                );
                $scope.updateLinesCoords();
                expect($scope.points[0].geometry.coordinates).toEqual(
                    [[1,2], [3,4], [5,6]]
                );
            });
        });

        describe('afterMapInit()', function(){
            it('$scope.mapObj.yaMap should be not null', function(){
                $scope.afterMapInit({});
                expect($scope.mapObj.yaMap).toEqual({});
            })
        });

        describe('delPoint()', function(){
            it('should delete a point at specified index', function(){
                $scope.points.push(
                    { name: 'One', isPoint: true, geometry: { coordinates: [1,2] }}
                );
                $scope.delPoint(1);
                expect($scope.points).toEqual([
                    lines
                ]);
            });
            it('should update lines coordinates', function(){
                $scope.points.push(
                    { name: 'One', isPoint: true, geometry: { coordinates: [1,2] }},
                    { name: 'Two', isPoint: true, geometry: { coordinates: [3,4] }},
                    { name: 'Three', isPoint: true, geometry: { coordinates: [5,6] }}
                );
                $scope.points.forEach(function(x){
                    if (x.isPoint)
                        $scope.points[0].geometry.coordinates.push(
                            x.geometry.coordinates
                        );
                });
                var tmpLines = angular.copy($scope.points[0]);
                tmpLines.geometry.coordinates.splice(1, 1);
                $scope.delPoint(2);
                expect($scope.points).toEqual([
                    tmpLines,
                    { name: 'One', isPoint: true, geometry: { coordinates: [1,2] }},
                    { name: 'Three', isPoint: true, geometry: { coordinates: [5,6] }}
                ]);
            });
        });

        describe('onDragEnd()', function(){
            var e, p;
            beforeEach(function(){
                e = {
                    originalEvent: {
                        target: {
                            geometry: {
                                _coordinates: [1,2]
                            }
                        }
                    }
                };
                p = {
                    name: 'One',
                    isPoint: true,
                    geometry: {
                        coordinates: [3,4]
                    }
                }
                $scope.points.push(p);
            });
            it("should update point's geometry", function(){
                $scope.onDragEnd(e, p);
                expect($scope.points[1].geometry.coordinates).toEqual([1,2]);
            });
            if('should update lines coordinates', function(){
                $scope.onDragEnd(e, p);
                expect($scope.points[0].geometry.coordinates).toEqual([[1,2]]);
            });
        });
    });
});
