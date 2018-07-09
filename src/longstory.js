/* 
 * It's a Long Story... Javascript Lirary v0.2.0 (Beta)
 * 2018/7/6
 */

(function(){
    
function Longstory(){

    var self = this;
    
    this._currentStep = 0;

    // 歷史紀錄
    this._historyArr = null;
    if(history.state){ //從history取回資料
        if(history.state["__longstoryjs_historyArr__"] && history.state["__longstoryjs_currentStep__"] != null){ 
            this._historyArr = JSON.parse(history.state["__longstoryjs_historyArr__"]);
            this._currentStep = history.state["__longstoryjs_currentStep__"];
        }
    }
    if(!this._historyArr){
        this._historyArr = [{ step: 0, stateDict: {}, }];
    }

    this._stateDict = {};

    this._stateCallbackDict = null;
        
    this._getState = function(key){
        if(key){
            return this._stateDict[key];
        }else{
            return this._stateDict;
        }
    }
    
    this._setState = function(key, val){
        this._stateDict[key] = val;
        
        //--replace state--
        this._historyArr[this._currentStep].stateDict = JSON.parse(JSON.stringify(this._stateDict));
        this._historyArr[this._currentStep].step = this._currentStep;

        //history - replace
        var historyState = {};
        historyState["__longstoryjs_historyArr__"] = JSON.stringify(this._historyArr);
        historyState["__longstoryjs_currentStep__"] = this._currentStep;
        //更新網址及瀏覽器狀態
        history.replaceState(historyState,"","");

        //--onChangeState--
        if(this._stateCallbackDict){
            this._stateCallbackDict(this._stateDict);
        }
    }

    this._onChangeState = function(callback){
        this._stateCallbackDict = callback;
    }

    this._removeState = function(key){
        if(key){
            delete this._stateDict[key];
        }else{
            this._stateDict = {};
        }
        //--onChangeState--
        if(this._stateCallbackDict){
            this._stateCallbackDict(this._stateDict);
        }
    }

    this._push = function(){
        this._historyArr[this._currentStep+1] = {};
        this._historyArr[this._currentStep+1].step = this._currentStep+1;
        this._historyArr[this._currentStep+1].stateDict = JSON.parse(JSON.stringify(this._stateDict));
        this._currentStep++;
        
        if(isFunction(this._pushCallback)){
            var param = {
                action: "push",
                step: this._currentStep,
                state: this._historyArr[this._currentStep].stateDict,
            }
            this._pushCallback(param);
        }
        
        //history - push
        var historyState = {};
        historyState["__longstoryjs_historyArr__"] = JSON.stringify(this._historyArr);
        historyState["__longstoryjs_currentStep__"] = this._currentStep;
        //更新網址及瀏覽器狀態
        history.pushState(historyState,"","");

    }
    
    this._pushCallback = null;

    this._onPush = function(callback){
        this._pushCallback = callback;
    }
    
    this._restore = function(action, step){
        if(action == "current"){
            _doRestore(this._currentStep, this._currentStep);
        }else if(action == "back"){
            try {
                if (this._currentStep <= 0){
                    throw new this.StoryError("Go back faild. This is the first step.");
                }
            } catch(e){
                console.log(e.showError())
                return;
            }
            _doRestore(this._currentStep, this._currentStep-1);
        }else if(action == "forward"){
            if(this._historyArr[this._currentStep+1]){//如果下一步的紀錄還在
                _doRestore(this._currentStep, this._currentStep+1);
            }
        }else if(action == "go"){
            if(this._historyArr[step]){//如果下一步的紀錄還在
                _doRestore(this._currentStep, step);
            }
        }
    }

    this._restoreCallback = null;
    
    this._onRestore = function(callback){
        this._restoreCallback = callback;
    }
    
    function _doRestore(originalStep, restoreStep){
        self._currentStep = restoreStep;
        self._stateDict = JSON.parse(JSON.stringify(self._historyArr[restoreStep].stateDict));
        
        //--執行onRestore--
        var param = {
            from: originalStep,
            step: restoreStep,
            state: self._historyArr[restoreStep].stateDict,
        }
        if(isFunction(self._restoreCallback)){
            self._restoreCallback(param);
        }
        //--onChangeState--
        if(this._stateCallbackDict){
            this._stateCallbackDict(this._stateDict);
        }
    }

    this._getHistory = function(){
        return this._historyArr.map(function(dict){
            return {
                step: dict.step,
                state: dict.stateDict,
            }
        })
    }
    
    this.StoryError = function(message) {
        this.name = '[Story] Error';
        this.message = message;
    }
    this.StoryError.prototype = new Error();
    this.StoryError.prototype.constructor = this.StoryError;
    this.StoryError.prototype.showError = function() {
        return this.name + ': "' + this.message + '"';
    }

    function isFunction(fn) {
        return (!!fn&&!fn.nodename&&fn.constructor!=String&&fn.constructor!=RegExp&&fn.constructor!=Array&&/function/i.test(fn+""));
    }
           
}

//---- public ---- 

Longstory.prototype = {}

Longstory.prototype.getState = function(key){
    return this._getState(key);
}

Longstory.prototype.setState = function(key, val){
    this._setState(key, val);
}

Longstory.prototype.onChangeState = function(key, callback){
    this._onChangeState(key, callback);
}

Longstory.prototype.removeState = function(key){
    if(!this._stateDict){
        return;
    }
    this._removeState(key);
}

Longstory.prototype.getStep = function(){
    return this._currentStep;
}

Longstory.prototype.onPush = function(callback){
    this._onPush(callback);
}

Longstory.prototype.push = function(key, val){
    this._push();

    if(key){
        this._setState(key, val);
    }
}



Longstory.prototype.restore = function(move){
    var n = -1;
    
    if(move == 0 || move == "current"){
        n = 0;
    }else if(move == null || move == "back"){
        n = -1;
    }else if(move == "forward"){
        n = 1;
    }else if(!isNaN(move)){
        n = move;
    }
    
    //--history--
    window.history.go(n);
}

Longstory.prototype.onRestore = function(callback){
    this._onRestore(callback);
}

Longstory.prototype.getHistory = function(){
    return this._getHistory();
}

var longstory = new Longstory();

window.longstory = longstory;

window.onpopstate = function(event) {
    var newStep = 0;
    if(history.state){
        if(history.state["__longstoryjs_currentStep__"] != null){
            newStep = history.state["__longstoryjs_currentStep__"];
        }
    }
    var fromStep = longstory.getStep();
    if(newStep-fromStep == -1){
        longstory._restore("back");
    }else if(newStep-fromStep == 1){
        longstory._restore("forward");
    }else{
        longstory._restore("go", newStep);
    }
}

}())


