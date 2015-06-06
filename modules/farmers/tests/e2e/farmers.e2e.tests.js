'use strict';

describe('Farmers E2E Tests:', function() {
	describe('Test farmers page', function() {
		it('Should report missing credentials', function() {
			browser.get('http://localhost:3000/#!/farmers');
			expect(element.all(by.repeater('farmer in farmers')).count()).toEqual(0);
		});
	});
});
