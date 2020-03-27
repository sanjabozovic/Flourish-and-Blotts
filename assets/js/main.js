$(document).ready(function(){
    menu();
    scrollMenu();

    dohvatiKnjige(
        function(knjige){
            ispisBestselera(knjige);
            ispisKnjiga(knjige);
            ispisZanrova(knjige);
        }
    )
   
    document.querySelector("#sort").addEventListener("change", sortiranje);


    
        
   
})

function dohvatiKnjige(success) {
    $.ajax({
        url: "data/knjige.json",
        method: "GET",
        success: success
    });
}

function menu(){
    var menuLinks = ["Početna", "Knjige", "Kontakt", "O meni"];
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
            scrollTop: $("#sorting").offset().top
        }, 1000);
      });
  
      $("#scrl2").click(function() {
        $([document.documentElement, document.body]).animate({
            scrollTop: $("#form").offset().top
        }, 1000);
      });

      $("#scrl3").click(function() {
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
        Number(this.value) ? filtrirajPoZanru(this.value) : dohvatiKnjige(function(knjige){ispisKnjiga(knjige)});
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
                dohvatiKnjige(function(knjige){ispisKnjiga(knjige)});
            }}
        },
        error: function(err){
            console.error(err);
        }
    })
}





function obradaZanra(k){
    let ispis = "";
    k.forEach((el, i) => {
        if(typeof el == "object"){
            i == 0 ? ispis += el.zanrNaziv : ispis += ", " + el.zanrNaziv;
        }
        else {
            i == 0 ? ispis += el : ispis += ", " + el;
        }
    })

    return ispis;
}

function ispisKnjiga(knjige){
    let ispis = "";
    
    for(k of knjige){
        if (k.bestseler == false){
            ispis += `
            <article class="autori">
                <img src="${k.slika}" alt="${k.naziv}">
                <h4>${k.naziv}</h4>
                ${k.autor} </br>
                ${k.cena} dinara </br>
                <button id="details${k.id}" class="details" onclick="prikazi(${k.id})" style="cursor:pointer;">Detalji</button>
                <div id="knjigaOkvir${k.id}" class="modal">
                    <div class="knjigaPosebno">
                        <span class="close" id="btn${k.id}"">&times;</span>
                        <div class="flexBook">
                            <div><h2>${k.naziv}</h2> </br>
                            <img src="${k.slika}" alt="${k.naziv}"> </br></br>
                            <b>Autor</b>: ${k.autor} </br></br>
                            <b>Godina izdanja</b>: ${k.godinaIzdanja} </br></br></div>
                            <div class="smaller"><b>Cena</b>: ${k.cena} dinara </br></br>
                            <b>Žanr</b>: ${obradaZanra(k.zanrovi)} </br></br>
                            <b>Pismo</b>: ${k.pismo} </br></br>
                            <b>Format</b>:${k.format}  </br></br>
                            <b>Opis</b>: ${k.opis} </br></br>
                            <button class="cart" data-id="${k.id}" onclick="addToCart(${k.id})">Dodaj u korpu</button>
                        </div>
                    </div>
                </div>
            </article>
            `
        }
    }
    document.getElementById("displayProducts").innerHTML = ispis;
}

function prikazi(id){
   dohvatiKnjige(function(knjige){
       for(let k of knjige){
        if(id==k.id){ 
            var modalID = "knjigaOkvir"+k.id;
            var modal = document.getElementById(modalID);
            var btnID = "btn"+k.id;
            var btn = document.getElementById(btnID);
            btn.onclick = function() {
                modal.style.display = "none";
            }
            modal.style.display="block";
       }
       }
   })
}
    

function ispisBestselera(bestseleri){
    let ispis = `<h2 class="middle">Bestseleri</h2>`;
    for(b of bestseleri){
        if(b.bestseler == true){
            ispis += `
            <article class="bestSeler">
                <h3>${b.naziv}</h3>
                <p>${b.autor}</p>
                <img src="${b.slika}" alt="${b.naziv}">
                <p>${b.cena} dinara</p>
                <button id="details${b.id}" onclick="prikazi(${b.id})" style="cursor:pointer;" class="details">Detalji</button>
                    <div id="knjigaOkvir${b.id}" class="modal">
                        <div class="knjigaPosebno">
                            <span class="close" id="btn${b.id}">&times;</span>
                            <div class="flexBook">
                                <div><h2>${b.naziv}</h2> </br>
                                <img src="${b.slika}" alt="${b.naziv}"> </br></br>
                                <b>Autor</b>: ${b.autor} </br></br>
                                <b>Godina izdanja</b>: ${b.godinaIzdanja} </br></br></div>
                                <div class="smaller"><b>Cena</b>: ${b.cena} dinara </br></br>
                                <b>Žanr</b>: ${obradaZanra(b.zanrovi)} </br></br>
                                <b>Pismo</b>: ${b.pismo} </br></br>
                                <b>Format</b>:${b.format}  </br></br>
                                <b>Opis</b>: ${b.opis}  </br></br>
                                <button class="cart" data-id="${b.id}" onclick="addToCart(${b.id})">Dodaj u korpu</button> </div>
                            </div>
                        </div>
                    </div>
            </article>
            `
        }
    }
    document.querySelector("#left").innerHTML = ispis;


}


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


       //shopping cart

      

       function openCart(){
            var modal = document.getElementById("okvir");
            var btn = document.getElementById("zatvorii");
            btn.onclick = function() {
                modal.style.display = "none";
            }
            modal.style.display="block";
       }
    
    
    function addToCart(id) {
        var knjige = JSON.parse(localStorage.getItem("knjige"));
    
        if(knjige) {
            if(productsAlreadyInCart()) {
                var knjige = JSON.parse(localStorage.getItem("knjige"));
                 for(let k in knjige){
                    if(knjige[k].id == id) {
                        knjige[k].quantity++;
                        break;
                    }      
            }
            localStorage.setItem("knjige", JSON.stringify(knjige));
            } else {
                var knjige = JSON.parse(localStorage.getItem("knjige"));
                knjige.push({
                    id : id,
                    quantity : 1
                });
                localStorage.setItem("knjige", JSON.stringify(knjige));
            }
        } else {
            var knjige = [];
            knjige[0] = {
                id : id,
                quantity : 1
            };
            localStorage.setItem("knjige", JSON.stringify(knjige));
        }
    
        
        function productsAlreadyInCart(){
            return knjige.filter(f => f.id == id).length;
        }

        alert("Knjiga je uspešno dodata u korpu!");
        
        location.reload();
    }
    

    //-------------------------------


    var knjige = JSON.parse(localStorage.getItem("knjige"));
        
    if(!knjige || knjige===null){
        $("#cartInside").html("<h1>Vaša korpa je prazna!</h1>");
    }else{
        prikaziUKorpi();  
    }

    
    function prikaziUKorpi() {
        var knjige = JSON.parse(localStorage.getItem("knjige"));

        dohvatiKnjige(function(data){
            
                data = data.filter(p => {
                    for(let prod of knjige)
                    {
                        if(p.id == prod.id) {
                            p.quantity = prod.quantity;
                            return true;
                        }
                            
                    }
                    return false;
                });
                ispisiUKorpi(data);
        })
    }

    function ispisiUKorpi(knjige) {
        if(!knjige.length){
            $("#cartInside").html("<h2>Vaša korpa je prazna!</h2>");
        }else{
        let html = `
                <table id="cartTable">
                    <thead>
                        <tr id="zaglavlje">
                            <th>Knjiga</th>
                            <th>Naziv</th>
                            <th>Cena</th>
                            <th>Količina</th>
                            <th>Ukupno</th>
                            <th>Ukloni</th>
                        </tr>
                    </thead>
                    <tbody>`;
                    
        for(let p of knjige) {
            html += `<tr class="knj">
                        <td>
                            <img src="${p.slika}" alt="${p.naziv}"">
                        </td>
                        <td><h4 class="hide">Naziv:</h4>${p.naziv}</td>
                        <td><h4 class="hide">Cena:</h4>${p.cena} dinara</td>
                        <td><h4 class="hide">Količina:</h4>${p.quantity}</td>
                        <td><h4 class="hide">Ukupno:</h4>${p.cena * p.quantity} dinara</td>
                        <td>
                        <button class="cart" onclick='removeFromCart(${p.id})'>Ukloni</button>
                        </td>
                    </tr>`
                    
        }
    
        html +=`    </tbody>
                </table>`;
    
        $("#cartInside").html(html);}
    
    }
    

    
    
    function removeFromCart(id) {
        var knjige = JSON.parse(localStorage.getItem("knjige"));
        var obrisano = knjige.filter(function(el){
            return el.id != id;
        })
    
        localStorage.setItem("knjige", JSON.stringify(obrisano));
        prikaziUKorpi();
    }
