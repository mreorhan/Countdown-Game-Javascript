(function(d) {

    var form = d.getElementById('form');
    d.getElementById('RastgeleUret').addEventListener('click', rastgeleOlustur, false);
    d.getElementById('Hesapla').addEventListener('click', hesapla, false);

    var i, j, sayilar = new Array(6),
        islem = new Array(6),
        enYuksek = new Array(6),
        enDusuk = new Array(6),
        k = new Array(6);


    var siralama = new Array(21), // 
        formul = new Array(21),
        dizi = []; // sayı üretmek için


    for (j = 0; j < siralama.length; j++) {
        siralama[j] = 0;
        formul[j] = ' ';
        dizi[i] = 0;
    }
    var islemTuru = ['+', '-', '*', '/'], // 4 işlemi arrayle tanımladık
        enIyiDurum = 0,
        hedef = 0,
        seviye = 0, // Kaç çözümyolu var?
        yeniFormul = '', // yeni çözümyolu bul
        deneme = 0,
        islemTamamlanma = 0,
        sayiHesapla = 0; // 0 olursa bakmaya devam, 1 olursa hesapla fonksiyonunu yap, 2 olursa dur


    function rastgeleOlustur() { //rastgeleOlustur metodu yeni sayılar üretir

        for (i = 0; i < 5; i++) { // Rasgele 1-9 arasında değer üretir
            form.elements[i].value = parseFloat(Math.floor((Math.random()) * 9) + 1);
        }
        dizi = [10, 20, 30, 40, 50, 60, 70, 80, 90]
        d.getElementById('sonSayi').value = dizi[Math.floor(Math.random() * 9)]; //10'un katı olan sayıyı random ayarla
        d.getElementById('hedef').value = Math.floor(Math.random() * 900) + 100; // random ayarla

    }

    function method(x) {
        return ((42 - ((6 - x) * (7 - x))) / 2);
    }


    function hesapla() {

        for (i = 0; i < sayilar.length; i++) {
            sayilar[i] = parseFloat(form.elements[i].value);
            siralama[i] = 0;
            islem[i] = 0;
        }
        hedef = parseFloat(form.elements[6].value);

        /***** büyükten küçüğe sıralama kısmı *****/

        for (i = 0; i < sayilar.length; i++) {
            k[i] = 0;
            for (j = 0; j < sayilar.length; j++) {
                if ((sayilar[i]) < sayilar[j] || (sayilar[i] === sayilar[j] && i < j)) {
                    k[i]++;
                }
            }
            siralama[k[i]] = sayilar[i];
            formul[k[i]] = ' ' + siralama[k[i]] + ' ';
        }

        seviye = 0;
        enIyiDurum = 0;
        enYuksek[seviye] = method(seviye);
        enDusuk[seviye] = enYuksek[seviye] + 1;
        islem[seviye] = 0;
        sayiHesapla = 0; //0 ise bakmaya devam et, 1 ise hesapla, 2 ise dur 

        while (sayiHesapla < 2) {
            if (5 <= enYuksek[0]) {
                sayiHesapla = 2;
            } else {
                sayiHesapla = 1;

                if (method(seviye + 1) <= enDusuk[seviye]) {
                    enYuksek[seviye]++;
                    enDusuk[seviye] = enYuksek[seviye] + 1;
                    islem[seviye] = 0;
                    sayiHesapla = 0;
                }
                if ((method(seviye + 1) <= (enYuksek[seviye] + 1)) || (4 < seviye)) {
                    if (5 <= enYuksek[0]) {
                        sayiHesapla = 2;
                    } else {
                        seviye--;
                        islem[seviye]++;
                        sayiHesapla = 0;
                    }
                }
            }
            if (sayiHesapla === 1) {
                if ((islem[seviye] === 1 && siralama[enYuksek[seviye]] <= siralama[enDusuk[seviye]]) ||
                    (islem[seviye] === 2 && siralama[enDusuk[seviye]] <= 1) ||
                    (islem[seviye] === 3 && (0 < siralama[enYuksek[seviye]] % siralama[enDusuk[seviye]] ||
                        siralama[enDusuk[seviye]] <= 1))) {
                    islem[seviye]++;
                    sayiHesapla = 0;
                }
                if (4 <= islem[seviye]) {
                    enDusuk[seviye]++;
                    islem[seviye] = 0;
                    sayiHesapla = 0;
                }
            }
            /***** hesaplama yapma kısmı *****/

            if (sayiHesapla === 1) {
                yeniFormul = ' (' + formul[enYuksek[seviye]] + islemTuru[islem[seviye]];
                yeniFormul = yeniFormul + formul[enDusuk[seviye]] + ') ';
                deneme = eval('' + siralama[enYuksek[seviye]] + islemTuru[islem[seviye]] + siralama[enDusuk[seviye]]);

                if (Math.abs(parseFloat(hedef) - deneme) < Math.abs(parseFloat(hedef) - parseFloat(enIyiDurum))) {
                    enIyiDurum = deneme;
                    d.getElementById('bulunanSayi').innerHTML = enIyiDurum;
                    d.getElementById('txtSonuc').innerHTML = 'Aranılan sayı tam hesaplandı';
                    sayiHesapla = 1;
                    if (parseFloat(enIyiDurum) === parseFloat(hedef)) {
                        d.getElementById('txtSonuc').innerHTML = 'Aranılan sayı tam hesaplandı';
                        sayiHesapla = 2;
                    }
                    d.getElementById('islemler').innerHTML = yeniFormul;
                }

                if (sayiHesapla < 2) {
                    i = method(seviye);
                    islemTamamlanma = 0;
                    for (j = method(seviye + 1); j < method(seviye + 2); j++) {
                        if (i === enYuksek[seviye]) {
                            i++;
                        }
                        if (i === enDusuk[seviye]) {
                            i++;
                        }
                        if (islemTamamlanma === 0 && (siralama[i] <= deneme || method(seviye + 1) <= i)) {
                            siralama[j] = deneme;
                            formul[j] = yeniFormul;
                            islemTamamlanma = 1;
                        } else {
                            siralama[j] = siralama[i];
                            formul[j] = formul[i];
                            i++;
                        }
                    }
                    seviye++;
                    islem[seviye] = 0;
                    enYuksek[seviye] = method(seviye);
                    enDusuk[seviye] = enYuksek[seviye] + 1;
                    sayiHesapla = 0;
                }
            }
        }

        if (5 <= enYuksek[0]) {
            d.getElementById('txtSonuc').innerHTML = 'Yaklaşık sayı bulundu';
        }
    }
}(document));