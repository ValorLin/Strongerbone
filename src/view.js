// # Strongerbone View #
// author: weilao
// @ https://github.com/weilao
(function (_window) {
    var _compiledTplCache = [];
    var S = _window.S = _window.S || {};

    S.View = Backbone.View.extend({
        template: '',
        model: null,
        data: {},
        hidden: false,

        constructor: function (opts) {
            _.extend(this, opts);

            if (this.model) {
                this.data = this.model.attributes;
            } else {
                this.data = _.result(this, 'data');
                this.model = new Backbone.Model(this.data);
            }

            this.model.on('change', this.render, this);
            return Backbone.View.apply(this, arguments);
        },

        getTemplate: function () {
            return this.template
                || this.syncGetTemplate(this.templateUrl)
                || '';
        },

        // fetch the template if there is a templateUrl
        syncGetTemplate: function (templateUrl) {
            return templateUrl && $.ajax({
                url: templateUrl,
                async: false
            }).responseText;
        },

        applyTemplate: function (compiledTpl, model) {
            return compiledTpl(model.toJSON());
        },

        compileTemplate: function (template) {
            return _compiledTplCache[template]
                || (_compiledTplCache[template] = _.template(template));
        },

        render: function () {
            _.result(this, 'beforeRender');
            this.trigger('beforeRender');

            var template, compiledTpl, html,
                $el = this.$el;

            template = this.getTemplate();
            compiledTpl = this.compileTemplate(template);
            html = this.applyTemplate(compiledTpl, this.model);
            $el.html(html);
            this.hidden && $el.hide();

            _.result(this, 'afterRender');
            this.trigger('afterRender');
            return this;
        },

        // shortcut methods
        find: function (selector) {return this.$el.find(selector);},
        show: function () {this.$el.show();},
        hide: function () {this.$el.hide();}
    });
})(window);
