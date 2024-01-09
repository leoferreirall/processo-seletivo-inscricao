"use strict";

var App = {
    initMainPage: function () {
        $('body').Layout();
        $('[data-toggle="push-menu"]').PushMenu('init');
        $('[data-widget="treeview"]').Treeview('init');
        $('.sidebar').overlayScrollbars({});
    },
    clearTags: function(){
        let els = document.getElementsByClassName('tagGTM');

        if(els.length > 0){
            els[0].parentNode.removeChild(els[0]);

            this.clearTags();
        }
    },
    tagFacebookCadastro: function () {
        var head = document.getElementsByTagName('head')[0];

        var script = document.createElement('script');

        script.type = 'text/javascript';

        script.onload = function () {
            callFunctionFromScript();
        }

        script.text = "";

        script.text += "!function(f,b,e,v,n,t,s)"
        script.text += "{if(f.fbq)return;n=f.fbq=function(){n.callMethod?"
        script.text += "n.callMethod.apply(n,arguments):n.queue.push(arguments)};"
        script.text += "if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';"
        script.text += "n.queue=[];t=b.createElement(e);t.async=!0;"
        script.text += "t.src=v;s=b.getElementsByTagName(e)[0];"
        script.text += "s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');"
        script.text += "fbq('init', '1658513827540411');"
        script.text += "fbq('track', 'PageView');"

        head.appendChild(script);

        var noscript = document.createElement('noscript');
        noscript.type = 'text/javascript';

        noscript.text = '<img height="1" width="1" style="display:none"src="https://www.facebook.com/tr?id=1658513827540411&ev=PageView&noscript=1"/>';

        head.appendChild(noscript);
    },
    tagFacebookDadosComplementares: function () {
        var head = document.getElementsByTagName('head')[0];

        var script = document.createElement('script');

        script.type = 'text/javascript';

        script.onload = function () {
            callFunctionFromScript();
        }

        script.text = "";

        script.text += "!function(f,b,e,v,n,t,s)"
        script.text += "{if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};"
        script.text += "if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';"
        script.text += "n.queue=[];t=b.createElement(e);t.async=!0;"
        script.text += "t.src=v;s=b.getElementsByTagName(e)[0];"
        script.text += "s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');"
        script.text += "fbq('init', '1658513827540411');"
        script.text += "fbq('track', 'PageView');"
        script.text += "fbq('track', 'CompleteRegistration');"

        head.appendChild(script);

        var noscript = document.createElement('noscript');

        noscript.text = '<img height="1" width="1" style="display:none"src="https://www.facebook.com/tr?id=1658513827540411&ev=PageView&noscript=1"/>';

        head.appendChild(noscript);
    },
    tagGTMPresencial: function () {
        var head = document.getElementsByTagName('head')[0];

        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.onload = function () {
            callFunctionFromScript();
        };        
        script.className = "tagGTM";
        script.text += "(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':";
        script.text += "new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],";
        script.text += "j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=";
        script.text += "'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);";
        script.text += "})(window,document,'script','dataLayer','GTM-5262TMH');";

        head.appendChild(script);

        let body = document.getElementsByTagName('body')[0];

        let noscript = document.createElement('noscript');
        noscript.id = 'nsPresencial';
        noscript.className = "tagGTM";

        let iframe = document.createElement('iframe');
        iframe.src = 'https://www.googletagmanager.com/ns.html?id=GTM-5262TMH';
        iframe.height = 0;
        iframe.width = 0;
        iframe.style.display = 'none';
        iframe.style.visibility = 'hidden';
        noscript.appendChild(iframe);
        body.appendChild(noscript);
    },
    tagGTMEAD: function () {
        var head = document.getElementsByTagName('head')[0];

        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.onload = function () {
            callFunctionFromScript();
        };
        script.className = "tagGTM";
        script.text += "(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':";
        script.text += "new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],";
        script.text += "j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=";
        script.text += "'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);";
        script.text += "})(window,document,'script','dataLayer','GTM-MXCLCZJ');";

        head.appendChild(script);

        let body = document.getElementsByTagName('body')[0];

        let noscript = document.createElement('noscript');
        noscript.id = 'nsEad';
        noscript.className = "tagGTM";

        let iframe = document.createElement('iframe');
        iframe.src = 'https://www.googletagmanager.com/ns.html?id=GTM-MXCLCZJ';
        iframe.height = 0;
        iframe.width = 0;
        iframe.style.display = 'none';
        iframe.style.visibility = 'hidden';
        noscript.appendChild(iframe);
        body.appendChild(noscript);
    },
    tagGTMMedicina: function () {
        var head = document.getElementsByTagName('head')[0];

        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.onload = function () {
            callFunctionFromScript();
        };
        script.className = "tagGTM";
        script.text += "(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':";
        script.text += "new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],";
        script.text += "j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=";
        script.text += "'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);";
        script.text += "})(window,document,'script','dataLayer','GTM-T8FPBVC');";

        head.appendChild(script);

        let body = document.getElementsByTagName('body')[0];

        let noscript = document.createElement('noscript');
        noscript.id = 'nsMedicina';
        noscript.className = "tagGTM";

        let iframe = document.createElement('iframe');
        iframe.src = 'https://www.googletagmanager.com/ns.html?id=GTM-T8FPBVC';
        iframe.height = 0;
        iframe.width = 0;
        iframe.style.display = 'none';
        iframe.style.visibility = 'hidden';
        noscript.appendChild(iframe);
        body.appendChild(noscript);
    },
    tagGTMVestibular100: function () {
        var head = document.getElementsByTagName('head')[0];

        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.onload = function () {
            callFunctionFromScript();
        };
        script.className = "tagGTM";
        script.text += "(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':";
        script.text += "new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],";
        script.text += "j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=";
        script.text += "'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);";
        script.text += "})(window,document,'script','dataLayer','GTM-W9N7PXP');";

        head.appendChild(script);

        let body = document.getElementsByTagName('body')[0];

        let noscript = document.createElement('noscript');
        noscript.id = 'nsVestibular100';
        noscript.className = "tagGTM";

        let iframe = document.createElement('iframe');
        iframe.src = 'https://www.googletagmanager.com/ns.html?id=GTM-W9N7PXP';
        iframe.height = 0;
        iframe.width = 0;
        iframe.style.display = 'none';
        iframe.style.visibility = 'hidden';
        noscript.appendChild(iframe);
        body.appendChild(noscript);
    }, 
    tagGTMSemidigital: function () {
        var head = document.getElementsByTagName('head')[0];

        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.onload = function () {
            callFunctionFromScript();
        };
        script.className = "tagGTM";
        script.text += "(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':";
        script.text += "new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],";
        script.text += "j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=";
        script.text += "'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);";
        script.text += "})(window,document,'script','dataLayer','GTM-5996JFR');";

        head.appendChild(script);

        let body = document.getElementsByTagName('body')[0];

        let noscript = document.createElement('noscript');
        noscript.id = 'nsSemidigital';
        noscript.className = "tagGTM";

        let iframe = document.createElement('iframe');
        iframe.src = 'https://www.googletagmanager.com/ns.html?id=GTM-5996JFR';
        iframe.height = 0;
        iframe.width = 0;
        iframe.style.display = 'none';
        iframe.style.visibility = 'hidden';
        noscript.appendChild(iframe);
        body.appendChild(noscript);
    },
    tagGTMPosEAD: function () {
        var head = document.getElementsByTagName('head')[0];

        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.onload = function () {
            callFunctionFromScript();
        };
        script.className = "tagGTM";
        script.text += "(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':";
        script.text += "new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],";
        script.text += "j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=";
        script.text += "'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);";
        script.text += "})(window,document,'script','dataLayer','GTM-PZ5PVCV');";

        head.appendChild(script);

        let body = document.getElementsByTagName('body')[0];

        let noscript = document.createElement('noscript');
        noscript.id = 'nsPosEad';
        noscript.className = "tagGTM";

        let iframe = document.createElement('iframe');
        iframe.src = 'https://www.googletagmanager.com/ns.html?id=GTM-PZ5PVCV';
        iframe.height = 0;
        iframe.width = 0;
        iframe.style.display = 'none';
        iframe.style.visibility = 'hidden';
        noscript.appendChild(iframe);
        body.appendChild(noscript);
    },
    tagGTMPresencialIfood: function () {
        var head = document.getElementsByTagName('head')[0];

        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.onload = function () {
            callFunctionFromScript();
        };
        script.className = "tagGTM";
        script.text += "(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':";
        script.text += "new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],";
        script.text += "j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=";
        script.text += "'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);";
        script.text += "})(window,document,'script','dataLayer','GTM-TV2DP2W');";

        head.appendChild(script);

        let body = document.getElementsByTagName('body')[0];

        let noscript = document.createElement('noscript');
        noscript.id = 'nsPresencialIfood';
        noscript.className = "tagGTM";

        let iframe = document.createElement('iframe');
        iframe.src = 'https://www.googletagmanager.com/ns.html?id=GTM-TV2DP2W';
        iframe.height = 0;
        iframe.width = 0;
        iframe.style.display = 'none';
        iframe.style.visibility = 'hidden';
        noscript.appendChild(iframe);
        body.appendChild(noscript);
    },    
    tagGTMEADIfood: function () {
        var head = document.getElementsByTagName('head')[0];

        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.onload = function () {
            callFunctionFromScript();
        };
        script.className = "tagGTM";
        script.text += "(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':";
        script.text += "new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],";
        script.text += "j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=";
        script.text += "'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);";
        script.text += "})(window,document,'script','dataLayer','GTM-TL6N6PL');";

        head.appendChild(script);

        let body = document.getElementsByTagName('body')[0];

        let noscript = document.createElement('noscript');
        noscript.id = 'nsEADIfood';
        noscript.className = "tagGTM";

        let iframe = document.createElement('iframe');
        iframe.src = 'https://www.googletagmanager.com/ns.html?id=GTM-TL6N6PL';
        iframe.height = 0;
        iframe.width = 0;
        iframe.style.display = 'none';
        iframe.style.visibility = 'hidden';
        noscript.appendChild(iframe);
        body.appendChild(noscript);
    },
    tagGTMSemidigitalIfood: function () {
        var head = document.getElementsByTagName('head')[0];

        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.onload = function () {
            callFunctionFromScript();
        };
        script.className = "tagGTM";
        script.text += "(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':";
        script.text += "new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],";
        script.text += "j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=";
        script.text += "'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);";
        script.text += "})(window,document,'script','dataLayer','GTM-NW6M4FM');";

        head.appendChild(script);

        let body = document.getElementsByTagName('body')[0];

        let noscript = document.createElement('noscript');
        noscript.id = 'nsSemidigitalIfood';
        noscript.className = "tagGTM";

        let iframe = document.createElement('iframe');
        iframe.src = 'https://www.googletagmanager.com/ns.html?id=GTM-NW6M4FM';
        iframe.height = 0;
        iframe.width = 0;
        iframe.style.display = 'none';
        iframe.style.visibility = 'hidden';
        noscript.appendChild(iframe);
        body.appendChild(noscript);
    },
    tagTaboola: function () {
        var head = document.getElementsByTagName('head')[0];

        let elTagTaboola = document.getElementById("tagTaboola");
        if (elTagTaboola) head.removeChild(elTagTaboola);


        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.onload = function () {
            script.onload = function () {
                callFunctionFromScript();
                callFunctionFromScript();
            }
        }

        script.id = "tagTaboola";
        script.text = "gtag('event', 'conversion', {'send_to': 'AW-950929710/N82ICPPp2okCEK6SuMUD'});";
        script.text = "_tfa.push({notify: 'event', name: 'lead', id: 1369241});";


        head.appendChild(script);
        head.appendChild(script);
    },
    tagWeach: function (numeroInscricao) {
        let elTagWeach = document.getElementById("tagWeach");
        if (elTagWeach) document.body.removeChild(elTagWeach);

        var trackingPixelIMG = document.createElement('img');
        trackingPixelIMG.setAttribute('src', `https://securewtkr.com/p.ashx?o=1492&e=2&f=img&t=${numeroInscricao}}`);
        trackingPixelIMG.setAttribute('id', `tagWeach`);
        trackingPixelIMG.setAttribute('height', '1');
        trackingPixelIMG.setAttribute('width', '1');
        trackingPixelIMG.setAttribute('border', '0');
        trackingPixelIMG.setAttribute('style', 'display:none');
        document.body.appendChild(trackingPixelIMG);
    },
    tagXTMediaPresencial: function () {
        let elTagTXMedia = document.getElementById("tagXTMediaPresencial");
        if (elTagTXMedia) document.body.removeChild(elTagTXMedia);

        var trackingPixelIMG = document.createElement('img');
        trackingPixelIMG.setAttribute('src', 'https://sp.analytics.yahoo.com/spp.pl?a=10000&.yp=10148088&ea=FAM_EAD-SP2021_FormInscricao');
        trackingPixelIMG.setAttribute('id', 'tagXTMediaPresencial');
        trackingPixelIMG.setAttribute('height', '1');
        trackingPixelIMG.setAttribute('width', '1');
        trackingPixelIMG.setAttribute('border', '0');
        trackingPixelIMG.setAttribute('style', 'display:none');
        document.body.appendChild(trackingPixelIMG);
    },
    tagXTMediaEAD: function () {
        let elTagTXMedia = document.getElementById("tagXTMediaEAD");
        if (elTagTXMedia) document.body.removeChild(elTagTXMedia);

        var trackingPixelIMG = document.createElement('img');
        trackingPixelIMG.setAttribute('src', 'https://sp.analytics.yahoo.com/spp.pl?a=10000&.yp=10148088&ea=FAM_EAD-BR2021_FormInscricao');
        trackingPixelIMG.setAttribute('id', 'tagXTMediaEAD');
        trackingPixelIMG.setAttribute('height', '1');
        trackingPixelIMG.setAttribute('width', '1');
        trackingPixelIMG.setAttribute('border', '0');
        trackingPixelIMG.setAttribute('style', 'display:none');
        document.body.appendChild(trackingPixelIMG);
    }
}