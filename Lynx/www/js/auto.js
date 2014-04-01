$(function(){
        //��ʼ������
        var li_index = -1;        //li����ֵ
        var search_word = $("#search_word");
        var search_div = $("#search_div");
        var search_ul = $("#search_ul");
        var enter_var = 1; //�س�����(���������Ǻ���������ĸ����enter��enter_var = 1��;���ǰ����¼�Ȼ����enter��enter_var = 2��ѡ��<li>Ԫ��)
        //����div �ؼ�����ʾ��
        search_div
        .css("border","1px solid black")
        .css("position","absolute")
        .css("top",search_word.offset().top+search_word.height()+6+"px")
        .css("left",search_word.offset().left+"px")
        .css("width",search_word.width()+4+"px")
        .hide();
        //�����ʾ����
        var clearContent = function(){
            if(search_ul != null){
                search_ul.find("li").remove();//ɾ��ulԪ���������ӽڵ�
            }
            if(search_div != null){
                search_div.hide();
            }
        }
        //��ʾ����
        var setContent = function(theContent){
            clearContent();
            search_div.show();
            for(str in theContent){
                $("<li>"+theContent[str]+"</li>").appendTo(search_ul);
                //liԪ�ر�����ѡ�� �� ��껬������Ч
                search_ul.find("li").click(function(){
                    search_word.val($(this).text());
                    clearContent();
                }).hover(
                    function () { $(this).addClass("mouseOver");},
                    function () { $(this).removeClass("mouseOver");}
                );
            }
        }
        //ajaxͬ��������
        search_word.keyup(function(event){
            var event = event || window.event;
            var key_code = event.keyCode;
            if((key_code >= 65 && key_code <= 90) || key_code == 8 || key_code == 46 || key_code == 32 || (key_code == 13 && enter_var == 1)){
                if(search_word.val().length > 0){
                    search_str = search_word.val();//�õ��û�����Ĵ�
					//alert(search_str);
                    $.ajax({
                        type : "post",
                        url : "ajax.php",
                        dataType : "json",
                        data : {search_word : search_str},
                        complete : function(data){
							//alert(data);
                            if(data != null){
                                setContent(data);
                            }else if(data == null){
                                clearContent();
                            }
                        }
                    });
					alert(data);
                }else{
                    clearContent();
                }
            }else if(key_code == 38 || key_code == 40){
                if(key_code == 38){//�����ϼ�
                    var autoLiNode = search_ul.find("li");
                    if(li_index != -1){
                        autoLiNode.eq(li_index).removeClass("mouseOver");
                        li_index--;
                    }else{
                        li_index = autoLiNode.length-1;
                    }
                    if(li_index == -1){//������� �����ƶ������һ��
                        li_index = autoLiNode.length-1;
                    }
                    autoLiNode.eq(li_index).addClass("mouseOver");
                    var context = autoLiNode.eq(li_index).text();
                    search_word.val(context);
                    enter_var = 2;
                }else if(key_code == 40){//�����¼�
                    var autoLiNode = search_ul.find("li");
                    if(li_index != -1){
                        autoLiNode.eq(li_index).removeClass("mouseOver");
                    }
                    li_index++;
                    if(li_index == autoLiNode.length){
                        li_index = 0;
                    }
                    autoLiNode.eq(li_index).addClass("mouseOver");
                    var context = autoLiNode.eq(li_index).text();
                    search_word.val(context);
                    enter_var = 2;
                }
            }else if(key_code == 13 && enter_var == 2){//����س�
                if(li_index != -1){
                    var context = search_ul.find("li").eq(li_index).text();
                    clearContent();
                    li_index = -1;
                    search_word.val(context);
                }
                enter_var = 1;
            }
        });
    });