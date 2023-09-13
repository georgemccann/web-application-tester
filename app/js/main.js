var appUrl = '';
var Mocha = require('js/mocha.js');
/**
 * Uses handlebars.js to get the page data and load it into the correct template
 * @param {string} pageTitle - The template to load
 */
function getJsonData() {
  var pageContent = [];
  var jsonData = "data/content.json";
  fetch(jsonData)
    .then(
      response => {
        if (response.status !== 200) {
          return;
        }
        // Examine the text in the response
        response.json().then(data => {
          
          globalJson = data.pages;
                   
          getPageData();

        });
      }
    )
    .catch(err => {
    });
}

Handlebars.registerHelper("ifvalue", function (conditional, options) {
  if (options.hash.value === conditional) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

/**
 * Sets the page template and content to serve
 * @param {string} pageTitle - the page template to display
 */
function getPageData(pageTitle = "homePage") {
  var pageContent = globalJson[pageTitle];
 
  // Grab the template script
  var theTemplateScript = $("#"+pageTitle).html();
            
  // Compile the template
  var theTemplate = Handlebars.compile(theTemplateScript);

  // Pass our data to the template
  var theCompiledHtml = theTemplate(pageContent);
  // Add the compiled html to the page
  $(".content-placeholder").html(theCompiledHtml);
 
}


/**
 * Loads a specific page template
 * @param {string} pageName - the page template to display
 */
function nextPage(pageName) {
  getPageData(pageName);
}

function submitUrl(e) {
  e.preventDefault();
  appUrl = document.getElementById("appUrl").value;


  var mocha = new Mocha({});

  mocha.addFile('test.js')

  mocha.run()
    .on('test', function(test) {
        console.log('Test started: '+test.title);
    })
    .on('test end', function(test) {
        console.log('Test done: '+test.title);
    })
    .on('pass', function(test) {
        console.log('Test passed');
        console.log(test);
    })
    .on('fail', function(test, err) {
        console.log('Test fail');
        console.log(test);
        console.log(err);
    })
    .on('end', function() {
        console.log('All done');
    });
}
 

$(function () {

  getJsonData();

});
 
 
 