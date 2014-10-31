/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Utils  = __webpack_require__(1);
	var data  = __webpack_require__(2);
	var Dropdown = __webpack_require__(3);
	var Furniture  = __webpack_require__(4);
	var welcome = __webpack_require__(5);
	var rootRef = new Firebase(Utils.urls.root);
	var furnitureRef = new Firebase(Utils.urls.furniture);
	var backgroundRef = new Firebase(Utils.urls.background);

	/*
	* Application Module
	*
	* This is the main module that initializes the entire application.
	*/

	var app = {
	  $welcome: null,
	  $app: null,
	  $signInButtons: null,
	  $alert: null,
	  $signOutButton: null,


	  /*
	  * Initalize the application
	  *
	  * Get intials dump of Firebase furniture data.
	  */

	  init: function() {

	    // REGISTER ELEMENTS
	    this.$welcome = $("#welcome");
	    this.$app = $("#app");
	    this.$officeSpace = $("#office-space");
	    this.$signInButtons = $(".welcome-hero-signin");
	    this.$alert = $(".alert");
	    this.$signOutButton = $(".toolbar-sign-out");

	    //INITIALIZE APP
	    welcome.init();
	    this.checkUserAuthentication();
	    this.createDropdowns();
	    this.setOfficeBackground();
	    this.logout();
	  },

	  checkUserAuthentication: function(){
	    var self = this;

	    rootRef.onAuth(function(authData){
	      if (authData) {
	        self.hideWelcomeScreen();
	        self.renderFurniture();
	      }
	      else {
	        self.showWelcomeScreen();
	      }
	    });
	  },

	  createDropdowns: function() {
	    var self = this;
	    var $addFurniture = $('#add-furniture');
	    var $addBackground = $('#select-background');

	    this.furnitureDropdown = new Dropdown($addFurniture, data.furniture, 'furniture');
	    this.backgroundDropdown = new Dropdown($addBackground, data.backgrounds, 'background');

	    $('.dropdown').on('click', '.dropdown-button', function(e) {
	      e.preventDefault();
	      var button = $(e.currentTarget);
	      var type = button.data('type');
	      var name = button.data('name');

	      switch(type) {
	        case 'furniture': self.addFurniture(name); break;
	        case 'background': self.changeBackground(name); break;
	      }
	    });
	  },

	  changeBackground: function(name) {
	    backgroundRef.set(name);
	  },

	  setOfficeBackground: function() {
	    var self = this;

	    backgroundRef.on('value', function(snapshot) {
	      var value = snapshot.val();
	      var pattern = value ? 'background-' + value : '';

	      self.$officeSpace.removeClass().addClass('editor ' +  pattern);
	    });
	  },

	  addFurniture: function(type) {
	    furnitureRef.push({
	      top: 400,
	      left: 300,
	      type: type,
	      rotation: 0,
	      locked: false,
	      name: ""
	    });
	  },

	  createFurniture: function(snapshot) {
	    new Furniture(snapshot);
	  },

	  renderFurniture: function(){
	    var self = this;

	    furnitureRef.once("value", function(snapshot){
	      snapshot.forEach(function(childSnapshot) {
	        new Furniture(childSnapshot);
	      });
	    });

	    furnitureRef.on("child_added", function(snapshot){
	      self.createFurniture(snapshot);
	    });
	  },

	  logout: function(){
	    this.$signOutButton.on("click", function(e){
	      rootRef.unauth();
	    });
	  },

	  showWelcomeScreen: function(){
	    this.$welcome.removeClass("is-hidden");
	    this.$app.addClass("is-hidden");
	  },

	  hideWelcomeScreen: function(){
	    this.$welcome.addClass("is-hidden");
	    this.$app.removeClass("is-hidden");
	  }
	};


	/*
	* Initialize App
	*
	*/

	$(document).ready(function() {
	  app.init();
	});


	/*
	* Export App
	*
	*/

	module.exports = app;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/*
	* Helper
	*
	*/

	var root = 'https://mover-app-5000-demo.firebaseio.com/';

	var utils = {
	  urls: {
	    root: root,
	    furniture: root + 'furniture/',
	    background: root + 'background/'
	  }
	};

	module.exports = utils;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var data = {
	  backgrounds: [
	    {
	      name: 'carpet',
	      description: 'Casino Carpet',
	      background: 'background-preview-carpet'
	    },
	    {
	      name: 'grid',
	      description: 'Grid Pattern',
	      background: 'background-preview-grid'
	    },
	    {
	      name: 'wood',
	      description: 'Hardwood Floor',
	      background: 'background-preview-wood'
	    },
	    {
	      name: 'tile',
	      description: 'Tile Flooring',
	      background: 'background-preview-tile'
	    }
	  ],

	  furniture: [
	    {
	      name: 'android',
	      description: 'Android Toy',
	      icon: 'icon-android'
	    },
	    {
	      name: 'ballpit',
	      description: 'Ball Pit Pool',
	      icon: 'icon-ballpit'
	    },
	    {
	      name: 'desk',
	      description: 'Office Desk',
	      icon: 'icon-desk'
	    },
	    {
	      name: 'dog_corgi',
	      description: 'Dog (Corgi)',
	      icon: 'icon-dog'
	    },
	    {
	      name: 'dog_retriever',
	      description: 'Dog (Retriever)',
	      icon: 'icon-dog'
	    },
	    {
	      name: 'laptop',
	      description: 'Laptop',
	      icon: 'icon-laptop'
	    },
	    {
	      name: 'nerfgun',
	      description: 'Nerfgun Pistol',
	      icon: 'icon-nerfgun'
	    },
	    {
	      name: 'pacman',
	      description: 'Pacman Arcade',
	      icon: 'icon-game'
	    },
	    {
	      name: 'pingpong',
	      description: 'Ping Pong Table',
	      icon: 'icon-pingpong'
	    },
	    {
	      name: 'plant1',
	      description: 'Plant (Shrub)',
	      icon: 'icon-plant'
	    },
	    {
	      name: 'plant2',
	      description: 'Plant (Succulent)',
	      icon: 'icon-plant'
	    },
	    {
	      name: 'redstapler',
	      description: 'Red Stapler',
	      icon: 'icon-stapler'
	    }
	  ]
	};

	module.exports = data;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/*
	* Dropdown Menu Module
	*
	*/

	var Dropdown = function($parent, data, type) {
	  var ListTemplate = _.template($('#template-dropdown').html());
	  var liTemplate = _.template($('#template-dropdown-item').html());
	  var buttonList = '';

	  // LOOP THROUGH DATA & CREATE BUTTONS
	  for(var i = 0, l = data.length; i < l; i++) {
	    buttonList = buttonList + liTemplate({
	      name: data[i].name,
	      description: data[i].description,
	      background: data[i].background,
	      icon: data[i].icon,
	      type: type
	    });
	  }

	  // ADD DROPDOWN TO DOM
	  $parent.append(ListTemplate({items: buttonList}));

	  //TOGGLE MENU OPEN/CLOSE
	  $parent.on('click', function(e) {
	    e.preventDefault();
	    $parent.find('.dropdown, .dropdown-overlay').toggleClass('is-visible');
	  });

	  // CLOSE MENU WHEN CLICKING OVERLAY
	  $parent.on('click', '.dropdown-overlay', function(e) {
	    e.stopPropagation();
	    $parent.find('.dropdown, .dropdown-overlay').removeClass('is-visible');
	  });
	};

	module.exports = Dropdown;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var utils  = __webpack_require__(1);
	var furnitureRef = new Firebase(utils.urls.furniture);

	/*
	* FURNITURE MODULES
	*
	* This is a furniture class and must be instaniated like
	* a normal class with the "new" keyword.
	*/

	var Furniture = function(snapshot, options) {
	  options = options || {};
	  var self = this;
	  var data = snapshot.val();
	  var element = "<div class='furniture'></div>";
	  var tooltip = "<div class='tooltip is-hidden'>" +
	                  "<button class='tooltip-button is-hidden' data-tooltip-action='edit'>Edit</button>" +
	                  "<button class='tooltip-button' data-tooltip-action='rotate'>Rotate</button>" +
	                  "<button class='tooltip-button' data-tooltip-action='delete'>Delete</button>" +
	                "</div>";

	  /*
	  * Register Furniture Values
	  *
	  */

	  this.officeSpace = $('#office-space');
	  this.element = $(element);
	  this.tooltip = $(tooltip);
	  this.$tooltipButtons = null;
	  this.id = snapshot.name();
	  this.ref = snapshot.ref();
	  this.type = data.type;
	  this.locked = data.locked;
	  this.rotation = data.rotation;
	  this.top = data.top;
	  this.left = data.left;
	  this.name = data.name;


	  /*
	  * Create Firebase Reference
	  *
	  */

	  this.ref  = new Firebase(utils.urls.furniture + this.id);




	  /*
	  * Render Furniture to DOM
	  *
	  */

	  this.render = function(){

	    var rotation = "rotate(" + (this.rotation * -1) + "deg)";  // CCW ROTATION

	    // REMOVE ELEMENT FROM DOM
	    this.element.detach();

	    // SET CURRENT LOCATION
	    this.element.css({
	      "top": parseInt(this.top, 10),
	      "left": parseInt(this.left, 10),
	      "transform": rotation
	    });

	    // SET ACTIVE STATE
	    if (this.locked){
	      this.element.addClass("is-active");
	    }
	    else {
	      this.element.removeClass("is-active");
	    }

	    // ADD TO DOM
	    this.officeSpace.append(this.element);
	  };

	  this.editName = function(){
	    console.log("EDIT");
	  };
	  this.rotate = function(){
	    this.ref.child("rotation").set(this.rotation + 90);
	    this.render();
	  };
	  this.delete = function(){
	    console.log("DELETE");
	  };

	  /*
	  * Initialize furniture module
	  *
	  */

	  this.initElement = function() {

	    //SET DRAG OPTIONS
	    this.element.draggable({
	      containment: self.officeSpace,
	      start: function(event, ui){
	        self.element.addClass("is-active");
	        self.ref.child("locked").set(true);
	      },

	      drag: function(event, ui){
	        self.ref.child("left").set(ui.position.left);
	        self.ref.child("top").set(ui.position.top);
	      },

	      stop: function(event, ui){
	        self.element.removeClass("is-active");
	        self.ref.child("locked").set(false);
	      }
	    });

	    // SET IMAGE FOR ELEMENT AND INIT TOOLTIP
	    this.element.addClass(this.type);
	    this.element.append(this.tooltip);

	    // SET CLICK HANDLER TO CREATE TOOLTIP
	    this.element.on("click", function(e){

	      var $el = $(e.target);
	      var $tooltip = $el.children(".tooltip");
	      var $edit = $tooltip.children("[data-tooltip-action='edit']");

	      $tooltip.toggleClass("is-hidden");

	      if (self.type === "desk") {
	        $edit.removeClass("is-hidden");
	      }
	    });

	    this.$tooltipButtons = $(".tooltip-button");
	    this.tooltip.on("click", function(e){
	      var $el = $(e.target);
	      var action = $el.data("tooltip-action");

	      switch (action) {
	        case "edit": self.editName(); break;
	        case "rotate": self.rotate(); break;
	        case "delete": self.delete(); break;
	      }

	    });

	    // RENDER
	    this.render();
	  };



	  /*
	  * Destroy element
	  *
	  */

	  this.destroy = function() {
	    this.element.remove();
	  };


	  /*
	  * Listen for updates
	  *
	  */

	  this.ref.on("value", function(snap){
	    var value = snap.val();

	    if(value === null) {
	      self.ref.off();
	      self.element.addClass('animated fadeOut');

	      setTimeout(function() {
	        self.destroy();
	      }, 2000);
	    }
	    else {
	      _.extend(self, value);
	      self.render();
	    }
	  });



	  /*
	  * Create Furniture Element
	  *
	  */

	  this.initElement();
	};

	module.exports = Furniture;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var utils  = __webpack_require__(1);
	var rootRef = new Firebase(utils.urls.root);

	/*
	* Welcome module
	*
	* This is the module that sets up the welcome page and Google login
	*/


	var welcome = {

	  $alert: null,
	  $signInButtons: null,

	  init: function(){
	    var self = this;

	    this.$alert = $(".alert");
	    this.$signInButtons = $(".welcome-hero-signin");

	    // SETUP LOGIN BUTTON
	    this.$signInButtons.on("click", function(e){
	      var provider = $(this).data("provider");

	      rootRef.authWithOAuthPopup(provider, function(error, authData){
	        if (error){
	          self.$alert.removeClass("is-hidden");
	        }
	        else {
	          self.$alert.addClass("is-hidden");
	        }
	      });
	    });

	  }
	};

	module.exports = welcome;

/***/ }
/******/ ])