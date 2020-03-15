window.onload = function(){

    if( window.location.href =="https://sanjabozovic.github.io/Flourish-and-Blotts" || window.location.href == "https://sanjabozovic.github.io/Flourish-and-Blotts/index.html") {
    menu();
    scrollMenu();
    
    $.ajax({
        url: "data/knjige.json",
        method: "GET",
        type: "json",
        success: function(data){
            dohvatiKnjige();
            ispisBestselera(data);
            ispisZanrova(data);
        },
        error: function(err){
            console.error(err);
        }
    });

    document.querySelector("#sort").addEventListener("change", sortiranje);


    for(let i=0; i<=18; i++){
        if(window.location.href == `https://sanjabozovic.github.io/Flourish-and-Blotts/knjiga.html?id=${i}`){
            filtriranaKnjiga();
        }
    }
}

}


function menu(){
    var menuLinks = ["Početna", "O knjižari", "Proizvodi", "Kontakt", "O meni"];
    var menuWhere = document.getElementById("menu");
      
    for(var i=0; i<menuLinks.length; i++){
        var MenuA = document.createElement("a");
        MenuA.id = "scrl"+ i;
        MenuA.innerHTML= menuLinks[i];
        menuWhere.appendChild(MenuA);
    }
}

function scrollMenu(){
    $("#scrl0").click(function() {
        $([document.documentElement, document.body]).animate({
            scrollTop: $("index.html").offset().top
        }, 1000);
      });
  
      $("#scrl1").click(function() {
        $([document.documentElement, document.body]).animate({
            scrollTop: $("#about").offset().top
        }, 1000);
      });
  
      $("#scrl2").click(function() {
        $([document.documentElement, document.body]).animate({
            scrollTop: $("#sorting").offset().top
        }, 1000);
      });

      $("#scrl3").click(function() {
        $([document.documentElement, document.body]).animate({
            scrollTop: $("#form").offset().top
        }, 1000);
      });

      $("#scrl4").click(function() {
        $([document.documentElement, document.body]).animate({
            scrollTop: $("#author").offset().top
        }, 1000);
      });
}


var zanroviNiz = [];
function ispisZanrova(knjige){
    let ispis = `<select id='zanr'><option value='0'>Izaberite...</option>`;
    for(let k of knjige) {
        for(let z of k.zanrovi){
            if (!zanroviNiz.includes(z.id)){
                zanroviNiz.push(z.id);
                ispis += `<option value='${z.id}'>${z.zanrNaziv}</option>`;
            }
            
        }
    }
    ispis += "</select>";

    document.querySelector("#filter").innerHTML += ispis;

    document.querySelector("#zanr").addEventListener("change", function() {
        Number(this.value) ? filtrirajPoZanru(this.value) : dohvatiKnjige();
    });


}

var filtr = [];

function filtrirajPoZanru(zanrId) {
    $.ajax({
        url : "data/knjige.json",
        method : "GET",
        type : "json",
        success : function(data) {
                const filtrirano = data.filter(f=>{
                    return f.zanrovi.some(zanr => {
                            if(zanr.id==zanrId){
                                return true;
                                
                            }
                    })
                })
                filtr.push(filtrirano);
                ispisKnjiga(filtrirano);
        },
        error : function(xhr, error, status) {
            alert(status);
        }
    });
}

function sortiranje() {
    const kliknuto = this.value;
    $.ajax({
        url: "data/knjige.json",
        method: "GET",
        type: "json",
        success: function(knjige){
            if(filtr.length > 0){
                filtr.forEach(el => {
                    if(kliknuto == "odAdoZ"){
                        el.sort((a,b) => {
                            if(a.naziv == b.naziv)
                                return 0;
                            return a.naziv > b.naziv ? 1 : -1;
                        })
                        ispisKnjiga(el);
                    }
                    else if(kliknuto == "cenaRastuce"){
                        el.sort((a,b) =>{
                            if(a.cena == b.cena)
                                return 0;
                            return a.cena > b.cena ? 1 : -1;
                        })
                        ispisKnjiga(el);
                    }
                    else if(kliknuto == "cenaOpadajuce"){
                        el.sort((a,b) =>{
                            if(a.cena == b.cena)
                                return 0;
                            return a.cena > b.cena ? -1 : 1;
                        })
                        ispisKnjiga(el);
                    }
                    else if(kliknuto == "godinaIzdanja"){
                        el.sort((a,b) => {
                            const datum1 = new Date(a.godinaIzdanja);
                            const datum2 = new Date(b.godinaIzdanja);
        
                            return Date.UTC(datum2.getFullYear() - Date.UTC(datum1.getFullYear()));
                        })
                        ispisKnjiga(el);
                    }
                    else {
                        ispisKnjiga(el);
                    }
                });
            }
           else{

            if(kliknuto == "odAdoZ"){
                knjige.sort((a,b) => {
                    if(a.naziv == b.naziv)
                        return 0;
                    return a.naziv > b.naziv ? 1 : -1;
                })
                ispisKnjiga(knjige);
            }
            else if(kliknuto == "cenaRastuce"){
                knjige.sort((a,b) =>{
                    if(a.cena == b.cena)
                        return 0;
                    return a.cena > b.cena ? 1 : -1;
                })
                ispisKnjiga(knjige);
            }
            else if(kliknuto == "cenaOpadajuce"){
                knjige.sort((a,b) =>{
                    if(a.cena == b.cena)
                        return 0;
                    return a.cena > b.cena ? -1 : 1;
                })
                ispisKnjiga(knjige);
            }
            else if(kliknuto == "godinaIzdanja"){
                knjige.sort((a,b) => {
                    const datum1 = new Date(a.godinaIzdanja);
                    const datum2 = new Date(b.godinaIzdanja);

                    return Date.UTC(datum2.getFullYear() - Date.UTC(datum1.getFullYear()));
                })
                ispisKnjiga(knjige);
            }
            else {
                ispisKnjiga(knjige);
            }}
        },
        error: function(err){
            console.error(err);
        }
    })
}



function dohvatiKnjige() {
    $.ajax({
        url : "data/knjige.json",
        method : "GET",
        type : "json",
        success : function(data) {
            ispisKnjiga(data);
        },
        error : function(xhr, error, status) {
            alert(status);
        }
    });
}

function ispisKnjiga(knjige){
    let ispis = "";
    
    for(k of knjige){
        if (k.bestseler == false){
            ispis += `
            <article class="autori">
                <a href="knjiga.html?id=${k.id}"><img src="${k.slika}" alt="${k.naziv}"></a>
                <h4>${k.naziv}</h4>
                <p>${k.autor}</p>
                <p>${k.cena} dinara</p>
            </article>
            `
        }
    }
    document.getElementById("displayProducts").innerHTML = ispis;
   
}

function ispisBestselera(bestseleri){
    let ispis = `<h2 class="middle">Bestseleri</h2>`;
    for(b of bestseleri){
        if(b.bestseler == true){
            ispis += `
            <article class="bestSeler">
                <h3>${b.naziv}</h3>
                <p>${b.autor}</p>
                <a href="#"><img src="${b.slika}" alt="${b.naziv}"></a>
                <p>${b.cena} dinara</p>
            </article>
            `
        }
    }
    document.querySelector("#left").innerHTML = ispis;


}

if( window.location.href =="http://127.0.0.1:8887" || window.location.href == "http://127.0.0.1:8887/index.html"){
var messageOkay = document.getElementById("messageAccept");

function accept() {

  
  var correct = true;
  messageOkay.innerHTML="";
  var reName = /^[A-ZŽŠĐČĆ][a-zšđčćž]{2,10}$/;
  var reSurname = /^([A-ZŽŠĐČĆ][a-zšđčćž]{2,16})(\s[AZŽŠĐČĆ][a-zšđčćž]{2,16})*$/;
  var reEmail = /^\w+([\.\-]\w+)*@\w+([\.\-]\w+)*(\.\w{2,4})+$/;
  var name = document.querySelector("#name").value.trim();
  var surname = document.querySelector("#surname").value.trim();
  var email = document.querySelector("#email").value.trim();
  var message = document.querySelector("#message").value.trim();

  if(!reName.test(name)) {
    document.querySelector("#name").classList.add("border");
    correct = false;
    } else{
   
   document.querySelector("#name").classList.remove("border");
    }

  if(!reSurname.test(surname)) {
   
   document.querySelector("#surname").classList.add("border");
    correct = false;
    } else{
      document.querySelector("#surname").classList.remove("border");
    }

    if(!reEmail.test(email)) {

      document.querySelector("#email").classList.add("border");
      correct = false;
    } else {
      document.querySelector("#email").classList.remove("border");
    }

    if(message == ""){
      document.querySelector("#message").classList.add("border");
      correct = false;
    } else{
      document.querySelector("#message").classList.remove("border");
    }

    
    if(correct){
      messageOkay.innerHTML="Poruka je poslata!";
      messageOkay.style.color="green";

      if(localStorage){
        localStorage.setItem("name",name);
        localStorage.setItem("surname",surname);
        localStorage.setItem("email",email);
        }
        else{
        console.log("Local storage is not supported");
        }
       
        }

        else{
          messageOkay.innerHTML="Upišite sve podatke ili proverite da li su podaci ispravno napisani.";
          messageOkay.style.color="red";

        }
  }
       document.getElementsByName("send")[0].addEventListener("click", accept);


}

       // Knjiga.html


       function obrada(data){
        let ispis = "";
        data.forEach((element, i) => {
            if(typeof element == "object"){
                i == 0 ? ispis += element.zanrNaziv : ispis += ", " + element.zanrNaziv;
            }
            else {
                i == 0 ? ispis += element : ispis += ", " + element;
            }
        })
    
        return ispis;
    }

       

    function knjigaPosebno(knjiga){
        let ispis = "";
        let niz = knjiga.slice(0, 1);
    
        niz.forEach(element =>{
            ispis += `<div id="content">
                            <h1>${element.naziv}</h1>
                            <p>Release Date: ${datum(element.datum)}</p>
                        </div>
                        <div id="image">
                            <img src="${element.slika}" alt="${element.naziv}" />
                            <p>${element.opis}</p>
                        </div>`
        })
    
        document.getElementById("knjiga").innerHTML = ispis;

    function filtriranaKnjiga(){
        var url = window.location.href;
        var idKnjige = url.split("?")[1].split("=")[1];
    


        dohvatiKnjige(
            function(knjige){
                const filtrirano = knjige.filter(el => el.id == idKnjige);
    
                knjigaPosebno(filtrirano);
            }
        )
    }
    }


    