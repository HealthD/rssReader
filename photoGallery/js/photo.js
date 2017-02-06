


var Image = Backbone.Model.extend({
    emptyURL: "/images/image.jpg",
    emptyTitle: "No photo",
    defaults: {
        visibleImage: 0
    },
    initialize: function(options) {
        if (!this.get("uri")) {
            this.set({"uri": this.emptyURL});
        }
        if (!this.get("title")) {
            this.set({"title": this.emptyTitle});
        }
    },

    getTitle : function() {
        return this.get("title");
    },
    getUri: function () {
        return this.get("uri")
    }
});

var ImagesCollection = Backbone.Collection.extend({
    model: Image,
    setIndex: function(photoIndex) {
        if(!this.length) return;
        alert(this.length);
        if(photoIndex < 0) {
            photoIndex = this.length - 1;
        } else if(photoIndex >= this.length) {
            photoIndex = 0;
        }
        this.set('visibleImage', photoIndex);
    },
    setPrev: function() {
        this.setIndex(this.get('visibleImage') - 1);
    },

    setNext: function() {
        this.setIndex(this.get('visibleImage') + 1);
    }
});

var images = new ImagesCollection;

function addImagesToCollection() {
    var imagesStorage = JSON.parse(localStorage.getItem('images'));
    images.reset();
    for (var i = 0; i < imagesStorage.length; i++) {
        var image = new Image;
        image.set({title: imagesStorage[i].title, uri: imagesStorage[i].uri});
        images.push(image);
    }
}


var ContactView = Backbone.View.extend({
    tagName: "article",
    className: "contact-container",
    template: $("#contactTemplate").html(),
    render: function () {
        var tmpl = _.template(this.template);
        this.$el.html(tmpl(this.model.toJSON()));
        return this;
    }
});


var ImagesView = Backbone.View.extend({
    el: $("#gallery"),
    initialize: function () {
        addImagesToCollection();
        this.collection = images;
        console.log(this.collection);
        this.render();
    },
    render: function () {
        var that = this;
        console.log(this.collection.models[0].getTitle());
        _.each(this.collection.models, function (item) { // проход по колекции моделей
            if(item.getTitle() == "Inside the Ice Cave") {
                item.set({visibleImage: 1});

            }
            that.renderContact(item);
        }, this);
    },
    renderContact: function (item) {
        var contactView = new ContactView({
            model: item
        });
        if (contactView.model.get('visibleImage') == 1) { //проверка видно или нет
           // this.$el.append(contactView.render().el); //все изображения
            this.$el.html('<img src="' + contactView.model.get('uri') + '" />');
        }

    }

});


var directory = new ImagesView();



