angular.module('TinyNewsApp.Directives').directive('nlImgUploader', ['$upload', '$compile', 'Alerts', function ($upload, $compile, Alerts) {
    return {
        restrict: 'EA',
        scope: {
            category: '@category',
            current_img: '@currentImg',
            callback: '=callback'
        },
        link: function (scope, element, attrs, ctrl) {
            var template = '<div class="modal fade" id="nl_image_uploader"> \
                    <div class="modal-dialog modal-sm"> \
                        <div class="modal-content"> \
                            <div class="modal-header"> \
                                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button> \
                                <h4 class="modal-title">Upload Image</h4> \
                            </div> \
                            <div class="modal-body" style="padding-bottom: 0;"> \
                                <div id="img-uploader"> \
                                    <img ng-src="{{ current_img }}" alt="No Image" class="img-rounded img-responsive" /> \
                                    <div id="img-uploader-file"> \
                                        <input type="file" ng-file-select="start_upload($files)" accept="image/*" /> \
                                    </div> \
                                </div> \
                            </div> \
                            <div class="modal-footer"> \
                                <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button> \
                                <button type="button" class="btn btn-primary" ng-disabled="!uploaded" ng-click="save_img()">Save</button> \
                            </div> \
                        </div> \
                     </div> \
                    </div>';

            element.parent().append($compile(template)(scope));

            element.bind('click', function() {
                $('#nl_image_uploader').modal('show');
            });
        },
        controller: function($scope, Alerts) {
            $scope.uploaded = false;

            // --
            // Methods
            // --

            $scope.start_upload = function($files) {

                // if file is not selected, show error alert
                if (!$files || $files.length <= 0) {
                    Alerts.Signal(Alerts.Type.ERROR, 'File is not selected.');
                    return;
                }

                // start uploading
                var file = $files[0];

                $upload.upload({
                    url: NL_WEB_HOST + 'imguploader',
                    file: file,
                    headers: { category: $scope.category }
                })
                    .success(function(data, status, headers, config) {
                        $scope.current_img = data.imgUrl;
                        $scope.uploaded = true;
                    })
                    .error(function(data, status, headers, config){
                        Alerts.Signal(Alerts.Type.ERROR, 'Problem while uploading image.');
                    });
            }

            $scope.save_img = function() {
                if (!$scope.uploaded) {
                    return;
                }

                $('#nl_image_uploader').modal('hide');

                console.log('Image Upload complete...', typeof $scope.callback);

                if ($scope.callback && typeof $scope.callback == 'function') {
                    $scope.callback($scope.current_img);
                }
            }


            $scope.current_img = '/images/default_journalist.png';
        }
    }
}]);
