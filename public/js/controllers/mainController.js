
app.controller("mainController",function($scope, ssnocService, $q,$rootScope){
		$scope.member = {};
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
					console.log("exisitng member");
					if (validateLoginDetails($scope.validateUser)) {
									// login successfull and send chat.html
							$scope.member = $scope.validateUser;
							$scope.member.status = 1;
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
		}

		$scope.signup = function()
		{   
			if(validateSignInDetails()){
				createMember();
				window.alert("Welcome to Brics SsNoc. You could send messages or share your status with the members in our communicty. 1-OK, 2-Help, 3-Emergency, 4-Undefined.");
				window.location = "/#/chatting";
			}
			else{
				console.log("type someting wong");
			}

		}

		function findExistingMember(){
			ssnocService.getMember($scope.member.username)
				.then(
					function(response){
						 console.log("response " + response.data);
						if(response.data !=undefined)
						{ 	
							$rootScope.id=response.data._id;
							console.log($rootScope.id);
							$scope.validateUser  = response.data;
							
							$scope.isExistingMember = true;
							defer.resolve($scope.isExistingMember);
						}
						else
							// not a member, crete new
						{ 
							console.log("false");
							$scope.message = "no existing member";
							$scope.isExistingMember = false;
							defer.resolve($scope.isExistingMember);
							//change hidden password box

							// create new 
							// createMember();	
						}
					},
					function(err){
							console.log("failedcall");
							defer.reject(err);
						}
					);

					return defer.promise;
			    // console.log(dbMember);			
		}



		$scope.logout = function(){
			$scope.loading = true;
			goOffline();
		}

		
		// CREATE ==================================================================
		// when submitting the add form, send the text to the node API
		function createMember() {
				$scope.loading = true;
				// call the create function from our service (returns a promise object)
				ssnocService.create($scope.member)
					.success(function(data) {
						$scope.loading = false;
						$scope.member = data;
						$scope.member.status = 1; 
						$rootScope.id=$scope.member._id;
						updateStatus(); 
					});
		}

		// function getMember(){
		// 	$scope.loading = true;
		// 	ssnocService.getMember($scope.member.username)
		// 	.success(function(data){
		// 		console.log(data);

		// 		$scope.loading = false;
		// 		return data;
		// 	}).error(function(error)
		// 	{
		// 		console.log(error);
		// 	});
		// }
		
		function validateLoginDetails(data){
			// console.log("validation " + data);
			if(data != undefined)
			{
				if(data.password == $scope.member.password){
				return true;
				}
			}
			else {
				 $scope.message = "wrong infomation";
				 return false;		 
			}
		}

		function validateSignInDetails(){
			//usecase requirements: https://drive.google.com/file/d/0B7mdj-x_n_iSX3Y4Q2FoallpMEE/view
			var reservedlists = ["about", "access", "account", "accounts", "add", "address", "adm", "admin", "administration", "adult", "advertising", "affiliate", "affiliates", "ajax", "analytics", "android", "anon", "anonymous", "api", "app", "apps", "archive", "atom", "auth", "authentication", "avatar", "backup", "banner", "banners", "bin", "billing", "blog", "blogs", "board", "bot", "bots", "business", "chat", "cache", "cadastro", "calendar", "campaign", "careers", "cgi", "client", "cliente", "code", "comercial", "compare", "config", "connect", "contact", "contest", "create", "code", "compras", "css", "dashboard", "data", "db", "design", "delete", "demo", "design", "designer", "dev", "devel", "dir", "directory", "doc", "docs", "domain", "download", "downloads", "edit", "editor", "email", "ecommerce", "forum", "forums", "faq", "favorite", "feed", "feedback", "flog", "follow", "file", "files", "free", "ftp", "gadget", "gadgets", "games", "guest", "group", "groups", "help", "home", "homepage", "host", "hosting", "hostname", "html", "http", "httpd", "https", "hpg", "info", "information", "image", "img", "images", "imap", "index", "invite", "intranet", "indice", "ipad", "iphone", "irc", "java", "javascript", "job", "jobs", "js", "knowledgebase", "log", "login", "logs", "logout", "list", "lists", "mail", "mail1", "mail2", "mail3", "mail4","mail5","mailer", "mailing", "mx", "manager", "marketing", "master", "me", "media", "message", "microblog", "microblogs", "mine", "mp3", "msg", "msn", "mysql", "messenger", "mob", "mobile", "movie", "movies", "music", "musicas", "my", "name", "named", "net", "network", "new", "news", "newsletter", "nick", "nickname", "notes", "noticias", "ns", "ns1", "ns2", "ns3", "ns4", "old", "online", "operator", "order", "orders", "page", "pager", "pages", "panel", "password", "perl", "pic", "pics", "photo", "photos", "photoalbum", "php", "plugin", "plugins", "pop", "pop3", "post", "postmaster", "postfix", "posts", "profile", "project", "projects", "promo", "pub", "public", "python", "random", "register", "registration", "root", "ruby", "rss", "sale", "sales", "sample", "samples", "script", "scripts", "secure", "send", "service", "shop", "sql", "signup", "signin", "search", "security", "settings", "setting", "setup", "site", "sites", "sitemap", "smtp", "soporte", "ssh", "stage", "staging", "start", "subscribe", "subdomain", "suporte", "support", "stat", "static", "stats", "status", "store", "stores", "system", "tablet", "tablets", "tech", "telnet", "test", "test1", "test2", "test3", "teste", "tests", "theme", "themes", "tmp", "todo", "task", "tasks", "tools", "tv", "talk", "update", "upload", "url", "user", "username", "usuario", "usage", "vendas", "video", "videos", "visitor", "win", "ww", "www", "www1", "www2", "www3", "www4", "www5", "www6", "www7", "wwww", "wws", "wwws", "web", "webmail", "website", "websites", "webmaster", "workshop", "xxx", "xpg", "you", "yourname", "yourusername", "yoursite", "yourdomain"];
			if ($scope.member.username.length < 3 || reservedlists.indexOf($scope.member.username) != -1 ){
				$scope.message = "Please provide a different username.";
				return false;
			}
			if ($scope.member.password.length < 4){
				$scope.message = "Please provide a different password, the password should include atleat 4 characters.";
				return false;
			}
			if ($scope.member.password != $scope.member.confirmPassword){
				$scope.message = "the two passwords dosen't match.";
				return false;
			}
			else {
				return true;
			}		
		}


		//update status send no
		function updateStatus(){
			console.log("status " +$scope.member.status)
			ssnocService.updateStatus($scope.member._id, $scope.member.status)
			.then(function(response){
				console.log("update status " + response.status);
				$scope.member = response;
				$scope.loading = false;
				defer.resolve($scope.member);
			},function(err){
				defer.reject(err);
			});
			return defer.promise;
		}
});