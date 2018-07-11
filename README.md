# longstory.js
It's a Long Story... Javascript Lirary v0.2.0 (Beta)

longstory.js是一個用來管理、紀錄**網頁狀態**的javascript library，以ECMA Script 5語法開發，一般主流瀏覽器皆適用（IE11可）

-- 這邊所說的「網頁狀態」指的是html5原生使用的history物件所紀錄的state，透過html5原生的history物件可以從前端產生瀏覽器的切換上下頁的效果，相關技術可參考：

https://developer.mozilla.org/zh-TW/docs/Web/API/History_API

longstory.js提供的許多功能讓狀態的操控變得更有彈性好用，其中一個最大的特色就是其使用陣列紀錄網頁所有的狀態。這邊舉一個例子，比如說在一個網頁進行操作，你從這個頁面跳轉到第二頁進行查詢，接著再開啟查詢結果畫面；透過longstory.getHistory()指令，你可能可以得到像這樣的狀態紀錄：

    [
    	{
    		"step": 0,
    		"state": {
    			"currentPage": "index",
    		}
    	},
    	{
    		"step": 1,
    		"state": {
    			"currentPage": "search",
    			"searchCondition": {
    				"startDate": "2018-06-09 11:30",
    				"endDate": "2018-07-10 11:30",
    				"keyword": "iphone"
    			},
    		}
    	},
    	{
    		"step": 2,
    		"state": {
    			"currentPage": "content",
    			"articleId": "e5e44c5344e790514f5049e7d1cb74ab4703aa9c"
    		}
    	}
    ]

## 使用方式

使用方式和一般js元件方式相同，一般建議放至<body>區域底部，例如

    <script src="longstory.js"  type="text/javascript"></script>

## 功能列表

- 取得狀態

 **longstory.getState(key)**
 
key: 狀態名稱

回傳狀態的值



- 紀錄狀態

**longstory.setState(key)**

key: 狀態名稱

功能等同原生history的replaceState()


- 狀態變更事件

**longstory.onChangeState(key, callback)**

key: 指定狀態的名稱

callback: 委派事件function


- 移除狀態

**longstory.removeState(key)**

key: 指定狀態的名稱（null為全部）


- 取得步驟

**longstory.getStep()**

回傳目前的步驟（流水號，由0開始：0,1,2,3）


- 增加步驟

**longstory.push(key, val)**

key: 狀態名稱(可不填)

val: 狀態值(可不填)

功能等同原生history的pushState()

如不填寫直接使用longstory.push()，之後再使用longstory.setState()紀錄步驟


- 增加步驟事件

**longstory.onPush(callback)**

callback: 委派事件function


- 回復步驟

**longstory.restore(n)**

n: 回復步驟數量

比如+1為往前一步，-1為回上一步（等同瀏覽器的上一頁及下一頁）

如n=0不會改變步驟，但仍會呼叫onPush()


- 回復步驟事件

**longstory.onRestory(callback)**

callback: 委派事件function


- 取得state堆疊（陣列）紀錄

**longstory.getHistory()**

回傳state堆疊（陣列）紀錄，格式為：

    [
        {
            step: 0,
            state: "__state__" //setState()或push()所紀錄的state
        }
    ]
