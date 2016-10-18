const base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const base64DecodeChars = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57,
  58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0,  1,  2,  3,  4,  5,  6,
  7,  8,  9,  10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
  25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
  37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1,
  -1, -1];

let token = sessionStorage.userToken;
if(location.pathname != '/login' && !token){
  location.href = '/login';
}

const csTools = {
  token: token,
  setNunjucksTmp: (options) => {
    const tpl_pay_template = $(options.tmpSelector).html();
    const html = nunjucks.renderString(tpl_pay_template, {data: options.data});
    const index_container = $(options.boxSelector);

    if(options.isAppend){
      index_container.append(html);
    }else{
      index_container.html(html);
    }
    if(options.callback){
      options.callback();
    }
  },
  setPagination: (options) => {
    let _pagination = $('.pagination');
    _pagination.empty();
    let li_upnext = '<li class="pageUp"><a href="javascript:void(0);">&laquo;</a></li>'
                  + '<li class="pageNext"><a href="javascript:void(0);">&raquo;</a></li>';
    _pagination.append(li_upnext);
    for (let i = 1; i <= options.pageNum; i++) {
      let html = '<li><a href="javascript:void(0);">'+ i +'</a></li>';
      $(".pageNext").before(html);
    }
    $(".pagination li:eq(1)").addClass('active');
    $(".pagination").on("click", "li", function() {
      let _self = $(this);
      let _index = _self.index();
      console.log(_index);
      if (!_self.hasClass("pageUp") && !_self.hasClass("pageNext")) {
        $(".pagination li").removeClass('active');
        _self.addClass('active');
        if(options.pageCallback){
          options.pageCallback(_index);
        }
      } else {

        // 上一页
        if(_index == 0) {
          // if(options.upCallback){
            let num = $(".pagination li.active").index();
            let _index = num - 1;
            if (_index != 0) {
              console.log(_index);
              $(".pagination li").removeClass('active').eq(_index).addClass('active');
              options.pageCallback(_index);
            }
          // }
        }

        // 下一页
        if (_index > options.pageNum) {
          // if (options.nextCallback) {
            let num = $(".pagination li.active").index();
            let _index = num + 1;
            if (_index != 0) {
              console.log(_index);
              $(".pagination li").removeClass('active').eq(_index).addClass('active');
              options.pageCallback(_index);
            }
          // }
        }
      }
    });

    // $(".pageUp").on("click", function() {
    //   // var
    //   console.log($(".pagination li.active").index());
    //
    // });
  },
  msgModalShow: (options) => {
    if(!options.msg){
      options.msg = '未知错误';
    }
    $('.js-modal-message').html(options.msg);
    if(options.href){
      $('.js-btn-close').on('click', function(){
        location.href = options.href;
      });
    }
    $('#messageModal').modal();
  },
  base64encode: (str) => {
    let out,i,len,base64EncodeChars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let c1,c2,c3;
    len=str.length;
    i=0;
    out="";
    while(i<len){
      c1=str.charCodeAt(i++)&0xff;
      if(i==len){
        out+=base64EncodeChars.charAt(c1>>2);
        out+=base64EncodeChars.charAt((c1&0x3)<<4);
        out+="==";
        break;
      }
      c2=str.charCodeAt(i++);
      if(i==len){
        out+=base64EncodeChars.charAt(c1>>2);
        out+=base64EncodeChars.charAt(((c1&0x3)<<4)|((c2&0xF0)>>4));
        out+=base64EncodeChars.charAt((c2&0xF)<<2);
        out+="=";
        break;
      }
      c3=str.charCodeAt(i++);
      out+=base64EncodeChars.charAt(c1>>2);
      out+=base64EncodeChars.charAt(((c1&0x3)<<4)|((c2&0xF0)>>4));
      out+=base64EncodeChars.charAt(((c2&0xF)<<2)|((c3&0xC0)>>6));
      out+=base64EncodeChars.charAt(c3&0x3F);
    }
    return out;

  },
  base64decode: (str) => {
    let c1,c2,c3,c4,base64DecodeChars=new Array(-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,62,-1,-1,-1,63,52,53,54,55,56,57,58,59,60,61,-1,-1,-1,-1,-1,-1,-1,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,-1,-1,-1,-1,-1,-1,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,-1,-1,-1,-1,-1);
    let i,len,out;
    len=str.length;
    i=0;
    out="";
    while(i<len){
      /* c1 */
      do{
        c1=base64DecodeChars[str.charCodeAt(i++)&0xff];
      }while(i<len&&c1==-1);
      if(c1==-1) break;

      /* c2 */
      do{
        c2=base64DecodeChars[str.charCodeAt(i++)&0xff];
      }while(i<len&&c2==-1);
      if(c2==-1) break;
      out+=String.fromCharCode((c1<<2)|((c2&0x30)>>4));
      /* c3 */
      do{
        c3=str.charCodeAt(i++)&0xff;
        if(c3==61) return out;
        c3=base64DecodeChars[c3];
      }while(i<len&&c3==-1);
      if(c3==-1) break;
      out+=String.fromCharCode(((c2&0XF)<<4)|((c3&0x3C)>>2));
      /* c4 */
      do{
        c4=str.charCodeAt(i++)&0xff;
        if(c4==61) return out;
        c4=base64DecodeChars[c4];
      }while(i<len&&c4==-1);
      if(c4==-1) break;
      out+=String.fromCharCode(((c3&0x03)<<6)|c4);
    }
    return out;
  },
  utf16to8: (str) => {
    var out,i,len,c;
    out="";
    len=str.length;
    for (i=0;i<len;i++){
      c=str.charCodeAt(i);
      if((c>=0x0001)&&(c<=0x007F)){
        out+=str.charAt(i);
      } else if(c>0x07FF){
        out+=String.fromCharCode(0xE0|((c>>12)&0x0F));
        out+=String.fromCharCode(0x80|((c>>6)&0x3F));
        out+=String.fromCharCode(0x80|((c>>0)&0x3F));
      } else {
        out+=String.fromCharCode(0xC0|((c>>6)&0x1F));
        out+=String.fromCharCode(0x80|((c>>0)&0x3F));
      }
    }
    return out;
  },
  utf8to16: (str) => {
    var out,i,len,c;
    var char2,char3;
    out="";
    len=str.length;
    i=0;
    while(i<len){
      c=str.charCodeAt(i++);
      switch (c>>4){
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
          // 0xxxxxxx
          out+=str.charAt(i-1);
          break;
        case 12:
        case 13:
          // 110x xxxx   10xx xxxx
          char2=str.charCodeAt(i++);
          out+=String.fromCharCode(((c&0x1F)<<6)|(char2&0x3F));
          break;
        case 14:
          // 1110 xxxx  10xx xxxx  10xx xxxx
          char2=str.charCodeAt(i++);
          char3=str.charCodeAt(i++);
          out+=String.fromCharCode(((c&0x0F)<<12)|((char2&0x3F)<<6)|((char3&0x3F)<<0));
          break;
      }
    }
    return out;
  },
};
