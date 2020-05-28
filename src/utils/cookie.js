const cookie = {
  setCookie(name, value) {
    var exp = new Date();
    exp.setTime(exp.getTime() + 365 * 24 * 60 * 60 * 30 * 1000);
    document.cookie =
      name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/";
  },

  getCookie(name) {
    var arr,
      reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if ((arr = document.cookie.match(reg))) return unescape(arr[2]);
    else return null;
  },
};

export default cookie;
