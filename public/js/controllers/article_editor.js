angular.module('TinyNewsApp.Controllers').controller('ArticleEditorController', function ArticleEditorController($scope, $rootScope, $sce, Preload, Storage, Alerts, Articles) {

    $scope.wip = {};                // Active Changes
    $scope.original = {};           // Pristine Original
    $scope.is_modified = false;     // Changes exist between wip & original
    $scope.processing = false;

    $scope.paste_options = [
        { text: "Immediate Fact", value: 'facts.immediate' },
        { text: "Contextual Fact", value: 'facts.contextual' },
        { text: "Immediate Statement", value: 'statements.immediate' },
        { text: "Contextual Statement", value: 'statements.contextual' }
    ];
    $scope.selected_paste_type = $scope.paste_options[0];

    $scope.highlighters = {
        'fact.immediate': 'yellow',
        'fact.contextual': '#FFA42E',
        'statement.immediate': '#77C6E6',
        'statement.contextual': '#AE77E6'
    };

    // --
    // Functions
    // --

    $scope.update_body = function() {
        $scope.is_modified = true;
    };

    /**
     * Remove an item from the meta data
     *
     * @param Obj       item    Item to remove
     * @param String    type    Item type [fact, statement]
     */
    $scope.remove = function(item, type) {
        $scope.wip[type][item.type].forEach(function(haystack, i) {
            if (haystack['@rid'] == item['@rid']) {
                $scope.wip[type][item.type].splice(i, 1);
                return;
            }
        });

        $scope.refresh_highlights();
        $scope.is_modified = true;
    }

    /**
     * Add an item to the meta data
     *
     * @param Obj       item    Item to remove
     * @param String    type    Item type [fact, statement]
     * @param String    value   Data content to add
     */
    $scope.add = function() {
        var types = $scope.selected_paste_type.value.split('.');

        var new_item = {
            '@rid': new Date().getTime() + '_' + new Date().getTime(),
            is_new: true,
            type: types[1]
        }

        //new_item.quote = $scope.wip.note.quote;
        new_item.note = $scope.wip.note.note;

        //$scope.wip.note.quote = '';
        $scope.wip.note.note = '';

        $scope.wip[types[0]][new_item.type].push(new_item);
        $scope.refresh_highlights();
        $scope.is_modified = true;
    }

    /**
     * Save the changes to the Article
     */
    $scope.save = function() {
        $('#processing_modal').modal({
            backdrop: 'static',
            keyboard: false,
            show: true
        });

        var errors = [];
        Articles.Save($scope.wip).then(
            function(article) {
                Storage.Purge(Storage.Type.LOCAL, 'wip_article_edit_' + $scope.wip['@rid']);
                $scope.refresh_highlights();
                $scope.is_modified = false;
                Alerts.Signal(Alerts.Type.SUCCESS, 'Your revisions have been published.');

                $('#processing_modal').modal('hide');
            },
            function(data, status, headers, config) {
                console.log(data, status, headers, config);
                $('#processing_modal').modal('hide');
                errors.push('We encountered an error saving your revisions.  Please try again later.');
            }
        );
    }

    /**
     * Revert all changes back to original object
     */
    $scope.revert = function() {
        $scope.wip = angular.copy($scope.original);
        Storage.Purge(Storage.Type.LOCAL, 'wip_article_edit_' + $scope.wip['@rid']);
        $scope.refresh_highlights();
        $scope.is_modified = false;
    }

    /**
     * Refresh Highlighting
     */
    $scope.refresh_highlights = function() {
        if (!$scope.wip.highlighted_body) {
            $scope.wip.highlighted_body = angular.copy($scope.wip.body);
        }
        $scope.wip.highlighted_body = angular.copy($scope.wip.highlighted_body);
        for (var i in $scope.wip.facts) {
            $scope.wip.facts[i].forEach(function(item) {
                var regex = new RegExp(item.quote, 'g');
                $scope.wip.highlighted_body = $scope.wip.highlighted_body.replace(regex, '<span style="background-color: ' + $scope.highlighters['fact.' + item.type] + ';">' + item.quote + '</span>');
            });
        }
        for (var i in $scope.wip.statements) {
            $scope.wip.statements[i].forEach(function(item) {
                var regex = new RegExp(item.quote, 'g');
                $scope.wip.highlighted_body = $scope.wip.highlighted_body.replace(regex, '<span style="background-color: ' + $scope.highlighters['statement.' + item.type] + ';">' + item.quote + '</span>');
            });
        }
    }

    /**
     * AngularJS requires we approve the value as trusted, so we
     * wrap the highlighted version of the body in this getter.
     */
    $scope.highlighted_body = function() {
        return $sce.trustAsHtml($scope.wip.highlighted_body);
    }

    // --
    // Init
    // --

    // Initialize the data using preloaded data.
    $scope.wip = angular.copy(Preload.Get('article'));
    $scope.wip.note = { quote: '', text: '' };


    // Sort Facts
    $scope.wip.facts = { immediate: [], contextual: [] };
    Preload.Get('article').facts.forEach(function(item) {
        $scope.wip.facts[item.type].push(item);
    });

    // Sort Statements
    $scope.wip.statements = { immediate: [], contextual: [] };
    Preload.Get('article').statements.forEach(function(item) {
        $scope.wip.statements[item.type].push(item);
    });

    // Copy the original data for comparison
    $scope.original = angular.copy($scope.wip);

    // Check for any WIP saved to localStorage, if it exists, load it.
    var wip = Storage.Get(Storage.Type.LOCAL, 'wip_article_edit_' + $scope.wip['@rid']);
    if (wip) {
        $scope.wip = wip;
        $scope.is_modified = true;
        Alerts.Signal(Alerts.Type.INFO, 'We\'ve restored in-progress changes from the last time you visited this page. Use the "Revert" button if you wish to discard these changes.');
    }

    $scope.$watch('wip.publisher', function(new_val, old_val) {
        if (new_val && new_val['@rid'] && new_val['@rid'] != $scope.original.publisher['@rid']) {
            console.log('is_modififed: wip.publisher');
            $scope.is_modified = true;
        }
    });

    $scope.$watch('wip.journalist', function(new_val, old_val) {
        if (new_val && new_val['@rid'] && new_val['@rid'] != $scope.original.journalist['@rid']) {
            console.log('is_modififed: wip.journalist');
            $scope.is_modified = true;
        }
    });

    $scope.refresh_highlights();

    // Periodically save the current data (WIP), so we can restore it
    // in the event of accident.
    setInterval(function() {
        if ($scope.is_modified) {
            Storage.Set(Storage.Type.LOCAL, 'wip_article_edit_' + $scope.wip['@rid'], $scope.wip);
        }
    }, 1000);

});