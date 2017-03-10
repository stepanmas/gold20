"use strict";

class Add {
    constructor($scope, $rootScope, $http, $location, socket, getPrivateData)
    {
        this.params = {
            keyup_delay: 1000
        };
        
        this.io        = socket;
        this.$location = $location;
        this.$http     = $http;
        
        this.bind.bind(this)();
        this.$scope = $scope;
        
        socket.emit('today', getPrivateData());
        
        $scope.getTranslate     = this.getTranslate.bind(this);
        $scope.translated       = [];
        $scope.lingualeo_source = null;
        $scope.loader           = false;
        $scope.save             = $event =>
        {
            this.save.bind(this)($event.currentTarget);
        };
    }
    
    getTranslate()
    {
        if (this._keyup_timer) clearTimeout(this._keyup_timer);
        
        this._keyup_timer = setTimeout(
            () =>
            {
                this.$scope.loader = true;
                this.$scope.$digest();
                
                if (this.$scope.phrase.length > 1)
                    this.io.emit('translate', this.$scope.phrase);
            },
            this.params.keyup_delay
        );
    }
    
    bind()
    {
        this.io.on(
            'translated',
            r =>
            {
                this.$scope.loader = false;
                
                if (!r || r.length < 3)
                {
                    console.error(r);
                    return;
                }
                
                for (let option of r)
                {
                    if (option.transcription)
                    {
                        this.$scope.lingualeo_source = option;
                        break;
                    }
                }
                
                console.log(r);
                
                this.$scope.translated = r;
                this.$scope.$digest();
            }
        );
    }
    
    normalizeData(result, data)
    {
        let res = null;
        let ll  = this.$scope.lingualeo_source;
        
        data = JSON.parse(data);
        
        res = {
            original     : this.$scope.phrase,
            transcription: data.transcription || ll.transcription,
            translate    : result,
            example      : this.$scope.example,
            sound        : data.sound_url || ll.sound_url,
            imagine      : data.pic_url || ll.pic_url
        };
        
        return res;
    }
    
    save(element)
    {
        let data = this.normalizeData(element.dataset.result, element.dataset.source);
    
        this.io.emit('add_word', data);
    }
}

export default Add;