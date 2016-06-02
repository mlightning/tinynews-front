angular.module('TinyNewsApp.Controllers')
    .controller('CreateGroupController', ['$scope', '$rootScope', 'Alerts', 'Groups',
        function CreateGroupController($scope, $rootScope, Alerts, Groups) {

            $scope.data = {
                name: '',
                description: '',
                standards: '',
                imageUrl: '/images/profile_default_group.png',
                url: 'http://www.tinynews.com',
                contact_email: '',
                contact_url: '',
                contact_twitter: '',
                contact_fb: '',
                type: 2,
                status: 0
            };

            /**
             * Update Profile Image
             */
            $scope.save_profile_image = function(img) {
                $scope.data.imageUrl = img;
            }

            /**
             * Submit group details
             */
            $scope.submit = function() {
                var groupData = angular.copy($scope.data);

                if (groupData.contact_twitter && groupData.contact_twitter.toLowerCase().indexOf('twitter.com') < 0) {
                    groupData.contact_twitter = 'https://www.twitter.com/' + groupData.contact_twitter;
                }
                if (groupData.contact_fb && groupData.contact_fb.toLowerCase().indexOf('facebook.com') < 0) {
                    groupData.contact_fb = 'https://www.facebook.com/' + groupData.contact_fb;
                }

                if (groupData.contact_url == '') delete groupData.contact_url;
                if (groupData.contact_twitter == '') delete groupData.contact_twitter;
                if (groupData.contact_fb == '') delete groupData.contact_fb;

                Groups.Create(groupData).then(
                    function(data) {
                        window.location.replace('/group/' + data.slug);
                        Alerts.Signal(Alerts.Type.SUCCESS, 'Group is created successfully.');
                    },
                    function(data, status, headers, config) {
                        Alerts.Signal(Alerts.Type.ERROR, 'There was a problem creating a group.');
                    }
                );
            };

        }]);