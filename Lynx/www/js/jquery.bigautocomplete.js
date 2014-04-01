(function($){

	var bigAutocomplete = new function(){
		this.currentInputText = null;//Ŀǰ��ù�������򣨽��һ��ҳ�����������Զ���ȫ���ܣ�
		this.functionalKeyArray = [9,20,13,16,17,18,91,92,93,45,36,33,34,35,37,39,112,113,114,115,116,117,118,119,120,121,122,123,144,19,145,40,38,27];//�����Ϲ��ܼ���ֵ����
		this.holdText = null;//�������ԭʼ���������
		
		//��ʼ�������Զ���ȫdiv������documentע��mousedown�������div��������div
		this.init = function(){
			$("body").append("<div id='bigAutocompleteContent' class='bigautocomplete-layout'></div>");
			$(document).bind('mousedown',function(event){
				var $target = $(event.target);
				if((!($target.parents().andSelf().is('#bigAutocompleteContent'))) && (!$target.is(bigAutocomplete.currentInputText))){
					bigAutocomplete.hideAutocomplete();
				}
			})
			
			//�����ͣʱѡ�е�ǰ��
			$("#bigAutocompleteContent").delegate("tr", "mouseover", function() {
				$("#bigAutocompleteContent tr").removeClass("ct");
				$(this).addClass("ct");
			}).delegate("tr", "mouseout", function() {
				$("#bigAutocompleteContent tr").removeClass("ct");
			});		
			
			
			//����ѡ���к�ѡ�����������õ�������У���ִ��callback����
			$("#bigAutocompleteContent").delegate("tr", "click", function() {
				bigAutocomplete.currentInputText.val( $(this).find("div:last").text());
				var callback_ = bigAutocomplete.currentInputText.data("config").callback;
				if($("#bigAutocompleteContent").css("display") != "none" && callback_ && $.isFunction(callback_)){
					callback_($(this).data("jsonData"));
					
				}				
				bigAutocomplete.hideAutocomplete();
			})			
			
		}
		
		this.autocomplete = function(param){
			
			if($("body").length > 0 && $("#bigAutocompleteContent").length <= 0){
				bigAutocomplete.init();//��ʼ����Ϣ
			}			
			
			var $this = $(this);//Ϊ���Զ���ȫ���ܵ������jquery����
			
			var $bigAutocompleteContent = $("#bigAutocompleteContent");
			
			this.config = {
			               //width:������Ŀ�ȣ�Ĭ��ʹ���������
			               width:0,//�߿�Ҳ����
			               //url����ʽurl:""����ajax��̨��ȡ���ݣ����ص����ݸ�ʽΪdata����һ��
			               url:null,
			               /*data����ʽ{data:[{title:null,result:{}},{title:null,result:{}}]}
			               url��data����ֻ��һ����Ч��data����*/
			               data:null,
			               //callback��ѡ���к󰴻س��򵥻�ʱ�ص��ĺ���
			               callback:null};
			               
			$.extend(this.config,param);
			
			$this.data("config",this.config);
			//console.log(this.config);
			//�����keydown�¼�
			$this.keydown(function(event) {
				switch (event.keyCode) {
				case 40://���¼�
					
					if($bigAutocompleteContent.css("display") == "none")return;
					
					var $nextSiblingTr = $bigAutocompleteContent.find(".ct");
					if($nextSiblingTr.length <= 0){//û��ѡ����ʱ��ѡ�е�һ��
						$nextSiblingTr = $bigAutocompleteContent.find("tr:first");
					}else{
						$nextSiblingTr = $nextSiblingTr.next();
					}
					$bigAutocompleteContent.find("tr").removeClass("ct");
					
					if($nextSiblingTr.length > 0){//����һ��ʱ���������һ�У�
						$nextSiblingTr.addClass("ct");//ѡ�е��мӱ���
						$this.val($nextSiblingTr.find("div:last").text());//ѡ�����������õ��������
						
						//div������ѡ�е���,jquery-1.6.1 $nextSiblingTr.offset().top ��bug����ֵ������
						$bigAutocompleteContent.scrollTop($nextSiblingTr[0].offsetTop - $bigAutocompleteContent.height() + $nextSiblingTr.height() );
						
					}else{
						$this.val(bigAutocomplete.holdText);//�������ʾ�û�ԭʼ�����ֵ
					}
					
					
					break;
				case 38://���ϼ�
					if($bigAutocompleteContent.css("display") == "none")return;
					
					var $previousSiblingTr = $bigAutocompleteContent.find(".ct");
					if($previousSiblingTr.length <= 0){//û��ѡ����ʱ��ѡ�����һ����
						$previousSiblingTr = $bigAutocompleteContent.find("tr:last");
					}else{
						$previousSiblingTr = $previousSiblingTr.prev();
					}
					$bigAutocompleteContent.find("tr").removeClass("ct");
					
					if($previousSiblingTr.length > 0){//����һ��ʱ�����ǵ�һ�У�
						$previousSiblingTr.addClass("ct");//ѡ�е��мӱ���
						$this.val($previousSiblingTr.find("div:last").text());//ѡ�����������õ��������
						
						//div������ѡ�е���,jquery-1.6.1 $$previousSiblingTr.offset().top ��bug����ֵ������
						$bigAutocompleteContent.scrollTop($previousSiblingTr[0].offsetTop - $bigAutocompleteContent.height() + $previousSiblingTr.height());
					}else{
						$this.val(bigAutocomplete.holdText);//�������ʾ�û�ԭʼ�����ֵ
					}
					
					break;
				case 27://ESC������������
					
					bigAutocomplete.hideAutocomplete();
					break;
				}
			});		
			
			//�����keyup�¼�
			$this.keyup(function(event) {
				var k = event.keyCode;
				var ctrl = event.ctrlKey;
				var isFunctionalKey = false;//���µļ��Ƿ��ǹ��ܼ�
				for(var i=0;i<bigAutocomplete.functionalKeyArray.length;i++){
					if(k == bigAutocomplete.functionalKeyArray[i]){
						isFunctionalKey = true;
						break;
					}
				}
				//k��ֵ���ǹ��ܼ�����ctrl+c��ctrl+xʱ�Ŵ����Զ���ȫ����
				if(!isFunctionalKey && (!ctrl || (ctrl && k == 67) || (ctrl && k == 88)) ){
					var config = $this.data("config");
					
					var offset = $this.offset();
        					
                    width_ = 0;
                    try{
                        width_ =  parseInt(config.width,10);
                    }catch(ex){
                        width_ = config.width;
                    }
					
					$bigAutocompleteContent.width(width_<= 0?$this.outerWidth()-2:config.width);
					var h = $this.outerHeight() - 1;
					$bigAutocompleteContent.css({"top":offset.top + h,"left":offset.left});
					
					var data = config.data;
					var url_ = config.url;
					var keyword_ = $.trim($this.val());
					//alert(url_);
					if(keyword_ == null || keyword_ == ""){
						bigAutocomplete.hideAutocomplete();
						return;
					}					
					if(data != null && $.isArray(data) ){
						var data_ = new Array();
						for(var i=0;i<data.length;i++){
							if(data[i].title.indexOf(keyword_) > -1){
								data_.push(data[i]);
							}
						}
						
						makeContAndShow(data_);
					}else if(url_ != null && url_ != ""){//ajax��������

						//alert(url_);
						$.post(url_,{keyword:keyword_},function(result){
							//gobal = result;
							//alert(result.data);
							result = $.parseJSON(result);
							makeContAndShow(result.data);
						});
					}
					
					bigAutocomplete.holdText = $this.val();
				}
				//�س���
				if(k == 13){
					var callback_ = $this.data("config").callback;
					if($bigAutocompleteContent.css("display") != "none"){
						if(callback_ && $.isFunction(callback_)){
							callback_($bigAutocompleteContent.find(".ct").data("jsonData"));
						}
						$bigAutocompleteContent.hide();						
					}
				}
				
			});	
					
			//��װ������html���ݲ���ʾ
			function makeContAndShow(data_){
				//alert(data_);
				
				if(data_ == null || data_.length <=0 ){
				    $bigAutocompleteContent.hide(); 
					return;
				}
				
				var cont = "<table><tbody>";
				for(var i=1;i<data_.length;i++){
					//alert(data_[i].tittle);
					cont += '<tr><td><div><span style="font-family:Arial">' + data_[0].title + '<strong>' + data_[i].title.split(data_[0].title)[1] + '</strong></span></div></td></tr>'
				}
				cont += "</tbody></table>";
				$bigAutocompleteContent.html(cont);
				$bigAutocompleteContent.show();
				
				//ÿ��tr�����ݣ����ظ��ص�����
				$bigAutocompleteContent.find("tr").each(function(index){
					$(this).data("jsonData",data_[index]);
				})
			}			
					
			
			//�����focus�¼�
			$this.focus(function(){
				bigAutocomplete.currentInputText = $this;
			});
			
		}
		//����������
		this.hideAutocomplete = function(){
			var $bigAutocompleteContent = $("#bigAutocompleteContent");
			if($bigAutocompleteContent.css("display") != "none"){
				$bigAutocompleteContent.find("tr").removeClass("ct");
				$bigAutocompleteContent.hide();
			}			
		}
		
	};
	
	
	$.fn.bigAutocomplete = bigAutocomplete.autocomplete;
	
})(jQuery)