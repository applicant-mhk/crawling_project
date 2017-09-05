/*
    
    Webpage Crawling using Javascript and Node.js

*/


// Loading modules
var client = require('cheerio-httpcli'); //For scraping data on webpages
var urlType = require('url'); //For using the resolve method in the 'url' module to convert a relative path to absolute path
var fs = require('fs'); //For file writing


/*
[세브란스 병원]

-진료과 (메뉴얼 테스트 완료) http://sev.iseverance.com/dept_clinic/department/

가정의학과 : http://sev.iseverance.com/dept_clinic/department/family_medicine/doc/
국제진료센터 : http://sev.iseverance.com/dept_clinic/center/international_healthcare/doc/ 
마취통증의학과 : http://sev.iseverance.com/dept_clinic/department/anesthesiology_pain_medicine/doc/
병리과 : http://sev.iseverance.com/dept_clinic/department/pathology/doc/
비뇨기과 : http://sev.iseverance.com/dept_clinic/department/urololgy/doc/
산부인과 : http://sev.iseverance.com/dept_clinic/department/obstetrics_gynecology/doc/
성형외과 : http://sev.iseverance.com/dept_clinic/department/plastic_reconstructive_surgery/index.asp
신경과 : http://sev.iseverance.com/dept_clinic/department/neurology/doc/
신경외과 : http://sev.iseverance.com/dept_clinic/department/neurosurgery/doc/
영상의학과 : http://sev.iseverance.com/dept_clinic/department/radiology/doc/
(구조 다름)응급진료센터 : http://sev.iseverance.com/dept_clinic/center/emergency_care_center/doc/
임상약리학과 : http://sev.iseverance.com/dept_clinic/department/pharmacology/doc/
정신건강의학과 : http://sev.iseverance.com/dept_clinic/department/psychiatry/doc/
정형외과 : http://sev.iseverance.com/dept_clinic/department/orthopedic_surgery/doc/
진단검사의학과 : http://sev.iseverance.com/dept_clinic/department/laboratory_medicine/doc/
피부과 : http://sev.iseverance.com/dept_clinic/department/dermatology/doc/
흉부외과 : http://sev.iseverance.com/dept_clinic/department/chest_surgery/doc/


-내과
-외과
-재활병원
-심장혈관병원
-안, 이비인후과병원
-어린이병원
-연세암병원


*/





//Setting root ULR 
var url_main = "http://sev.iseverance.com/";
var param = {};



//Getting all the url for all the medical offices
client.fetch(url_main, param, function(err, $, res) { 

    //console.log(url_main);

    //Getting the each url for the each medical office (CSS selectors are different for the each medical office)
    $("#familysite li>a").each(function(idx) {
        
        receivedURL = $(this).attr('href');
        console.log(receivedURL);

        client.fetch(receivedURL, param, function(err, $, res) { 


            $("div.main_list li:nth-child(2)>a").each(function(idx) {
                
                recevedHref = $(this).attr('href');
                

                //Convert a relative path to an absolute path using the resolve method in the 'url' module to
                recevedHref = urlType.resolve(receivedURL, recevedHref);


                getInfo(recevedHref);
            });   

        }); 

    });   

}); 




//A function to get the medical office name, the medical officer name, the specific medical information
function getInfo(url_param)
{

        client.fetch(url_param, param, function(err, $, res) { 


            if (err) { console.log("error"); return; }
            var text;
            var i = 0;
            var j = 0;
            var name = []; //medical officer name
            var info = []; //specific medical information
            var medicOffice; //medical office name


           //medical office name
           medicOffice = $("#snb h2>a").text();


           //medical officer name
            $("table.bbslist2 td:nth-child(2)>a:nth-child(1)").each(function(idx) {
                
                text = $(this).text();
                name[i] = text;

                i++;

            });

            //specific medical information
            $("table.bbslist2 td.left").each(function(idx) {
                
                text = $(this).text();
                info[j] = text;
                j++;
            });



            /* Printing the results on command window and writing them to a file (start) */
            writingToFile('\r\n==============<Info Print Start>==============\r\n'); 
            console.log('==============<Info Print Start>==============');


            writingToFile('\r\n[Medical Office : ' + medicOffice + ']\r\n'); 
            console.log('[Medical Office : ' + medicOffice + ']');



            for ( var k = 0; k < name.length; k++ ){
                console.log(name[k] + " : " + info[k]);
            

                var textsToWrite = '\r\n' + name[k] + " : " + info[k] + '\r\n';
                console.log(name[k] + " : " + info[k]);
                            
                writingToFile(textsToWrite);   
                                    
            }


            writingToFile('\r\n==============<Info Print Complete>==============\r\n'); 
            console.log('==============<Info Print Complete>==============');
            /* Printing the results on command window and writing them to a file (end) */

        });

        

}


//A function to write the result to a file
function writingToFile(textToWrite_param){

        fs.appendFile('./result.txt', textToWrite_param , (err) => {
          if (err) throw err;
        });

}
