const apiKey = "5e2edc5a0e28d8ec2dcb845536af0d68";
const pvtApiKey = "d0f3055ba17fb13b0b0d473575e7c8d4ca22d949";

const searchCharUrl = `http://gateway.marvel.com/v1/public/`;
const BASE_URL = "https://gateway.marvel.com/v1/public/characters";
const ts = new Date().getTime();
const corsWorkAround = 'https://cors-anywhere.herokuapp.com/'

let eBayurl =''

let hash = MD5(`${ts}${pvtApiKey}${apiKey}`);

function generateCharacterUrl(){
  

  const charInput = encodeURI(
    document.getElementById("search-character").value
  );

  eBayurl = `https://open.api.ebay.com/shopping?callname=FindItems&responseencoding=JSON&appid=randypre-MarvelCh-PRD-682b90351-404642b0&siteid=0&version=967&QueryKeywords=${charInput}&AvailableItemsOnly=true&MaxEntries=5`;
  

  return `${BASE_URL}?name=${charInput}&ts=${ts}&apikey=${apiKey}&hash=${hash}`;
}

function getCharacter() {
  let urlString = generateCharacterUrl()

 


  fetch(urlString)
    .then(response => {
     
 
      let template = "";
 
      // Examine the text in the response
      response.json().then(jsonData => {
        if (jsonData.data.results.length === 0 ) {
          template += `<div class='errorMessage'>That character was not found!</div>`
             attachErrorTemplate(template);      
        }
        const charId = jsonData.data.results[0].id;

        if (jsonData.data.results.length < 1) {
          template += `<div><h2>${charInput} was not found!</h2></div>`;
        } else {
          for (let index = 0; index < jsonData.data.results.length; index++) {
         
            template += `<img alt='Photo of searched character' class="bio Picture" src='${jsonData.data.results[index].thumbnail.path}/portrait_incredible.${jsonData.data.results[index].thumbnail.extension}'>`;
            template += `<div class ="character-content">
              <div class="character-name"><h1>${jsonData.data.results[index].name}</h1></div>
                <div class="bio Description"><h3>${jsonData.data.results[index].description}</h3></div>
                <div class="character-comics">
                  <h4>Comics:${jsonData.data.results[index].comics.available}</h4>
                  <h4>Series:${jsonData.data.results[index].series.available}</h4>
                  <h4>Events:${jsonData.data.results[index].events.available}</h4>
                  <h4>Stories:${jsonData.data.results[index].stories.available}</h4>
                </div>
              </div>`
              
          }
          
        }
        
        fetch( 
          `${BASE_URL}/${charId}/comics?ts=${ts}&apikey=${apiKey}&hash=${hash}`
        )
          .then(res => res.json())
          .then(json => {
            let arr = json.data.results
            let filteredArr = arr.filter(result => !result.thumbnail.path.includes('image_not_available'));
            // console.log(filteredArr)
             
            template += `<div class="wrappingDiv">`
            for (let index = 0; index < 9; index++) {
              
              template += `
                <img alt='related character comics' class='relatedComics' src='${filteredArr[index].thumbnail.path}/portrait_medium.${filteredArr[index].thumbnail.extension}'>`
                
              // console.log(filteredArr)
            }
            template += `</div>`;
             getEbayStuff(template)
             attachTemplate(template)            
          });
      });
    })
    .catch(function(err) {
      console.log("Fetch Error :-S", err);
    });

   
    
}

function getEbayStuff(template){
  fetch(corsWorkAround + eBayurl)
  .then(resp => resp.json())
  .then(j => {
    let buybuttonhtml = `<div class="shopButton"><a target='_blank' href = '${j.Item[0].ViewItemURLForNaturalSearch}'>Shop Here!</a></div>`
    console.log(j.Item);
    
    attatchBuyButton(buybuttonhtml)
  })
}

function attatchBuyButton(template){
  $('#buyButton').html(template)
}

function attachTemplate(template){
  $("#searchResults").html(template);
}

function attachErrorTemplate(template){
  $(".errorMessage").html(template)
}

function watchForm() {
  $("#search").submit(event => {
    event.preventDefault();
    $('.container2').removeAttr('hidden');
    $('.containerStart').remove();
    getCharacter();
  });
}

$(function() {
  console.log("App loaded! Waiting for submit!");
  watchForm();
});
