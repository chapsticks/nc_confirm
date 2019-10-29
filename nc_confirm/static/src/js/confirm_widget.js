openerp.nc_confirm = function(instance) {
	var _t = instance.web._t;

    instance.web.form.WidgetButton.include({
        confirmRender: function(temp, data){
            var res = {};
            _(data).each(function(model,index,list){
                if (model instanceof Array){
                    res[index] = model[1];
                }else{
                    res[index] = model;
                }
            })
            return _.template(temp.replace('{{', '<%-').replace('}}', '%>'))(res);
        },
        execute_action: function() {
            var self = this;
            var exec_action = function() {
                if (self.node.attrs.confirm) {
                    var def = $.Deferred();

                    var content = $('<div/>').html(self.confirmRender(self.node.attrs.confirm, self.field_manager.datarecord));//$('<div/>').html(self.node.attrs.confirm);
                    var dialog = new instance.web.Dialog(this, {
                        title: _t('Confirm'),
                        buttons: [
                            {text: _t("Cancel"), click: function() {
                                    this.parents('.modal').modal('hide');
                                }
                            },
                            {text: _t("Ok"), click: function() {
                                    var self2 = this;
                                    self.on_confirmed().always(function() {
                                        self2.parents('.modal').modal('hide');
                                    });
                                }
                            }
                        ],
                    }, content).open();
                    dialog.on("closing", null, function() {def.resolve();});
                    return def.promise();
                } else {
                    return self.on_confirmed();
                }
            };
            if (!this.node.attrs.special) {
                return this.view.recursive_save().then(exec_action);
            } else {
                return exec_action();
            }
        },
    })
}
