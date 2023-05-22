let calendar = document.querySelector('.calendar')

var flag = 0

const month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0 && year % 400 !== 0) || (year % 100 === 0 && year % 400 ===0)
}

getFebDays = (year) => {
    return isLeapYear(year) ? 29 : 28
}

generateCalendar = (month, year) => {

    
    let calendar_days = calendar.querySelector('.calendar-days')
    let calendar_header_year = calendar.querySelector('#year')

    let days_of_month = [31, getFebDays(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

    calendar_days.innerHTML = ''

    let currDate = new Date()
    if(month == null) month = currDate.getMonth()
    if (!year) year = currDate.getFullYear()

    let curr_month = `${month_names[month]}`
    month_picker.innerHTML = curr_month
    calendar_header_year.innerHTML = year

    

    // get first day of month
    
    let first_day = new Date(year, month, 1)

    for (let i = 0; i <= days_of_month[month] + first_day.getDay() - 1; i++) {
        let day = document.createElement('div')
        if (i >= first_day.getDay()) {
            day.classList.add('calendar-day-hover')
            var day_choose = i - first_day.getDay() + 1
            day.setAttribute("id", "calendar-day" + day_choose)
            day.innerHTML = i - first_day.getDay() + 1
            day.setAttribute("onclick", "setDate(" + day_choose + ") ")
            day.innerHTML += `<span></span>
                            <span></span>
                            <span></span>
                            <span></span>`
            if (i - first_day.getDay() + 1 === currDate.getDate() && year === currDate.getFullYear() && month === currDate.getMonth()) {
                day.classList.add('curr-date')
                
            }
        }
        calendar_days.appendChild(day)
    }
}

let month_list = calendar.querySelector('.month-list')

month_names.forEach((e, index) => {
    let month = document.createElement('div')
    month.innerHTML = `<div data-month="${index}">${e}</div>`
    month.querySelector('div').onclick = () => {
        document
        month_list.classList.remove('show')
        curr_month.value = index
        generateCalendar(index, curr_year.value)
        document.getElementById("calendar-body").hidden = false
        //console.log(curr_month.value)
    }
    month_list.appendChild(month)
    
})

let month_picker = calendar.querySelector('#month-picker')

month_picker.onclick = () => {
    month_list.classList.add('show')

    if(document.getElementById("month-list").hidden == false){

        document.getElementById("calendar-body").hidden = true

    }


    
}

let currDate = new Date()

let curr_month = {value: currDate.getMonth()}
let curr_year = {value: currDate.getFullYear()}

generateCalendar(curr_month.value, curr_year.value)

function resetCalendar(){
    flag = 0
}


function setDate(day){


    if(document.getElementById("day-start").innerHTML.length <15){
        if (flag == 0){

            //document.getElementById("day-start").innerHTML = "Data inizio: "
            document.getElementById("day-start").innerHTML += day + " " + document.getElementById("month-picker").innerHTML + " " + document.getElementById("year").innerHTML
            localStorage.setItem("day-start", JSON.stringify(day))
            localStorage.setItem("month-start", JSON.stringify(document.getElementById("month-picker").innerHTML))
            localStorage.setItem("year-start", JSON.stringify(document.getElementById("year").innerHTML))
            //if(document.getElementById("cambia_data_fine")!= null) document.getElementById("cambia_data_fine").disabled = false
            document.getElementById("calendar-original").hidden = true
    
        }
    }

    
    
    if(document.getElementById("day-end").innerHTML.length <15){

        if((flag == 1)){

            //document.getElementById("day-end").innerHTML = "Data fine: "
            document.getElementById("day-end").innerHTML += day + " " + document.getElementById("month-picker").innerHTML + " " + document.getElementById("year").innerHTML
            document.getElementById("calendar-day" + day).style.backgroundColor = "grey"
            flag = 0
            localStorage.setItem("day-end", JSON.stringify(day))
            localStorage.setItem("month-end", JSON.stringify(document.getElementById("month-picker").innerHTML))
            localStorage.setItem("year-end", JSON.stringify(document.getElementById("year").innerHTML))
            document.getElementById("calendar-original").hidden = true
            document.getElementById("availableSpindles").innerHTML = "<div id = 'loader' style = 'margin-top: 60px;'></div>"
            //if(document.getElementById("cambia_data_inizio")!= null) document.getElementById("cambia_data_inizio").disabled = false

    }
    

    flag = 1
    //console.log(flag)
    }
   
}

function cambia_data_inizio(day){
    document.getElementById("calendar-day" + day).style.backgroundColor = ""
    //document.getElementById("day-start").innerHTML = "Data inizio: "
    flag = 0
    document.getElementById("cambia_data_fine").disabled = true
}

function cambia_data_fine(day){

    document.getElementById("calendar-day" + day).style.backgroundColor = ""
    //document.getElementById("day-end").innerHTML = "Data inizio: "
    flag = 1
    document.getElementById("cambia_data_inizio").disabled = true

}

document.querySelector('#prev-year').onclick = () => {
    --curr_year.value
    generateCalendar(curr_month.value, curr_year.value)
}

document.querySelector('#next-year').onclick = () => {
    ++curr_year.value
    generateCalendar(curr_month.value, curr_year.value)
}
