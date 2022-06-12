
require("core-js");
require("core-js/stage/3");
require("core-js/stage/2");
require("core-js/stage/1");
const _ = require('lodash');
const tj = require("@tmcw/togeojson");
const fs = require("fs");
const path = require("path");
const DOMParser = require("xmldom").DOMParser;
const plik = path.resolve(process.cwd(),'archive/GenetekaZakres_GoogleMaps202206110721.kml');
const kml = new DOMParser().parseFromString(fs.readFileSync(plik, "utf8"));
const converted = tj.kml(kml);
//^ https://geneteka.genealodzy.pl/index.php?op=gt
const kmlJSON = ((tab)=>{
    function g_link(a) {
        return Object.assign({}, ...a.split(/\?|\&/).splice(1).map(i => {
            let q = i.split(/\=/);
            let o = {};
            o[q[0]]= q[1];
            return o;
        }));
    }

    function g_zakres(U_or_M_or_Z, zakresINP_of_U_or_M_or_Z, errNr) {
        let zakresEXP_of_U_or_M_or_Z = [];
        const tryNr0_czy_niepodano_zakresu = zakresINP_of_U_or_M_or_Z == '';        
        const tryNr1_czy_pojedynczy_rok = zakresINP_of_U_or_M_or_Z.length==4;
        if (tryNr0_czy_niepodano_zakresu) {
            const errNr0_komunikat = `//~ dla pozycji ${errNr}, brakuje zakresu dla ${U_or_M_or_Z} !!`; 
            //& console.error(errNr0_komunikat);
        } else if (tryNr1_czy_pojedynczy_rok) {
            zakresEXP_of_U_or_M_or_Z = [parseInt(zakresINP_of_U_or_M_or_Z)];
        } else {
            let w__robocze = {
                lp: 0,
                indexThis: 0,
                indexNext: 0,
                wymiar: 0,
                znakThis: '',
                znakNext: '',
                strLast: '',
                strNext: '',
                rokLast: 0,
                rokNext: 0,
                zakres:[]
            };
            let w__pytanie = /\,|\-/gm;
            var w_rezultat;
            var w_iteracja = 0;
            while ((w_rezultat = w__pytanie.exec(zakresINP_of_U_or_M_or_Z)) !== null) {

                //? rozczytywanie -> inicjowanie
                ((q, r, s, t, u) => {
                    r.indexThis = r.indexNext; 
                    r.indexNext = q.lastIndex-1;
                    r.wymiar = r.indexNext - r.indexThis - (t==0 ? 0 : 1);
                    r.znakThis = r.znakNext;
                    r.znakNext = s;
                    r.strLast = r.strNext;
                    r.strNext = u.slice(r.indexThis + (t==0 ? 0 : 1), r.indexNext);
                    r.rokLast = r.rokNext;
                })(w__pytanie, w__robocze, w_rezultat[0], w_iteracja, zakresINP_of_U_or_M_or_Z);

                //? rozczytywanie -> przygotowywanie
                ((r, t, u, v, w)=>{
                    const tryNr2_czy_to_poczatkowy_rok = t == 0;
                    const tryNr3_czy_rok_ma_4_cyfry = r.wymiar==4;
                    const tryNr4_czy_rok_ma_2_cyfry = r.wymiar==2;
                    if (tryNr2_czy_to_poczatkowy_rok && !tryNr3_czy_rok_ma_4_cyfry) {
                        const errNr1_komunikat = `//~ dla pozycji | ${w} | ${v} |, BRAK początkowego roku w postaci 4 cyfr, << ${u} >> !!`; 
                        //& console.error(errNr1_komunikat);
                    } else if (tryNr2_czy_to_poczatkowy_rok && tryNr3_czy_rok_ma_4_cyfry) {
                        r.rokNext = parseInt(r.strNext);
                    } else if(!tryNr2_czy_to_poczatkowy_rok && tryNr3_czy_rok_ma_4_cyfry){
                        r.rokNext = parseInt(r.strNext);
                    } else if(!tryNr2_czy_to_poczatkowy_rok && tryNr4_czy_rok_ma_2_cyfry){
                        r.rokNext = parseInt( ((r.rokLast!=0) ? (r.rokLast+'').slice(0,2) : r.strLast.slice(0,2)) +r.strNext);
                    } else if(!tryNr2_czy_to_poczatkowy_rok && !tryNr3_czy_rok_ma_4_cyfry && !tryNr4_czy_rok_ma_2_cyfry){
                        const errNr2_komunikat = `//~ dla pozycji | ${w} | ${v} |, BŁĄD ilość cyfr rózna od 2 i 4, << ${u} >> !!`; 
                        //& console.error(errNr2_komunikat);
                    } else {
                        const errNr3_komunikat = `//~ dla pozycji | ${w} | ${v} |, BŁĄD nieznany, << ${u} >> !!`; 
                        //& console.error(errNr3_komunikat);
                    }
                })(w__robocze, w_iteracja, zakresINP_of_U_or_M_or_Z, U_or_M_or_Z, errNr);

                //? rozczytywanie -> zasadnicze
                ((r, t, w)=>{
                    const tryNr5_czy_to_poczatkowy_rok = t == 0;
                    const tryNr6_czy_LISTA = r.znakThis == ',';
                    const tryNr7_czy_RANGA = r.znakThis == '-';
                    if (tryNr5_czy_to_poczatkowy_rok) {
                        const errNr4_komunikat = `//~  BŁĄD nieznany dla pozycji | ${w} !!`; 
                        //& console.error(errNr4_komunikat);
                    } else if (!tryNr5_czy_to_poczatkowy_rok && tryNr6_czy_LISTA){
                        r.zakres =[r.rokLast,r.rokNext];
                    } else if (!tryNr5_czy_to_poczatkowy_rok && tryNr7_czy_RANGA){
                        r.zakres=_.range(r.rokLast,r.rokNext+1);
                    } else { 
                        const errNr5_komunikat = `//~  BŁĄD nieznany dla pozycji | ${w} !!`; 
                        //& console.error(errNr5_komunikat);
                    }
                    r.zakres = r.zakres.uniqueBy().sort((a, b) => a - b);
                })(w__robocze, w_iteracja, errNr);

                //? rozczytywanie -> zapisywanie
                zakresEXP_of_U_or_M_or_Z.push(...(w__robocze.zakres))

                //? iterator pętli while
                w_iteracja++;
            }            
        }
        zakresEXP_of_U_or_M_or_Z = zakresEXP_of_U_or_M_or_Z.uniqueBy().sort((a, b) => a - b);
        return zakresEXP_of_U_or_M_or_Z; 
    }

    let tabN =[];
    let zakr ={};
    for (let k = 0; k < tab.length; k++) {
        let obj ={
            lp: k,
            lon_lat: tab[k].geometry.coordinates.slice(0, -1),
            nazwa: {
                parafia: tab[k].properties.name,
                teren: tab[k].properties['Obszar/województwo']
            },
            kod:{
                parafia: ['rid'],
                teren: ['w']
            },
            zakres:{
                u:[],
                m:[],
                z:[]
            }
        };
        let zakres = tab[k].properties.Zakres;
        let link = tab[k].properties['Link do Geneteki'];
        //~ #############ERROR####################
        if ((20.8017713 ==obj.lon_lat[0]) && (52.5337256 ==obj.lon_lat[1])) {
            /* 
            ! BRAK LINKU DO GENETEKI W:  name: 'Aleksandrowo (prawosł.)'
            * 'Obszar/województwo': 'mazowieckie',
            * description: 'latitude: 52.5337256<br>longitude: 20.8017713<br>Obszar/województwo: mazowieckie<br>Zakres: U 1846,61-62; M 1846-1911<br>Link do Geneteki: ; Z 1846-1911',
            * Zakres: 'U 1846,61-62; M 1846-1911',
            * 'Link do Geneteki': '; Z 1846-1911'
            */
            zakres = 'U 1846,61-62';
            link ='https://geneteka.genealodzy.pl/index.php?op=gt&w=07mz&rid=9687';
        }
        obj.kod.parafia.push(g_link(link).rid);
        obj.kod.teren.push(g_link(link).w);
        //~ #############ERROR####################
        {
            //! brakuje podanego zakresu dla | U | pod numerem 14 .
            //! brakuje podanego zakresu dla | U | pod numerem 59 .
            //! brakuje podanego zakresu dla | Z | pod numerem 59 .
            //! brakuje podanego zakresu dla | U | pod numerem 73 .
            //! brakuje podanego zakresu dla | Z | pod numerem 73 .
            //! brakuje podanego zakresu dla | U | pod numerem 280 .
            //! brakuje podanego zakresu dla | Z | pod numerem 696 .
            //! brakuje podanego zakresu dla | U | pod numerem 883 .
            //! brakuje podanego zakresu dla | M | pod numerem 883 .
            //! brakuje podanego zakresu dla | Z | pod numerem 883 .
            //! brakuje podanego zakresu dla | Z | pod numerem 909 .
            //! brakuje podanego zakresu dla | Z | pod numerem 978 .
            //! brakuje podanego zakresu dla | Z | pod numerem 995 .
            //! brakuje podanego zakresu dla | U | pod numerem 1075 .
            //! brakuje podanego zakresu dla | M | pod numerem 1075 .
            //! brakuje podanego zakresu dla | M | pod numerem 1078 .
            //! brakuje podanego zakresu dla | M | pod numerem 1308 .
            //! brakuje podanego zakresu dla | U | pod numerem 1606 .
            //! brakuje podanego zakresu dla | U | pod numerem 1673 .
            //! brakuje podanego zakresu dla | M | pod numerem 1781 .
            //! brakuje podanego zakresu dla | U | pod numerem 1803 .
            //! brakuje podanego zakresu dla | Z | pod numerem 1803 .
            //! brakuje podanego zakresu dla | U | pod numerem 1804 .
            //! brakuje podanego zakresu dla | U | pod numerem 1820 .
            //! brakuje podanego zakresu dla | M | pod numerem 1820 .
            //! brakuje podanego zakresu dla | U | pod numerem 1962 .
            //! brakuje podanego zakresu dla | U | pod numerem 2011 .
            //! brakuje podanego zakresu dla | U | pod numerem 2402 .
            //! brakuje podanego zakresu dla | Z | pod numerem 2412 .
            //! brakuje podanego zakresu dla | U | pod numerem 2477 .
            //! brakuje podanego zakresu dla | U | pod numerem 2592 .
            //! brakuje podanego zakresu dla | M | pod numerem 2676 .
            //! brakuje podanego zakresu dla | Z | pod numerem 3264 .
            //! brakuje podanego zakresu dla | M | pod numerem 3271 .
            //! brakuje podanego zakresu dla | M | pod numerem 3282 .
            //! brakuje podanego zakresu dla | Z | pod numerem 3282 .
            //! brakuje podanego zakresu dla | Z | pod numerem 3283 .
            //! brakuje podanego zakresu dla | Z | pod numerem 3324 .
            //! brakuje podanego zakresu dla | M | pod numerem 3333 .
            //! brakuje podanego zakresu dla | Z | pod numerem 3333 .
            //! brakuje podanego zakresu dla | M | pod numerem 3339 .
            //! brakuje podanego zakresu dla | M | pod numerem 3376 .
            //! brakuje podanego zakresu dla | U | pod numerem 3415 .
            //! brakuje podanego zakresu dla | Z | pod numerem 3415 .
            //! brakuje podanego zakresu dla | U | pod numerem 3417 .
            //! brakuje podanego zakresu dla | U | pod numerem 3432 .
            //! brakuje podanego zakresu dla | Z | pod numerem 3465 .
            //! brakuje podanego zakresu dla | M | pod numerem 3493 .
            //! brakuje podanego zakresu dla | Z | pod numerem 3496 .
            //! brakuje podanego zakresu dla | U | pod numerem 3498 .
            //! brakuje podanego zakresu dla | Z | pod numerem 3498 .
            //! brakuje podanego zakresu dla | Z | pod numerem 3505 .
            //! brakuje podanego zakresu dla | M | pod numerem 3510 .
            //! brakuje podanego zakresu dla | Z | pod numerem 3582 .
            //! brakuje podanego zakresu dla | U | pod numerem 3627 .
            //! brakuje podanego zakresu dla | Z | pod numerem 3939 .
            //! brakuje podanego zakresu dla | M | pod numerem 4145 .
            //! brakuje podanego zakresu dla | Z | pod numerem 4145 .
            //! brakuje podanego zakresu dla | Z | pod numerem 4180 .
            //! brakuje podanego zakresu dla | M | pod numerem 4232 .
            //! brakuje podanego zakresu dla | U | pod numerem 4302 .
            //! brakuje podanego zakresu dla | Z | pod numerem 4315 .
            //! brakuje podanego zakresu dla | U | pod numerem 4328 .
            //! brakuje podanego zakresu dla | Z | pod numerem 4346 .
        };
        zakres.split(/\;/).map(i => i.trim()).forEach(e => {
            let U_or_M_or_Z = e.slice(0,1);
            let zakres_umz = e.slice(1).trim();
            (obj.zakres[U_or_M_or_Z.toLowerCase()]).push(...g_zakres(U_or_M_or_Z, zakres_umz, k));
        });        
        obj.zakres.u = obj.zakres.u.uniqueBy().sort((a, b) => a - b);     
        obj.zakres.m = obj.zakres.m.uniqueBy().sort((a, b) => a - b);     
        obj.zakres.z = obj.zakres.z.uniqueBy().sort((a, b) => a - b);
        tabN.push(obj);
    }
    //let zakr2 = zakr ;//.sort((a, b) => a.length - b.length);
    //console.dir(JSON.stringify(zakr2), { depth: null });
    //^ fs.writeFileSync('file2.json', JSON.stringify(zakr), {spaces: 2});
    //^ console.dir(tabN, { depth: null });
    //console.dir(tabN, { depth: null });
    return tabN;
})(converted.features);

//fs.writeFileSync(plik+'.json', JSON.stringify(kmlJSON), {spaces: 2});
fs.writeFileSync(plik+'__slim.json', JSON.stringify(kmlJSON));

//console.dir(kmlJSON, { depth: null });



