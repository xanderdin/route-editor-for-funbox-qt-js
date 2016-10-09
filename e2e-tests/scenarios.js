'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('myApp', function() {


  it('should automatically redirect to / when location hash/fragment is empty', function() {
    browser.get('index.html');
    expect(browser.getLocationAbsUrl()).toMatch("/map");
  });


  describe('map', function(){
     beforeEach(function(){
         browser.get('index.html#!/map');
     });

     // TODO: write tests
  });
});
