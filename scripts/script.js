const _updateBirthdayCards = () => {
  var alert = document.getElementById("invalid-json");
  var emptyInput = document.getElementById("empty-input");
  try {
    //validate inputvalue and json
    let inputDate = document.getElementById("year-input-field").value;
    if (inputDate === "") {
      emptyInput.style.display = "block";
    } else {
      emptyInput.style.display = "none";
    }
    let inputJSON = document.getElementById("textarea").value;
    let input = JSON.parse(inputJSON);
    alert.style.display = "none";
    //if valid remove current values
    _removeCurrentRenderedValues();

    //get people having birthdays in input year
    let people = _getBirthYearData(inputDate, input);
    let data = people.map((item) => {
      //calculate age

      let date = item.birthday.split("/");
      let timeStamp = new Date(date[2], date[1] - 1, date[0]);
      var cur = new Date();
      var diff = cur - timeStamp;
      let final = Math.floor(diff / 31557600000);
      return {...item, age: final};
    });

    // map respective birthday
    _getBirthWeekDay(data);
  } catch (err) {
    //add error label

    alert.style.display = "block";

    console.log(err);
    return;
  }
};

const _removeCurrentRenderedValues = () => {
  //set innerHtml empty
  for (i = 0; i < 7; i++) {
    var id = document.getElementById(i);
    id.innerHTML = "";
  }
};

const _getBirthYearData = (inputYear, input) => {
  //filter input data based on input year
  const people = input.filter((item) => {
    let date = new Date(item.birthday);
    if (date.getFullYear() === parseInt(inputYear, 10)) {
      return item;
    }
  });
  return people;
};

const _getBirthWeekDay = (people) => {
  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const birthdays = people.map((item) => {
    let date = new Date(item.birthday);
    return {...item, day: weekdays[date.getDay()], dayIndex: date.getDay(), acronym: item.name.match(/\b(\w)/g).join("")};
  });

  //sort youngest to lowest
  birthdays.sort((a, b) => a.age - b.age);

  let groupedData = groupBy(birthdays, "dayIndex");
  let i;

  //looping through groupedData object with keys as day index
  Object.keys(groupedData).forEach((ele) => {
    // determine size of grid based on number of elements in current day
    for (i = 1; i < birthdays.length; i++) {
      //determine value of i based on number of elements in current day
      if (groupedData[ele].length <= i * i) {
        //if the number elements are less then the power of i make grid
        break;
      }
    }

    groupedData[ele].forEach((element) => {
      var day = document.getElementById(element.dayIndex);
      var div = document.createElement("div");
      var childDiv = document.createElement("div");
      div.className = "acronym";
      childDiv.className = "element";
      //divide the grid based on value of i
      div.style.width = 100 / i + "%";
      div.style.height = 100 / i + "%";
      childDiv.innerText = element.acronym;
      day.appendChild(div);
      div.appendChild(childDiv);
    });
  });
};

//group by day index
var groupBy = function (arr, key) {
  return arr.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};
