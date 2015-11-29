app.controller("mainController",function($scope, ssnocService, member, $q,$rootScope){
		$scope.loginDetails = {};
		$scope.loading = true;
		$scope.isExistingMember = true;
		var defer = $q.defer();

		// GET =====================================================================
		// when landing on the page, get all todos and show them
		// use the service to get all the todos
		$scope.login = function(){
			$scope.loading = true;

			findExistingMember().then(function(response){
				if($scope.isExistingMember)
				{
					if (validateLoginDetails($rootScope.member)) {
							// login successfull and send chat.html
							$rootScope.member.setStatus($rootScope.statuses.OK.id);	
							$rootScope.member.setAuthentication(true);
							updateStatus().then(function(response){
								window.location = "/#/chatting";
							});
					}
					else {
						$scope.message = "wrong infomation,please type in again";
					}
				}
				else
				{
					console.log($scope.isExistingMember);
				}
			});
		};

		$scope.signup = function()
		{   
			if(validateSignInDetails()){
				createMember();
				window.location = "/#/chatting";
			}

		};

		function findExistingMember(){
			ssnocService.getMember($scope.loginDetails.username)
				.then(
					function(response){
			
						if(response.data !== null)
						{ 	
							$rootScope.member  = new member(
								response.data._id, 
								response.data.name,
								response.data.password, 
								response.data.status,
								response.data.permissionId,
								response.data.accountStatus);
							$rootScope.member.printMember();
							$scope.isExistingMember = true;
							defer.resolve($scope.isExistingMember);
						}
						else
							// not a member, crete new
						{ 
							
							$scope.message = "no existing member";
							$scope.isExistingMember = false;
							defer.resolve($scope.isExistingMember);

						}
					},
					function(err){
							
							defer.reject(err);
						}
					);

					return defer.promise;			    	
		}


		$scope.logout = function(){
			$scope.loading = true;
			//goOffline();
		};

		
		// CREATE ==================================================================
		// when submitting the add form, send the text to the node API
		function createMember() {
				$scope.loading = true;
				// call the create function from our service (returns a promise object)
				$rootScope.member = new member(0,
					$scope.loginDetails.username, 
					$scope.loginDetails.password, 
					$rootScope.statuses.OK.id,
					0,
					0);
				$rootScope.member.printMember();
				ssnocService.create($rootScope.member)
					.success(function(data) {
						$scope.loading = false;
						$rootScope.member = new member(
							data._id, 
							data.name, 
							data.password, 
							data.status, 
							data.permissionId,
							data.accountStatus);
						$rootScope.member.printMember();
						$rootScope.member.setAuthentication(true);
						updateStatus();
					});
		}

		
		function validateLoginDetails(data){

			console.log("Data " + data.name);
			if(data !== undefined)
			{
				if(data.password == $scope.loginDetails.password){
				return true;
				}
			}
			else {
				 $scope.message = "wrong infomation";
				 return false;		 
			}
		}

		function validateSignInDetails(){
			
			var reservedlists = ["about", "access", "account", "accounts", "add", "address", "adm", "admin", "administration", "adult", "advertising", "affiliate", "affiliates", "ajax", "analytics", "android", "anon", "anonymous", "api", "app", "apps", "archive", "atom", "auth", "authentication", "avatar", "backup", "banner", "banners", "bin", "billing", "blog", "blogs", "board", "bot", "bots", "business", "chat", "cache", "cadastro", "calendar", "campaign", "careers", "cgi", "client", "cliente", "code", "comercial", "compare", "config", "connect", "contact", "contest", "create", "code", "compras", "css", "dashboard", "data", "db", "design", "delete", "demo", "design", "designer", "dev", "devel", "dir", "directory", "doc", "docs", "domain", "download", "downloads", "edit", "editor", "email", "ecommerce", "forum", "forums", "faq", "favorite", "feed", "feedback", "flog", "follow", "file", "files", "free", "ftp", "gadget", "gadgets", "games", "guest", "group", "groups", "help", "home", "homepage", "host", "hosting", "hostname", "html", "http", "httpd", "https", "hpg", "info", "information", "image", "img", "images", "imap", "index", "invite", "intranet", "indice", "ipad", "iphone", "irc", "java", "javascript", "job", "jobs", "js", "knowledgebase", "log", "login", "logs", "logout", "list", "lists", "mail", "mail1", "mail2", "mail3", "mail4","mail5","mailer", "mailing", "mx", "manager", "marketing", "master", "me", "media", "message", "microblog", "microblogs", "mine", "mp3", "msg", "msn", "mysql", "messenger", "mob", "mobile", "movie", "movies", "music", "musicas", "my", "name", "named", "net", "network", "new", "news", "newsletter", "nick", "nickname", "notes", "noticias", "ns", "ns1", "ns2", "ns3", "ns4", "old", "online", "operator", "order", "orders", "page", "pager", "pages", "panel", "password", "perl", "pic", "pics", "photo", "photos", "photoalbum", "php", "plugin", "plugins", "pop", "pop3", "post", "postmaster", "postfix", "posts", "profile", "project", "projects", "promo", "pub", "public", "python", "random", "register", "registration", "root", "ruby", "rss", "sale", "sales", "sample", "samples", "script", "scripts", "secure", "send", "service", "shop", "sql", "signup", "signin", "search", "security", "settings", "setting", "setup", "site", "sites", "sitemap", "smtp", "soporte", "ssh", "stage", "staging", "start", "subscribe", "subdomain", "suporte", "support", "stat", "static", "stats", "status", "store", "stores", "system", "tablet", "tablets", "tech", "telnet", "test", "test1", "test2", "test3", "teste", "tests", "theme", "themes", "tmp", "todo", "task", "tasks", "tools", "tv", "talk", "update", "upload", "url", "user", "username", "usuario", "usage", "vendas", "video", "videos", "visitor", "win", "ww", "www", "www1", "www2", "www3", "www4", "www5", "www6", "www7", "wwww", "wws", "wwws", "web", "webmail", "website", "websites", "webmaster", "workshop", "xxx", "xpg", "you", "yourname", "yourusername", "yoursite", "yourdomain"];
			if ($scope.loginDetails.username.length < 3 || reservedlists.indexOf($scope.loginDetails.username) != -1 ){
				$scope.message = "Please provide a different username.";
				return false;
			}
			if ($scope.loginDetails.password.length < 4){
				$scope.message = "Please provide a different password, the password should include at least 4 characters.";
				return false;
			}
			if ($scope.loginDetails.password != $scope.loginDetails.confirmPassword){
				$scope.message = "Passwords do not match.";
				return false;
			}
			else {
				return true;
			}		
		}

		function updateStatus(){
			console.log("Updates status " + $rootScope.member.id + ", " +  $rootScope.member.username);
			ssnocService.updateStatus($rootScope.member.id, $rootScope.member.position, $rootScope.member.status)
			.then(function(response){
				console.log(response.data);
				$rootScope.member.printMember();
				$scope.loading = false;
				defer.resolve($rootScope.member);
			},function(err){
				defer.reject(err);
			});
			return defer.promise;
		}

});
