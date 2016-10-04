describe('publisher', function() {
	
	var config = require('../settings');
	
	beforeEach(function() {
		var ptor = protractor.getInstance();
		ptor.get('/publishers');
	});
	
	var publisherConfig = config.getPublisherConfig();
	
	it('should render initial data set', function() {
		var ptor = protractor.getInstance();

		var pages = ptor.element.all(by.repeater('i in pages'));
		expectedPages = Math.ceil(publisherConfig.num_of_data/publisherConfig.page_size);
		expect(pages.count()).toBe(expectedPages);
		
		pages.get(0).then(function(row) {
			row.findElement(by.tagName('a')).getAttribute('class').then(function (value) {
				expect(value).toBe('typcn typcn-media-record');
			});
		});
		
		pages.get(1).then(function(row) {
			row.findElement(by.tagName('a')).getAttribute('class').then(function (value) {
				expect(value).toBe('typcn typcn-media-record-outline');
			});
		});
	});

	
	it('should update repeater when filter predicate changes', function() {
		var ptor = protractor.getInstance();
		
		var publishers = ptor.element.all(by.repeater('publisher in filtered'));
		 expect(publishers.count()).toBe(8);
		 element(by.model('query_input')).sendKeys('FRA');
		 expect(publishers.count()).toBe(1);
	});
	

	it('should change view to grid style', function() {
		var ptor = protractor.getInstance();
		
		gridViewButton = ptor.findElement(protractor.By.name('to_grid_view'));
		gridViewButton.click();
	
		ptor.findElement(protractor.By.tagName('nl-list-publishers')).findElement(protractor.By.tagName('div')).getAttribute('id').then(function (value) {
			expect(value).toBe('grid_view_publishers');
		});
	});
	
	it('should change view to list style', function() {
		var ptor = protractor.getInstance();
		
		listViewButton = ptor.findElement(protractor.By.name('to_list_view'));
		listViewButton.click();
		
		ptor.findElement(protractor.By.tagName('nl-list-publishers')).findElement(protractor.By.tagName('div')).getAttribute('id').then(function (value) {
			expect(value).toBe('list_view_publishers');
		});
	});
	
	it('should paginate and should remain on same page when viwe is changed to list style', function() {
		var ptor = protractor.getInstance();
		
		nextButton = ptor.findElement(protractor.By.name('next_page'));
		nextButton.click();
		
		var pages = ptor.element.all(by.repeater('i in pages'));
		
		pages.get(1).then(function(row) {
			row.findElement(by.tagName('a')).getAttribute('class').then(function (value) {
				expect(value).toBe('typcn typcn-media-record');
			});
		});
		
		pages.get(0).then(function(row) {
			row.findElement(by.tagName('a')).getAttribute('class').then(function (value) {
				expect(value).toBe('typcn typcn-media-record-outline');
			});
		});
		
		
		listViewButton = ptor.findElement(protractor.By.name('to_list_view'));
		listViewButton.click();
		
		pages.get(1).then(function(row) {
			row.findElement(by.tagName('a')).getAttribute('class').then(function (value) {
				expect(value).toBe('typcn typcn-media-record');
			});
		});
		
		pages.get(0).then(function(row) {
			row.findElement(by.tagName('a')).getAttribute('class').then(function (value) {
				expect(value).toBe('typcn typcn-media-record-outline');
			});
		});
	});
	 

});