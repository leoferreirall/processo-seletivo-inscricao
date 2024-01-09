//GTM
var IDGTM="";
var paginaAtual = window.location.hash;

document.addEventListener('click', (e) => {
    if(e.srcElement.hash == "#/painel-do-candidato" || paginaAtual == "#/painel-candidato"){
        window.location.reload();
    }  
})

if(paginaAtual == "#/"){
    IDGTM = "GTM-MBVS65B";
}else if (paginaAtual == "#/painel-do-candidato" || paginaAtual == "#/painel-candidato"){
    IDGTM = "GTM-PV9Q298";
}     

if(IDGTM != ""){
    document.write("<div id='tagGTM'><script>" + (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer', IDGTM) + "</script></div>");
}
//GTM