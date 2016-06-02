angular.module('TinyNewsApp.Directives').directive('nlComments', function ($rootScope) {
    return {
        restrict: 'E',
        scope: { target: '=target', type: '@type', count: '=count' },
        templateUrl: '/public/js/views/comments.html',
        link: function (scope, element, attrs, ctrl) {

        },
        controller: function($scope, $document, ActiveUser, Comments, Alerts, RID) {

            $scope.editing = { comment: '' };
            $scope.comments = [];
            $scope.count = 0;
            $scope.reply_target = false;

            $scope.registered = false;

            console.log('Type Check:', $scope.type, Comments.Types[$scope.type]);

            // --
            // Methods
            // --

            $scope.reply = function(comment) {
                $scope.reply_target = comment;
                $('#comment-input').focus();
            }

            $scope.do_submit = function() {
                console.log($scope.editing.comment);

                var props = {
                    body: $scope.editing.comment,
                    owner_id: $scope.target['@rid'],
                    type: $scope.type
                }

                if ($scope.reply_target) {
                    props.parent_id = $scope.reply_target['@rid'];
                }

                console.log('PROPS', props);

                Comments.Create(props, $scope.type).then(
                    function(res) {
                        res.unique = RID.Encode(res['@rid']).replace('.', '_');

                        // Put into list
                        res.user = $scope.user;
                        res.user.rid = $scope.user['@rid'];

                        if (res.parent_id) {
                            if (!$scope.comments[res.parent_id]) {
                                $scope.comments[res.parent_id] = [];
                            }
                            $scope.comments[res.parent_id].push(res);
                        } else {
                            if (!$scope.comments['top']) {
                                $scope.comments['top'] = [];
                            }
                            $scope.comments['top'].push(res);
                        }

                        $scope.editing.comment = '';
                        $scope.reply_target = false;

                        $scope.count = 0;
                        for (var i in $scope.comments) {
                            $scope.count += $scope.comments[i].length;
                        }

                        console.log('Count:', $scope.count);

                        // Move focus to new comment
                        setTimeout(function() {
                            var someElement = angular.element(document.getElementById('comment_' + res.unique.replace('.', '_')));
                            $document.scrollToElement(someElement);
                        }, 500);
                    },
                    function(data, status, headers, config) {
                        console.log(data, status, headers, config);
                        Alerts.Signal(Alerts.Type.ERROR, 'There was a problem a problem posting your comment.  Please try again shortly.');
                    }
                );


                return false;
            }

            $scope.vote = function(val, comment) {
                Comments.Vote(comment['@rid'], val).then(
                    function(comment) {
                        console.log(comment);
                    },
                    function(data, status, headers, config) {
                        console.log(data, status, headers, config);
                        Alerts.Signal(Alerts.Type.ERROR, 'There was a problem placing your vote.');
                    }
                )
            }

            // --
            // Init
            // --

            if (ActiveUser.IsRegistered()) {
                $scope.user = ActiveUser.Get('user');
            } else {
                $scope.user = false;
            }

            Comments.List($scope.target['@rid'], $scope.type).then(
                function(comments) {
                    $scope.comments = comments;
                    $scope.count = 0;
                    for (var i in $scope.comments) {
                        $scope.count += $scope.comments[i].length;
                    }
                    console.log('Count:', $scope.count);
                },
                function(data, status, headers, config) {
                    console.log(data, status, headers, config);
                    Alerts.Signal(Alerts.Type.ERROR, 'There was a problem loading the comment list.');
                }
            );

        }
    }
});
