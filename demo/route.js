
//设置route资源路由
;(function(bingo, $){
	"use strict";

	var app = bingo.app('demo');

	//直接通过， 即没有转发处理
	app.route('pass', {
		type: 'pass',
		url: '{pass*}',
		toUrl: '{pass*}',
		defaultValue: {
			pass: ''
		}
	});

	//设置controller资源路由
	app.route('controller', {
		//优先级, 越小越前, 默认100
		//priority: 200,
		type: 'controller',
		//路由url, 如: user/list
		url: '{controller*}',
		//路由到目标url, 生成:modules/user/list.js
		toUrl: 'modules/{controller*}.js',
		//变量默认值, 框架提供内部用的变量: app, controller, service
		defaultValue: {
			controller: ''
		}
	});

	//设置view模板路由
	app.route('view', {
		type: 'view',
		url: '{view*}',
		toUrl: 'modules/{view*}.html',
		defaultValue: {
			view: ''
		}
	});

	//设置tmpl资源路由
	app.route('tmpl', {
		type: 'tmpl',
		url: '{tmpl*}',
		toUrl: 'tmpls/{tmpl*}.html',
		defaultValue: {
			tmpl: ''
		}
	});

	//设置command资源路由
	app.route('command', {
		type: 'command',
		url: '{command*}',
		toUrl: '{command*}',
		//如果{{select /}} , 加载commands/base.js(里面存放基础指令)
		//如果{{index/footer /}} , 加载commands/index.js(里面存放index相关指令)
		promise: function(url, p, context){

			var cUrl = context.url,
				l = cUrl.split('/'),
			    hasType  = l.length > 1,
				cmdType = hasType ? l[0] : 'base',
				tmplid = hasType ? l[1] : cUrl;

			//如 route url: index/sidebar
			//类型(type)为: index, 如果空为base
			//url==> commands/index.js
			url = ['pass::commands', cmdType].join('/');//使用pass路由直接转发
			url += '.js';

			return app.using(url);
		},
		defaultValue: {
			command: ''
		}
	});

	//设置command模板资源路由
	app.route('cmdtmpl', {
		type: 'cmdtmpl',
		url: '{cmdtmpl*}',
		//如果{{select /}} , 加载commands/base.html(里面存放基础指令模板)
		//如果{{index/footer /}} , 加载commands/index.html(里面存放index相关指令模板)
		promise: function(url, p, context){

			var cUrl = context.url,
				l = cUrl.split('/'),
			    hasType  = l.length > 1,
				cmdType = hasType ? l[0] : 'base';

			//如 route url: index/sidebar
			//类型(type)为: index, 如果空为base

			//url==> commands/index.html
			url = ['pass::commands', cmdType].join('/');//使用pass路由直接转发
			url += '.html';

			//tmplid: index:sidebar
			//最终结果是: 加载commands/index.html文件中id="index/sidebar"模板
			return app.tmpl(url, {tmplid:cUrl});
		},
		defaultValue: {
			cmdtmpl: ''
		}
	});

	//设置ajax资源路由
	app.route('ajax', {
		type: 'ajax',
		url: '{ajax*}',
		toUrl: 'api/{ajax*}.json',
		defaultValue: {
			ajax: ''
		}
	});

	//设置service资源路由
	app.route('service', {
		type: 'service',
		url: '{service*}',
		//如果$site, 加载services/base.js(里面存放基础服务)
		//如果user/lib , 加载services/user.js(里面存放user相关的服务如: user/lib, user/role)
		toUrl: function(url, p){
			var l = url.split('/'),
			    isBase  = l.length == 1,
				file = isBase ? 'base' : l[0];
			return 'services/' + file + '.js';
		},
		defaultValue: {
			service: ''
		}
	});

	bingo.ready(function(){
		bingo.compile(document.getElementById('main'));
	});

})(bingoV2, window.jQuery);
