/*
   fields:[
*          {
*              type: string,          Valid types are the html5 types, plus the types:
 *                                    options, catalog, array(string), catalog_array,
 *                                    catalog_array and fileUploader.
 *             lock: string,          (Optional)  If true, the field would be locked to
 *                                    any modification, useful if you want to show some
 *                                    info, but don't allow modifications (Doesn't work in file)
*              model: string,         Name of the field that will be sent to the API
*              required: boolean,     (Optional) Specifies whether or not the field is required
*              hint: string,          (Optional) Hint label to show
*              label: string,         (Optional) Label to show in the form,
 *                                    if not given, the model string will be used as label
*              bindTo: string,        (Optional) It's used when the object returns
 *                                    the actual value of the field into a
*                                     different property.
*                                     Example:
*                                  
*                                     //When modifying is required as follows
*                                     object:{
*                                       property_id: id
*                                     }
*                                  
*                                     //When returned from the API is given as follows
*                                     object:
*                                     {
*                                       property:{}
*                                     }
*                                     In this case, the bindTo parameter should be
 *                                    'property', and the model of the field
*                                     should be 'property_id'
*              validations:
*                  {
*                      regex: string,          Option regular expression for field validation (just used when text),
*                      max: number,            Maximum value allowed for selection or maximum number of array elements
*                      min: number,            Minimum value allowed for selection or minimum number of array elements
*                      date_format: string,    String format to use for date formating (just used when date)
*                      errors:{
*                          required: string,       (Optional) Default is 'Required field'
*                          regex: string,          (Optional) Default is 'Invalid pattern {{regex}}'
*                          max: string,            (Optional) Default is 'Max value is {{max}}'
*                          min: string,            (Optional) Default is 'Min value is {{min}}'
*                          date_format: string     (Optional) Default is 'Required date format is {{date_format}}'
*                      }
*                  },
*              catalog:{                 As used by the catalog-select component
 *                  url: string,         Full or partial URL depending on the kind
 *                  kind: string,        (Optional) Mobile, Web, Generic. Default is 'Generic'
 *                  name: string,        (Optional) Default is "Catalog"
 *                  loadMoreButtonText, string (Optional) Test to show in the 'Load more' Button, default is 'Load more'
 *                  model: string,       From the catalog object, which element will be sent (aka: id, name, etc.)
 *                  option: string       (Optional) From the catalog object, which element will be shown in the list (ake: name, description, etc)
 *                                       If not given, then the model will be used
 *                               
 *                  pagination: {         (Optional) If present, the component asumes that the catalog API uses pagination
 *                  //Next parameter, just used when the url is going to be used from what the API returned.
 *                      next: string,         (Optional) Binding for the url that brings to the next page
 *                  //Total, limit and offset, used when the component is going to calculate and build the query,
 *                  //All of the following are required if no next parameter is given.
 *                      total: string,        (Optional) Binding for the number of total elements.
 *                      limit: string,        (Optional) Parameter used for the query building, not the number.
 *                      offset: string,       (Optional) Parameter used for the query building, not the number.
 *                      pageSize: number      (Optional) Used to determine how many results are going to be loaded per page.
 *                  },
 *                  required: boolean,    (Optional) To be used in form validation
 *                  elements: string,     (Optional) Model used if the elements are not returned at the root of the response
 *                                        aka: the API returns the array of objects in an element of the response, as in pagination
 *                                        Example:
 *                                        {
 *                                          total:'',
 *                                          description:'',
 *                                          results:[
 *                                              {...},
 *                                              {...}
 *                                          ]
 *                                        }
 *                                        In this case 'elements' should receive the parameter 'results'
 *                  softDelete: {
 *                      hide: string,         Boolean property to consider in order to hide the element (hide, deleted, disabled, etc.)
 *                      reverse: boolean      If true, the element will be hiden when the parameter is false rather than true
 *                  } 
*              },
*              options:{              // (Optional) Just used when the field is options, in this case, the possible options are passed to the component since the beginning
*                  model: string,            Field of the element to be used in the model
*                  option: string,           Field of the element to show in list
*                  elements:[
*                      {
*                          model: {{}},
*                          option: {{}}
*                      }
*                  ]
*              }
*              fileUploder: {                 As used by the file-uploader component
*                          fileFormats: '<',           //image/*, audio/*, video/*, application/pdf
*                          capture: '<',               //camera
*                          validations: '<',           //size: {max: '20MB', min: '10B'}, height: {max: 12000}, width: {max: 12000}, duration: {max: '5m'}}
*                          resize: '<',                //{width: 1000, height: 1000, centerCrop: true}
*                          resizeIf: '<',              //$width > 5000 || $height > 5000
*                          maxDimensions: '<',         //Max dimensions for images
*                          maxDuration: '<',           //Max duration for videos
*                          multipleFiles: '<',         //Allow multiple files
*                          allowFolders: '<',          //Allow directory uploading
*                          maxFiles: '<',              //Max number of files allowed
*                          keep: '<',                  //true, false or distinct,
*                                                      (Optional) Just necessary if any further treatment is required in the model of the files, such as conversion.
*                          filesSelected: '<'          * function(files){ return model; } //Do the necesary processing for the files inside the given function
*                      },
*          }
*      ],
*      dialog:{              //Labels to use in the creation dialog
*          title: string,          (Optional) Title for the creation dialog, default is 'Modify element'
*          okButton: string,       (Optional) Label for the Ok button, default is 'Modify'
*          cancelButton: string    (Optional) Label for the cancel button, default is 'Cancel'
*      },
 *     url:string,                 URL of the API for creation.
*      id: string,           //(Optional) Field name to be used as id for HTTP PUT method, default is 'id'
*      element: object       //Initial object to be modified
*/

(function () {
    angular
        .module('catalogManager')
        .controller('CatalogModifyDialogController', CatalogModifyDialogController);
    function CatalogModifyDialogController(
        $mdDialog,
        dialog,
        CATALOG,
        fields,
        id,
        element,
        url
    ) {
        var vm = this;

        vm.dialog = dialog;
        vm.fields = fields;
        vm.ModifyCatalogProvider = CATALOG;

        vm.id = id;
        vm.url = url;
        vm.objectToModify = angular.fromJson(angular.toJson(element));

        vm.modify = modify;
        vm.cancel = cancel;

        function createProvider() {
            if (vm.hasOwnProperty('url')) {
                vm.ModifyCatalogProvider.url = vm.url;
            }
            else {
                $mdDialog.cancel('"url" parameter was not provided');
            }
        }

        function modify() {
            createProvider();
            var id = null;
            if (vm.id) {
                id = vm.id;
            }
            else {
                id = 'id';
            }
            vm.modifyLoader = vm.ModifyCatalogProvider
                .update(vm.objectToModify[id], vm.objectToModify)
                .then(function (modifiedElement) {
                    var elementToReturn;
                    if (modifiedElement) {
                        elementToReturn = modifiedElement;
                    }
                    else {
                        elementToReturn = vm.objectToModify;
                    }
                    $mdDialog.hide(elementToReturn);
                })
                .catch(function (modifyError) {
                    $mdDialog.cancel(modifyError);
                });
        }

        function cancel() {
            $mdDialog.cancel(null);
        }

    }

})();
