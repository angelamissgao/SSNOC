var app = angular.module('ssnoc',['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
        // $rootscope ="hello world",
        $routeProvider

            // route for the home page
            .when('/', {
              templateUrl : 'login.html',
              controller  : 'mainController'
            })

            // // route for the about page
            .when('/chatting', {
              templateUrl : 'chat.html',
              controller  : 'chatController'
            })

            .when('/directory',{
              templateUrl: 'directory.html',
              controller:'chatController'
            })

            .when('/inbox', {
              templateUrl : 'inbox.html',
              controller  : 'chatController'
            })

            .when('/announcements', {
              templateUrl : 'announcement.html',
              controller  : 'chatController'
            })

            .when('/privatechat', {
              templateUrl : 'privatechat.html',
              controller  : 'privateChatController'
            })

            .when('/performance', {
              templateUrl : 'performance.html',
              controller  : 'performanceTestController'
            })

            .when('/emergencymode', {
              templateUrl : 'emergencymode.html',
              controller  : 'emergencyModeController'
            })

            .when('/editprofile', {
              templateUrl : 'editprofile.html',
              controller  : 'editProfileController'
            });

          }]);

app.run(function($rootScope, ssnocService, shakeService, locationService, member){
    $rootScope.socket = io.connect(); 

    $rootScope.currentPosition = {lat: 0, lng: 0};
    // $rootScope.currentPosition.lat = 0;    
    // $rootScope.currentPosition.lng = 0;    
    // $rootScope.authenticated = false;
    $rootScope.member = new member();

    $rootScope.statuses = {
    'Offline' : {'name':"Offline", 'id': 0},
    'OK' : {'name':"OK", 'id':1},
    'Help' :{ 'name' :"Help", 'id':2},
    'Emergency' :{'name':"Emergency", 'id':3}
    };

    $rootScope.statusImgMap = {
      0:"offline.png",
      1:"ok-icon.png",
      2:"help-icon.png",
      3:"emergency-icon.png",
    };

    $rootScope.permissionMap = {
      'Citizen' : {'name':"Citizen", 'id': 0},
      'Administrator' : {'name':"Administrator", 'id':1},
      'Coordinator' :{ 'name' :"Coordinator", 'id':2},
      'Monitor' :{'name':"Monitor", 'id':3}
    };

    $rootScope.accountStatusMap = {
      'Active' : {'name':"Active", 'id': 0},
      'Inactive' : {'name':"Inactive", 'id':1},
    };

    $rootScope.currentMsgPage = 0;
    var pageSize = 10;
    
    shakeService.addShakeDetection();

    locationService.getLocation();

    $rootScope.shareStatus= function(status_id){
     $rootScope.memberstatus = status_id;
     ssnocService.updateStatus($rootScope.member.id, $rootScope.position, status_id);
    };

    $rootScope.logout = function()
    {
      ssnocService.updateStatus($rootScope.member.id, $rootScope.member.position, $rootScope.statuses.Offline.id).
      success(function(response){
        console.log("logout" + response);
        $rootScope.member.setAuthentication(false);
        window.location = "/";
      });
    };

    $rootScope.socket.on('userProfileChange', function(changedMember){
      if ($rootScope.member.id == changedMember._id &&
          changedMember.accountStatus == $rootScope.accountStatusMap.Inactive.id) {
        $rootScope.logout();
        window.alert("Your account has been deactivated.");
      }
    });

    $rootScope.socket.on('disconnect', function(){
      console.log("disconnecting" + $rootScope.member.id);
      ssnocService.updateStatus($rootScope.member.id, $rootScope.statuses.Offline.id);
      $rootScope.$apply();
    });

    $rootScope.isSearchMsgShown = function(messageId, messages)
    {
      for (var i = 0; i < messages.length; i ++) {
        if (messages[i]._id == messageId) {
          if (i < ($rootScope.currentMsgPage+1) * pageSize) {
            return true;
          }
          else {
            return false;
          }
        }
      }
      return false;
    };

    $rootScope.isShowMoreButtonShown = function(messages) {
      if (($rootScope.currentMsgPage+1) * pageSize >= messages.length) {
        return false;
      }
      else {
        return true;
      }
    };

    $rootScope.showMore = function() {
      $rootScope.currentMsgPage += 1;
    };

    $rootScope.validateSignInDetails = function(username, password, confirmPassword){
      var reservedlists = ["about", "access", "account", "accounts", "add", "address", "adm", "admin", "administration", "adult", "advertising", "affiliate", "affiliates", "ajax", "analytics", "android", "anon", "anonymous", "api", "app", "apps", "archive", "atom", "auth", "authentication", "avatar", "backup", "banner", "banners", "bin", "billing", "blog", "blogs", "board", "bot", "bots", "business", "chat", "cache", "cadastro", "calendar", "campaign", "careers", "cgi", "client", "cliente", "code", "comercial", "compare", "config", "connect", "contact", "contest", "create", "code", "compras", "css", "dashboard", "data", "db", "design", "delete", "demo", "design", "designer", "dev", "devel", "dir", "directory", "doc", "docs", "domain", "download", "downloads", "edit", "editor", "email", "ecommerce", "forum", "forums", "faq", "favorite", "feed", "feedback", "flog", "follow", "file", "files", "free", "ftp", "gadget", "gadgets", "games", "guest", "group", "groups", "help", "home", "homepage", "host", "hosting", "hostname", "html", "http", "httpd", "https", "hpg", "info", "information", "image", "img", "images", "imap", "index", "invite", "intranet", "indice", "ipad", "iphone", "irc", "java", "javascript", "job", "jobs", "js", "knowledgebase", "log", "login", "logs", "logout", "list", "lists", "mail", "mail1", "mail2", "mail3", "mail4","mail5","mailer", "mailing", "mx", "manager", "marketing", "master", "me", "media", "message", "microblog", "microblogs", "mine", "mp3", "msg", "msn", "mysql", "messenger", "mob", "mobile", "movie", "movies", "music", "musicas", "my", "name", "named", "net", "network", "new", "news", "newsletter", "nick", "nickname", "notes", "noticias", "ns", "ns1", "ns2", "ns3", "ns4", "old", "online", "operator", "order", "orders", "page", "pager", "pages", "panel", "password", "perl", "pic", "pics", "photo", "photos", "photoalbum", "php", "plugin", "plugins", "pop", "pop3", "post", "postmaster", "postfix", "posts", "profile", "project", "projects", "promo", "pub", "public", "python", "random", "register", "registration", "root", "ruby", "rss", "sale", "sales", "sample", "samples", "script", "scripts", "secure", "send", "service", "shop", "sql", "signup", "signin", "search", "security", "settings", "setting", "setup", "site", "sites", "sitemap", "smtp", "soporte", "ssh", "stage", "staging", "start", "subscribe", "subdomain", "suporte", "support", "stat", "static", "stats", "status", "store", "stores", "system", "tablet", "tablets", "tech", "telnet", "test", "test1", "test2", "test3", "teste", "tests", "theme", "themes", "tmp", "todo", "task", "tasks", "tools", "tv", "talk", "update", "upload", "url", "user", "username", "usuario", "usage", "vendas", "video", "videos", "visitor", "win", "ww", "www", "www1", "www2", "www3", "www4", "www5", "www6", "www7", "wwww", "wws", "wwws", "web", "webmail", "website", "websites", "webmaster", "workshop", "xxx", "xpg", "you", "yourname", "yourusername", "yoursite", "yourdomain"];
      if (username.length < 3 || reservedlists.indexOf(username) != -1 ){
        return {
          validateResult: false,
          message: "Please provide a different username."
        };
      }
      if (password.length < 4){
        return {
          validateResult: false,
          message: "Please provide a different password, the password should include at least 4 characters."
        };
      }
      if (password != confirmPassword){
        return {
          validateResult: false,
          message: "Passwords do not match."
        };
      }
      else {
        return {
          validateResult: true,
          message: ""
        };
      }   
    }

    // Create default admin user if no admin user exists.
    ssnocService.getDirectory()
    .success(function(data) {
      for (var i = 0; i < data.length; i ++) {
        var user = data[i];
        if (data[i].permissionId == $rootScope.permissionMap.Administrator.id) {
          break;
        }
      }
      if (i >= data.length) {
        var adminUser = new member(
          0,
          "SSNAdmin",
          "admin",
          $rootScope.statuses.OK.id,
          $rootScope.permissionMap.Administrator.id, 0);
        ssnocService.create(adminUser)
          .success(function(data) {
          });
      }
    }); 
  });


