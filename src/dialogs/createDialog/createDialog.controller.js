/*
   fields:[
*          {
*              type: string,          Valid types are the html5 types, plus the types:
 *                                    options, catalog, array(strings), catalog_array,
 *                                    catalog_array and fileUploader.
 *                                    catalog and catalog_array use the catalog_select component.
 *             initial_value: string, (Optional) If given the value will be shown in the field
 *                                    (just html5 types)
 *             lock: boolean,         (Optional) If true, the field would be disabled,
 *                                    just works for HTML5 fields and if a initial_value is given,
 *                                    otherwise is ignored.
*              model: string,         Name of the field that will be sent to the API
*              required: boolean,     (Optional) Specifies whether or not the field is required,
 *                                    used for form validation
*              hint: string,          (Optional) Hint label to show
*              label: string,         (Optional) Label to show in the form, if not given,
 *                                    the model string will be used as label.
*              validations:
*                  {
*                      regex: string,          Option regular expression for field validation
 *                                             (just used when text),
*                      max: number,            Maximum value allowed for selection (just used when number
 *                                             array and catalog_array)
*                      min: number,            Minimum value allowed for selection (just used when number)
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
 *                  url: string,         Full URL
 *                  requires: string,    (Optional) Model of the catalog field that needs to be selected before this field appears (catalog dependance)
 *                                       It can just be used with catlog type field, or catalog_array field.
 *                  query: string,       (Optional) Just used if requires contains a model. Given the fact that
 *                                       this catalog depends of other, a query would be required in order to load.
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
 *     url:string,                 URL of the API for creation.
*      dialog:{                    //Labels to use in the creation dialog
*          title: string,          (Optional) Title for the creation dialog, default is 'Create element'
*          okButton: string,       (Optional) Label for the Ok button, default is 'Create'
*          cancelButton: string    (Optional) Label for the cancel button, default is 'Cancel'
*      }
*/

(function () {
    angular
        .module('catalogManager')
        .controller('CatalogCreateDialogController', CatalogCreateDialogController);
    function CatalogCreateDialogController(
        $mdDialog,
        dialog,
        CATALOG,
        fields,
        url
    ) {
        var vm = this;

        vm.dialog = dialog;
        vm.fields = fields;
        vm.url = url;
        vm.CreateCatalogProvider = CATALOG;

        vm.objectToCreate = {};

        //Functions
        vm.create = create;
        vm.cancel = cancel;


        function createProvider() {
            if (vm.hasOwnProperty('url')) {
                vm.CreateCatalogProvider.url = vm.url;
            }
            else {
                $mdDialog.cancel('"url" parameter was not provided');
            }
        }

        function create(objectToCreate) {
            createProvider();
            vm.createLoader = vm.CreateCatalogProvider
                .create(objectToCreate)
                .then(function (createdElement) {
                    var elementToReturn;
                    if (createdElement) {
                        elementToReturn = createdElement;
                    }
                    else {
                        elementToReturn = objectToCreate;
                    }
                    $mdDialog.hide(elementToReturn);
                })
                .catch(function (createError) {
                    $mdDialog.cancel(createError);
                });
        }

        function cancel() {
            $mdDialog.cancel(null);
        }
    }

})();
