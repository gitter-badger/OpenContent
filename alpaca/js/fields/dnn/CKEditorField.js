﻿(function ($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.CKEditorField = Alpaca.Fields.TextAreaField.extend(
    /**
     * @lends Alpaca.Fields.CKEditorField.prototype
     */
    {
        /**
         * @see Alpaca.Fields.TextAreaField#getFieldType
         */
        getFieldType: function () {
            return "ckeditor";
        },

        /**
         * @see Alpaca.Fields.TextAreaField#setup
         */
        setup: function () {
            if (!this.data) {
                this.data = "";
            }

            this.base();



            

            if (typeof (this.options.ckeditor) == "undefined") {
                this.options.ckeditor = {};
                
            }

            
        },

        afterRenderControl: function (model, callback) {
            var self = this;

            this.base(model, function () {

                // see if we can render CK Editor
                if (!self.isDisplayOnly() && self.control && typeof (CKEDITOR) !== "undefined") {
                    // use a timeout because CKEditor has some odd timing dependencies
                    setTimeout(function () {

                        var defaultConfig = {
                            toolbar: [
                                 
                                 { name: 'basicstyles', groups: ['basicstyles', 'cleanup'], items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat'] },
                                 { name: 'styles', items: ['Styles', 'Format'] },
                                 { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align'], items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', ] },
                                 { name: 'links', items: ['Link', 'Unlink'] },
                                 
                                 { name: 'document', groups: ['mode', 'document', 'doctools'], items: ['Source'] },
                            ],
                            // Set the most common block elements.
                            format_tags: 'p;h1;h2;h3;pre',

                            // Simplify the dialog windows.
                            removeDialogTabs: 'image:advanced;link:advanced',

                            // Remove one plugin.
                            removePlugins: 'elementspath,resize',

                            extraPlugins: 'dnnpages',

                            //autoGrow_onStartup : true,
                            //autoGrow_minHeight : 100,
                            //autoGrow_maxHeight : 300,
                            height : 150,
                            //skin : 'flat',

                            customConfig: '',
                            stylesSet: []
                        };


                        var config = $.extend({}, defaultConfig, self.options.ckeditor);

                        self.editor = CKEDITOR.replace($(self.control)[0], config);
                        //self.editor = CKEDITOR.replace($(self.control)[0], self.options.ckeditor);

                    }, 600);
                }

                // if the ckeditor's dom element gets destroyed, make sure we clean up the editor instance
                $(self.control).bind('destroyed', function () {

                    if (self.editor) {
                        self.editor.removeAllListeners();
                        self.editor.destroy(false);
                        self.editor = null;
                    }

                });

                callback();
            });
        },

        initControlEvents: function () {
            var self = this;

            setTimeout(function () {

                // click event
                self.editor.on("click", function (e) {
                    self.onClick.call(self, e);
                    self.trigger("click", e);
                });

                // change event
                self.editor.on("change", function (e) {
                    self.onChange();
                    self.triggerWithPropagation("change", e);
                });

                // blur event
                self.editor.on('blur', function (e) {
                    self.onBlur();
                    self.trigger("blur", e);
                });

                // focus event
                self.editor.on("focus", function (e) {
                    self.onFocus.call(self, e);
                    self.trigger("focus", e);
                });

                // keypress event
                self.editor.on("key", function (e) {
                    self.onKeyPress.call(self, e);
                    self.trigger("keypress", e);
                });

                // NOTE: these do not seem to work with CKEditor?
                /*
                // keyup event
                self.editor.on("keyup", function(e) {
                    self.onKeyUp.call(self, e);
                    self.trigger("keyup", e);
                });
    
                // keydown event
                self.editor.on("keydown", function(e) {
                    self.onKeyDown.call(self, e);
                    self.trigger("keydown", e);
                });
                */

            }, 800); // NOTE: odd timing dependencies
        },

        setValue: function (value) {
            var self = this;

            // be sure to call into base method
            this.base(value);

            if (self.editor) {
                self.editor.setData(value);
            }
        },

        getValue: function () {
            var self = this;

            var value = this.base();

            if (self.editor) {
                value = self.editor.getData();
            }

            return value;
        },

        /**
         * @see Alpaca.Field#destroy
         */
        destroy: function () {
            // destroy the plugin instance
            if (this.editor) {
                this.editor.destroy();
                this.editor = null;
            }

            // call up to base method
            this.base();
        }

        /* builder_helpers */

        /**
         * @see Alpaca.Fields.TextAreaField#getTitle
         */
        ,
        getTitle: function () {
            return "CK Editor";
        },

        /**
         * @see Alpaca.Fields.TextAreaField#getDescription
         */
        getDescription: function () {
            return "Provides an instance of a CK Editor control for use in editing HTML.";
        },

        /**
         * @private
         * @see Alpaca.ControlField#getSchemaOfOptions
         */
        getSchemaOfOptions: function () {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "ckeditor": {
                        "title": "CK Editor options",
                        "description": "Use this entry to provide configuration options to the underlying CKEditor plugin.",
                        "type": "any"
                    }
                }
            });
        },

        /**
         * @private
         * @see Alpaca.ControlField#getOptionsForOptions
         */
        getOptionsForOptions: function () {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "ckeditor": {
                        "type": "any"
                    }
                }
            });
        }

        /* end_builder_helpers */
    });

    Alpaca.registerFieldClass("ckeditor", Alpaca.Fields.CKEditorField);

})(jQuery);